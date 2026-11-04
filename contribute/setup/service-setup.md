---
description: Installation guide for CREDEBL Platform Services
icon: layer-group
---

# Service setup

Before installing the CREDEBL Platform services, it is essential to ensure that your environment meets certain prerequisites. Properly setting up these requirements will help facilitate a smooth installation process and optimal performance of the platform. This includes preparing your system with the necessary software dependencies, configuring the required network settings, and ensuring adequate hardware resources. Following these guidelines will help prevent potential issues and ensure that the CREDEBL Platform services are installed and operate as intended.

## System requirements

Here is the list of software needed to get started:

* [Node.js](https://nodejs.org/en) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (>= 18)
* [Git](https://git-scm.com/) (>= 2.34.1)
* [Docker](https://docs.docker.com/engine/install/) (>= 24.0.5)
* [Docker Compose](https://docs.docker.com/compose/install/) (>= 2.20.3)

{% hint style="success" %}
The above can directly be installed from their respective docs or [from common prerequisites](../../getting-started/local-deployment/#common-prerequisites)
{% endhint %}

***

## Prerequisites

Here is the list of prerequisites software we will need for CREDEBL:

* [Clone Repository](service-setup.md#clone-repository)
* [Environment Variables](service-setup.md#environment-variables)
* [PostgreSQL](service-setup.md#postgresql) (>= 14)
* [NATS](service-setup.md#nats) (>= 2.6.4)
* [REDIS](service-setup.md#redis) (>= 7.4)
* [Keycloak](service-setup.md#top) (>= 25.0.6)
* [Sendgrid](service-setup.md#sendgrid)
* [AWS S3](service-setup.md#aws-s3)
* [Schema file server](service-setup.md#schema-file-server-optional) (optional)
* [Agent Setup](service-setup.md#agent-setup)

### Clone Repository

Clone the platform repository from GitHub:

```sh
git clone https://github.com/credebl/platform.git
cd platform
```

### Environment Variables

To help you quick start, a `.env.demo` is already present at the root of the platform repository. To getting started, rename `.env.demo` to `.env`\
\
Please find `your-ip` in the `.env` file, and replace **all occurrences** it with your machine's Ip address.

{% hint style="info" %}
If you want to know more about the environment variables, please refer to `.env.sample` file which is given at root of the repository.
{% endhint %}

Apart from the already present variables, you need to add few variables generated from the below prerequisites like the [PostgreSQL](service-setup.md#postgresql), [Keycloak](service-setup.md#top), [Sendgrid](service-setup.md#sendgrid), [AWS S3](service-setup.md#aws-s3), etc at the respective steps.

### PostgreSQL

{% hint style="success" %}
In case you already have PostgreSQL preinstalled on your machine, you can simply skip the database setup and add the appropriate .env variable after creating user `postgres` and database `credebl` if not already created.
{% endhint %}

PostgreSQL is a powerful, open-source object-relational database system known for its robustness and advanced features. This guide provides instructions for installing and configuring PostgreSQL both natively and using Docker. Installing PostgreSQL

**Initially we'll need to install postures on the host or on docker**

{% tabs %}
{% tab title="Ubuntu" %}
{% code overflow="wrap" fullWidth="false" %}
```shell
sudo apt install postgresql

# To verify the status of the PostgreSQL service, use:

sudo systemctl status postgresql
```
{% endcode %}
{% endtab %}

{% tab title="Docker" %}
```sh
# Pull the PostgreSQL Docker image:
docker pull postgres

# Create a Docker volume to persist PostgreSQL data:
docker volume create CREDEBL
```
{% endtab %}
{% endtabs %}

Access the PostgreSQL and create user and database

{% tabs %}
{% tab title="Ubuntu" %}
```sh
# Access the PostgreSQL command line interface:
sudo -u postgres psql

# Create a new user and set password:
CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';

# Create db:
CREATE DATABASE credebl;

# Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE credebl TO postgres;
```
{% endtab %}

{% tab title="Docker" %}
```sh
# Run the PostgreSQL Docker container:
docker run --name CREDEBL -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 -v CREDEBL:/var/lib/postgresql/data postgres

# Enter the container
docker exec -it CREDEBL psql -U postgres

# Create a db
CREATE DATABASE credebl;

# Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE credebl TO postgres;

# List all databases to confirm
\l

# Exit the PostgreSQL prompt:
\q
```
{% endtab %}
{% endtabs %}

<details>

<summary>Optional: In case you customize the database details, you need to update this</summary>

Add the appropriate postgres environment variable to the `.env` file

{% code title=".env" overflow="wrap" %}
```sh
WALLET_STORAGE_HOST=your-ip
WALLET_STORAGE_PORT=5432 # postgres port
WALLET_STORAGE_USER='postgres' # postgres user
WALLET_STORAGE_PASSWORD='postgres' # postgres password 

# The format for below is as follows: postgresql://{postgres.user}:{postgres.password}@{your-ip}:{postgres.port}/{database-name}
POOL_DATABASE_URL="postgresql://postgres:postgres@your-ip:5432/credebl"
DATABASE_URL="postgresql://postgres:postgres@your-ip:5432/credebl"
```
{% endcode %}

{% hint style="info" %}
You can read more about prisma connection URLs in PostgreSQL here: [https://www.prisma.io/docs/orm/overview/databases/postgresql](https://www.prisma.io/docs/orm/overview/databases/postgresql)
{% endhint %}

</details>

### NATS

The CREDEBL platform utilizes NATS for message-driven data exchange between its micro-services.

{% hint style="warning" %}
For default setup, you can skip NATS and REDIS configurations and [Continue here](service-setup.md#top)
{% endhint %}

<details>

<summary>NATS configurations</summary>

1. **NATS Configuration File** (nats-server.conf)\
   The configuration file defines how the NATS server operates, including port assignments and WebSocket support.

{% code title="nats-server.conf" %}
```editorconfig
port: 4222
max_payload: 4194304  # 4 MB in bytes
websocket {
  port: 443
  no_tls: true
}
```
{% endcode %}

* **port:** The main port for NATS communication is set to 4222.
* **max\_payload:** Sets the maximum message payload size to 4 MB.
* **websocket:** Enables WebSocket support on port 443 without TLS (for unsecured communication).

2. **docker-compose.yml File**

* The docker-compose.yml file will define the NATS service, map the necessary ports, and bind the configuration file.

{% code title="docker-compose.yml" %}
```yaml
version: '3'
services:
  nats:
    container_name: nats
    image: nats
    command: ["-c", "/nats-server.conf"]
    ports:
      - '4222:4222'
      - '6222:6222'
      - '8222:8222'
    volumes:
      - ./nats-server.conf:/nats-server.conf:ro
```
{% endcode %}

{% hint style="warning" %}
Currently the [_.env.demo_](service-setup.md#environment-variables) already contains NATS keys and the local setup skips authorization for NATS messaging between services. Refer [here](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/nkey_auth) to know more about NATS authorization
{% endhint %}

{% hint style="info" %}
To create your Nkeys, you can refer NATS tool nk as per their [official documentation](https://docs.nats.io/using-nats/nats-tools/nk)
{% endhint %}

* **container\_name:** Sets the name of the container to nats.
* **image:** Uses the official NATS Docker image.
* **command:** Passes the NATS configuration file to the container at startup.
* **ports:** Exposes three key ports:
  * `4222`: Main NATS client communication port.
  * `6222`: Routing port for NATS clusters.
  * `8222`: HTTP monitoring port for server statistics and health checks.
* **volumes:** Mounts the nats-server.conf configuration file into the container as read-only (ro).

3. **Start the NATS Server**

To start the NATS server, run the following command from the directory containing the docker-compose.yml file:

```sh
docker compose -f docker-compose.nats.yml up -d
```

</details>

### REDIS

The CREDEBL platform leverages Redis as an in-memory data store, primarily for caching and queuing.

{% hint style="warning" %}
You can skip REDIS setup if you are installing Platform services using docker. [Continue here](service-setup.md#top)
{% endhint %}

<details>

<summary>REDIS configurations</summary>

To set up Redis for the CREDEBL platform, follow the steps below to create and launch a Redis instance using Docker.

1. **Create the docker-compose.yml File**\
   The docker-compose.yml file is used to define and configure the Redis container for the platform.

{% code title="docker-compose.redis.yml" %}
```yaml
version: '3'
services:
  redis:
    image: redis:6.2-alpine
    restart: always
    ports:
      - '6379:6379'
    command: redis-server --save 20 1 --loglevel warning
    volumes:
      - cache:/data

volumes:
  cache:
```
{% endcode %}

2. **Start REDIS Server**\
   Once the `docker-compose.redis.yml` file is in place, start the Redis service by running the following command:

```sh
docker compose -f docker-compose.redis.yml up -d
```

</details>

### Keycloak <a href="#keycloak" id="keycloak"></a>

#### Run Keycloak using Docker

```
docker run -d -p 8080:8080 \
-e KEYCLOAK_ADMIN=admin \
-e KEYCLOAK_ADMIN_PASSWORD=admin \
quay.io/keycloak/keycloak:25.0.6 start-dev
```

This command installs and starts Keycloak locally and makes it accessible at:

```
http://localhost:8080
```

***

#### Initial Keycloak Configuration

1. Open the Keycloak Administration Console.
2. Login using:
   * Username: `admin`
   * Password: `admin`
3. Click on the Keycloak dropdown at the top-left corner.
4. Create a new realm named:

```
credebl-platform
```

***

#### Create `adminClient`

1. Go to **Clients** under **Manage** from the left sidebar.
2. Click on **Create Client**.
3. Set:

```
Client ID = adminClient
```

4. Click **Next**.
5. Enable the following:
   * Client Authentication = ON
   * Service Accounts Roles = ON
   * Direct Access Grants = ON
6. Click **Next**.
7. Configure the following values:

* Valid Front end redirect URIs

```
http://your-url/*
```

Example: `http://localhost:3000/*`

* Root URL

```
http://your-url/
```

Example: `http://localhost:8080/`

* Web Origins

```
http://your-url/
```

Example: `http://localhost:8080/`

8. Save the client details.

#### **Configure Service Account Roles for `adminClient`**

1. Open the `adminClient`.
2. Go to the **Service Account Roles** section.
3. Click on **Assign Role**.
4. Select **Filter by Clients** from the dropdown.
5. Assign the following roles:

```
create-client
manage-clients
manage-users
query-clients
query-users
view-clients
view-users
```

***

#### Realm Roles Settings

1. Under the `credebl-platform` realm, select:

```
Realm Roles
```

2. Click on **Create Role**.
3. Create a role with:

```
Role Name = holder
```

{% hint style="info" %}
When a new user registers on the platform we are assigning them a **“holder”** role from the realm.
{% endhint %}

#### **SSO Session Settings:**

Set SSO Session Idle to 2 days. This is the expiration time of the refresh token if the user is idle on the platform. We can configure this as per our need.\
To navigate to SSO Session, go to `Realm settings` option on left sidebar under `configure,` now under the `Sessions` tab you can see `SSO Session Idle.`\\

#### **Update the `.env`**

Update the .env file for the Keycloak details:

To set the env variable KEYCLOAK\_MANAGEMENT\_CLIENT\_SECRET

1. Go to the `credebl-platform` realm.
2. Navigate to:

* **Clients** → `adminClient`
* Open the **Credentials** tab
* Copy the client secret for `ADMIN_KEYCLOAK_SECRET`

```dotenv
KEYCLOAK_DOMAIN=http://localhost:8080/
KEYCLOAK_ADMIN_URL=http://localhost:8080
KEYCLOAK_MASTER_REALM=master
KEYCLOAK_MANAGEMENT_CLIENT_ID=adminClient
KEYCLOAK_MANAGEMENT_CLIENT_SECRET=
KEYCLOAK_REALM=credebl-platform
```

***

#### **Additional Keycloak Configuration for v2.2.0**

If you are upgrading to `v2.2.0` or later, apply the following additional changes.

#### Create `credeblClient`

1. Go to **Clients** under **Manage**.
2. Click on **Create Client**.
3. Set:

```
Client ID = credeblClient
```

4. Click **Next**.
5. Enable the following:
   * Client Authentication = ON
   * Service Accounts Roles = ON
   * Direct Access Grants = ON
6. Click **Next**.
7. Configure the same Redirect URIs, Root URL, and Web Origins used for `adminClient`.
8. Save the client details.

#### Configure Service Account Roles for `credeblClient`

1. Open the `credeblClient`.
2. Go to the **Service Account Roles** section.
3. Click on **Assign Role**.
4. Select **Filter by Clients** from the dropdown.
5. Assign the same roles configured for `adminClient`:

```
create-client
manage-clients
manage-users
query-clients
query-users
view-clients
view-users
manage-realm
```

***

#### Enable Unmanaged Attributes

1. Go to:

```
Realm Settings
```

2. Locate:

```
Unmanaged Attributes
```

3. If it is disabled, enable it.

***

#### Realm Roles Settings

1. Under the `credebl-platform` realm, select:

```
Realm Roles
```

2. Click on **Create Role**.
3. Create a role with:

```
Role Name = holder
```

#### **Update the `.env`**

Update the `.env` file with the following Keycloak configuration details:

{% code title=".env" %}
```sh
KEYCLOAK_DOMAIN=http://localhost:8080/
KEYCLOAK_ADMIN_URL=http://localhost:8080
KEYCLOAK_MASTER_REALM=master
KEYCLOAK_REALM=credebl-platform

KEYCLOAK_MANAGEMENT_CLIENT_ID=credeblClient
KEYCLOAK_MANAGEMENT_CLIENT_SECRET=<CLIENT_SECRET>

ADMIN_KEYCLOAK_ID=adminClient
ADMIN_KEYCLOAK_SECRET=<CLIENT_SECRET>
```
{% endcode %}

To set the environment variables `KEYCLOAK_MANAGEMENT_CLIENT_SECRET` and `ADMIN_KEYCLOAK_SECRET`:

1. Go to the `credebl-platform` realm.
2. Navigate to:
   * **Clients** → `credeblClient`
   * Open the **Credentials** tab
   * Copy the client secret for `KEYCLOAK_MANAGEMENT_CLIENT_SECRET`
3. Navigate to:
   * **Clients** → `adminClient`
   * Open the **Credentials** tab
   * Copy the client secret for `ADMIN_KEYCLOAK_SECRET`

{% hint style="warning" %}
Below is an optional step to add users and can be skipped
{% endhint %}

{% hint style="info" %}
Note : If you are an old user of Credebl platform from before v2.2.0 then make sure to add **PLATFORM\_ADMIN\_OLD\_CLIENT\_ID=adminClient** to you env this will update the clientId in the user table with the newly created clientId credeblClien&#x74;**.** Also rename the old adminClient as credeblClient in keycloak and create the adminClient as ne&#x77;**.**
{% endhint %}

<details>

<summary><strong>Optional: Add users manually</strong></summary>

This section provides guidance on adding users manually to the Keycloak realm.

1. Go to **users**.
2. Add **username**: [_**your.email@your.domain**_](mailto:your.email@your.domain) and **email**: [_**your.email@your.domain**_](mailto:your.email@your.domain).
3. Enable user and email, then click on **save**.
4. Change the password in the credential section for user login.
5. Update the Keycloak userId in the users table in the local database.
6. Also update the _**client secret key**_ in the .env file, which you will get in the credential section of **adminClient** in the **client** section.
7. Test the flow by logging in to platform admin.

</details>

### **SendGrid**

Create a [SendGrid account](https://sendgrid.com/), generate an API key, and grant necessary permissions for sending emails.

{% hint style="info" %}
Make a note of the API-key as well as the email used, as this will be [later](service-setup.md#environment-variables)used in our `.env` and during [Installation](service-setup.md#installations)
{% endhint %}

* Add the send grid key in the `.env`

{% code title=".env" %}
```sh
SENDGRID_API_KEY=your-API-key
```
{% endcode %}

### AWS S3

To utilize all functionalities of CREDEBL, total of 3 S3 buckets are required for;

1. Storing Organization logo during creating and updating an organization
2. Bulk issuance of credentials
3. Storing connection URL generated from [Agent](../../introduction/concepts.md#agent) and creating shortened URL

{% hint style="info" %}
From the above mentioned, 1 and 2 can be skipped, if the respective functionality of adding organization logo and Bulk issuance is unused
{% endhint %}

<pre data-title=".env"><code># 1. Used for Adding org-logo during org creation and update 
# Optional (Can be skipped if no image is added during org creation and updation)
AWS_PUBLIC_ACCESS_KEY=
AWS_PUBLIC_SECRET_KEY=
AWS_PUBLIC_REGION=
ORG_LOGO_BUCKET_NAME=

<strong># 2. Used for Bulk issuance of credential
</strong># Optional (Can be skipped if Bulk issuance is not used)
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=
FILE_SHARING_BUCKET=

# 3. Used for storing connection URL generated from Agent and creating shortened URL
# Required (As connecting to org requires Shortened url)
AWS_S3_STOREOBJECT_ACCESS_KEY=
AWS_S3_STOREOBJECT_SECRET_KEY=
AWS_S3_STOREOBJECT_REGION= 
STOREOBJECT_BUCKET=
</code></pre>

Use `STOREOBJECT_BUCKET` to build the shortened URL domain. Follow the [AWS S3 path style](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access) for your bucket.

{% code title=".env" overflow="wrap" %}
```sh
# Please refere AWS to determine your bucket url
# https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access 
SHORTENED_URL_DOMAIN='https://s3.AWS_S3_STOREOBJECT_REGION.amazonaws.com/STOREOBJECT_BUCKET'
```
{% endcode %}

{% hint style="info" %}
Note: Usually, `SHORTENED_URL_DOMAIN` for bucket names with dot ( . ) in it comes after '/': `https://s3.AWS_S3_STOREOBJECT_REGION.amazonaws.com/bucket-name`. While others without a dot(.) are often referred as a subdomain: `https://`**`bucket-name`**`.AWS_S3_STOREOBJECT_REGION.amazonaws.com`
{% endhint %}

### RustFs and Local Setup Guide

This explains how to configure where your platform stores files (images, CSVs, etc.).

### Choose a storage type

Set `FILE_STORAGE_TYPE` in your `.env` file:

```env
FILE_STORAGE_TYPE=aws
```

| Value    | What it does                    | What you need                   |
| -------- | ------------------------------- | ------------------------------- |
| `aws`    | Stores files on Amazon S3       | AWS account and credentials     |
| `rustfs` | Stores files on a RustFS server | RustFS endpoint and credentials |

***

{% hint style="info" %}
By default the storage configuration uses _aws_ as its default if `FILE_STORAGE_TYPE` isn't provided
{% endhint %}

### Option 1: AWS S3 (`FILE_STORAGE_TYPE=aws`)

Fill in these variables:

```env
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=
AWS_PUBLIC_ACCESS_KEY=
AWS_PUBLIC_SECRET_KEY=
AWS_PUBLIC_REGION=
AWS_S3_STOREOBJECT_ACCESS_KEY=
AWS_S3_STOREOBJECT_SECRET_KEY=
AWS_S3_STOREOBJECT_REGION=
FILE_SHARING_BUCKET=
ORG_LOGO_BUCKET_NAME=
STOREOBJECT_BUCKET=
```

### Option 2: RustFS (`FILE_STORAGE_TYPE=rustfs`)

```env
RUSTFS_ENDPOINT=http://localhost:9000
RUSTFS_ACCESS_KEY_ID=
RUSTFS_SECRET_ACCESS_KEY=
RUSTFS_REGION=
FILE_SHARING_BUCKET=
ORG_LOGO_BUCKET_NAME=
STOREOBJECT_BUCKET=
```

Make sure the buckets already exist on your server.

***

### Verify it works

1. Start the platform
2. Upload a file through the UI using the org logo update feature on dashboard for a quick check to see if its working.
3. Perform a bulk issuance to check if it stores the shortened url and uploaded csv to the storage.
4. Check that the file appears in the configured S3 or RustFS bucket. Currently there are only 3 features that utilize the file storage in platform \[Organization logo storage , URL shortening for issuance , Csv upload for bulk issuance]

***

## OpenBao Secrets Management Guide

[OpenBao](https://openbao.org/) (a FOSS fork of HashiCorp Vault) for secrets management. All secrets are fetched at runtime and optionally cached with a 10-minute TTL.

***

### Enabling OpenBao

Set the following environment variables:

```env
ENABLE_BAO=true
SECRETS_PROVIDER=openbao
BAO_URL=http://localhost:8200
BAO_SECRET_PATH=secret/data/my-nestjs-app
BAO_ROLE_ID=<your-approle-role-id>
BAO_SECRET_ID=<your-approle-secret-id>
```

OpenBao is **disabled by default**. When `ENABLE_BAO` is not `"true"`, all secret lookups return an empty object and the application falls back to `process.env` entirely.

***

### Secret Paths

All paths are defined in `libs/common/src/common.constant.ts`:

| Constant                        | Path                                   | Used By                    |
| ------------------------------- | -------------------------------------- | -------------------------- |
| `CREDEBL_RESEND_API_KEY_PATH`   | `secret/data/credebl_resend_api_key`   | `resend-helper-file.ts`    |
| `CREDEBL_SMTP_CONFIG_PATH`      | `secret/data/credebl_smtp_config`      | `smtp-helper-file.ts`      |
| `CREDEBL_SENDGRID_API_KEY_PATH` | `secret/data/credebl_sendgrid_api_key` | `send-grid-helper-file.ts` |
| `CREDEBL_AWS_KEY_PATH`          | `secret/data/credebl_aws_keys`         | `s3-storage.provider.ts`   |

Each path returns a flat key-value map. For example, `secret/data/credebl_smtp_config` should contain:

```json
{
  "SMTP_HOST": "smtp.example.com",
  "SMTP_PORT": "587",
  "SMTP_USER": "user@example.com",
  "SMTP_PASS": "your-password"
}
```

***

### OpenBao UI Configuration Guide (Generic KV-v2 Setup)

This guide covers how to set up a KV (Key-Value) Version 2 secrets engine, add arbitrary secret paths, and configure policies using the OpenBao Web Interface.

### Step 1: Enable the KV-v2 Secrets Engine

1. Log in to your OpenBao Web Interface (typically `http://localhost:8200`).
2. In the left navigation menu, click Secrets Engines.
3. Click Enable new engine + in the top-right corner.
4. Under the Generic section, select KV.
5. Click Next.
6. Configure the engine settings:
   * Path: Set your desired mount path (e.g., `secret`).
   * Expand Method Options.
   * Version: Select Version 2.
7. Click Enable Engine.

> Note on Paths: Mounting a KV-v2 engine at `secret` automatically prefixes underlying API paths with `/data/`. A path entered as `my-app-config` in the UI is accessed via HTTP at `secret/data/my-app-config`.

### Step 2: Create Secret Paths

To store key-value pairs under your secrets engine:

1. Click on your mounted secrets engine (e.g., `secret/`).
2. Click Create secret + in the top-right corner.
3. Complete the form:
   * Path for this secret: Enter your identifier (e.g., `app-config` or `service-credentials`).
   * Secret data: Enter your key-value pairs (e.g., `KEY_NAME` = `value`).
   * Click Add row to add additional pairs to the same path.
4. Click Save.

### Step 3: Configure Access Policies

To allow applications or roles to read the secrets:

1. Go to Policies in the left sidebar menu.
2. Click Create ACL policy +.
3. Enter a Name for your policy (e.g., `read-app-secrets`).
4. Enter the HCL policy definition granting read capabilities:

Terraform

```
# Allow read capabilities on all paths under the secret engine
path "secret/data/*" {
  capabilities = ["read"]
}
```

5. Click Create policy.
6. Attach this policy to your preferred auth method (AppRole, Kubernetes, OIDC, etc.) under Access -> Auth Methods.

***

### Schema File Server

#### Clone Repository

Clone the platform repository from GitHub:

```sh
git clone https://github.com/ayanworks/schema-file-server.git
cd schema-file-server
```

#### Environment Variables

To help you quick start, a `.env.demo` is already present at the root of the platform repository. To getting started, rename `.env.demo` to `.env`\
\
Please find `JWT_TOKEN_SECRET` in the `.env` file and replace its value with a base64-encoded JWT token.

{% hint style="info" %}
Note: You can create JWT Token using the following command:\
**node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"**
{% endhint %}

#### Service Setup

1.  **Build the Docker Image**

    ```bash
    docker build -t schema-file-server .
    ```
2.  **Run the Docker Container**

    ```bash
    docker run -d --env-file .env -p 4000:4000 -v "$PWD/app/schemas:/app/schemas" --name schema-file-server schema-file-server
    ```

    * `-d`: Run container in detached mode
    * `--env-file .env`: Load environment variables from the `.env` file
    * `-p 4000:4000`: Map host port 4000 to container port 4000
    * `-v "$PWD/app/schemas:/app/schemas"`: Mount the local `app/schemas` directory into the container
    * `--name schema-file-server`: Assign a name to the container
    * `schema-file-server`: The name of the Docker image

#### Update .env and agent.env

* Update the schema file server token and URL in both the .env and agent.env files.

{% code title=".env" %}
```
SCHEMA_FILE_SERVER_URL='http://localhost:4000/schemas/'
SCHEMA_FILE_SERVER_TOKEN=
```
{% endcode %}

{% code title="agent.env" %}
```
SERVER_URL='http://localhost:4000'
FILE_SERVER_TOKEN=
```
{% endcode %}

### Agent Setup

The Docker image built during this process is used to launch agents for new organizations on the CREDEBL platform.The Docker image name is set as an environment variable during the platform setup in a later step.

The default image for agent is `ghcr.io/credebl/credo-controller:latest` refering to latest release of the credo-controller. Refer here: [https://github.com/credebl/credo-controller/pkgs/container/credo-controller](https://github.com/credebl/credo-controller/pkgs/container/credo-controller)

<details>

<summary>Optional: In case you want to build your own image for the agent</summary>

{% hint style="danger" %}
Note: Currently to have agent setup(image built), we need node version to be - `18.19.0`\
However, we are actively seeking contributions to update it to the Latest Stable Version, you can check the open issue [here](https://github.com/credebl/credo-controller/issues/267)
{% endhint %}

* Clone the following repository:

```sh
git clone https://github.com/credebl/credo-controller
cd credo-controller
```

* Use following commands to install and upgrade Yarn:

```sh
npm install -g yarn
```

* To install the dependencies use following command:

```sh
yarn
```

* Build Agent controller using the following command:

```sh
yarn build
```

* Create Docker Image using following command :

```sh
docker build . -t credo-controller-0.5.3:latest
```

{% hint style="info" %}
Mention credo controller version or any tag name. Note the same version will also be needed in the `.env` against the variable `AFJ_VERSION`
{% endhint %}

* Add the Docker Image tag in the `.env`

{% code title=".env" %}
```sh
AFJ_VERSION=credo-controller-0.5.3:latest
```
{% endcode %}

</details>

### SSO (Single Sign-On) (Applicable for V 2.1.0 onwards)

* If applications consuming CREDEBL want to use SSO feature, additional environment variables need to be set on the backend side as well.Please refer to the `env.demo` file for the required values when running the Platform.
* As part of session management, for users who want to use the client ID / client secret based token generation feature, we have updated the response to include cookies.\
  Using these cookies, users can fetch their session details.
  * To fetch the session details, call the following API while passing the stored cookies in the request headers`:`
    * `/auth/sessionDetails`
* For more details visit this - [https://docs.credebl.id/docs/\~/revisions/IXcpHdsfgTsukxV376wG/references/releases/v.2.1.0](https://docs.credebl.id/docs/~/revisions/IXcpHdsfgTsukxV376wG/references/releases/v.2.1.0#sso-single-sign-on)

## Installations

Make sure the `.env` file is set with all the required environment variables as per the sample file and the [env guide](service-setup.md#environment-variables) give above.

Before you start the services make sure to update the `credebl-master-table.json` present at location, `libs/prisma-service/prisma/data` [sendgrid](service-setup.md#sendgrid) details as well as your `ip-address`

<pre class="language-json" data-title="credebl-master-table.json" data-line-numbers><code class="lang-json">{
  "platformConfigData": {
    "externalIp": "192.168.x.x",
    "inboundEndpoint": "192.168.x.x",
    "username": "credebl",
    "sgApiKey": "API-key-received <a data-footnote-ref href="#user-content-fn-1">here</a>",
    "emailFrom": "Mail used in sendgrid",
    "apiEndpoint": "http://192.168.x.x:5000",
    "tailsFileServer": "http://192.168.x.x:5000"
  },
</code></pre>

At the root of the [platfrom repo](service-setup.md#clone-repository):

```sh
cd libs/prisma-service
npx prisma generate
npx prisma migrate deploy
```

Now seed the db, before starting the services using the following:

```sh
npx prisma db seed
```

Since, you are in the '/prisma-service', move back to the root

<pre class="language-sh"><code class="lang-sh"><strong>cd ../..
</strong></code></pre>

Start the services:

{% tabs %}
{% tab title="Docker setup" %}
```
docker compose -f docker-compose-dev.yml up -d
```

<details>

<summary>To start container from pre-built docker images</summary>

In case we want to start services using the latest images from CREDEBL you can start services using the following command:

```
docker compose up -d
```

</details>
{% endtab %}

{% tab title="pnpm setup" %}
Install the pnpm package using the following command if it isn’t already installed on your machine:

```
npm install -g pnpm
```

Install dependencies

```
pnpm i
```

To start the API gateway

```
pnpm run start
```

To start all microservices using below command followed by microservice name, example: start user service.

```
pnpm run start user
```

<details>

<summary>Services are as follows</summary>

utility\
connection\
ledger\
organization\
agent-provisioning (Only required once when provisioning base-wallet)\
agent-service\
issuance\
verification\
(Below are optional services)\
webhook\
geolocation\
notification\
cloud-wallet

</details>
{% endtab %}
{% endtabs %}

Access the Platform API by navigating to [http://localhost:5000](http://localhost:5000)

[^1]: While setting up sendgrid
