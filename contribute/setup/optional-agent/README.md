---
description: Local setup using NPM
icon: magento
---

# (Optional) Agent

This is an optional section, it's not required for CREDEBL setup. If you want to explore credo-controller rest APIs locally you can consume this section.

## CREDO Controller <a href="#credo-controller" id="credo-controller"></a>

Clone the following repository:

```
git clone https://github.com/credebl/credo-controller
cd credo-controller
```

Use the following commands to install and upgrade Yarn:

```
npm install -g yarn
```

To install the dependencies use the following command:

```
yarn
```

Below is the cliConfig.json file, which needs to be used to set up the agent

<details>

<summary>cliConfig.json</summary>

```
{
  "label": "AFJ Rest Agent 1",
  "walletId": "sample",  # Mention your walletId here
  "walletKey": "sample",   # Mention your walletKey here
  "walletType": "postgres",  # Mention wallet type here
  "walletUrl": "localhost:5432",  # Mention your wallet url here
  "walletAccount": "postgres",  # Mention your wallet account name here
  "walletPassword": "postgres",   # Mention your wallet password here
  "walletAdminAccount": "postgres",
  "walletAdminPassword": "postgres",,
  "walletScheme": "ProfilePerWallet",
  "indyLedger": [
    {
      "genesisTransactions": "https://raw.githubusercontent.com/Indicio-tech/indicio-network/main/genesis_files/pool_transactions_testnet_genesis",
      "indyNamespace": "indicio:testnet"
    },
    {
      "genesisTransactions": "https://raw.githubusercontent.com/Indicio-tech/indicio-network/main/genesis_files/pool_transactions_demonet_genesis",
      "indyNamespace": "indicio:demonet"
    },
    {
      "genesisTransactions": "https://raw.githubusercontent.com/bcgov/von-network/main/BCovrin/genesis_test",
      "indyNamespace": "bcovrin:testnet"
    }
  ],
  "endpoint": ["localhost:4002"],
  "autoAcceptConnections": true,
  "autoAcceptCredentials": "always",
  "autoAcceptProofs": "never",
  "logLevel": 2,
  "inboundTransport": [
    {
      "transport": "http",
      "port": 4002
    }
  ],
  "outboundTransport": ["http"],
  "adminPort": 4001,
  "tenancy": false,
  "webhookUrl": "http://localhost:5000/wh/9fb768a6-2ad8-435d-95f0-ad1876d2eb74",
  "schemaFileServerURL": "https://schema.credebl.id/schemas/",
  "didRegistryContractAddress": "0xcB80F37eDD2bE3570c6C9D5B0888614E04E1e49E",
  "schemaManagerContractAddress": "0x4742d43C2dFCa5a1d4238240Afa8547Daf87Ee7a",
  "rpcUrl": "https://rpc-amoy.polygon.technology",
  "fileServerUrl": "https://schema.credebl.id",
  "fileServerToken":     #Use your token here
}
```

</details>

{% hint style="info" %}
For polygon mainnet use these configuration
{% endhint %}

```json
"didRegistryContractAddress": "0x0C16958c4246271622201101C83B9F0Fc7180d15",
"schemaManagerContractAddress": "0x4B16719E73949a62E9A7306F352ec73F1B143c27"
"rpcUrl": "https://polygon-rpc.com"
```

_**Description of Fields in cliConfig.json**_

