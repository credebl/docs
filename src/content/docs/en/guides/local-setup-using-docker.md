---
title: Install CREDEBL using Docker
description: A reference page in my new CREDEBL docs site.
---


## Platform API

Clones the platform repository from GitHub:

 ```bash
   git clone https://github.com/credebl/platform.git 
   cd platform
 ```
  
Create a `.env` file and set the required environment variables as per the `.env.example`. To start the API gateway and microservices.

Start the services:

```bash
  docker compose up -d
```

Access the Platform API by navigating to:

```bash
  http://localhost:5000
```

## Studio UI

Clone the CREDEBL Studio repository:

```bash
  git clone https://github.com/credebl/studio.git
  cd studio
```

Create a `.env` file and set the required environment variables as per the `.env.example`. To start the Studio UI. 

Build docker image

 ```bash
  docker build -t UI .
 ```

Start Studio UI
 
```bash
  docker run -d -p 8085:8085 --env-file .env --name UI-App UI
```

Access the dockerized Studio UI by navigating to:

```bash
 http://localhost:8085
```
