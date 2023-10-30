---
title: Getting Started 
description: A reference page in my new CREDEBL docs site.
---

## Setting Up CREDEBL

Welcome to the CREDEBL Platform Setup Guide! This manual will walk you through the process of installing CREDEBL on your local machine. Let's get started.

### Initial Setup

There are two ways you can setup the platform: 
- Using [NPM](/en/guides/local-setup-using-npm/) directly by cloning the repository   OR
- Using [Docker](/en/guides/local-setup-using-docker/)

### Pre-requisites

At the base of the CREDEBL Platform consist of Prerequisite Softwares. 

Before you begin with the project, make sure the following software's are installed on your machine.


**Node.js and npm:**  use node 18 version

**Git:** Install [git](https://git-scm.com/) if it is not already installed.

**Docker:** Install the latest version of [Docker](https://docs.docker.com/engine/install) 

**Docker Compose:**  Install the **latest version** of [Docker-Compose](https://docs.docker.com/compose/install).

**NATS:** Download and install [NATS](/en/guides/nats/).

**Authentication and Database** 

The CREDEBL Platform, being open source , mandates user authentication and utilizes a database for storing agent wallets and platform data.Supabase is used as a database service.

To set up authentication and the database server, you have the option to either utilize [supabase](https://supabase.com/docs/guides/cli/local-development) or take advantage of the [Supabase SaaS service](https://supabase.com/).

**SendGrid** 

Create a [SendGrid account](https://sendgrid.com/), generate an API key, and grant necessary permissions for sending emails.
