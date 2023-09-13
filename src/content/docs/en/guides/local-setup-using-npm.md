---
title: Install CREDEBL from repository
description: A reference page in my new CREDEBL docs site.
---

## Platform API

Clone the platform repository from GitHub:

```bash
   git clone https://github.com/credebl/platform.git 
   cd platform
```
  
Create a .env file and set the required environment variables as per the `.env.sample` file.

Install dependancie
```bash
  npm i
```
Keep your database schema in sync with your Prisma schema as it evolves and Maintain existing data in your database.
```bash
  cd lib/prisma-service/
  npx prisma migrate deploy 
```
Generate Prisma Client to access schema model with the following command:
```bash 
  npx primsa generate
```
For initial master table entry create a credebl-master-table.json file at **lib/prisma-service/prisma/data** and set the required variables as per the `credebl-master-table.json` file.run following command.
```bash 
  npx primsa db seed
```
To start the API gateway
```bash
   npm run start
```
To start all microservices using below command followed by microservice name, example: start user service.

```bash
  npm run start user
```

Access the Platform API by navigating to:

 ```bash
  http://localhost:5000

```
## Using swagger to access platform API

If you're running docker locally, access the CREDEBL platform swagger dashboard through the API gateway on port 5000.

```bash
http://localhost:5000/api
```
## Studio UI

Clone the studio repository:

```bash
  git clone https://github.com/credebl/studio.git
  cd studio
```

Create a .env file and set the required environment variables as per the `.env.sample` file. 

Install dependencies and start the Studio UI:

 ```bash
  npm i
  npm run start
```

Access the Studio UI by navigating to:

```bash
 http://localhost:3000
```


---
