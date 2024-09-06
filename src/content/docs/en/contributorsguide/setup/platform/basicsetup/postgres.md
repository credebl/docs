---
title: Local setup using PostgreSQL
description: A reference page in my new CREDEBL docs site.
---

### Setting Up PostgreSQL Locally

[PostgreSQL](https://www.postgresql.org/) is a powerful, open-source object-relational database system known for its robustness and advanced features. This guide provides instructions for installing and configuring PostgreSQL both natively and using Docker.
Installing PostgreSQL

```bash
   sudo apt install postgresql
```

To verify the status of the PostgreSQL service, use:

```bash
   sudo systemctl status postgresql
```

#### Configuring PostgreSQL

1. Access the PostgreSQL command line interface: 

```bash
   sudo -u postgres psql
```

2. Create a new user:

```bash
   CREATE USER your_user;
```

3. Create a new database:

```bash
   CREATE DATABASE your_db_name;
```
4. Set a password for the user:

```bash
   CREATE USER your_user WITH ENCRYPTED PASSWORD 'your_password';
```

5. Grant all privileges on the database to the user:

```bash
   GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_user;
```

### Installing PostgreSQL Using Docker

1. Pull the PostgreSQL Docker image:

```bash
   docker pull postgres
```

2. Create a Docker volume to persist PostgreSQL data:

```bash
   docker volume create CREDEBL
```
3. Run the PostgreSQL Docker container:

```bash
   docker run --name CREDEBL -e POSTGRES_PASSWORD=credebl_password -d -p 5432:5432 -v CREDEBL:/var/lib/postgresql/data postgres
```

4. Verify that the Docker container is running:

```bash
   docker ps
```

You should see the container named CREDEBL listed.

