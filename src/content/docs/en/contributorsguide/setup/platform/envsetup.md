---
title: Environment Configuration
description: A guide to setting up environment variables for the CREDEBL platform.
---

# `.env.sample` Configuration Documentation

This document outlines the configuration variables used in the `.env.sample` file. Each environment variable has been described to guide users on how to set up their environment correctly. These variables are critical for the functioning of the CREDEBL platform and must be configured with appropriate values.

## General Configuration

- **MODE**: Defines the operating mode of the application. Example: `DEV`, `PROD`, or `STAGING`.

## API Gateway Configuration

- **API_GATEWAY_PROTOCOL**: Protocol used for the API Gateway, typically `http` or `https`.
- **API_GATEWAY_HOST**: The host address of the API Gateway, often `0.0.0.0` for development.
- **API_GATEWAY_PORT**: The port on which the API Gateway will run. Example: `5000`.
- **API_GATEWAY_PROTOCOL_SECURE**: Security protocol for the API Gateway, typically `http` or `https`.

## Platform Settings

- **PLATFORM_NAME**: The name of the platform that will be displayed in the UI.
- **PLATFORM_LOGO**: The URL of the platform logo to be used in the UI.
- **PUBLIC_PLATFORM_SUPPORT_EMAIL**: The support email for users to contact in case of issues.
- **POWERED_BY**: The name of the organization powering the platform.
- **PLATFORM_WEB_URL**: The base URL of the platform's web interface.
- **POWERED_BY_URL**: The URL of the powered-by organization's website.

## Upload and File Hosting Settings

- **UPLOAD_LOGO_HOST**: Domain or URL where the logo files will be hosted.
- **FILE_SERVER**: URL or IP address of the file server.
- **FILE_SERVER_PORT**: Port on which the file server is running. Example: `8081`.
- **FILE_SERVER_USER**: Username for file server access.
- **FILE_SERVER_HOST**: Host IP address of the file server.

## Environment-Specific API URLs

- **PUBLIC_LOCALHOST_URL**: The localhost URL for the platform in development.
- **PUBLIC_DEV_API_URL**: API URL for the development environment.
- **PUBLIC_QA_API_URL**: API URL for the QA environment.
- **PUBLIC_PRODUCTION_API_URL**: API URL for the production environment.
- **PUBLIC_SANDBOX_API_URL**: API URL for the sandbox environment used for testing.

## AWS Configuration

- **AWS_ACCOUNT_ID**: Your AWS account ID.
- **S3_BUCKET_ARN**: The Amazon Resource Name (ARN) of the S3 bucket.
- **AWS_PUBLIC_ACCESS_KEY**: AWS access key for public resources.
- **AWS_PUBLIC_SECRET_KEY**: AWS secret key for public resources.
- **AWS_PUBLIC_REGION**: The AWS region where your resources are hosted.
- **AWS_PUBLIC_BUCKET_NAME**: The name of your public AWS S3 bucket.

## NATS Messaging Configuration

- **NATS_HOST**: Host IP address of the NATS server. Example: `0.0.0.0`.
- **NATS_PORT**: Port on which NATS messaging service is running. Example: `4222`.
- **NATS_URL**: Complete URL for connecting to the NATS server. Example: `nats://0.0.0.0:4222`.

## Redis Configuration

- **REDIS_HOST**: Host IP address of the Redis server.
- **REDIS_PORT**: Port on which Redis is running. Example: `6379`.

## PostgreSQL Configuration

- **POSTGRES_HOST**: Host IP address of the PostgreSQL server.
- **POSTGRES_PORT**: Port for PostgreSQL access. Default is `5432`.
- **POSTGRES_USER**: Username for PostgreSQL access. Default is `postgres`.
- **POSTGRES_PASSWORD**: Password for the PostgreSQL user.
- **POSTGRES_DATABASE**: Name of the PostgreSQL database to connect to.

## Socket and API Configuration

- **SOCKET_HOST**: URL for the socket connection to the API Gateway. Example: `http://localhost:5000`.
- **API_ENDPOINT**: URL and port of the API Gateway. Example: `localhost:5000`.
- **API_ENDPOINT_PORT**: Port on which the API Gateway is running. Example: `5000`.

## Prisma Configuration

- **DATABASE_URL**: Full PostgreSQL connection string for Prisma. Example: `postgresql://postgres:xxxxxx@localhost:5432/postgres?schema=public`.
- **POOL_DATABASE_URL**: URL for the pooled database connection.

## Additional Services Configuration

- **SENDGRID_API_KEY**: API key for SendGrid email service.
- **FRONT_END_URL**: The base URL for the front-end application. Example: `http://localhost:3000`.
- **KEYCLOAK_DOMAIN**: Base URL for Keycloak authentication. Example: `http://localhost:8080/`.

---

### Key Guidelines:
- Replace all placeholder values (e.g., `xxxxx`) with actual values.
- Ensure that sensitive information, such as API keys and passwords, are securely stored.
- For production environments, consider using a secrets manager instead of keeping values in the `.env` file.

