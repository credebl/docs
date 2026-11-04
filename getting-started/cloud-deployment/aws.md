---
description: >-
  This release provisions AWS infrastructure for the CREDEBL project using
  Terraform.
icon: aws
---

# AWS

## Setting Up Infrastructure with **Terraform**

To automate and streamline the deployment of infrastructure for CREDEBL, we use **Terraform**.

You can easily deploy the required infrastructure by following the steps below.

#### Prerequisites

* **Terraform** installed on your local machine. You can download it from the official [**Terraform website**](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).
*   An **AWS account** with the appropriate permissions to create and manage resources.

    The following AWS permissions are required for this deployment:

    1. EC2 Access
    2. S3 Access
    3. CloudWatch Access
    4. ECR (Elastic Container Registry) Access
    5. ECS (Elastic Container Service) Access
    6. EFS (Elastic File System) Access
    7. VPC Access
    8. IAM Access
* Ensure the cloud provider’s CLI (e.g., **AWS CLI**) is installed and configured on your local machine with valid credentials. You can follow the [AWS CLI configuration guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) to set it up.

#### Directory Structure

```
terraform-script/
└── aws/
    └── modules/          # Terraform modules
    └── platform/
        ├── main.tf       # Terraform resources for CREDEBL
        ├── variables.tf  # Input variables
        ├── backend.tf    # Backend configuration for remote state
        └── terraform.tfvars # Environment-specific values
```

#### Checkout to Release Version

Before proceeding with the deployment, make sure you are using the correct tagged release of the Terraform scripts.

1.  Clone the repository (if not already done):

    ```bash
    git clone https://github.com/credebl/install.git
    ```
2.  Navigate to the install directory:

    ```bash
    cd install
    ```
3.  Checkout to the release version used for this deployment:

    ```bash
    git checkout <latest_release tag>  ## example: v2.1.2
    ```

> **Note:** This ensures you are deploying the exact version of Terraform scripts tested for CREDEBL infrastructure provisioning.

#### Configuring Environment Variables

1. Open the `terraform.tfvars` file in the `platform` directory:
2.  Add or update environment-specific values. For example:

    ```hcl
    # Variables
    region                  = "aws_region"
    project_name            = "CREDEBL"
    environment             = "PROD"
    profile                 = "aws profile_name"


    certificate_arn         = "arn:aws:acm:us-west-1:123456789012:certificate/abcd1234-ab12-cd34-ef56-abcdef123456"
    domain_name             = "example.com"

    vpc_cidr                = "10.0.0.0/16"
    public_subnet_cidr      = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
    private_app_subnet_cidr = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
    private_db_subnet_cidr  = ["10.0.7.0/24", "10.0.8.0/24", "10.0.9.0/24"]

    natscluster             = true
    image_tag               = "latest"
    ```

    > **Note:**&#x20;
    >
    > * Make sure all required variables defined in `variables.tf` are set in `terraform.tfvars`.
    > * If you have multiple AWS CLI profiles configured, specify the profile name, or comment out the profile line to use default credentials.

