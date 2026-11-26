---
description: >-
  Optional liveness and readiness endpoints for the CREDEBL NATS microservices,
  for container health checks and uptime monitors.
---

# Health endpoints (optional)

Only the API gateway serves HTTP. Every other service (user, organization, utility, webhook, agent-service, cloud-wallet, issuance, verification, oid4vc-issuance, oid4vc-verification, x509 and so on) is a NATS microservice with no HTTP port, so orchestrators and uptime monitors cannot probe it.

Each microservice can start a small HTTP listener for this purpose. It is **off by default**.

## Enable

Set `HEALTH_PORT` in the environment of the service:

```bash
HEALTH_PORT=8081
```

If several services share one network namespace (for example, a single host), give each its own port. An invalid value disables the listener and logs a warning.

## Endpoints

| Endpoint            | Meaning                                       | Status                                 |
| ------------------- | --------------------------------------------- | -------------------------------------- |
| `GET /health/live`  | The process is up. No dependency checks run.  | `200`                                  |
| `GET /health/ready` | The service's dependencies are reachable.     | `200`, or `503` if any check is `down` |

Example readiness response when the database is unreachable:

```json
{
  "status": "unavailable",
  "service": "user",
  "checks": { "nats": "up", "database": "down" }
}
```

### Readiness checks

Each check times out after 3 seconds.

| Check      | What it does                                                                               | Services                                       |
| ---------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `nats`     | Opens a dedicated connection with the service's own credentials and flushes it per probe.  | All                                            |
| `database` | Runs `SELECT 1` through the service's Prisma client.                                       | All services with a database                   |
| `redis`    | Opens a TCP connection to `REDIS_HOST:REDIS_PORT`.                                         | Issuance, notification                         |

## Container health check

Use the readiness endpoint for orchestrator health checks, for example in Docker Compose:

```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost:8081/health/ready"]
  interval: 30s
  timeout: 5s
  retries: 3
```

Use `/health/live` for liveness probes (restart when the process is stuck) and `/health/ready` for readiness probes (stop routing traffic when a dependency is down).

{% hint style="info" %}
Available from the platform release that includes [credebl/platform#1870](https://github.com/credebl/platform/pull/1870). Prometheus-format metrics are not part of this feature yet.
{% endhint %}
