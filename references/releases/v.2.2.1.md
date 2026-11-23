# v.2.2.1

Released on **11 November 2026** for Platform and Agent controller (both `v2.2.1`). Studio has no `v2.2.1` release. Platform changelog: [v2.2.0...v2.2.1](https://github.com/credebl/platform/compare/v2.2.0...v2.2.1). Agent controller changelog: [v2.2.0...v2.2.1](https://github.com/credebl/agent-controller/compare/v2.2.0...v2.2.1).

{% hint style="info" %}
`v2.3.0` and agent controller `v2.3.3` supersede this release. If you move from `v2.2.0` to `v2.3.0`, apply the steps below as part of that upgrade; they are repeated in the upgrade section of [v.2.3.0](v.2.3.0.md).
{% endhint %}

## Platform

### Highlights

* **JSON-LD credentials over OID4VC** — the `jwt_vc_json-ld` format.
* **RustFS and local file storage** — storage is pluggable, with Amazon S3 still supported.
* **Row-level security** migration for tenant isolation.
* Status list settings added to `agent.env`, `protocolVersion 2` for Indy flows, and a fix to the organization public-profile search.
* Dependabot configuration, `.env.demo` cleanup and updated comments, and a refreshed pnpm lock file.

### Changes need to be applied

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

Delete the removed variables `ELK_LOG`, `ELK_LOG_PATH`, `ELK_USERNAME` and `ELK_PASSWORD`, and add the storage settings:

```env
FILE_STORAGE_TYPE=aws
RUSTFS_ENDPOINT=
RUSTFS_ACCESS_KEY_ID=
RUSTFS_SECRET_ACCESS_KEY=
RUSTFS_REGION=
HIDE_EXPERIMENTAL_OIDC_CONTROLLERS=false
```

Set `FILE_STORAGE_TYPE` to `aws` for Amazon S3 or `rustfs` for a RustFS endpoint, and fill in the matching bucket or endpoint values.

### Database migration

The release adds a row-level security migration (`enable_rls_if_not_exists`). Run it during the upgrade window:

```bash
npx prisma migrate deploy
```

{% hint style="warning" %}
The migration changes database policies. Apply it to a copy of your production data first, and take a backup before running it against production.
{% endhint %}

## Agent controller

Agent controller `v2.2.1` is paired with this platform release.

* **W3C JSON-LD credentials** — issuance, presentation, and credential sign and verify.
* **DCQL** — `ldp_vc` query filtering and JSON-LD serialization fixed.
* **Tenant sessions** are released after proof events (a session leak in multi-tenant mode).
* Mediator message-forwarding message type, Node base image moved to 26, patch files renamed for Windows compatibility, and routine security updates of dependencies.

Add the status list settings to `agent.env`:

```env
STATUS_LIST_SERVER_URL=https://status-list.example.com
STATUS_LIST_API_KEY=<API_KEY>
STATUS_LIST_DEFAULT_SIZE=131072
```

{% hint style="warning" %}
Rebuild agent images instead of reusing cached layers; layers based on the previous Node version fail at runtime.
{% endhint %}

## Upgrade checklist

1. Back up the database and the environment files.
2. Rename `AWS_BUCKET` and `AWS_ORG_LOGO_BUCKET_NAME`, and add `STOREOBJECT_BUCKET`.
3. Remove the `ELK_*` variables and add the storage variables.
4. Run `npx prisma migrate deploy` and verify the row-level security policies.
5. Add the `STATUS_LIST_*` values to the agent environment and rebuild the agent image without cache.
