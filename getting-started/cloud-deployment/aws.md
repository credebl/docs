---
icon: aws
---

# AWS

## Setting Up Infrastructure with Terraform

To automate and streamline the deployment of infrastructure for CREDEBL, we use **Terraform**.&#x20;

You can easily deploy the required infrastructure by following the steps below.

#### Prerequisites

* **Terraform** installed on your local machine. You can download it from the official [Terraform website.](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
* You must have an **AWS account** with the appropriate permissions to create and manage resources.
* Ensure cloud provider's **CLI** (e.g., AWS CLI) is installed and configured on your local machine with valid credentials.

### Steps to Deploy

1.  **Clone the Repository**: First, get the Terraform code from the repository:

    ```bash
    git clone <your-github-repo-url>
    cd <your-repo-directory>
    ```
2.  **Configure AWS**: Ensure that your AWS credentials are set up. Run the following command to configure the AWS CLI if not done already:

    ```bash
    aws configure
    ```

    This will prompt you for your **AWS Access Key**, **Secret Access Key**, **Region**, and **Output format**.
3.  **Initialize Terraform**: Initialize the directory containing Terraform files to install the required AWS provider:

    ```bash
    terraform init
    ```
4.  **Preview the Infrastructure Changes**: Run the following command to preview the changes that Terraform will make to your AWS infrastructure:

    ```bash
    terraform plan
    ```
5.  **Deploy the Infrastructure**: When ready, deploy the resources using the following command:

    ```bash
    terraform apply
    ```
6. **Confirm the Deployment**: Type `yes` when prompted to confirm and proceed with creating the AWS resources.

### Access the Terraform Code

The full Terraform configuration for this deployment is available in the following GitHub repository:

* Terraform Code for AWS Deployment

#### Tearing Down AWS Resources

To delete the AWS resources created by Terraform, run the following command:

```bash
terraform destroy
```

#### Notes

* Ensure that the required **AWS IAM roles** and permissions are in place before deploying.
* For additional details or troubleshooting, refer to the Terraform AWS Provider documentation and the Terraform documentation.
