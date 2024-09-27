---
title: Prerequisite softwares
description: Prerequisites
---

### Pre-requisites

At the base of the CREDEBL Platform consist of prerequisite softwares.
Before you begin with the project, make sure the following software's are installed on your machine.

**Node.js and npm:**  use node 18 version

**Git:** Install [git](https://git-scm.com/) if it is not already installed.

**Docker:** Install the latest version of [Docker](https://docs.docker.com/engine/install) 

**Docker Compose:**  Install the **latest version** of [Docker-Compose](https://docs.docker.com/compose/install).

**NATS:** Download and install [NATS](/en/developersguide/setup/prerequisites/nats/).

**REDIS:** Download and install [REDIS](/en/developersguide/setup/prerequisites/redis/).

**PostgreSQL:** Download and install [PostgreSQL](/en/developersguide/setup/prerequisites/postgres/).

#### Authentication and Database 

The CREDEBL Platform, being open source , mandates user authentication and utilizes a database for storing agent wallets and platform data. Keycloak is used as a database service.

To set up keycloak for authentication follow the [Keycloak Setup using Docker](/en/guides/keycloak) section. Learn more about keycloak from their [official website](https://www.keycloak.org/).

**SendGrid** 

Create a [SendGrid account](https://sendgrid.com/), generate an API key, and grant necessary permissions for sending emails.