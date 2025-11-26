# CREDEBL UI User Guide

**Version:** v0.1 — 2025-11-26

## Introduction

CREDEBL is an open-source Self‑Sovereign Identity (SSI) and Verifiable Credentials platform.  
See the code repository: [CREDEBL Platform](https://github.com/credebl/platform)

This guide helps users navigate the CREDEBL User Interface (UI), perform common tasks, and troubleshoot issues.

## Accessing the Platform

1. Open your browser.
2. Navigate to your environment:
   - Local development: `http://localhost:5000` (default; verify `FRONTEND_PORT` or `FRONTEND_URL` in your README or `.env`)
   - Hosted environment: `https://<your-environment.example.com>` — provided by your administrator
3. Log in using your assigned account:
   - Local dev: document default test credentials and roles in the README (example roles: Administrator, Issuer, Verifier)
   - If no defaults exist, document where to obtain or create seed users (backend README or setup scripts)

## Dashboard Overview

- **Users** — manage users, view credentials, and inspect activity logs (create/edit/delete, assign credentials)
- **Ledger** — view issued credentials, verification history, search by credential ID or DID
- **Organizations** — create/manage organizations, assign roles and credentials
- **Connections** — inspect SSI connections, invitation status, and last activity
- **Issuance & Verification** — issue credentials from templates and verify with detailed results (signature, revocation, schema checks)

## Navigation

- Use the sidebar menu to switch between modules
- Hover over icons to see tooltips explaining their functions
- Tip: Use the global search (top bar) to look up credential IDs and DIDs quickly. Filters accept exact IDs and date ranges
- Use search bars and filters to quickly locate records

## Modules

### Users

- **Add User** — fill required fields (display name, email, unique ID or DID, role) and click Create. Required: name, email, role. Optional: metadata and initial credentials
- **Search Users** — filter by ID, name, email, or DID
- **View Details** — click a user to view credentials, connections, and event history
- **Permission note** — only Administrator or Issuer roles can issue credentials. Document role capabilities in the backend README

### Ledger

- Lists all issued credentials with columns: credential ID, type, issuer, issuance date, and status
- Status values: active, revoked, pending, expired
- Filter and sort by type, status, date range, or issuer

### Organizations

- **Add Organization** — provide name, organization type (issuer, verifier, partner), and assign org admins
- **Manage Credentials** — attach credential templates, assign or revoke credentials for organization members

### Connections

- Shows active SSI connections including status, last activity, and associated users
- To establish a connection, the recipient must accept an invitation (DID exchange). See backend connection API in the repo README
- Use filters to locate connections by connection ID, user, or DID

### Issuance & Verification

**Issue Credential:**

1. Select a credential template
2. Choose recipient (user DID or organization DID)
3. Fill required fields — fields are marked on the form  
   Example payload: `{ "name": "Jane Doe", "email": "jane@example.com", "id": "did:key:z6M..." }`
4. Click Issue Credential — UI shows issuance progress and returns a credential ID. Save the credential ID  

If issuance fails, check issuer service logs and database connectivity

**Verify Credential:**

1. Enter credential ID or upload credential JSON
2. The system validates cryptographic proofs against the ledger/trust anchors
3. The UI displays VALID / INVALID and details of any failing checks (signature, revocation, schema)

## Best Practices

- Verify credential data before issuing to avoid invalid ledger entries
- Required environment variables (document exact names and values in deployment docs):
  - `DATABASE_URL`
  - `LEDGER_URL`
  - `NATS_URL` (or other message broker)
  - `API_GATEWAY_URL`
  - `JWT_SIGNING_KEY` (or OIDC configuration)
- Use HTTPS/TLS and proper authentication in production. Never commit secrets to the repository
- Use test networks and test DIDs for development
- Log and monitor issuer, verifier, ledger, and messaging services for observability
- Restart services if the UI is not reflecting updates (see Troubleshooting)

## Troubleshooting

- **UI not accessible:**
  - Confirm frontend container/process is running (`docker-compose ps | grep frontend`)
  - Check logs: `docker-compose logs -f frontend`
  - Confirm API gateway and microservices are running: `docker-compose logs -f api-gateway`
  - Check browser console for CORS/network errors
- **Credential issuance errors:**
  - Check issuer service logs: `docker-compose logs -f issuer`
  - Look for Prisma/DB errors; confirm `DATABASE_URL` and DB connectivity
  - If schema changed: run migrations (`npx prisma migrate deploy` or `prisma migrate dev`)
- **Verification failures:**
  - Confirm verifier can reach the ledger and has correct trust anchors/public keys
  - Inspect verifier logs for signature or revocation check errors
- **UI shows stale data:** Hard refresh browser (Ctrl+F5), clear cache, or restart frontend container: `docker-compose restart frontend`
- **Message/event-driven issues:** verify NATS or the configured message broker is running and `NATS_URL` is correct

## Known issues & workarounds

- **Credential issuance fails with "database error"**  
  Cause: missing Prisma migrations or wrong `DATABASE_URL`  
  Workaround: run migrations, confirm `DATABASE_URL`, restart services, check issuer logs
- **Connection remains "Pending"**  
  Cause: messaging broker (NATS) down or network misconfiguration  
  Workaround: ensure NATS is running, verify `NATS_URL`, check logs
- **Revocation not reflected in verification**  
  Cause: verifier cache or delayed propagation of revocation events  
  Workaround: restart verifier and confirm revocation events are published and consumed

## Environment & Setup Notes

- **Local dev tips:**
  - Bring up services: `docker-compose up --build`
  - Check running services: `docker-compose ps`
  - Tail logs: `docker-compose logs -f <service-name>`
  - If backend schema changes, run migrations and restart dependent services
- Document any additional env vars or secrets required in the repository README

## Additional Resources

- CREDEBL GitHub Repository: [https://github.com/credebl/platform](https://github.com/credebl/platform)
- Backend Setup & Environment Guide: [README.md](https://github.com/credebl/platform/blob/main/backend/README.md)
- Docker Documentation: [https://docs.docker.com/](https://docs.docker.com/)
- NATS Documentation: [https://docs.nats.io/](https://docs.nats.io/)

---

*This guide is maintained by contributors. To propose changes, open a PR in the credebl/docs repository.*
