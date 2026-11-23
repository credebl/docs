---
description: >-
  Import a did:x509 and see which key store (KMS backend) holds an
  organization's keys.
icon: certificate
---

# did:x509 and KMS backend

`did:x509` import and X.509 KMS backend tracking are available with platform `v2.3.0` and agent controller `v2.3.3`. With an older agent, the platform returns an "upgrade the agent" error for `did:x509` import.

## Import a did:x509

**`POST`** `/v1/orgs/{orgId}/agents/did/x509/import`

Imports a CA-issued certificate chain (leaf first) and the leaf private key as a `did:x509` in the organization wallet. Allowed roles: owner, admin, issuer.

| Field                      | Required | Description                                                                                        |
| -------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `certificateChain`         | Yes      | Array of PEM certificates, leaf first.                                                             |
| `encryptedKey`             | One of   | The leaf private key encrypted to a single-use import session (`method: x509`). Preferred.         |
| `privateKey`, `passphrase` | One of   | Plaintext key. Works only when the agent runs with `ALLOW_PLAINTEXT_KEY_IMPORT=true`.              |
| `policies`                 | No       | Policies of the DID. The agent defaults to the common name (`subject:CN`) of the leaf certificate. |

The DID is built from the root certificate fingerprint and the policies. The chain is stored with the certificate.

**`GET`** `/v1/orgs/{orgId}/agents/did/x509/chain/{did}` returns the stored certificate chain. The `did` must start with `did:x509`. Allowed roles: owner, admin, issuer, verifier.

SD-JWT VCs signed with a did:x509 carry the chain in the `x5c` header. A verifier accepts them only when the chain leads to a root it trusts; see the trust list settings in [(Optional) Agent](../../contribute/setup/optional-agent/).

## KMS backend

Each X.509 certificate and each DID has a `kmsBackend`, stored and returned by the APIs:

| Value     | Meaning                                                                                    |
| --------- | ------------------------------------------------------------------------------------------ |
| `askar`   | Keys are in the agent's Askar wallet (default).                                            |
| `node`    | Keys are in a persistent Node KMS backend (used for RSA and P-521 keys Askar cannot hold). |
| `openbao` | Keys are in OpenBao Transit (agent setting `OPENBAO_ENABLED=true`).                        |

The agent also reports a DID's backend as `mixed` when its keys sit in more than one store (`GET /dids/{did}/kms` on the agent).

Existing certificates are backfilled by the migration `add_kms_backend_to_x509_certificates`: key ids starting with `ob_` become `openbao`, all others `askar`. The `kmsBackend` column of DIDs is nullable (`add_kms_backend_to_org_dids`).

## DID archive state

The platform also tracks whether a DID is archived (`isArchived`, `archivedAt`) and whether it was a primary DID (`wasPrimary`).

## Migrations

`add_kms_backend_to_x509_certificates`, `add_certificate_chain_to_x509_certificates`, `add_did_archive_and_usage_tracking` and `add_kms_backend_to_org_dids`. Run `npx prisma migrate deploy`. See [v.2.3.0](../releases/v.2.3.0.md).
