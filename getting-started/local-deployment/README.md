---
icon: sign-posts-wrench
---

# Local Deployment

Before you begin with the project, make sure the following software’s on your machine.

#### **Docker:** Install the latest version of [Docker](https://docs.docker.com/engine/install)

#### **Docker Compose:** Install the **latest version** of [Docker-Compose](https://docs.docker.com/compose/install).

#### **NATS:** Download and install NATS.

The configuration file defines how the NATS server operates, including port assignments and WebSocket support.

{% code lineNumbers="true" %}
```yaml
port: 4222
max_payload: 4194304  # 4 MB in bytes
websocket {
  port: 443
  no_tls: true
}
```
{% endcode %}

Install NATS via docker from [here](https://docs.nats.io/running-a-nats-service/introduction/running#docker).

#### **REDIS:** Download and install REDIS from [here](https://redis.io/docs/latest/operate/oss\_and\_stack/install/install-stack/docker/)

#### **PostgreSQL:** Download and install PostgreSQL from here

### **Authentication and Database**

The CREDEBL Platform, being open source , mandates user authentication and utilizes a database for storing agent wallets and platform data. Keycloak iyams used as a database service.

To set up keycloak for authentication follow the Keycloak Installation using Docker section. Learn more about keycloak from their [official website](https://www.keycloak.org/).

### **SendGrid**

Create a [SendGrid account](https://sendgrid.com/), generate an API key, and grant necessary permissions for sending emails.
