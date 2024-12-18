---
icon: layer-group
description: Installation guide for CREDEBL Platform Services
---

# Platform

Before installing the CREDEBL Platform services, it is essential to ensure that your environment meets certain prerequisites. Properly setting up these requirements will help facilitate a smooth installation process and optimal performance of the platform. This includes preparing your system with the necessary software dependencies, configuring the required network settings, and ensuring adequate hardware resources. Following these guidelines will help prevent potential issues and ensure that the CREDEBL Platform services are installed and operate as intended.&#x20;

## System requirements

Here is the list of software needed to get started:&#x20;

* [Node.js](https://nodejs.org/en) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (>= 18)
* [Git](https://git-scm.com/) (>= 2.34.1)
* [Docker](https://docs.docker.com/engine/install/) (>= 24.0.5)
* [Docker Compose](https://docs.docker.com/compose/install/) (>= 2.20.3)

{% hint style="success" %}
The above can directly be installed from their respective docs or [from common prerequisites](./#common-prerequisites)
{% endhint %}

***

## Prerequisites

Here is the list of prerequisites software we will need for CREDEBL:

* [Clone Repo](platform.md#clone-repository)
* [PostgreSQL](platform.md#postgresql) (>= 14)
* [NATS](platform.md#nats) (>= 2.6.4)
* [REDIS](platform.md#redis) (>= 7.4)
* [Keycloak](platform.md#top) (>= 25.0.6)
* [Sendgrid](platform.md#sendgrid)
* [AWS S3](platform.md#aws-s3)
* [Schema file server](platform.md#schema-file-server-optional) (optional)
* [Agent Setup](platform.md#agent-setup)
* [Environment Variables](platform.md#environment-variables)

### Clone Repository

Clone the platform repository from GitHub:

```sh
git clone https://github.com/credebl/platform.git
cd platform
```

### Postgresql

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

# List all databases to confirm
\l

# Exit the PostgreSQL prompt:
\q
```
{% endtab %}
{% endtabs %}

Now, add the postgres environment variable to the `.env` file

{% code title=".env" overflow="wrap" %}
```sh
WALLET_STORAGE_HOST=your-ip
WALLET_STORAGE_PORT=5432
WALLET_STORAGE_USER='postgres'
WALLET_STORAGE_PASSWORD='postgres'

# The format for below is as follows: postgresql://{postgres.user}:{postgres.password}@{your-ip}:{postgres.port}/{database-name}
POOL_DATABASE_URL="postgresql://postgres:postgres@your-ip:5432/credebl"
DATABASE_URL="postgresql://postgres:postgres@your-ip:5432/credebl"
```
{% endcode %}

### NATS

The CREDEBL platform utilizes NATS for message-driven data exchange between its microservices.&#x20;

1. **Create the NATS Configuration File** (nats-server.conf)\
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

{% hint style="warning" %}
You can skip further NATS  and REDIS setup if you are installing services using docker and [Continue here](platform.md#top)
{% endhint %}

2. **Create the docker-compose.yml File**

The docker-compose.yml file will define the NATS service, map the necessary ports, and bind the configuration file.

{% hint style="warning" %}
Currently the [_.env.demo_](platform.md#environment-variables) already contains NATS keys and the local setup skips authorization for NATS messaging between services. Refer [here](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/nkey_auth) to know more about NATS authorization
{% endhint %}

{% hint style="info" %}
To create your Nkeys, you can refer NATS tool nk as per their [official documentation](https://docs.nats.io/using-nats/nats-tools/nk)
{% endhint %}

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
docker-compose up -d
```

### REDIS

{% hint style="warning" %}
You can skip REDIS setup if you are installing Platform services using docker. [Continue here](platform.md#top)
{% endhint %}

The CREDEBL platform leverages Redis as an in-memory data store, primarily for caching and queuing.

To set up Redis for the CREDEBL platform, follow the steps below to create and launch a Redis instance using Docker.

1. **Create the docker-compose.yml File**\
   The docker-compose.yml file is used to define and configure the Redis container for the platform.

{% code title="docker-compose.yml" %}
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
   Once the `docker-compose.yml` file is in place, start the Redis service by running the following command:

```sh
docker-compose up -d
```

### Keycloak <a href="#top" id="top"></a>

Keycloak is an open source identity and access management solution

1. **Run Keycloak using docker:**

{% code overflow="wrap" %}
```sh
docker run -d -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:25.0.6 start-dev
```
{% endcode %}

This command installs and starts Keycloak at the specified endpoints, locally accessible at [http://localhost:8080](http://localhost:8080).

2.  **Once logged in**:

    This section guides you through the initial setup and configuration of Keycloak through its administration console.

    1. Go to **administration console**
    2. Login using username: admin, password: admin.
    3. Click on the Keycloak dropdown on the top left and add a new realm as “credebl-platform” by clicking on 'Create realm'.
    4. Go to 'Clients' under 'Manage' in the sidebar on the left and create new client as a clientId = “adminClient”.
    5. Click on **Next** Button
    6. Set client authentication to **ON** mode.
    7. Set Service Accounts Roles to **ON** mode.
    8. Set Direct Access Grants to **ON** mode.
    9. Click on **Next** Button
    10. Add [http://your-url/](http://your-url/)\* (Eg.: [http://localhost:3000/](http://localhost:3000/)\*) in _**Valid Redirect URIs**_ as front-end url.
    11. Add [http://your-url/](http://your-url/) (Eg.: [http://localhost:8080/](http://localhost:8080/)) in _**Root URL**_.
    12. Add [http://your-url/](http://your-url/) (Eg.: [http://localhost:8080/](http://localhost:8080/)) in _**Web Origins**_.
    13. Save the details
3.  **Service Account Roles Settings**:

    This section outlines the configuration of service account roles to manage permissions and access control within Keycloak.

    1. Go to **adminClient** by selecting from the clients side tab.
    2. Go to the **Service account role** section.
    3. Click on the **Assign role** button.
    4. Select **Filter by clients** from the dropdown menu.
    5. Select the below roles from the Available Roles and click on the **Assign** button:
       * Create-client
       * Manage-client
       * Manage-users
       * Query-clients
       * Query-users
       * View-clients
       * View-users
4.  **Realm Roles Settings:**

    This section covers the configuration of realm role settings within Keycloak.

    1. Under the **credebl-platform** realm, from the menu select **realm-roles**.
    2. In **realm-roles**, click on **Create Role** and create a role with **Role name**=**“holder”**, as when a new user registers on the platform we are assigning him a **“holder”** role from the realm.
5.  **SSO Session Settings:**

    Set SSO Session Idle to 2 days. This is the expiration time of the refresh token if the user is idle on the platform. We can configure this as per our need.\
    To navigate to SSO Session, go to  `Realm settings` option on left sidebar under `configure,`  now under the `Sessions` tab you can see `SSO Session Idle`
6.  **Update the `.env`**

    This section covers the setup of environment variables for seamless integration with your application

    Update the .env file for the Keycloak details:

{% code title=".env" %}
```sh
KEYCLOAK_DOMAIN=http://localhost:8080/
KEYCLOAK_ADMIN_URL=http://localhost:8080
KEYCLOAK_MASTER_REALM=master
KEYCLOAK_MANAGEMENT_CLIENT_ID=adminClient
KEYCLOAK_MANAGEMENT_CLIENT_SECRET=
KEYCLOAK_REALM=credebl-platform
```
{% endcode %}

{% hint style="info" %}
To set the env variable KEYCLOAK\_MANAGEMENT\_CLIENT\_SECRET, in credebl-platform realm, go to clients >> adminClient. Now in the Credentials tab, copy the client secret
{% endhint %}

{% hint style="warning" %}
Below is an optional step to add users and can be skipped
{% endhint %}

7.  **Add users manually (Optional):**

    This section provides guidance on adding users manually to the Keycloak realm.

    1. Go to **users**.
    2. Add **username**: [_**your.email@your.domain**_](mailto:your.email@your.domain) and **email**: [_**your.email@your.domain**_](mailto:your.email@your.domain).
    3. Enable user and email, then click on **save**.
    4. Change the password in the credential section for user login.
    5. Update the Keycloak userId in the users table in the local database.
    6. Also update the _**client secret key**_ in the .env file, which you will get in the credential section of **adminClient** in the **client** section.
    7. Test the flow by logging in to platform admin.

### **SendGrid**

Create a [SendGrid account](https://sendgrid.com/), generate an API key, and grant necessary permissions for sending emails.

{% hint style="info" %}
Make a note of the API-key as well as the email used, as this will be [later](platform.md#environment-variables) used in our `.env` and during [Installation](platform.md#installations)
{% endhint %}

* Add the send grid key in the `.env`

{% code title=".env" %}
```sh
SENDGRID_API_KEY=your-API-key
```
{% endcode %}

### AWS S3

To utilize all functionalities of CREDEBL, total of 3 S3 buckets are required for;&#x20;

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
AWS_ORG_LOGO_BUCKET_NAME=

<strong># 2. Used for Bulk issuance of credential
</strong># Optional (Can be skipped if Bulk issuance is not used)
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=
AWS_BUCKET=

# 3. Used for storing connection URL generated from Agent and creating shortened URL
# Required (As connecting to org requires Shortened url)
AWS_S3_STOREOBJECT_ACCESS_KEY=
AWS_S3_STOREOBJECT_SECRET_KEY=
AWS_S3_STOREOBJECT_REGION= 
AWS_S3_STOREOBJECT_BUCKET=
</code></pre>

According to the `AWS_S3_STOREOBJECT_BUCKET` name, as per the [AWS S3 path style](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access), add domain to access objects from the bucket and save it, as it is utilized for the another .env variable &#x20;

{% code title=".env" overflow="wrap" %}
```sh
# Please refere AWS to determine your bucket url
# https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access 
SHORTENED_URL_DOMAIN='https://AWS_S3_STOREOBJECT_REGION.amazonaws.com/AWS_S3_STOREOBJECT_BUCKET'
```
{% endcode %}

{% hint style="info" %}
Note: Usually, `SHORTENED_URL_DOMAIN` for bucket names with dot ( . ) in it comes after '/': `https://AWS_S3_STOREOBJECT_REGION.amazonaws.com/`**`bucket-name`**. And others are often referred as a subdomain: `https://`**`bucket-name`**`.AWS_S3_STOREOBJECT_REGION.amazonaws.com`
{% endhint %}

### Schema File Server (Optional)

{% hint style="info" %}
This is an optional setup required for using w3c credentials, you can skip this if you want to use AnonCreds credentials
{% endhint %}

Coming Soon

### Agent Setup

The Docker image built during this process is used to launch agents for new organizations on the CREDEBL platform.The Docker image name is set as an environment variable during the platform setup in a later step.

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
docker build . -t credo-0.5.3:latest
```

{% hint style="info" %}
Mention credo controller version or any tag name. Note the same version will also need to be added in the `.env`
{% endhint %}

* Add the Docker Image tag in the `.env`

{% code title=".env" %}
```sh
AFJ_VERSION=credo-controller-0.5.3:latest
```
{% endcode %}

### Environment Variables

To help you quick start, a `.env.demo` is already present at the root of the platform repository. To getting started, rename `.env.demo` to `.env`

Please find `your-ip` in the `.env` file, and replace it with your machine's Ip address.

{% hint style="info" %}
If you want to know more about the environment variables, please refer to `.env.sample` file which is given at root of the repository.
{% endhint %}

Apart from the already present variables, you need to add few variables generated from the above prerequisites like the [postgresql](platform.md#postgresql), [keycloak](platform.md#top), [sendgrid](platform.md#sendgrid), [AWS S3](platform.md#aws-s3), [Credo version](platform.md#agent-setup), etc

## Installations

Make sure the `.env` file is set with all the required environment variables as per the .env.sample file and the [env guide](platform.md#environment-variables) give above.

Before you start the services make sure to update the `credebl-master-table.json` present at location, `libs/prisma-service/prisma/data`&#x20;

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

At the root of the [platfrom repo](platform.md#clone-repository):

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

```
docker-compose up -d
```

Access the Platform API by navigating to [http://localhost:5000](http://localhost:5000)

[^1]: While setting up sendgrid
