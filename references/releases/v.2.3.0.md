# v.2.3.0

This release is published together with agent controller `v2.3.3`. The platform image is tagged `v2.3.0`; the agent image is `ghcr.io/credebl/credo-controller:v2.3.3`. Both were released on **23 November 2026**. The previous release is `v2.2.1`, published on 11 November 2026. Studio v2.3.0 is released with it; the Studio image is ghcr.io/credebl/studio:v2.3.0.

This page lists what was merged after `v2.2.1`, including everything first shipped in the `v2.3.0` release candidates. Full platform changelog: [v2.2.1...v2.3.0](https://github.com/credebl/platform/compare/v2.2.1...v2.3.0).

{% hint style="info" %}
**Upgrading from v2.2.0?** `v2.2.1` introduced pluggable file storage (RustFS), row-level security, W3C JSON-LD formats over OID4VC and the `AWS_BUCKET` renames. They are not new in `v2.3.0`, but you need them when you skip `v2.2.1`. See the last section of this page and [v.2.2.1](v.2.2.1.md).
{% endhint %}

## Agent controller compatibility

Platform `v2.3.0` requires agent controller `v2.3.3`. The image name is unchanged (`ghcr.io/credebl/credo-controller`); the rename to `agent-controller` is deferred upstream.

```env
AFJ_VERSION=ghcr.io/credebl/credo-controller:v2.3.3
```

{% hint style="warning" %}
**did:polygon needs a setting.** Controller `v2.3.3` turns plaintext key import off. The platform creates did:polygon DIDs by sending `privatekey` to `POST /dids/write`, which the controller now rejects with `400`. Until the platform sends an encrypted key, set `ALLOW_PLAINTEXT_KEY_IMPORT=true` in the agent environment of every deployment that creates did:polygon DIDs.
{% endhint %}

Rebuild agent images instead of reusing cached layers; the base image is Node 26.

### What the platform uses from agent controller 2.3.x

* **OID4VCI issuer notifications (2.3.3).** Issuers advertise a `notification_endpoint`, return a `notification_id` with each credential, and post wallet notifications on the `/openid4vc-issuance` webhook. The platform relays them. Set `OID4VCI_NOTIFICATION_ENDPOINT_ENABLED=false` to turn the endpoint off. A wallet can report a notification only while the session's access token is valid (`OID4VCI_ACCESS_TOKEN_EXPIRY`, default 3600 s).
* **did:x509 import (2.3.3)** and **KMS backend of X.509 keys (2.3.3).** With an older agent, the platform returns an "upgrade the agent" error for did:x509 import, and new certificates have no `kmsBackend`.
* **Holder binding to an existing DID (2.3.1).** `request-credential` takes `holderDidUrl` and `bindingPolicy`.
* **`ldp_vc` bound to a `did:web` holder and `Ed25519VerificationKey2020` (2.3.2).** The platform's `did:web` default for `ldp_vc` relies on these. Since 2.3.2, `credentialSubject.id` of new W3C credentials is the holder's bare DID, and DCQL `ldp_vc` queries must use expanded JSON-LD IRIs in `meta.type_values`.
* **From 2.3.0:** W3C JSON-LD end to end (`ldp_vc` over OID4VC, DCQL verification), X.509 chain support, a tenant session leak fix, and a Node 26 base image. Credo moved from 0.7.0 to 0.7.4 in 2.3.1 with no storage migration.

### Behaviour changes in agent controller 2.3.3

* **Holder notifications are on by default.** `POST /openid4vc/holder/request-credential` sends `credential_accepted` (or `credential_failure`) to the issuer. Send `sendNotification: false` to turn it off. Each returned credential has a new `notification` field: `{ status: "sent", event }`, `{ status: "skipped", reason }` or `{ status: "failed", event, reason }`. A notification that cannot be sent never fails the request.
* **Stricter `did:web`.** `POST /dids/write` with `method: web` validates the domain and optional `:`-separated path; an invalid host, an empty segment or `..` returns `400`. The new `POST /dids/web/import` imports a `did:web` document and keys issued by an external authority.
* **Plaintext key import is disabled** unless `ALLOW_PLAINTEXT_KEY_IMPORT=true` (see the warning above).
* **Holder list endpoints** (SD-JWT, mdoc, W3C) return a plain array when called with no query parameters, and an envelope `{ data, pagination, filters? }` as soon as any parameter is sent. Handle both shapes.
* Agent 2.3.3 also adds items the platform does not use yet: an optional OpenBao KMS, `selectedCredentials` and `verifierResponse` on `accept-proof-request`, the whole DCQL query in presentation requests, and an optional Indy ledger.

Agent settings are described in [(Optional) Agent](../../contribute/setup/optional-agent/).

## Platform

### Features

* **OpenBao secret storage.** Optional provider, provisioning script and `docker-compose.openbao.yml`, controlled by `ENABLE_BAO`, `SECRETS_PROVIDER` and the `BAO_*` variables.
* **Revocation with Bitstring Status List.** JSON-LD credentials can be issued as revocable (`isRevocable`, `credentialVersion` `v1.0` or `v2.0`). The new `POST /orgs/:orgId/credentials/:threadId/revoke` revokes DIDComm credentials, idempotently. OID4VC revocation of SD-JWT VC, `jwt_vc_json-ld` and `ldp_vc` credentials is persisted. OID4VP verification returns a structured result for revoked or failed sessions. See [Credential revocation](../platform-apis/credential-revocation.md).
* **Cloud wallet.** Credential management by format, OpenID4VCI and OpenID4VP holder flows, and DID binding. See [Cloud wallet APIs](../platform-apis/cloud-wallet-apis.md).
* **Configurable holder binding methods** per template and per issuer; `ldp_vc` advertises `did:web` by default. See [Holder binding methods](../platform-apis/oid4vc-apis/holder-binding-methods.md).
* **RS256 holder proofs** for `dc+sd-jwt` and `jwt_vc_json-ld`, so a holder whose `did:web` uses an RSA key can receive a bound credential. `mso_mdoc` is unchanged.
* **OID4VC offer checks, readable offer states and reissue.** Non-UUID offer and session ids return `400`; an mDoc offer is checked before creation (`422` when `issuing_country` does not match the certificate); offers return a `status` object; `POST /orgs/{orgId}/oid4vc/credential-offer/{offerId}/reissue` creates a new offer for a used or expired one.
* **OID4VCI wallet notifications** relayed to the organization's webhook, with history stored per issuance session.
* **`did:x509`** import and chain read, and the **KMS backend** of X.509 certificates and DIDs. See [did:x509 and KMS backend](../platform-apis/did-x509-and-kms-backend.md).
* Swagger UIs per module group, switched with `ENABLE_SWAGGER`; the API gateway version through `API_GATEWAY_VERSION`; and changesets for release notes.

### Fixes

* Agent provisioning scripts run with `execFile` arguments instead of shell interpolation.
* Cloud wallet: holder wallet resolution scoped to the authenticated user, base wallet configuration restricted to platform administrators, health checks use the holder tenant token, and cloud wallet creation works on Credo 0.7 agents.
* Creating a DID for an organization with many DIDs no longer deadlocks.
* `prisma db seed` finds `ts-node`; notifications use the firebase-admin 14 modular API; invitation responses return the `org_invitations` array; template validation returns a JSON error; `sendError` no longer crashes on undefined errors; Swagger redirect fixed.
* Security: critical and high Dependabot vulnerabilities, SonarQube security hotspots and critical container image vulnerabilities.

### Dependency changes

Custom builds and images that extend the official Dockerfile must be updated:

* nodemailer `7` → `10`
* nanoid `4` → `5` (ESM-only)
* firebase-admin `13` → `14`
* axios `1.16` → `1.21`
* uuid `9` → `11`
* `@opentelemetry/sdk-node` `0.202` → `0.300`
* Removed: `html-pdf`, `puppeteer`, `node-html-to-image`, `auth0-js`
* Docker compose: redis `6.2-alpine` → `8.10-alpine`; nats pinned to `2.15.2`
* pnpm `9.15.3` → `9.15.9` with security overrides

### Environment variables

New in `.env.demo`:

```env
API_GATEWAY_VERSION=1.0
ENABLE_SWAGGER=true
```

For the optional OpenBao provider:

```env
ENABLE_BAO=false
SECRETS_PROVIDER=
BAO_URL=http://127.0.0.1:8200
BAO_SECRET_PATH=secret/data/credebl_resend_api_key
BAO_ROLE_ID=<ROLE_ID>
BAO_SECRET_ID=<SECRET_ID>
```

If you keep secrets in environment variables, leave `ENABLE_BAO=false` and `SECRETS_PROVIDER` unset.

### Database migrations

Run `npx prisma migrate deploy`. Eight migrations are new since `v2.2.1`, all additive:

| Migration                                          | Change                                                                                                                                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `add_cryptographic_binding_methods_to_oidc_issuer` | Adds `oidc_issuer.cryptographicBindingMethods TEXT[] DEFAULT '{}'`, no backfill.                                                                                         |
| `add_bitstring_status_to_credentials`              | Adds `statusListId`, `statusListIndex`, `statusListUri`, `credentialVersion` and `revokedAt` to `credentials`, with a unique index on `(statusListId, statusListIndex)`. |
| `add_revoked_at_to_issued_oid4vc_credentials`      | Adds `issued_oid4vc_credentials.revokedAt`.                                                                                                                              |
| `add_kms_backend_to_x509_certificates`             | Adds a nullable `x509_certificates.kmsBackend` and backfills existing rows (key ids starting with `ob_` become `openbao`, all others `askar`).                           |
| `add_did_archive_and_usage_tracking`               | Adds `org_dids.archivedAt`, `isArchived` (default `false`) and `wasPrimary` (default `true`).                                                                            |
| `add_kms_backend_to_org_dids`                      | Adds a nullable `org_dids.kmsBackend`.                                                                                                                                   |
| `add_certificate_chain_to_x509_certificates`       | Adds `x509_certificates.certificateChain TEXT[]`, default empty.                                                                                                         |
| `add_notifications_to_oid4vc_credentials`          | Adds a nullable `oid4vc_credentials.notifications` jsonb column, no backfill.                                                                                            |

## Studio

Studio v2.3.0 is released together with platform v2.3.0 and agent controller v2.3.3. The image is ghcr.io/credebl/studio:v2.3.0. New in Studio: an organization wallet page with DID details, resolve, set as primary, archive, restore and delete actions; browser-encrypted private key import for did:key, did:web and did:polygon; did:x509 import from a reviewed certificate chain and X.509 certificate import with its chain; the KMS backend (Askar, NodeKMS or OpenBao) shown for each DID and certificate; OID4VC issuer, template and offer management; a platform admin console at /admin; and light, dark and system themes on Next.js 16. Deploy platform v2.3.0 with its migrations and agent controller v2.3.3 before Studio, and set NEXT\_PUBLIC\_CURRENT\_RELEASE=v2.3.0. Release notes: https://github.com/credebl/studio/releases/tag/v2.3.0

## Upgrade notes

* **Existing OID4VC issuers and templates** keep the binding methods and proof algorithms already published in their agent metadata (including the new `did:web` default for `ldp_vc` and `RS256` proofs) until their configuration is pushed again. Update an issuer (`POST /v1/orgs/{orgId}/oid4vc/issuers/{issuerId}`) to re-push it. A template's binding methods are pushed when the template is created or updated (`PATCH /v1/orgs/{orgId}/oid4vc/{issuerId}/template/{templateId}`). Issuers created after the upgrade get the new configuration directly.
* **OID4VCI issuance webhook.** `notification` is validated, and an invalid one gets `400`. The `notifications` history is accepted in any shape. Organization webhook consumers must not treat a post with `data.notification` as a state change.
* **Agent provisioning.** Deploy `agent-service` and `agent-provisioning` together.
* **Redis.** The compose file moves redis from 6.2 to 8.10. Check your data and persistence settings before pulling the new image.

### Upgrade checklist

1. Back up the database and the environment files.
2. If you come from `v2.2.0`, apply the steps in the last section, "If you are upgrading from v2.2.0".
3. Add `API_GATEWAY_VERSION` and `ENABLE_SWAGGER`; configure OpenBao only if you want it.
4. Run `npx prisma migrate deploy`.
5. Set `AFJ_VERSION` to `ghcr.io/credebl/credo-controller:v2.3.3`. If you create did:polygon DIDs, add `ALLOW_PLAINTEXT_KEY_IMPORT=true` to the agent environment.
6. Rebuild all images without cache, deploy `agent-service` and `agent-provisioning` together, and run your regression tests.
7. Push issuer and template configuration again for existing OID4VC issuers that should use the new binding methods.

## If you are upgrading from v2.2.0

These changes first shipped in platform `v2.2.1`. Apply them when you move from `v2.2.0` to `v2.3.0`.

Rename these variables in your platform `.env` file:

| Old name                   | New name               |
| -------------------------- | ---------------------- |
| `AWS_BUCKET`               | `FILE_SHARING_BUCKET`  |
| `AWS_ORG_LOGO_BUCKET_NAME` | `ORG_LOGO_BUCKET_NAME` |

`SHORTENED_URL_DOMAIN` builds from `STOREOBJECT_BUCKET`, so update it if you use shortened URLs:

```env
STOREOBJECT_BUCKET=<BUCKET_NAME>
SHORTENED_URL_DOMAIN='https://s3.AWS_S3_STOREOBJECT_REGION.amazonaws.com/STOREOBJECT_BUCKET'
```

Delete the removed `ELK_LOG`, `ELK_LOG_PATH`, `ELK_USERNAME` and `ELK_PASSWORD` variables, and add the storage settings:

```env
FILE_STORAGE_TYPE=aws
RUSTFS_ENDPOINT=
RUSTFS_ACCESS_KEY_ID=
RUSTFS_SECRET_ACCESS_KEY=
RUSTFS_REGION=
HIDE_EXPERIMENTAL_OIDC_CONTROLLERS=false
```

Set `FILE_STORAGE_TYPE` to `aws` for Amazon S3 or `rustfs` for a RustFS endpoint. `v2.2.1` also added a row-level security migration (`enable_rls_if_not_exists`); apply it to a copy of your production data first and back up before running it against production. Add the `STATUS_LIST_SERVER_URL`, `STATUS_LIST_API_KEY` and `STATUS_LIST_DEFAULT_SIZE` values to `agent.env` if you use status lists.
