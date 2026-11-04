# v.2.1.1

Released on **15 October 2025** for Platform, Studio, and Agent controller.

## Platform

### Highlights

* **Session management APIs** — new endpoints to list a user's active sessions (`GET /{userId}/sessions`) and delete one (`DELETE /{sessionId}/sessions`), with validation added on both operations.
* **Client token generation** — a new `POST /{clientId}/token` endpoint issues a token from client credentials, so integrations can authenticate without a user session.

### Fixes

* Updated NestJS to a supported version.
* Fixed Docker build failures caused by the pnpm catalog.
* Resolved cache-related issues.
* Improved `README.md` structure and formatting.

### Changes need to be applied

No new environment variables or configuration values. Rebuild and redeploy the Platform image, then restart the services.

## Studio

### Highlights

* New **subscription management** screens and a reworked billing interface.
* **Session listing and deletion** controls, matching the new Platform APIs.
* Dynamic **theme and logo** customisation, plus an updated app launcher.

### Fixes

* Sensitive values moved from client-side to server-side components.
* IP address added to the headers of the sign-in flow.
* Fixed password encryption in the authentication flow.
* Fixed default theme handling and sign-in redirection.

### Changes need to be applied

No new environment variables. Rebuild and redeploy Studio.

## Agent controller

### Changes

* Updated the bundled Credo controller dependency to `v2.1.1`.

### Changes need to be applied

No new environment variables. Rebuild the agent image.
