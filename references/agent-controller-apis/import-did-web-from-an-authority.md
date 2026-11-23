---
description: Use a did:web that is created and hosted by an external authority
icon: globe
---

# Import did:web from an authority

Sometimes the identity is **created and hosted by someone else**, for example a government agency. They publish the DID document and give you the private key(s). Use `POST /dids/web/import` for this.

## Why not `POST /dids/write`

* `/dids/write` needs a `domain` and creates a new simple document with a fixed `#key-1`.
* Your signature would then point to a key id that the authority never published.
* `/dids/web/import` keeps the authority's document **as it is**.
* `/dids/write` now rejects `didDocument` for `method: "web"` and points to this API.

## Request

Each key needs its own [import session](encrypted-key-import.md) (use `method: "web"`).

```json
{
  "did": "did:web:gov-agency.example.com",
  "didDocument": {
    "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/ed25519-2020/v1"],
    "id": "did:web:gov-agency.example.com",
    "verificationMethod": [
      {
        "id": "did:web:gov-agency.example.com#authority-signing-key",
        "type": "Ed25519VerificationKey2020",
        "controller": "did:web:gov-agency.example.com",
        "publicKeyJwk": { "kty": "OKP", "crv": "Ed25519", "x": "..." }
      }
    ],
    "authentication": ["did:web:gov-agency.example.com#authority-signing-key"],
    "assertionMethod": ["did:web:gov-agency.example.com#authority-signing-key"]
  },
  "keys": [
    {
      "verificationMethodId": "did:web:gov-agency.example.com#authority-signing-key",
      "encryptedKey": { "sessionId": "...", "jwe": "..." }
    }
  ]
}
```

## What the agent does

* Stores the document as given: `@context`, services and verification method ids are not changed.
* Binds each key to the verification method in `verificationMethodId` (full id or `#relative`).
* Keeps methods without a key (for example an X25519 `keyAgreement` key) as public-only entries.
* Checks that the private key matches the public key in that method (RFC 7638 thumbprint). If not, you get a 400.
* If `didDocument` is not sent, the agent fetches it from the network.
* If `didDocument` is sent, it is compared with the published one. Set `allowUnresolvedDocument: true` to skip this (offline, air-gapped or private setups).
* All envelopes are checked **before** any session is used, so a failed request can be retried with the same envelopes.

## Re-import

* Same document and same key binding again: fine (idempotent).
* Changed document or key binding: send `replace: true`. Without it the request fails, because already issued credentials would stop verifying.

## Response

```json
{
  "did": "did:web:gov-agency.example.com",
  "didDocument": { "...": "..." },
  "keys": [
    {
      "verificationMethodId": "did:web:gov-agency.example.com#authority-signing-key",
      "keyId": "...",
      "backend": "openbao"
    }
  ]
}
```

`backend` tells where the key is stored, see [KMS backends](kms-backends.md).