{% hint style="info" %}
**Note:** To use an existing VPC, refer to the [README](https://github.com/credebl/install/tree/main/terraform-script/aws#using-existing-vpc) file in the `install/terraform-script/aws` directory
{% endhint %}

### Terraform Deployment Workflow

1.  **Initialise Terraform**:

    Navigate to the directory containing Terraform configuration files.

    ```bash
    cd terraform-script/aws/platform
    terraform init
    ```
2.  **Preview the Infrastructure Changes**: Run the following command to preview the changes that Terraform will make to your AWS infrastructure:

    ```bash
    terraform plan
    ```
3.  **Deploy the Infrastructure**: When ready, deploy the resources using the following command:

    ```bash
    terraform apply
    ```
4. **Confirm the Deployment**: Type `yes` when prompted to confirm and proceed with creating the AWS resources.

#### Infrastructure Provisioned

This release will create the required infrastructure on AWS for the CREDEBL platform, using the existing VPC.\
The following services and components will be provisioned:

* **ECS Services**
* **ECS Task Definitions**
* **Application Load Balancer (ALB)**
* **Amazon S3 Buckets**
* **Security Groups (SG)**
* **Elastic File System (EFS)**

#### Post-Execution Steps

1.  **Container Image Source**&#x20;

    By default, container images are pulled from CREDEBL GitHub Container Registry (GHCR). To use private Amazon ECR images instead:&#x20;

    1. Pull the required images from GitHub Packages: [https://github.com/orgs/credebl/packages](https://github.com/orgs/credebl/packages)&#x20;
    2. Tag and push all service images to your ECR repository:&#x20;

    ACCOUNT\_ID.dkr.ecr.us-east-1.amazonaws.com/ECR\_REPO:SERVICE\_NAME&#x20;
2.  **Database Setup**

    You will need **three PostgreSQL databases** for the services:

    1. **credo-controller** – Used by the credo controller service.
    2. **keycloak** – Used by Keycloak for authentication and identity management.
    3. **platform** – Used by the main CREDEBL platform application.

    You have two options for setting up these databases:

    * **Option 1:** Create a new PostgreSQL database manually.
    * **Option 2:** Use an existing database by providing its connection details in the environment files.
3.  **Create and Configure the `.env` File**:



    You will need to create **three environment files** for the services, using the environment prefix defined in your `terraform.tfvars` (e.g., `dev`, `qa`, or `prod`).

    **Example file names:**

    ```
    DEV-credebl.env
    DEV-credo.env
    DEV-keycloak.env
    ```

    **File references:**

    * `DEV-credebl.env` → Refer to:\
      [https://github.com/credebl/platform/blob/main/.env.demo](https://github.com/credebl/platform/blob/main/.env.demo)



    While configuring `DEV-credebl.env` for CREDEBL, the Terraform script provisions services on **ECS Fargate**, so you must update/add the following environment variables:

    ```bash
    # Fargate-specific script
    AFJ_AGENT_SPIN_UP=/agent-provisioning/AFJ/scripts/fargate.sh

    # AWS and infrastructure references
    AWS_ACCOUNT_ID=<your_aws_account_id>
    ECS_SECURITY_GROUP_ID=<ECS_CREDO_SG_ID_created_by_TF>
    S3_BUCKET_ARN=<credo_env_file_bucket_ARN>
    ECS_SUBNET_ID=<subnet_ID_for_CREDO_service>
    FILESYSTEMID=<CREDO_EFS_ID>
    AFJ_VERSION=ghcr.io/credebl/credo-controller:latest <optional: specify different image; default uses GHCR image>
    INBOUND_TG_ARN=<CREDO_inbound_target_group_ARN>
    ADMIN_TG_ARN=<CREDO_admin_target_group_ARN>

    # Service Connect URLs for ECS services
    NATS_URL=nats://nats-1-4222.dev-credebl-namespace:4222
    REDIS_HOST=redis-sc.dev-credebl-namespace
    REDIS_PORT=6379
    ```

    > **Notes:**
    >
    > * `NATS_URL` and `REDIS_HOST` point to the ECS Service Connect endpoints. ECS Fargate services will use this for communication.

    This ensures the **CREDEBL ECS service** can start properly with the correct **network, security, and service connectivity configuration**.



    `DEV-credo.env` → Refer to:\
    [https://github.com/credebl/platform/blob/main/agent.env](https://github.com/credebl/platform/blob/main/agent.env)



    * `DEV-keycloak.env` → Use the following template:

    ```bash
    KEYCLOAK_ADMIN=admin
    KEYCLOAK_ADMIN_PASSWORD=admin

    KC_HTTP_ENABLED=true
    KC_DB=postgres
    KC_DB_URL=jdbc:postgresql://HOST:PORT/Database
    KC_DB_USERNAME=DB_USERNAME
    KC_DB_PASSWORD=DB_PASSWORD
    KC_DB_URL_PORT=PORT
    PROXY_ADDRESS_FORWARDING=true

    KC_HOSTNAME_ADMIN_URL=https://KEYCLOAK_DOMAIN
    KC_HOSTNAME_URL=https://KEYCLOAK_DOMAIN

    KC_PROXY=edge
    KC_HOSTNAME_STRICT=false
    KC_LOG=console
    KC_HOSTNAME_STRICT_HTTPS=false

    KC_HTTPS_ENABLED=true

    ./kcadm.sh config credentials --server http://0.0.0.0:8080 --realm master --user admin
    ./kcadm.sh update realms/master -s sslRequired=NONE
    ```

    > **Note:** Replace placeholders like `HOST`, `PORT`, `Database`, and `KEYCLOAK_DOMAIN` with actual values.


4.  **Upload the `.env`  files to S3**:\
    Once you've configured the `.env` files, you’ll need to upload it to the S3 bucket that was created during the deployment.


5.  **Bastion and EFS Configuration**

    1. **Create a Bastion Server**
       * Create a new **Bastion EC2 instance** in the same VPC.
       * Ensure the Bastion host has access to both **NATS EFS** and **CREDO EFS** created by Terraform
    2. Mount EFS File Systems on Bastion
       1.  Mount both EFS volumes:

           * **NATS EFS**
           * **CREDO EFS**

           Command to mount EFS:

           ```bash
           sudo mkdir -p /nats-efs /credo-efs 
           sudo mount -t efs fs-xxxxxxx:/ /nats-efs	# replace with NATS EFS ID 
           sudo mount -t efs fs-yyyyyyy:/ /credo-efs   # replace with CREDO EFS ID 
           ```
    3.  Configure EFS Contents&#x20;

        ```bash
        mkdir -p /credo-efs/token 
        mkdir -p /credo-efs/seed
        ```



        *   Place the master-data.json file inside the seed/ directory and add&#x20;

            add the `credebl-master-table.json` file:

    Refer: [https://github.com/credebl/platform/blob/main/libs/prisma-service/prisma/data/credebl-master-table.json](https://github.com/credebl/platform/blob/main/libs/prisma-service/prisma/data/credebl-master-table.json)



    Update only the platformConfigData section and platformAdminKeycloakPassword for your environment:

    ```bash
    "platformConfigData": { 
      "externalIp":   "192.168.x.x",   // Credo agent admin endpoint 
      "inboundEndpoint":  "192.168.x.x",   // Credo agent inbound endpoint 
      "username":     "credebl", 
      "sgApiKey":     "API-key-received-here",
      "emailFrom":    "verified-email@domain.com", 
      "apiEndpoint":  "http://192.168.x.x:5000",  // API Gateway endpoint 
      "tailsFileServer":  "http://192.168.x.x:5000"
    }

    "platformAdminKeycloakPassword": ##Please provide encrypted password using crypto-js##
    ```

    Note: Do not modify any other sections of the JSON file.

    1. **In NATS EFS:**
       * Add the `nats.config` file in the root path of EFS.\
         Reference:\
         [https://github.com/credebl/platform/blob/main/nats-server.conf](https://github.com/credebl/platform/blob/main/nats-server.conf)
         * It’s recommended to add authentication to your NATS setup.
         *   Create a `seed` folder and add the `credebl-master-table.json` file:

             ```bash
             mkdir -p /mnt/nats-efs/seed
             ```

             Reference for JSON file:\
             [https://github.com/credebl/platform/blob/main/libs/prisma-service/prisma/data/credebl-master-table.json](https://github.com/credebl/platform/blob/main/libs/prisma-service/prisma/data/credebl-master-table.json)\
             To fill data for your setup, refer to the [credebl documentation](https://docs.credebl.id/docs/contribute/setup/service-setup#installations).\\

             <div data-gb-custom-block data-tag="hint" data-style="info" class="hint hint-info"><ul><li><strong>If you want to use NKeys based nats authentication:</strong></li></ul><p>To create your Nkeys, you can refer NATS tool nk as per their <a href="https://docs.nats.io/using-nats/nats-tools/nk">official documentation</a><br>Add one key from the generated NKey pair to your <code>.env</code> file and add the other key to the <code>nats-server.conf</code> file.</p><p>Example:</p><pre class="language-bash"><code class="lang-bash"># In credebl.env
             USER_NKEY_SEED=SUAM6N6D6IODRE2SGUFUGDUKRI7WRLMW2VU4OR2JAGCDGWVURMHBK2ZMGM
             </code></pre><pre class="language-bash"><code class="lang-bash"># In nats-server.conf
             authorization {
               users = [
                 { nkey: "UCQDGGRDXSCC777ZTCO2VF6LOK5OC3VSBRMK4ZUTYLKPSI7YKD67SGG6" }
               ]
             }
             </code></pre><ul><li>To use <strong>jwt based NATS authentication</strong> refer to <a href="https://github.com/credebl/nats">Nats directory</a> in CREDEBL git organisation<strong>.</strong></li><li>To use <a href="aws.md#to-use-username-and-password-based-authentication-for-nats.-refer-this">username and password based authentication</a> for NATS Refer dropdown below.</li></ul></div>

<details>

<summary>To use username and password based authentication for NATS. Refer this</summary>



```
jetstream: {
    domain: hub
    store_dir: "/data/jetstream"
    max_mem_store: 1Gb
    max_file_store: 10Gb
}

system_account: SYS
accounts: { 
app: { 
    jetstream: enabled    
    users: [
        {
            user: "backend_user",
            password: "backend_password",
            permissions: {
                publish: ">",
                subscribe: ">"
            }
        },
        {
            user: "exec_user",
            password: "exec_password",
            permissions: {
                publish: ">",
                subscribe: ">"
            }
        }
    ]
},
SYS: {
    users: [
        {
            user: "sys",
            password: "sys_password",
            permissions: {
                publish: ">",
                subscribe: ">",
                allow_responses: true
            }
        }
    ]
}
}
```

</details>

6.  **Service Startup Sequence**

    After completing the Bastion and EFS setup, the services can now be started in the correct order.

    1. **Start Keycloak Service**
       1. Start the Keycloak service first.
       2.  Navigate to the Keycloak Terraform directory:&#x20;

           ```
           cd install/terraform-scripts/keycloak
           ```
       3. Update terraform.tfvars with the Keycloak admin password and root-url domain.
       4.  Initialise and apply:

           ```
           terraform init && terraform plan && terraform apply 
           ```
       5. A secret.env file will be generated containing adminClient, platformClient, and trust-client secrets.
       6.  Copy the secrets into your credebl.env file:&#x20;

           ```
           KEYCLOAK_DOMAIN=https://KEYCLOAK_DOMAIN/ 
           KEYCLOAK_ADMIN_URL=https://KEYCLOAK_DOMAIN 
           KEYCLOAK_MASTER_REALM=master 
           KEYCLOAK_MANAGEMENT_CLIENT_ID=credeblClient 
           KEYCLOAK_MANAGEMENT_CLIENT_SECRET=<credeblClient_secret> 
           KEYCLOAK_REALM=credebl-platform 
            
           ADMIN_KEYCLOAK_ID=adminClient 
           ADMIN_KEYCLOAK_SECRET=<adminClient_secret> 
            
           Provide the value in its encrypted form using CRYPTO_PRIVATE_KEY for credeblClient ID and secret
           CREDEBL_KEYCLOAK_MANAGEMENT_CLIENT_ID=
           CREDEBL_KEYCLOAK_MANAGEMENT_CLIENT_SECRET= 
           ```
    2.  **Start Seed Service**

        1. Start the **Seed Service**. This service is used **only once** to populate initial data in the database.
        2.  Monitor the logs. You should see a message like:

            ```
            The seed command has been executed
            ```
        3. Once the seed command completes, **stop the seed service**, as it is not required to run continuously.

        > **Note:** The Seed Service writes initial data to your database (CREDEBL tables) and will not be needed after this one-time execution.
7.  **Start NATS, Redis, and Remaining Services**

    1. Start the **NATS service** first.
       * Ensure NATS is correctly configured with the `nats.config` and NKeys authentication is enabled.
    2. Once NATS is running, start the **Redis service**.
    3. After Redis is running, you can start **all other services** except the following, which should **not be started yet**:
       * `agent-service`
       * `agent-provisioning-service`

    > **Note:** `agent-service` and `agent-provisioning-service` will be started later, after the main platform services are confirmed to be healthy.
    >
    > This ensures the **correct service startup order**:
    >
    > Keycloak → 2. Seed Service → 3. NATS → 4. Redis → 5. All remaining services (excluding agent-related services).
8. **Start Agent-Provisioning and Agent Services**
   1. Start the **agent-provisioning service** first.
   2. Once the agent-provisioning service has started successfully, start the **agent service**.
      * This will executes a script that provisions the necessary agent resources in the **CREDO Controller cluster.** (creates credo-controller service)
9.  **Verification & Validation**

    After all services have been started successfully, perform the following checks to verify that the infrastructure and services are healthy and functioning correctly.

    1. Check ECS Services Health: Verify that all ECS services are in the **Running** state.
    2. Check Application Load Balancer (ALB):
       * The **Target Groups** are healthy.
       * Each registered target shows **“Healthy”** status.

    ✅ **If all the above checks pass**, your CREDEBL infrastructure is successfully provisioned and all services are up and running on AWS.

#### Tearing Down AWS Resources

To delete the AWS resources created by Terraform, run the following command:

```bash
terraform destroy
```

#### Notes

* For setting up NATS keys for authorization, please refer to the documentation on [NATS](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/nkey_auth) authorization for more details.
* Ensure that the required **AWS IAM roles** and permissions are in place before deploying.
* For additional details or troubleshooting, refer to the Terraform AWS Provider documentation and the Terraform documentation.
