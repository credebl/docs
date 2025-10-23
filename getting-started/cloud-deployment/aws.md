---
icon: aws
---

# AWS

## Setting Up Infrastructure with **Terraform**

To automate and streamline the deployment of infrastructure for CREDEBL, we use **Terraform**.&#x20;

You can easily deploy the required infrastructure by following the steps below.

#### Prerequisites

* **Terraform** installed on your local machine. You can download it from the official [**Terraform website**](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).
*   An **AWS account** with the appropriate permissions to create and manage resources.

    The following AWS permissions are required for this deployment:

    1. EC2 Full Access
    2. S3 Full Access
    3. CloudWatch Full Access
    4. ECR (Elastic Container Registry) Full Access
    5. ECS (Elastic Container Service) Full Access
    6. EFS (Elastic File System) Full Access
    7. VPC Full Access
    8. IAM Full Access
* Ensure the cloud provider’s CLI (e.g., **AWS CLI**) is installed and configured on your local machine with valid credentials. You can follow the [AWS CLI configuration guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) to set it up.

### Steps to Deploy

1.  **Clone the Repository**: First, get the code from the repository:

    ```bash
    git clone https://github.com/credebl/install.git
    cd install/terraform-scripts
    ```
2.  **Configure AWS**: Ensure that your AWS credentials are set up. Run the following command to configure the AWS CLI if not done already:

    ```bash
    aws configure
    ```

    This will prompt you for your **AWS Access Key**, **Secret Access Key**, **Region**, and **Output format**.
3.  **Create and Configure `terraform.tfvars` File**:\
    Before initiating the deployment, create a `terraform.tfvars` file on path `terraform-script/aws/platform`.\
    \
    Open the `terraform.tfvars` file and add values to the variables. These values will be used to customize your deployment, such as the AWS region, instance type, and other required settings. Example:

    ```
    aws_region = "us-west-2"
    ```

Ensure all required variables are set before proceeding.

1.  **Initialise Terraform**: Initialise the directory containing Terraform files to install the required AWS provider:

    ```bash
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

#### Post-Deployment Steps

7.  **Create and Configure the `.env` File**:\
    After the deployment, a `.env` file will be created with Environment name. Open the file and add the necessary values to configure your environment. For example:

    ```bash
    DATABASE_URL=<your-database-url>
    API_KEY=<your-api-key>
    SECRET_KEY=<your-secret-key>
    ```

    Ensure all required variables are added and saved before proceeding.
8. **Upload the `.env` File to S3**:\
   Once you've configured the `.env` file, you’ll need to upload it to the S3 bucket that was created during the deployment.
9.  **Update ECS Service**:\
    Navigate to the **ECS (Elastic Container Service)** in the AWS Console. Go to the **Cluster** that was created. Inside the cluster, locate the **Services** and set the **Desired Task Count** to `1` (or your desired number of tasks) to launch the container.

    This step will start your application as defined in the ECS service.

#### Tearing Down AWS Resources

To delete the AWS resources created by Terraform, run the following command:

```bash
terraform destroy
```

#### Notes

* For setting up NATS keys for authorization, please refer to the documentation on [NATS](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/nkey_auth) authorization for more details.
* Ensure that the required **AWS IAM roles** and permissions are in place before deploying.
* For additional details or troubleshooting, refer to the Terraform AWS Provider documentation and the Terraform documentation.
