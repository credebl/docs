---
title: Local setup using Docker
description: A reference page in my new CREDEBL docs site.
---

The Docker image built during this process is used to launch agents for new organizations on the CREDEBL platform.The Docker image name is set as an environment variable during the platform setup in a later step.
### CREDO Controller
Clone the following repository:

```bash
git clone https://github.com/credebl/afj-controller
cd afj-controller
```

Use following commands to install and upgrade Yarn:

```bash
npm install -g yarn
```
To install the dependancies use following command:
```bash
 yarn
```
Build Agent controller using the following command: 
```bash 
yarn build
```

Create Docker Image using following command :
```bash 
docker build . -t afj-0.4.2:latest // Mention afj version or any tag name
```
