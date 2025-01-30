---
icon: osi
---

# How to contribute

Thanks for your interest in CREDEBL docs and for wanting to contribute! There are many ways how you can contribute and have an impact:

* **Contribute Code:** Submit a pull request to any of our product repositories to share your contributions and improvements.
* Report an Issue: Found something not working? Let us know by creating an issue in the relevant repository to help us improve.
* **Support the Community:** Brighten someone’s day by helping them resolve their challenges in LFDT [discord help channel](https://discord.com/channels/905194001349627914/1331657363161219082) for CREDEBL

You are encouraged to contribute to the repository by forking and submitting a pull request.

(If you are new to GitHub, you might start with a [basic tutorial](https://help.github.com/articles/set-up-git) and check out a more detailed guide to [pull requests](https://help.github.com/articles/using-pull-requests/).)

Pull requests will be evaluated by the repository guardians on a schedule and if deemed beneficial will be committed to the main branch. Pull requests should have a descriptive name and include a summary of all changes made in the pull request description.

If you would like to propose a significant change, please open an issue first to discuss the proposed changes with the community and to avoid re-work.

Contributions are made pursuant to the Developer's Certificate of Origin, available at [https://developercertificate.org](https://developercertificate.org), and licensed under the Apache License, version 2.0 (Apache-2.0).

### Local setup guide

<details>

<summary>Platform </summary>

Please find the list of prerequisites software we will need for local setup [here](https://docs.credebl.id/docs/getting-started/local-deployment/platform#prerequisites).\
\
Clone the platform repository from GitHub:

```
git clone https://github.com/credebl/platform.git
cd platform
```

Create a .env file and set the required environment variables as per the `.env.sample` file.

Install the pnpm package using the following command if it isn’t already installed on your machine:

```
npm install -g pnpm
```

Install dependencies

```
pnpm i
```

Keep your database schema in sync with your Prisma schema as it evolves and Maintain existing data in your database.

```
cd libs/prisma-service/  npx prisma migrate deploy
```

Generate Prisma Client to access schema model with the following command:

```
npx prisma generate
```

For initial master table entry create a credebl-master-table.json file at **lib/prisma-service/prisma/data** and set the required variables as per the `credebl-master-table.json` file.run following command.

```
npx prisma db seed
```

To start the API gateway

```
pnpm run start
```

To start all microservices using below command followed by microservice name, example: start user service.

```
pnpm run start user
```

Access the Platform API by navigating to:

```
http://localhost:5000
```

### Using swagger to access platform API <a href="#using-swagger-to-access-platform-api" id="using-swagger-to-access-platform-api"></a>

If you’re running docker locally, access the CREDEBL platform swagger dashboard through the API gateway on port 5000.

```
http://localhost:5000/api
```



</details>

<details>

<summary>CREDO Controller </summary>

Clone the following repository:

```
git clone https://github.com/credebl/credo-controllercd credo-controller
```

Use following commands to install and upgrade Yarn:

<pre><code><strong>npm install -g yarn
</strong></code></pre>

To install the dependancies use following command:

```
yarn
```

Below is the cliConfig.json file, which needs to be used to set up the agent

```
{"label": "AFJ Rest Agent 1",  "walletId": "sample",  # Mention your walletId here  "walletKey": "sample",   # Mention your walletKey here  "walletType": "postgres",  # Mention wallet type here  "walletUrl": "localhost:5432",  # Mention your wallet url here  "walletAccount": "********",  # Mention your wallet account name here  "walletPassword": "********",   # Mention your wallet password here  "walletAdminAccount": "********",  "walletAdminPassword": "********",,  "walletScheme": "ProfilePerWallet",  "indyLedger": [    {      "genesisTransactions": "https://raw.githubusercontent.com/Indicio-tech/indicio-network/main/genesis_files/pool_transactions_testnet_genesis",      "indyNamespace": "indicio:testnet"    },    {      "genesisTransactions": "https://raw.githubusercontent.com/Indicio-tech/indicio-network/main/genesis_files/pool_transactions_demonet_genesis",      "indyNamespace": "indicio:demonet"    },    {      "genesisTransactions": "https://raw.githubusercontent.com/bcgov/von-network/main/BCovrin/genesis_test",      "indyNamespace": "bcovrin:testnet"    }  ],  "endpoint": ["localhost:4002"],  "autoAcceptConnections": true,  "autoAcceptCredentials": "always",  "autoAcceptProofs": "never",  "logLevel": 2,  "inboundTransport": [    {      "transport": "http",      "port": 4002    }  ],  "outboundTransport": ["http"],  "adminPort": 4001,  "tenancy": false,  "webhookUrl": "http://localhost:5000/wh/9fb768a6-2ad8-435d-95f0-ad1876d2eb74",  "schemaFileServerURL": "https://schema.credebl.id/schemas/",  "didRegistryContractAddress": "0xcB80F37eDD2bE3570c6C9D5B0888614E04E1e49E",  "schemaManagerContractAddress": "0x4742d43C2dFCa5a1d4238240Afa8547Daf87Ee7a",  "rpcUrl": "https://rpc-amoy.polygon.technology",  "fileServerUrl": "https://schema.credebl.id",  "fileServerToken":     #Use your token here}
```

_**Description of Fields in cliConfig.json**_

* **label:** A descriptive name for the agent configuration.
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
* **webhookUrl:** Provide base wallet’s tenantId for Shared agent and for individuals entity Id for Dedicated agent
* **schemaFileServerURL:** URL for accessing schema files.
* **didRegistryContractAddress:** To know more about [DID registry contract address](https://github.com/ayanworks/polygon-did-registrar)
* **schemaManagerContractAddress:** To know more about [schema manager contract address](https://github.com/ayanworks/polygon-schema-manager)
* **rpcUrl:** URL for the Remote Procedure Call (RPC) service.
* **fileServerUrl:** You can create your own file server by refering [schema file server](https://github.com/ayanworks/schema-file-server)
* **fileServerToken:** Authentication token for accessing the file server

Build Agent controller using the following command:

```
yarn build
```

Use following command to run agent locally :

```
./bin/afj-rest.js --config ./samples/cliConfig.json
```

* The command ./bin/afj-rest.js `--config` ./samples/cliConfig.json is used to run a script (afj-rest.js) located in the ./bin/ directory, with the configuration file (cliConfig.json) specified via the `--config` flag.

</details>

<details>

<summary>Studio UI</summary>

Clone the studio repository:

```
git clone https://github.com/credebl/studio.git  cd studio
```

Create a .env file and set the required environment variables as per the `.env.sample` file.

Install dependencies and start the Studio UI:

```
npm i npm run start
```

Access the Studio UI by navigating to:

```
http://localhost:3000
```

</details>

### Contributing checklist:

* It is difficult to manage a release with too many changes.
  * We should release more often, not months apart.
  * We should focus on feature releases (minor and patch releases) to speed iteration.
* Mixing breaking changes with other PRs slows development.
  * Consider separating your PR into a (usually larger) non-breaking PR and a (usually smaller) breaking change PR.
* Commits and PR titles MUST follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). This allows us to automatically determine the next release version and generate changelog files.
  * Use conventional commits to mark breaking changes. Adding ! after the scope of a prefix message (e.g. chore!: a breaking change) or adding a BREAKING CHANGE: note to commit messages marks a commit as breaking. See [examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)
* Signing off commit
  * We use developer certificate of origin (DCO) in all CREDEBL repositories, so to get your pull requests accepted, you must certify your commits by signing off on each commit.
  * $ git commit -s -m "your commit message"
  * To see if your commits have been signed off, run $ git log. Any commits including a line with Signed-off-by: Example Author \<author.email@example.com> are signed off.
  * If you need to re-sign the most current commit, use $ git commit --amend --no-edit -s.
  * The -s flag signs off the commit message with your name and email.

\
