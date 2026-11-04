---
description: >-
  This is an optional feature. It is not required for CREDEBL setup. Enable it
  only if you need automatic record lifecycle management.
---

# Data Deletion (Purge System)

The purge system automatically deletes credential exchange records, proof records, and OID4VC session records after a configurable TTL (time-to-live). This keeps the agent database lean and ensures compliance with data retention policies.

Two independent flows are available:

| Flow       | Mode | How it works                                                                                  |
| ---------- | ---- | --------------------------------------------------------------------------------------------- |
| **Flow A** | NATS | Schedules deletion at the moment of offer creation via NATS JetStream. No DB scanning needed. |
| **Flow B** | Cron | Periodically scans the database and deletes records older than TTL. No NATS required.         |

#### Environment Variables

Add the following variables to your `.env` file.

**Master Switch**

```bash
# Set to true to activate the purge system
PURGE_ENABLED=true

# Set to false to disable webhook notifications after deletion (default: true)
PURGE_WEBHOOK_ENABLED=true
```

**Flow A — NATS Mode**

```bash
PURGE_NATS_ENABLED=true
PURGE_NATS_TTL_SECONDS=2592000   # 30 days
```

**Flow B — Cron Mode**

```bash
PURGE_CRON_ENABLED=true
PURGE_CRON_TTL_SECONDS=2592000   # 30 days
PURGE_CRON_SCHEDULE=0 * * * *    # every hour
```

**Optional: Per-Type Record Filtering**

By default all four record types are purged. Uncomment specific flags to restrict purge to those types only.

```bash
# PURGE_DIDCOMM_CREDENTIAL=true
# PURGE_DIDCOMM_PROOF=true
# PURGE_OID4VC_ISSUANCE=true
# PURGE_OID4VC_VERIFICATION=true
```

If any one of these flags is present in your environment, at least one must be set to `true`. Setting all to `false` will throw an error at startup.

***

#### Flow A: NATS Setup

Flow A requires a running NATS server with JetStream enabled.

**Step 1 — Generate NKey Credentials**

Run the key generation script from the repository root:

```bash
node scripts/generate-nkeys.js
```

This prints two values:

```
=== NATS NKey Keypair ===

Public key  (→ nats/nats.conf → authorization.users[].nkey):
  UAAPUCW6PFSR4RWK7KXFNT355ARP7SLZQVG4WNHMXXGTDABOOLTGOL7W

Seed/secret (→ .env → NATS_NKEY_SEED):
  SUAOCKZZKX5SBYYVCXB4PYSNACZUQECTYRBGYLD67FW65EUHIGKKKSKGOM
```

Keep the seed secret. Anyone with the seed can authenticate to your NATS server. Never commit it to version control.

**Step 2 — Configure NATS Server**

Paste the public key into `nats/nats.conf`:

```
jetstream {
  store_dir: /data/jetstream
  max_memory_store: 256MB
  max_file_store: 1GB
}

max_payload: 1MB

authorization {
  users = [
    { nkey: "UAAPUCW6PFSR4RWK7KXFNT355ARP7SLZQVG4WNHMXXGTDABOOLTGOL7W" }
  ]
}
```

**Step 3 — Start NATS via Docker**

```bash
docker compose up nats -d
```

Verify JetStream and authentication are active:

```bash
curl -s http://localhost:8222/varz | grep auth_required
# Expected: "auth_required": true
```

**Step 4 — Configure NATS Connection in `.env`**

```bash
NATS_SERVERS=nats://localhost:4223
NATS_AUTH_TYPE=nkey
NATS_NKEY_SEED=SUAOCKZZKX5SBYYVCXB4PYSNACZUQECTYRBGYLD67FW65EUHIGKKKSKGOM
```

***

#### NATS Authentication Types

The purge system supports four NATS authentication methods controlled by `NATS_AUTH_TYPE`:

| `NATS_AUTH_TYPE`   | Required Variables           | Description                        |
| ------------------ | ---------------------------- | ---------------------------------- |
| `nkey`             | `NATS_NKEY_SEED`             | Ed25519 NKey — recommended         |
| <sup>`creds`</sup> | `NATS_CREDENTIALS_FILE`      | `.creds` file (JWT + NKey)         |
| `usernamePassword` | `NATS_USER`, `NATS_PASSWORD` | Basic credentials                  |
| `none`             | —                            | No authentication (local dev only) |

***

#### Flow B: Cron Setup

Flow B requires no additional infrastructure. Enable it in `.env` and the agent handles the rest at startup.

```bash
PURGE_CRON_ENABLED=true
PURGE_CRON_TTL_SECONDS=2592000
PURGE_CRON_SCHEDULE=0 * * * *
```

Flow A and Flow B can run simultaneously. When both are enabled, Flow A handles new records proactively and Flow B acts as a safety net for any records missed due to restarts or publish failures.

***

#### Webhook Notifications

When `PURGE_WEBHOOK_ENABLED=true`, the agent sends a `POST` request to your configured `webhookUrl` after each deletion.

**Payload:**

```json
{
  "eventType": "purge.deletion.complete",
  "occurredAt": "2026-04-28T10:00:00.000Z",
  "tenantId": "abc-123",
  "deletion": {
    "recordId": "xyz-456",
    "recordType": "oid4vc_issuance",
    "status": "deleted",
    "deletedAt": "2026-04-28T10:00:00.000Z"
  }
}
```

**`status` values:**

| Value            | Meaning                                      |
| ---------------- | -------------------------------------------- |
| `deleted`        | Record was found and successfully deleted    |
| `already-absent` | Record was already gone (treated as success) |

***

#### Verification

After starting the agent, confirm the purge system is active by checking the startup logs:

**Cron mode:**

```
[Purge][Cron] Scheduler started — schedule="0 * * * *" ttlSeconds=2592000 recordTypes=didcomm_credential, oid4vc_issuance
```

**NATS mode:**

```
[Purge] Provisioning NATS streams...
[Purge] NATS streams ready
[Purge] NatsPurgeScheduler started
```

