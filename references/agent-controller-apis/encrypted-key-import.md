---
description: Import a private key into the agent without sending it as plain text
icon: lock
---

# Encrypted key import

Use this when you already have a private key and want the agent to use it for `did:key`, `did:web`, `did:x509` or `did:polygon`, or to import an X.509 certificate with `POST /x509/import`.

## Why we need this

* Earlier, the private key was sent as plain text in the request body (`privateKey`, `privateKeyJwk`).
* That body passes through the API gateway, NATS, agent service and agent HTTP layer. A log or an error message at any place can leak the key.
* TLS alone is not enough, because TLS ends at every hop.
* So now the key is **encrypted for the agent that will own it, before it leaves the client**.

## How it works (3 steps)

1. **Ask for an import session.** The agent creates a fresh RSA-3072 key pair and gives you the public key.
2. **Encrypt and send.** You encrypt the private key with that public key (JWE) and send only the encrypted `encryptedKey` in the create / import request.
3. **Complete the import.** The agent decrypts and validates the key, then imports it.

### Step 1: create a session

* Platform: `POST /orgs/{orgId}/agents/did/import/session`
* Agent controller: `POST /dids/import/session`

```json
{ "method": "key" }
```

* `method` can be `key`, `web`, `x509`, `polygon` or `x509-certificate`.
* Use `x509` for `POST /dids/x509/import` and `x509-certificate` for `POST /x509/import` (the X.509 certificate import). A session created for one method cannot be used for another. For `x509-certificate`, `privateKeyJwk` and `passphrase` are not supported and are rejected with `400`.
* The session works only for that method and only for the same agent.

Response (short):

```json
{
  "sessionId": "...",
  "method": "key",
  "expiresAt": "2026-11-07T12:00:00.000Z",
  "alg": "RSA-OAEP-256",
  "enc": "A256GCM",
  "publicKeyJwk": { "kty": "RSA", "n": "...", "e": "AQAB" },
  "protectedHeader": { "alg": "RSA-OAEP-256", "enc": "A256GCM", "kid": "...", "sid": "...", "method": "key", "exp": 1794052800 }
}
```

### Step 2: build the envelope

* Standard JWE compact format: `RSA-OAEP-256` for the key and `A256GCM` for the content.
* Use the returned `protectedHeader` as the JWE protected header (it is also the AAD).
* The payload has exactly one key form, plus an optional passphrase:

```json
{ "privateKey": "-----BEGIN ENCRYPTED PRIVATE KEY-----\n..." }
{ "privateKeyJwk": { "kty": "EC", "crv": "P-256", "x": "...", "y": "...", "d": "..." } }
{ "privateKey": "...", "passphrase": "..." }
```

* Sending both `privateKey` and `privateKeyJwk` is rejected.
* For `did:polygon`, send the secp256k1 key as 64 hex characters (optional `0x`) or as a private JWK. Passphrase is not supported there.
* Any JOSE library can create this envelope.

### Step 3: send the request

Put the envelope in `encryptedKey` of the normal request:

```json
{ "method": "key", "encryptedKey": { "sessionId": "...", "jwe": "..." } }
```

* Create DID: `POST /orgs/{orgId}/agents/did` (platform) or `POST /dids/write` (agent controller)
* Import X.509: `POST /dids/x509/import` (see did:x509)
* Import did:web: `POST /dids/web/import` (see Import did:web from an authority)

## Example with Node

```bash
node scripts/import-did-key.mjs \
  --agent http://127.0.0.1:4001 --api-key "$AGENT_API_KEY" \
  --method key --key ./ed25519.pem
```

## Security rules

* The private half of the session key lives only in agent memory and is never saved.
* A session works **only once** and is deleted after first use, so a captured envelope cannot be replayed.
* Session expires in 5 minutes by default (`KEY_IMPORT_SESSION_TTL_MS`).
* After 5 wrong attempts the session is deleted.
* All decrypt errors show the same generic message, so nobody can probe sessions.
* Size limits: envelope 200,000 characters, decrypted payload 50,000 bytes.
* Session API is rate limited: 30 per minute by default (`KEY_IMPORT_RATE_LIMIT`).
* Key material is removed from logs and error messages.

## Plain text keys are off by default

* Fields `privateKey`, `privateKeyJwk`, `passphrase` and `privatekey` (did:polygon) are **rejected** unless `ALLOW_PLAINTEXT_KEY_IMPORT=true`.
* The error message tells you to use the session endpoint.
* Use this flag only on a trusted non-production setup, while you move old clients to the encrypted flow.

Suggested migration:

1. Deploy the version that has the session endpoint (plain text stays rejected by default).
2. Move each client to the 3-step encrypted-key flow. Studio already does this.
3. If an old client cannot change now, set `ALLOW_PLAINTEXT_KEY_IMPORT=true` on one agent only, migrate that client, then remove the flag.

## Limits

| Control                   | Default                 |
| ------------------------- | ----------------------- |
| Session lifetime          | 5 minutes               |
| Session reuse             | single use              |
| Wrong attempts            | 5, then session deleted |
| Live sessions per process | 1,000                   |
| Session creation rate     | 30 per minute           |

{% hint style="warning" %}
Sessions are kept in agent memory. If you run many instances of one agent behind a load balancer, send both calls (session and create) to the same instance (sticky routing). Otherwise you get "session is invalid or has expired" and need a new session.
{% endhint %}
