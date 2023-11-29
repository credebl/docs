---
title: NATS Messaging
description: NATS Messaging
---
CREDEBL Platform uses [NATS](https://nats.io) for message-driven data exchange between CREDEBL microservices.

CREDEBL Platform services need to exchange data. NATS is an infrastructure that allows such data exchange, segmented in the form of messages. It is called as "message oriented middleware".
With NATS, application developers can:
- Effortlessly build distributed and scalable client-server applications.
- Store and distribute data in realtime in a general manner. This can flexibly be achieved across various environments, languages, cloud providers and on-premises systems.

## Setup a NATS Server:

### Create NATS config `nats-server.conf`

```yaml
port: 4222
max_payload: 4194304  # 4 MB in bytes
websocket:
  port: 443
  no_tls: true 

```

### Create `docker-compose`

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

### Start NATS Server

```yaml
docker compose up
```