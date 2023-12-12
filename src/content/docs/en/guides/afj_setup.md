---
title: Agent Setup
description: Describe the CREDEBL Platform Architecture
---
Docker image build in this process is used to start the agents for new organizations in CREDEBL platform.
The docker image name is used as a environment setting while setting up the CREDEBL Platform in later step.
### AFJ Controller
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