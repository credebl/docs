# v.2.3.0 (RC)

{% hint style="danger" %}
**Release candidate — not for production.** The current candidate is `v2.3.0-rc.2`, published on **2 November 2026**. It supersedes `rc.1`, whose image build failed on the `notification` service. Use it for evaluation and upgrade testing only; deploy `v2.2.0` in production until `v2.3.0` is generally available.
{% endhint %}

This release is published together with agent controller `v2.3.0`. The platform image is tagged `v2.3.0-rc.2`; the agent image is `ghcr.io/credebl/credo-controller:v2.3.0`.

## Platform

### Highlights

* **OpenBao secret storage** — optional external secret provider with a provisioning script and `docker-compose.openbao.yml`.
* **RustFS and local file storage** — storage is now pluggable through `@credebl/storage`, with Amazon S3 still supported.
* **JSON-LD credentials over OID4VC** — `jwt_vc_json-ld` and `ldp_vc` formats.
* **Per-module Swagger UIs** and an `API_GATEWAY_VERSION` value exposed through the API.
* **Row-level security** migration for tenant isolation.

### Breaking changes

Rename these variables in your platform `.env` file before starting the new image:

| Old name                   | New name               |
| -------------------------- | ---------------------- |
| `AWS_BUCKET`               | `FILE_SHARING_BUCKET`  |
| `AWS_ORG_LOGO_BUCKET_NAME` | `ORG_LOGO_BUCKET_NAME` |

`SHORTENED_URL_DOMAIN` now builds from `STOREOBJECT_BUCKET`, so update it if you use shortened URLs:

```env
STOREOBJECT_BUCKET=<BUCKET_NAME>
SHORTENED_URL_DOMAIN='https://s3.AWS_S3_STOREOBJECT_REGION.amazonaws.com/STOREOBJECT_BUCKET'
```

The following variables are removed. Delete them from your environment file; leaving them in place has no effect but will confuse future upgrades:

```env
ELK_LOG
ELK_LOG_PATH
ELK_USERNAME
ELK_PASSWORD
```

### New environment variables

```env
API_GATEWAY_VERSION=1.0
ENABLE_SWAGGER=true
FILE_STORAGE_TYPE=aws
RUSTFS_ENDPOINT=
RUSTFS_ACCESS_KEY_ID=
RUSTFS_SECRET_ACCESS_KEY=
RUSTFS_REGION=
HIDE_EXPERIMENTAL_OIDC_CONTROLLERS=false
```

Set `FILE_STORAGE_TYPE` to `aws` for Amazon S3 or `rustfs` for a RustFS endpoint, and fill in the matching bucket or endpoint values.

### Optional: OpenBao secret storage

OpenBao is disabled by default. To enable it, deploy the provider and set:

```env
ENABLE_BAO=true
SECRETS_PROVIDER=openbao
BAO_URL=http://127.0.0.1:8200
BAO_SECRET_PATH=secret/data/credebl_resend_api_key
BAO_ROLE_ID=<ROLE_ID>
BAO_SECRET_ID=<SECRET_ID>
```

If you keep secrets in environment variables, leave `ENABLE_BAO=false` and `SECRETS_PROVIDER` unset.

### Database migration

This release adds a row-level security migration (`enable_rls_if_not_exists`). Run the migration during the upgrade window:

```bash
npx prisma migrate deploy
```

{% hint style="warning" %}
The migration changes database policies. Apply it to a copy of your production data first, and take a backup before running it against production.
{% endhint %}

### Dependency changes

Some dependencies were upgraded to major versions or removed. Custom builds and images that extend the official Dockerfile must be updated:

* nodemailer `7` → `10`
* nanoid `4` → `5` (ESM-only)
* firebase-admin `13` → `14`; the notification service now uses the modular API
* axios `0.26`/`1.16` → `1.20`
* `@opentelemetry/sdk-node` `0.202` → `0.221`
* Removed: `html-pdf`, `puppeteer`, `node-html-to-image`, `auth0-js`, `winston-elasticsearch`, `@elastic/ecs-winston-format`
* pnpm updated to `9.15.9` with security overrides

## Agent controller

Agent controller `v2.3.0` was released on **30 October 2026**. The image name is unchanged in this release — `ghcr.io/credebl/credo-controller:v2.3.0` — and the rename to `agent-controller` is deferred.

Pin the platform to this image:

```env
AFJ_VERSION=ghcr.io/credebl/credo-controller:v2.3.0
```

### Highlights

* W3C JSON-LD credentials end to end, including `ldp_vc` over OID4VC and DCQL verification.
* X.509 certificate chain support.
* Tenant session leak fix.
* Base image moved to Node 26.

{% hint style="warning" %}
Rebuild agent images instead of reusing cached layers. Cached layers based on the previous Node version will fail at runtime.
{% endhint %}

### Changes need to be applied

Add the status list settings to `agent.env`:

```env
STATUS_LIST_SERVER_URL=https://status-list.example.com
STATUS_LIST_API_KEY=<API_KEY>
STATUS_LIST_DEFAULT_SIZE=131072
```

The holder list endpoints for SD-JWT, mDoc, and W3C credentials return a plain array when called without query parameters, and an envelope of `{ data, pagination, filters? }` as soon as any parameter is sent. Handle both shapes if you consume these endpoints.

## Studio

Studio has no `v2.3.0` release yet. Continue using Studio `v2.2.0` with platform `v2.3.0-rc.2`; no Studio-side upgrade is required for this candidate.

## Upgrade checklist

1. Back up the database and the environment files.
2. Rename `AWS_BUCKET` and `AWS_ORG_LOGO_BUCKET_NAME`, and add `STOREOBJECT_BUCKET`.
3. Remove the `ELK_*` variables and add the new storage and Swagger variables.
4. If you want OpenBao, enable it and provide the role and secret IDs.
5. Run `npx prisma migrate deploy` and verify the row-level security policies.
6. Set `AFJ_VERSION` to `ghcr.io/credebl/credo-controller:v2.3.0` and add the `STATUS_LIST_*` values to the agent environment.
7. Rebuild all images without cache, then deploy and run your regression tests.
8. Report any issue before `v2.3.0` is promoted to stable.

## Known limitations

* This is a release candidate; interfaces and environment variables may still change.
* `v2.3.0-rc.1` is unusable because its notification image fails to build. Use `rc.2`.
* Agent controller `v2.3.1` was published after this candidate. It is not part of `rc.2`; evaluate it separately.
