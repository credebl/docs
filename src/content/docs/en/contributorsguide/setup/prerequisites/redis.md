---
title: REDIS Transporter
description: REDIS Transporter
---
The CREDEBL platform leverages [Redis](https://redis.io/) as an in-memory data store, primarily for caching and queuing. By storing bulk data in memory, CREDEBL services can achieve high performance, making it easier to manage real-time workloads and handle large volumes of data efficiently.

## Setting Up a REDIS Server:

To set up Redis for the CREDEBL platform, follow the steps below to create and launch a Redis instance using Docker.

###  Create the `docker-compose.yml` File

The docker-compose.yml file is used to define and configure the Redis container for the platform.

``` yaml
version: '3'
services:
  redis:
    image: redis:6.2-alpine
    restart: always
    ports:
      - '6379:6379'
    command: redis-server --save 20 1 --loglevel warning
    volumes:
      - cache:/data

volumes:
  cache:

```

- **Image:** This specifies the version of Redis to be used. In this case, we are using **redis:6.2-alpine** for a lightweight and fast setup.
- **Restart Policy:** The restart always directive ensures that the Redis service restarts automatically in case of failure.
- **Ports:** The Redis server is mapped to the host machine’s port 6379.
- **Command:** Configures the Redis server to save data after 20 changes within 1 second and limits logging to warnings.
- **Volumes:** Data is persisted in a Docker volume named cache.


### Start REDIS Server
Once the docker-compose.yml file is in place, start the Redis service by running the following command:

```yaml
docker compose up
```

This command will bring up the Redis container, which is now ready to handle caching and queuing for the CREDEBL platform.