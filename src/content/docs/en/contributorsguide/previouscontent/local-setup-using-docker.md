---
title: Local setup using Docker
description: A reference page in my new CREDEBL docs site.
---


## Platform API

Clones the platform repository from GitHub:

 ```bash
   git clone https://github.com/credebl/platform.git 
   cd platform
 ```
  
Create a .env file and set the required environment variables as per the `.env.sample` file.To start the API gateway and microservices. 

Start the services:

```bash
  docker compose up -d
```
For initial master table entry create a credebl-master-table.json file at **lib/prisma-service/prisma/data** and set the required variables as per the `credebl-master-table.json` file.run following command.
```bash 
  npx prisma db seed
```

Access the Platform API by navigating to:

```bash
  http://localhost:5000
```

