---
description: Import a CA issued certificate chain and use it as a DID
icon: certificate
---

# did:x509

If you already have a certificate from a CA and its private key, you can import them into the agent. The agent gives you a `did:x509`, keeps the key in its KMS and can sign with it like any other DID.

{% hint style="info" %}
Available from agent controller **2.3.3**.
{% endhint %}

## What you can do

* Import your CA issued chain and key, and get a `did:x509`.
* Issue **SD-JWT VC** credentials signed with that DID.
* Verify SD-JWT VC credentials from other issuers that use a `did:x509`.

Not covered yet: holder binding with a did:x509, did:x509 as verifier request signer, allowlist of trusted DIDs, trust registry.

## What is a did:x509

```
did:x509:0:sha256:<fingerprint of the root CA>::<policy>[::<policy>]
```

* **Fingerprint:** SHA-256 hash of the root CA (last certificate of the chain). It ties the DID to that CA.
* **Policy:** says which leaf certificates can use the DID, for example `subject:CN:issuer.example.com`.
* The DID document is **not stored anywhere**. It is calculated from the DID and the certificate chain, so resolving always needs the chain.
* For DIDs imported in this agent, the chain is stored with the DID. For DIDs of others, the chain comes with the credential (`x5c` header).
* Spec: [did:x509](https://github.com/microsoft/did-x509).

## Import a certificate chain

`POST /dids/x509/import`

| Field              | Required | Meaning                                                                                                                    |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `certificateChain` | yes      | Certificates, **leaf first, root CA last**. Each entry can be a PEM certificate, a PEM bundle or a base64 DER certificate. |
| `encryptedKey`     | yes\*    | Private key of the **leaf** certificate, encrypted using an import session with `method: "x509"`.                          |
| `privateKey`       | no       | Plain text key (passphrase too, if the key is encrypted). Works **only** when `ALLOW_PLAINTEXT_KEY_IMPORT=true`.           |
| `policies`         | no       | Policies for the DID. Default is `subject:CN` of the leaf.                                                                 |
| `did`              | no       | Import an existing did:x509. It is validated against the chain. `policies` is ignored then.                                |

\* Send either `encryptedKey` or (if allowed) `privateKey`, not both.

```json
{
  "certificateChain": [
    "-----BEGIN CERTIFICATE-----\n...leaf...\n-----END CERTIFICATE-----",
    "-----BEGIN CERTIFICATE-----\n...issuing CA...\n-----END CERTIFICATE-----",
    "-----BEGIN CERTIFICATE-----\n...root CA...\n-----END CERTIFICATE-----"
  ],
  "encryptedKey": { "sessionId": "...", "jwe": "..." }
}
```

Response (short):

```json
{
  "did": "did:x509:0:sha256:JAsS...::subject:CN:issuer.example.com",
  "didDocument": { "...": "..." },
  "keyId": "dVD6pXEPBlStv7pWUpa2Cpl1kw3ui7v8uYPrgjI7lTo",
  "verificationMethodId": "did:x509:0:sha256:JAsS...::subject:CN:issuer.example.com#0"
}
```

The agent does these steps:

1. Reads the chain and key, and checks the key belongs to the leaf certificate.
2. Builds the DID from the root fingerprint and policies.
3. Resolves the DID against the chain. This checks fingerprint, policies, chain order, signatures, CA flag and path length, and validity dates.
4. Stores the leaf key in the KMS (key id = JWK thumbprint, so importing again reuses it).
5. Imports the DID with a link to that key and saves the chain with it.

Importing the same chain and key again gives the same DID. If the DID already exists, the agent also checks that the stored key still matches your certificate.

### Other endpoints

| Endpoint                     | What it does                                                       |
| ---------------------------- | ------------------------------------------------------------------ |
| `GET /dids/x509/chain/{did}` | Chain stored for an imported did:x509 (base64url DER, leaf first). |
| `GET /dids/{did}`            | Resolves the DID. Works for DIDs imported in this agent.           |
| `GET /dids`                  | Lists DIDs of the agent, including did:x509.                       |
| `GET /dids/{did}/kms`        | Shows where the key is stored, see KMS backends.                   |

{% hint style="warning" %}
A did:x509 has `:` and sometimes `%` characters. **URL-encode the whole DID** when you use it in a path.
{% endhint %}

## Prepare your files

If you have a `.p12` / `.pfx` file:

```bash
openssl pkcs12 -in bundle.p12 -clcerts -nokeys -out leaf.pem
openssl pkcs12 -in bundle.p12 -cacerts -nokeys -out ca-chain.pem
openssl pkcs12 -in bundle.p12 -nocerts -nodes -out leaf.key
```

* Order matters: leaf first, then issuing CA(s), root last. Root is needed because the DID is built from its fingerprint.
* The agent does **not** check if the root is trusted. Trust is set separately (see [Verify credentials](did-x509.md#verify-credentials-from-didx509-issuers)).

## Supported key types

| Leaf key | Algorithm | KMS backend |
| -------- | --------- | ----------- |
| EC P-256 | ES256     | Askar       |
| EC P-384 | ES384     | Askar       |
| EC P-521 | ES512     | Node        |
| Ed25519  | EdDSA     | Askar       |
| RSA      | RS256     | Node        |

* secp256k1 certificates are not supported.
* With OpenBao enabled, keys can go to OpenBao, see KMS backends.

## Policies

If you send no `policies`, the DID is limited to the common name (CN) of the leaf. If the leaf has no CN, you must send `policies`.

```json
{ "type": "subject", "fields": { "CN": "issuer.example.com", "O": "Acme Corp" } }
{ "type": "san", "sanType": "dns", "value": "issuer.example.com" }
{ "type": "eku", "value": "1.3.6.1.5.5.7.3.3" }
{ "type": "fulcio-issuer", "value": "https://accounts.example.com" }
```

* Many policies are joined with `::`. Values are percent-encoded.
* Choose the narrowest policy that still covers your future certificates. A `subject:CN` DID keeps working after you renew the leaf, if the subject and the root CA stay same. Import the new chain and key again under the same DID.

## Issue SD-JWT VC with a did:x509

* Use the imported DID as `signerOptions` of an OpenID4VCI credential offer.
* Only **SD-JWT VC** (`dc+sd-jwt`, `vc+sd-jwt`) works with a did:x509. For `mso_mdoc` use the `x5c` signer. W3C formats give a clear error.

```json
{
  "publicIssuerId": "my-issuer",
  "credentials": [{
    "credentialSupportedId": "IdentityCredential-sdjwt",
    "format": "dc+sd-jwt",
    "signerOptions": { "method": "did", "did": "did:x509:0:sha256:JAsS...::subject:CN:issuer.example.com" },
    "payload": { "vct": "urn:acme:identity", "given_name": "Alice" },
    "disclosureFrame": { "_sd": ["given_name"] }
  }],
  "preAuthorizedCodeFlowConfig": { "authorizationServerUrl": "https://agent.example.com/oid4vci/my-issuer" }
}
```

Send it to `POST /openid4vc/issuance-sessions/create-credential-offer`.

* `credential_signing_alg_values_supported` of the credential configuration must include the algorithm of your key (ES256, ES384, ES512, EdDSA or RS256).
* The DID must be imported in the same agent that issues.

What the issued credential looks like:

```json
// header
{ "typ": "dc+sd-jwt", "alg": "ES256", "kid": "#0", "x5c": ["<leaf>", "<issuing CA>", "<root CA>"] }
// payload
{ "iss": "did:x509:0:sha256:JAsS...::subject:CN:issuer.example.com", "vct": "urn:acme:identity", "cnf": { "jwk": { "...": "..." } } }
```

* `iss` is the did:x509 and `kid` is its verification method.
* The **full chain is in `x5c`** (leaf first, root last).
* A verifier that knows did:x509 resolves the DID using this chain. A verifier that does not can still check signature and chain with `x5c`.

{% hint style="info" %}
Credo 0.7 can put either `kid` or `x5c` in the header, not both. The agent controller uses a small Credo patch for this. Other Credo based wallets and verifiers need the same change to accept these credentials. We are discussing it upstream in [credo-ts#3187](https://github.com/openwallet-foundation/credo-ts/issues/3187).
{% endhint %}

## Verify credentials from did:x509 issuers

When the agent verifies an SD-JWT VC where `iss` is a did:x509 and the header has `x5c`:

1. **Trust:** the root of the `x5c` chain must be trusted by the agent's X.509 trust setup (trust list `TRUST_LIST_URL` or trust service `TRUST_SERVICE_*`). Just add the root CA there, nothing new to configure.
2. **Resolve:** the DID is resolved with that chain. This checks fingerprint, policies against the leaf, chain and validity.
3. **Signature:** checked with the key of the leaf certificate.

The DID does not need to be imported in the verifying agent.

A certificate from a trusted CA **cannot pretend to be another organisation's did:x509**, because the policies of that DID will not match its leaf.

| Case                                                    | Result                       |
| ------------------------------------------------------- | ---------------------------- |
| Root of the chain is in the trust list                  | accepted                     |
| No trusted certificates configured                      | rejected                     |
| Another root is trusted, not this chain's root          | rejected                     |
| `iss` is a did:x509 the leaf does not satisfy (same CA) | rejected                     |
| `x5c` header missing                                    | rejected                     |
| Payload changed after signing                           | rejected (invalid signature) |

## Errors

| Status | Message                                                                       | Reason                                                                                                                                 |
| ------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | `privateKey does not match the public key of the first (leaf) certificate...` | Wrong key, or chain is not leaf first.                                                                                                 |
| 400    | `did:x509 does not validate against certificateChain: ...`                    | DID does not match the chain: missing intermediate, policy mismatch, expired certificate, CA path length problem or unsupported curve. |
| 400    | `certificateChain contains an invalid certificate: ...`                       | An entry is not PEM / base64 DER.                                                                                                      |
| 400    | `Unable to read privateKey: ...`                                              | Key format or passphrase is wrong.                                                                                                     |
| 400    | `The leaf certificate has no common name (CN), provide policies...`           | No `policies` and no `did`, and leaf has no CN.                                                                                        |
| 400    | `Plaintext private key import is disabled...`                                 | Plain text key sent. Use `encryptedKey`.                                                                                               |
| 401    | `Unauthorized`                                                                | Missing or invalid token.                                                                                                              |

## Good to know

* The key cannot be read back. It is stored in the agent's encrypted wallet (or OpenBao) and is never returned by the API.
* You cannot import a key for a certificate you do not control. The key must match the leaf.
* The resolver does not cache DID documents. Every resolution validates the chain again.
* Needs `@didx509/core` 0.1.3 or newer (older versions reject issuing CAs with `pathlen:0`).
* Planned: holder binding with did:x509, did:x509 as verifier request signer, allowlist of trusted DIDs, trust registry.

On the platform, the same import is `POST /v1/orgs/{orgId}/agents/did/x509/import`; see [did:x509 and KMS backend](../platform-apis/did-x509-and-kms-backend.md).