* **referringlabel:** A descriptive name for the agent configuration.
* **walletId:** The identifier for the wallet used by the agent.
* **walletKey:** The key or token used to access the wallet.
* **walletType:** The type of wallet (e.g., PostgreSQL).
* **walletUrl:** The URL where the wallet service is hosted.
* **walletAccount:** The username for the wallet account.
* **walletPassword:** The password for the wallet account.
* **walletAdminAccount:** The username for the wallet admin account.
* **walletAdminPassword:** The password for the wallet admin account.
* **walletScheme:** The `ProfilePerWallet` scheme implies that each wallet operates with its own distinct profile or configuration. This means that each wallet can have its own settings, schemas, and data management rules. It provides isolation between different wallets, which can be useful for managing multiple wallets with different requirements or configurations
*   **indyLedger:** Configuration for Indy ledger.

    To know more about indyLedgers - [IndyLedgers](https://wiki.hyperledger.org/display/indy)
* **endpoint:** List of URLs for the agent’s API endpoints.
* **inboundTransport:** Configuration for inbound transport methods.
* **transport:** Type of transport protocol.
* **port:** Port number used for inbound transport.
* **outboundTransport:** Types of transport methods used for outgoing communications.
* **adminPort:** Port number for administrative operations.
* **tenancy:** Set to `true` for a Shared agent and `false` for a Dedicated or on-premises agent.
* **webhookUrl:** Provide base wallet’s tenantId for Shared agent and for individual entity ID for Dedicated agent
* **schemaFileServerURL:** URL for accessing schema files.
* **didRegistryContractAddress:** To know more about the [DID registry contract address](https://github.com/ayanworks/polygon-did-registrar)
* **schemaManagerContractAddress:** To know more about [schema manager contract address](https://github.com/ayanworks/polygon-schema-manager)
* **rpcUrl:** URL for the Remote Procedure Call (RPC) service.
* **fileServerUrl:** You can create your own file server by referring to the [schema file server](https://github.com/ayanworks/schema-file-server)
* **fileServerToken:** Authentication token for accessing the file server
* **apiKey:** This is the authentication key required to obtain the access token needed for base wallet operations. (Required in **v.2.1.0** and above)

Build Agent controller using the following command:

```
yarn build
```

Use the following command to run the agent locally :

```
./bin/afj-rest.js --config ./samples/cliConfig.json
```

* The command ./bin/afj-rest.js `--config` ./samples/cliConfig.json is used to run a script (afj-rest.js) located in the ./bin/ directory, with the configuration file (cliConfig.json) specified via the `--config` flag.

The agent env sample file is already provided in the repository, for a quick start rename the file to `.env`

### Trust List Configuration

The agent controller supports an optional **trust-list validation** step during OID4VC verification. When enabled, it checks that the issuer's X.509 certificate chain is present in a trusted certificate registry before accepting a presentation.

***

\
**How It Works**

When a verifier session processes an mDL/mdoc presentation, the agent calls your trust-list service with the certificate chain extracted from the credential. The trust-list service responds with `{ "matched": true/false }`. If `matched` is `false`, The verification is rejected.

```
OID4VC Verification Request
  └── Agent extracts X.509 certificate chain from presentation
        └── POST {TRUST_LIST_URL}
              Body: { "x509": ["<base64-cert>", ...], "tenantId": "<id>" }
              ↓
        Response: { "matched": true }  →  verification proceeds
                  { "matched": false } →  verification rejected
```

For **shared agent** mode, `tenantId` is always included in the request body so the trust-list service can scope the lookup per tenant.

***

#### Trust Service API

The agent internally calls the following Trust Service endpoint to validate a certificate chain:

**`POST /api/x509-certificates/validate`**

Verifies whether the provided certificate chain matches the trusted certificates registered in the Trust Service. This is consumed automatically by the agent during X.509 validation in the issuance and verification flow, it is not called directly by API consumers.

**Request Body**

```json
{
  "x509": [
    "<base64-encoded-certificate-data>"
  ],
  "tenantId": "{entityId}"
}
```

**Request Fields**

| Field      | Type             | Required | Description                                                                                                                |
| ---------- | ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `x509`     | array of strings | Yes      | Ordered array of base64-encoded DER certificate strings. Leaf certificate first, followed by any intermediates             |
| `tenantId` | UUID             | No       | Tenant identifier used to scope validation against the correct set of trusted certificates (required in shared agent mode) |

**Expected Response**

```json
{ "matched": true }
```

***

#### Auth Modes

Set `TRUST_SERVICE_AUTH_TYPE` in your `.env` to choose one of two modes.

**`ClientAuth`**

The agent first fetches a bearer token from a platform token endpoint (with in-memory caching, refreshed 60 seconds before expiry), then includes it as `Authorization: Bearer <token>` on every trust-list request.

| Variable                      | Required | Description                                       |
| ----------------------------- | -------- | ------------------------------------------------- |
| `TRUST_SERVICE_AUTH_TYPE`     | **Yes**  | Must be NoAuth or ClientAuth                      |
| `TRUST_LIST_URL`              | **Yes**  | Full URL the agent POSTs the certificate chain to |
| `TRUST_SERVICE_TOKEN_URL`     | **Yes**  | Platform endpoint that returns an access token    |
| `TRUST_SERVICE_CLIENT_ID`     | **Yes**  | OAuth2 client ID                                  |
| `TRUST_SERVICE_CLIENT_SECRET` | **Yes**  | OAuth2 client secret                              |

```bash
TRUST_SERVICE_AUTH_TYPE=ClientAuth
TRUST_LIST_URL=https://trust.example.com/api/v1/certificates/match
TRUST_SERVICE_TOKEN_URL=https://platform.example.com/api/v1/auth/token
TRUST_SERVICE_CLIENT_ID=agent-controller-client
TRUST_SERVICE_CLIENT_SECRET=super-secret
```

Token request body sent to `TRUST_SERVICE_TOKEN_URL`:

```json
{ "clientId": "...", "clientSecret": "..." }
```

Expected response:

```json
{ "data": { "access_token": "<jwt>" } }
```

***

#### Startup Validation

At agent startup, the controller validates the auth configuration. If required variables are missing, the agent will refuse to start with a descriptive error:

```
[validateAuthConfig] TRUST_SERVICE_TOKEN_URL is required for ClientAuth
[validateAuthConfig] TRUST_LIST_URL is required for NoAuth
```

If `TRUST_SERVICE_AUTH_TYPE` is set to an unrecognised value, the startup also fails:

```
TRUST_SERVICE_AUTH_TYPE 'ApiKey' is not supported. Supported types: NoAuth, ClientAuth
```

If none of the trust-list env vars are set at all, trust-list validation is simply **not invoked,** the agent runs without it.
