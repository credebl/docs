# v.2.2.0

## Platform

If you are updating to `v2.2.0`, apply the following changes.

#### Changes need to be applied

**Update environment variables**

The `adminClient` was already used as `KEYCLOAK_MANAGEMENT_CLIENT_ID` in earlier versions.

For this release, update the `adminClient` values for the following variables in your `.env` file:

```
ADMIN_KEYCLOAK_ID=adminClient
ADMIN_KEYCLOAK_SECRET=<ADMIN_CLIENT_SECRET>
```

**Create `credeblClient`**

Create a new Keycloak client named `credeblClient`. Refer to the [`credeblClient` creation page](../../contribute/setup/service-setup.md#additional-keycloak-configuration-for-v2.2.0) for setup instructions.

After creating the client, update the following environment variables with the client ID and secret:

```
KEYCLOAK_MANAGEMENT_CLIENT_ID=credeblClient
KEYCLOAK_MANAGEMENT_CLIENT_SECRET=<CREDEBL_CLIENT_SECRET>
```

#### **Revocation support**

If you want to enable revocation support, update the following environment variable with your status list server URL in platform env file:

```
STATUS_LIST_HOST=<STATUS_LIST_SERVER_URL>
```

***

## Credo-Controller

Added support for OID4VC features and revocation configuration.

#### Changes need to be applied

**OID4VC feature support**

If you want to enable OID4VC features and do not want to use authentication update the environment with:

```
TRUST_URL_LIST=<TRUST_URLS>
TRUST_SERVICE_AUTH_TYPE=NoAuth
```

If you are using authentication:

```
TRUST_SERVICE_AUTH_TYPE=ClientAuth
TRUST_SERVICE_TOKEN_URL=http://host:5000/v1/orgs/{clientId}/tokenT
RUST_SERVICE_CLIENT_ID=<CLIENT_ID>
TRUST_SERVICE_CLIENT_SECRET=<CLIENT_SECRET>
```

***

**Data deletion and purging**

For data deletion and purging configuration, refer to the [Data Purging documentation page](https://docs.credebl.id/docs/contribute/setup/optional-agent/data-deletion-purge-system).
