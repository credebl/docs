# v.2.2.0

Released on **13 May 2026** for Platform, Studio, and Agent controller. This is the latest stable release.

## Platform

### Highlights

* **OpenID4VC issuance and verification** — issuer, holder, and verifier flows with `preAuth` and `noAuth` issuance, issuance and verification templates, and HAIP 1.0 compatible presentation flows.
* **SD-JWT and mDoc credentials**, including SD-JWT revocation through the IETF Token Status List 2021.
* **X.509 certificates** — creation, import, and trust management.
* **Digital Trust Ecosystems** — governed networks of organisations coordinated by an ecosystem lead.
* **Trust-service integration** and **signed webhooks**.
* **Consent notices** with intent mapping, and `noticeUrl` support during issuance.
* Simplified wallet provisioning, an SMTP email provider option, and configurable Prisma logging.

{% hint style="warning" %}
OID4VC support is experimental in this release. Test it in a non-production environment before enabling it for users.
{% endhint %}

### Changes need to be applied

#### Update environment variables

The `adminClient` was used as `KEYCLOAK_MANAGEMENT_CLIENT_ID` in earlier versions. For this release, point the admin credentials at `adminClient` explicitly in your `.env` file:

```env
ADMIN_KEYCLOAK_ID=adminClient
ADMIN_KEYCLOAK_SECRET=<ADMIN_CLIENT_SECRET>
```

#### Create `credeblClient`

Create a new Keycloak client named `credeblClient`. Refer to the [`credeblClient` creation page](../../contribute/setup/service-setup.md#additional-keycloak-configuration-for-v2.2.0) for setup instructions.

After creating the client, update the following environment variables with the client ID and secret:

```env
KEYCLOAK_MANAGEMENT_CLIENT_ID=credeblClient
KEYCLOAK_MANAGEMENT_CLIENT_SECRET=<CREDEBL_CLIENT_SECRET>
```

{% hint style="danger" %}
`KEYCLOAK_MANAGEMENT_CLIENT_ID` no longer points at `adminClient`. Deployments that skip this step lose platform administration and token generation after the upgrade.
{% endhint %}

#### Revocation support

If you want to enable revocation support, update the following environment variable with your status list server URL in the platform env file:

```env
STATUS_LIST_HOST=<STATUS_LIST_SERVER_URL>
```

See the [Status List Server](../status-list-server.md) reference for deployment.

#### NATS authentication

NATS authentication is now selected explicitly with `NATS_AUTH_TYPE`, which accepts `none`, `usernamePassword`, `nkey`, or `creds`. The connection uses a single `NATS_URL`; `NATS_HOST` and `NATS_PORT` are no longer read.

For **username/password** authentication:

```env
NATS_AUTH_TYPE=usernamePassword
NATS_USER=<NATS_USER>
NATS_PASSWORD=<NATS_PASSWORD>
```

For **JWT-based authentication with a credentials file**, mount the same `.creds` file into every service container and point the platform at it:

```env
NATS_AUTH_TYPE=creds
NATS_CREDS_FILE=/run/secrets/nats.creds
```

For **NKey** authentication, set the seed for each service that connects to NATS, for example:

```env
NATS_AUTH_TYPE=nkey
ORGANIZATION_NKEY_SEED=<NKEY_SEED>
LEDGER_NKEY_SEED=<NKEY_SEED>
```

If your broker does not require authentication, keep the default:

```env
NATS_AUTH_TYPE=none
```

The notification service reads its own `NOTIFICATION_NATS_AUTH_TYPE` value, which accepts the same options. Set `ENABLE_NATS_NOTIFICATION=true` only if you run the notification consumer.

{% hint style="warning" %}
When `NATS_AUTH_TYPE` is unset, the platform falls back to `nkey` and every service fails at startup without a seed. Set `NATS_AUTH_TYPE` explicitly during the upgrade, even if it is `none`.
{% endhint %}

## Agent controller

Added support for OID4VC features, X.509 certificate management, and revocation configuration.

### Changes need to be applied

#### OID4VC feature support

If you want to enable OID4VC features and do not want to use authentication, update the environment with:

```env
TRUST_LIST_URL=<TRUST_URLS>
TRUST_SERVICE_AUTH_TYPE=NoAuth
```

If you are using authentication:

```env
TRUST_SERVICE_AUTH_TYPE=ClientAuth
TRUST_SERVICE_TOKEN_URL=http://host:5000/v1/orgs/{clientId}/token
TRUST_SERVICE_CLIENT_ID=<CLIENT_ID>
TRUST_SERVICE_CLIENT_SECRET=<CLIENT_SECRET>
```

#### X.509 certificate validity

The agent issues X.509 certificates for OID4VC. Set the validity period and start month used when generating root CA and document signer certificates:

```env
ROOT_CA_VALIDITY_YEARS=<YEARS>
DCS_VALIDITY_YEARS=<YEARS>
ROOT_CA_START_FROM_CURRENT_MONTH=true
DCS_START_FROM_CURRENT_MONTH=true
```

#### Holder redirection

For OID4VC flows that redirect the holder back to your application, set:

```env
APP_URL=<PLATFORM_URL>
AGENT_HTTP_URL=<AGENT_URL>
HOLDER_REDIRECT=<HOLDER_REDIRECT_URL>
HOLDER_CLIENT_ID=<HOLDER_CLIENT_ID>
ALLOW_INSECURE_HTTP_URLS=false
```

Keep `ALLOW_INSECURE_HTTP_URLS` set to `false` outside local development.

#### API key

Set the agent API key used by the platform to authenticate agent requests:

```env
API_KEY=<AGENT_API_KEY>
```

#### Data deletion and purging

For data deletion and purging configuration, refer to the [Data Purging documentation page](../../contribute/setup/optional-agent/data-deletion-purge-system.md).

## Studio

### Highlights

* New UI and API integration for **ecosystem creation, management, and intents**.
* Restricted platform administration access and improved ecosystem and date handling.
* Automatic token fetch when token data changes.

### Fixes

* Corrected the invalid date shown on member invitations.
* Fixed certificate import handling and ecosystem build issues.
* Fixed type errors in intent lists and Axios interceptors.

### Changes need to be applied

Update the Studio `.env` file from the new `env.demo`, in particular `FRONT_END_URL`, `POWERED_BY`, `POWERED_BY_URL`, and `UPLOAD_LOGO_HOST`, which no longer contain environment-specific defaults. Rebuild and redeploy Studio.
