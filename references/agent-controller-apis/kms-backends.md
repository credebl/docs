---
description: Where the agent stores each key and how to check it
---

# KMS backends

The agent can store keys in three places (KMS backends). It picks one automatically, based on the key type and your settings.

## Backends

| Backend     | What it is                                                                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Askar**   | Default. Stored in the agent's encrypted wallet. Holds Ed25519 and EC P-256 / P-384 / secp256k1.                                                                                   |
| **Node**    | A second backend using `node:crypto`. Keys are saved as records in the agent's own encrypted wallet, separate for every tenant. Used only for keys Askar cannot hold or sign with. |
| **OpenBao** | External Transit key store. Keys are non-exportable and signing happens inside OpenBao. Used when OpenBao is enabled.                                                              |

## Which key goes where

| Key                                                                                     | Backend                              |
| --------------------------------------------------------------------------------------- | ------------------------------------ |
| RSA, EC P-521                                                                           | Node (Askar cannot hold / sign them) |
| Ed25519, EC P-256 / P-384, secp256k1                                                    | Askar by default                     |
| Ed25519, RSA, EC P-256 / P-384 / P-521 with OpenBao enabled and the DID method flag set | OpenBao                              |

## Using OpenBao for imported keys

* OpenBao does not get your key as plain text either. The agent wraps it with OpenBao's wrapping key (BYOK) and OpenBao stores it non-exportable.
* Settings needed:
  * `OPENBAO_ENABLED=true`
  * `OPENBAO_WRITE_ENABLED=true`
  * `OPENBAO_DID_KEY_ENABLED` for `did:key`, `OPENBAO_DID_WEB_ENABLED` for `did:web`
* The agent's OpenBao policy needs `transit/wrapping_key` (read) and `transit/keys/*/import` (update).
* `did:x509` leaf keys use the same path when OpenBao is enabled.

## Check where the keys of a DID are

`GET /dids/{did}/kms`

* Read-only.
* Tells which backend holds the keys of a DID (`askar`, `node`, `openbao` or mixed) and the key ids.
* If the agent has no keys for that DID, it returns `kmsBackend: null` and no keys.
* The create DID and X.509 import responses also include this info.
* URL-encode the DID when you put it in the path.

The platform stores and returns the backend as `kmsBackend` for each X.509 certificate and DID; see [did:x509 and KMS backend](../platform-apis/did-x509-and-kms-backend.md). The agent's OpenBao KMS is separate from the platform's OpenBao secret storage.
