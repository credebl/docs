---
icon: sign-posts-wrench
description: This is a guide for local deployment and common prerequisites
---

# Local Deployment

## Overview

Welcome to the Local Deployment guide for the CREDEBL platform! This section provides step-by-step instructions to help you set up the complete CREDEBL environment on your local machine. Deploying CREDEBL locally allows you to test and explore the platform's capabilities, ensuring that all components work seamlessly together in a controlled setting before moving on to larger-scale environments.

Before diving into the installation process, it is important to understand the main components that make up the CREDEBL ecosystem. The local deployment will include the following parts:

* **Prerequisites:** Essential software, dependencies, and system configurations that must be set up before starting the installation process.
* **Platform:** The core of CREDEBL, responsible for managing identities, transactions, and data flow within the system.
* **Studio:** A user-friendly interface that enables interaction with the CREDEBL platform, providing tools for administration and data visualization.
* **Agent:** The service that handles secure communications and interactions with the platform, acting as the middleware between the user and the platform's core functionalities.
* **Adeya Wallet:** A secure digital wallet that integrates with CREDEBL, allowing users to manage their digital identities, credentials, and transactions in a safe and controlled manner.

## Purpose of Local Deployment

Deploying CREDEBL locally offers a development-friendly environment, perfect for exploring features and testing before moving to production, ideal for developers, testers, and evaluators.

Once your environment is prepared, you can move on to installing each component in the following order:

1. **Platform**: The heart of CREDEBL's functionality.
2. **Studio**: For managing and visualizing data.
3. **Agent**: Ensures secure interactions with the platform.
4. **Adeya Wallet**: Facilitates identity and credential management.

Now that you understand the overall process, let's get started with the installation steps, beginning with the prerequisites.

## Prerequisites

Before you begin the installation process, make sure that your system has the following common prerequisites installed. These tools are essential for running and managing the CREDEBL platform components locally:

* Node.js and npm
  * Ensure that you have Node.js installed with a version greater than 18.&#x20;
  * npm (Node Package Manager) comes bundled with Node.js, and it will be used to install and manage JavaScript packages required for the CREDEBL platform.

{% code title="To verify the installation, run:" %}
```sh
node -v
npm -v
```
{% endcode %}

* Git
  * Git is required for version control and to clone repositories for the CREDEBL platform.
  * You can install Git by following the instructions on [Git's official website](https://git-scm.com/).

{% code title="To check if Git is installed, use:" %}
```sh
git --version
```
{% endcode %}

* Docker
  * Docker is a containerization tool used to deploy the CREDEBL platform services in a consistent and isolated environment.&#x20;
  * Install Docker by following the instructions for your operating system on Docker's official website.

{% code title="Verify the Docker installation:" %}
```sh
docker --version
```
{% endcode %}

* Docker Compose
  * Docker Compose is a tool for defining and running multi-container Docker applications. It's used to manage the various services that make up the CREDEBL platform.
  * Docker Compose typically comes with Docker Desktop installations, but if you're using Docker on a Linux machine, you might need to install it separately.

{% code title="Check Docker Compose version:" %}
```sh
docker-compose --version
```
{% endcode %}
