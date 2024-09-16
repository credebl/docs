---
title: Local setup using NPM
description: A reference page in my new CREDEBL docs site.
---

### CREDO Controller
Clone the following repository:

```bash
git clone https://github.com/credebl/credo-controller
cd credo-controller
```

Use following commands to install and upgrade Yarn:

```bash
npm install -g yarn
```
To install the dependancies use following command:
```bash
 yarn
```

Below is the cliConfig.json file, which needs to be used to set up the agent
```bash

{
  "label": "AFJ Rest Agent 1",
  "walletId": "sample",  # Mention your walletId here
  "walletKey": "sample",   # Mention your walletKey here
  "walletType": "postgres",  # Mention wallet type here
  "walletUrl": "localhost:5432",  # Mention your wallet url here
  "walletAccount": "********",  # Mention your wallet account name here
  "walletPassword": "********",   # Mention your wallet password here
  "walletAdminAccount": "********",
  "walletAdminPassword": "********",,
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
***Description of Fields in cliConfig.json***
- **label:** A descriptive name for the agent configuration.
- **walletId:** The identifier for the wallet used by the agent.
- **walletKey:** The key or token used to access the wallet.
- **walletType:** The type of wallet (e.g., PostgreSQL).
- **walletUrl:** The URL where the wallet service is hosted.
- **walletAccount:** The username for the wallet account.
- **walletPassword:** The password for the wallet account.
- **walletAdminAccount:** The username for the wallet admin account.
- **walletAdminPassword:** The password for the wallet admin account.
- **walletScheme:** The `ProfilePerWallet` scheme implies that each wallet operates with its own distinct profile or configuration. This means that each wallet can have its own settings, schemas, and data management rules. It provides isolation between different wallets, which can be useful for managing multiple wallets with different requirements or configurations
- **indyLedger:** Configuration for Indy ledger.
    
   To know more about indyLedgers - <a href = "https://wiki.hyperledger.org/display/indy">IndyLedgers</a> 
- **endpoint:** List of URLs for the agent's API endpoints.
- **inboundTransport:** Configuration for inbound transport methods.
- **transport:** Type of transport protocol.
- **port:** Port number used for inbound transport.
- **outboundTransport:** Types of transport methods used for outgoing communications.
- **adminPort:** Port number for administrative operations.
- **tenancy:** Set to `true` for a Shared agent and `false` for a Dedicated or on-premises agent.
- **webhookUrl:** Provide base wallet's tenantId for Shared agent and for individuals entity Id for Dedicated agent
- **schemaFileServerURL:** URL for accessing schema files.
- **didRegistryContractAddress:** To know more about <a href = "https://github.com/ayanworks/polygon-did-registrar"> DID registry contract address</a>
- **schemaManagerContractAddress:** To know more about <a href = "https://github.com/ayanworks/polygon-schema-manager">schema manager contract address</a>
- **rpcUrl:** URL for the Remote Procedure Call (RPC) service.
- **fileServerUrl:** You can create your own file server by refering <a href = "https://github.com/ayanworks/schema-file-server">schema file server</a>
- **fileServerToken:** Authentication token for accessing the file server

Build Agent controller using the following command: 
```bash 
yarn build
```

Use following command to run agent locally :
```bash 
./bin/afj-rest.js --config ./samples/cliConfig.json
```
- The command ./bin/afj-rest.js `--config` ./samples/cliConfig.json is used to run a script (afj-rest.js) located in the ./bin/ directory, with the configuration file (cliConfig.json) specified via the `--config` flag.
