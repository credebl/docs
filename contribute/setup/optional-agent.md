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
