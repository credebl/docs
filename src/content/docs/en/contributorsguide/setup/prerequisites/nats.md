---
title: NATS Messaging
description: NATS Messaging
---
The CREDEBL platform utilizes [NATS](https://nats.io/) for message-driven data exchange between its microservices. NATS serves as a lightweight and high-performance "message-oriented middleware," allowing services to communicate seamlessly in real-time.

### Why NATS?
NATS enables CREDEBL platform services to exchange data effectively by breaking down communication into discrete messages. With NATS, application developers can:

  - Build distributed and scalable client-server applications effortlessly.
  - Store and distribute data in real time, making it adaptable across various environments, languages, cloud providers, and on-premises systems.

## Setting Up a NATS Server

Follow the steps below to set up a NATS server for the CREDEBL platform using a configuration file and Docker.

### Create the NATS Configuration File (`nats-server.conf`)

The configuration file defines how the NATS server operates, including port assignments and WebSocket support.

```yaml
port: 4222
max_payload: 4194304  # 4 MB in bytes
websocket {
  port: 443
  no_tls: true
}

```
- **port:** The main port for NATS communication is set to 4222.
- **max_payload:** Sets the maximum message payload size to 4 MB.
- **websocket:** Enables WebSocket support on port 443 without TLS (for unsecured communication).

### Create the `docker-compose.yml` File

The docker-compose.yml file will define the NATS service, map the necessary ports, and bind the configuration file.

``` yaml
version: '3'
services:
  nats:
    container_name: nats
    image: nats
    command: ["-c", "/nats-server.conf"]
    ports:
      - '4222:4222'
      - '6222:6222'
      - '8222:8222'
    volumes:
      - ./nats-server.conf:/nats-server.conf:ro

```
- **container_name:** Sets the name of the container to nats.
- **image:** Uses the official NATS Docker image.
- **command:** Passes the NATS configuration file to the container at startup.
- **ports:** Exposes three key ports:
  - `4222`: Main NATS client communication port.
  - `6222`: Routing port for NATS clusters.
  - `8222`: HTTP monitoring port for server statistics and health checks.
- **volumes:** Mounts the nats-server.conf configuration file into the container as read-only (ro).

### Start the NATS Server

To start the NATS server, run the following command from the directory containing the docker-compose.yml file:

```yaml
docker compose up
```

This command will bring up the NATS container, configured to handle messaging for the CREDEBL platform's microservices.