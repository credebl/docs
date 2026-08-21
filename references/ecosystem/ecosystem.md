# CREDEBL Platform — Ecosystem and Trust Service

---

## Table of Contents

1. [Overview](#1-overview)
2. [Users & Organizations](#2-users-organizations)
3. [Ecosystems](#3-ecosystems)
   - 3.1 [Ecosystem API Reference](#31-ecosystem-api-reference)
     - 3.1.1 [Create Ecosystem Invitation (Platform Admin)](#311-create-ecosystem-invitation-platform-admin)
     - 3.1.2 [Create Ecosystem](#312-create-ecosystem)
     - 3.1.3 [Invite Organizations](#313-invite-organizations)
     - 3.1.4 [Accept or Reject Invitation](#314-accept-or-reject-invitation)
   - 3.2 [Intent](#32-intent)
     - 3.2.1 [Create Intent](#321-create-intent)
     - 3.2.2 [Get All Intents](#322-get-all-intents)
     - 3.2.3 [Get Intent by ID](#323-get-intent-by-id)
     - 3.2.4 [Update Intent](#324-update-intent)
     - 3.2.5 [Intent Template](#325-intent-template)
       - 3.2.5.1 [Create Intent Template](#3251-create-intent-template)
       - 3.2.5.2 [Get Intent Templates](#3252-get-intent-templates)
       - 3.2.5.3 [Update Intent Template](#3253-update-intent-template)
     - 3.2.6 [Intent Notice](#326-intent-notice)
       - 3.2.6.1 [Create Intent Notice](#3261-create-intent-notice)
       - 3.2.6.2 [Get Intent Notice by Intent ID](#3262-get-intent-notice-by-intent-id)
       - 3.2.6.3 [Update Intent Notice](#3263-update-intent-notice)

---

## 1. Overview

The platform is organized into three functional layers, each building upon the one below it:

| Layer | What it contains |
|---|---|
| **Users & Organizations** | Platform users and the organizations they own and manage |
| **Ecosystems** | Groups of organizations governed and coordinated by an ecosystem lead |
| **Trust Service** | A centralized registry of trusted entities and their associated X.509 certificates |

Users own organizations; organizations can form or join ecosystems; and ecosystems publish trust lists that are consumed during credential issuance and verification workflows.

---

## 2. Users & Organizations

The platform supports multiple concurrent users. Each user can create and own one or more organizations, each operating as a fully independent unit.

Every organization is capable of:

- Creating and managing its own **digital wallet**
- **Issuing** verifiable credentials to holders
- **Verifying** credentials presented by holders during interactions

```
Platform Admin
     │
     ├── User A
     │     ├── Org 1  (Wallet · Issue · Verify)
     │     └── Org 2  (Wallet · Issue · Verify)
     │
     └── User B
           ├── Org 3  (Wallet · Issue · Verify)
           └── Org 4  (Wallet · Issue · Verify)
```

---

## 3. Ecosystems

An ecosystem is a governed network of organizations coordinated by an **ecosystem lead**. The platform admin initiates this process by designating an organization as the ecosystem lead. The formation process works in two stages:

1. **Platform Admin → Organization:** The platform administrator sends an invitation to a specific organization, designating it as the ecosystem lead.
2. **Ecosystem Lead → Member Organizations:** Once the invitation is accepted, the ecosystem lead can invite other organizations to join as **ecosystem members**.

An organization that receives a membership invitation may either:

- **Accept** — and become an active ecosystem member, gaining access to the ecosystem's shared trust data and workflows.
- **Reject** — and remain outside the ecosystem, with no access to its resources.

An ecosystem can include any number of member organizations, enabling large-scale, multi-party credential workflows.

```
Platform Admin
     │
     │  (sends ecosystem invitation)
     ▼
Ecosystem Lead Org
     │
     ├── Member Org 1  ← Accepted invitation
     ├── Member Org 2  ← Accepted invitation
     └── Org C         ← Rejected (not a member)
```

---

### 3.1. Ecosystem API Reference

This section documents the core API endpoints available for managing ecosystems and their memberships.

---

#### 3.1.1 Create Ecosystem Invitation (Platform Admin)

This endpoint allows the platform administrator to invite a user (by email) to create and lead a new ecosystem.

**Endpoint**

```
POST /v1/invitations
```

**Request Body**

```json
{
  "email": "user@example.com"
}
```

**Response**

```json
{
  "statusCode": 201,
  "message": "Ecosystem created successfully",
  "data": {
    "id": "{invitationId}",
    "name": "ecosystem 1",
    "description": "ecosystem 1",
    "tags": null,
    "autoEndorsement": false,
    "logoUrl": null,
    "createdBy": "{userId}",
    "createDateTime": "2026-02-05T11:24:03.046Z"
  }
}
```

> **Note:** The platform admin can also fetch all ecosystem invitations created by the currently authenticated user using the appropriate listing endpoint.

---

#### 3.1.2 Create Ecosystem

Once invited, the designated organization uses this endpoint to formally create and configure the ecosystem.
> **Role required:** Organization Owner

**Endpoint**

```
POST /v1/ecosystem/{orgId}/create
```

**Request Body**

```json
{
  "name": "ecosystem 1",
  "description": "ecosystem 1"
}
```

**Response**

```json
{
  "statusCode": 201,
  "message": "Ecosystem invitations sent"
}
```

---

#### 3.1.3 Invite Organizations

Once the ecosystem is established, the ecosystem lead can invite other platform organizations to join as members. This endpoint initiates a membership invitation for a specific organization.
> **Role required:** Ecosystem Lead

**Endpoint**

```
POST /v1/ecosystem/invite-member
```

**Request Body**

```json
{
  "orgId": "{orgId}",
  "ecosystemId": "{ecosystemId}"
}
```

**Response**

```json
{
  "statusCode": 201,
  "message": "Invitation sent successfully for the member"
}
```

**Check Invitation Status**

To review the list of pending or accepted invitations within an ecosystem, use the following endpoint:

```
GET /v1/ecosystem/invitations?orgId={ecosystemId}&pageNumber=1&pageSize=10&role=Ecosystem%20Member
```

---

#### 3.1.4 Accept or Reject Invitation

The organization owner uses this endpoint to respond to a received ecosystem membership invitation. Upon acceptance, the organization gains access to the ecosystem's shared trust data and can view all other member organizations.
> **Role required:** Ecosystem Member

**Endpoint**

```
POST /v1/ecosystem/update-invitation-status
```

**Request Body**

```json
{
  "status": "accepted",
  "ecosystemId": "{ecosystemId}"
}
```

**Response**

```json
{
  "statusCode": 200,
  "message": "Status for ecosystem invitation updated successfully as accepted"
}
```

**View Member Organizations**

Once an organization has accepted the invitation, it can retrieve the full list of organizations that have joined the same ecosystem using the following endpoint:

```
GET /v1/ecosystem/get-ecosystem-orgs
```

---

### 3.2. Intent

An **Intent** represents a named business workflow or use case within an ecosystem — for example, "Airport Boarding" or "Age Verification at a Venue." Ecosystem leads define intents to establish the purpose and context of credential-based interactions, enabling all participating organizations to align on the goals of each workflow.

Each intent can optionally have:
- An **Intent Template** — defining which credential templates are required as part of this workflow (section 3.2.5).
- An **Intent Notice** — a formal consent notice informing data subjects of how their personal data will be processed (section 3.2.6).

---

#### 3.2.1 Create Intent

Creates a new intent within the specified ecosystem.
> **Role required:** Ecosystem Lead

**Endpoint**

```
POST /v1/intent/ecosystem/{ecosystemId}
```

**Request Body**

```json
{
  "name": "Boarding",
  "description": "Boarding pass intent"
}
```

**Response**

```json
{
  "statusCode": 201,
  "message": "Ecosystem intent created successfully",
  "data": {
    "id": "{intentId}",
    "ecosystemId": "{ecosystemId}",
    "name": "Boarding",
    "description": "Boarding pass intent",
    "createDateTime": "2026-03-30T08:39:25.118Z",
    "createdBy": "{userId}",
    "lastChangedDateTime": "2026-03-30T08:39:25.118Z",
    "lastChangedBy": "{userId}"
  }
}
```

---

#### 3.2.2 Get All Intents

Retrieves a paginated list of all intents defined within a given ecosystem. Useful for displaying available workflows to ecosystem participants.
> **Role required:** Ecosystem Lead

**Endpoint**

```
GET /v1/intent/ecosystem/{ecosystemId}?pageNumber=1&pageSize=10
```

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `pageNumber` | integer | No | The page number to retrieve (default: `1`) |
| `pageSize` | integer | No | The number of records per page (default: `10`) |

**Response**

```json
{
  "statusCode": 200,
  "message": "Ecosystem intents fetched successfully",
  "data": {
    "totalItems": 2,
    "data": [
      {
        "id": "{intentId}",
        "ecosystemId": "{ecosystemId}",
        "name": "Boarding",
        "description": "Boarding pass intent",
        "createDateTime": "2026-03-30T08:39:25.118Z",
        "createdBy": "{userId}",
        "lastChangedDateTime": "2026-03-30T08:39:25.118Z",
        "lastChangedBy": "{userId}"
      }
    ],
    "page": 1,
    "pageSize": 10
  }
}
```

---

#### 3.2.3 Get Intent by ID

Retrieves the full details of a specific intent using its unique identifier. This is typically used when loading the details of a selected workflow for review or configuration.

**Endpoint**

```
GET /v1/intent/{intentId}
```

**Path Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `intentId` | UUID | Yes | The unique identifier of the intent to retrieve |

**Response**

```json
{
  "statusCode": 200,
  "message": "Ecosystem intent fetched successfully",
  "data": {
    "id": "{intentId}",
    "ecosystemId": "{ecosystemId}",
    "name": "Boarding",
    "description": "Boarding pass intent",
    "createDateTime": "2026-03-30T08:39:25.118Z",
    "createdBy": "{userId}",
    "lastChangedDateTime": "2026-03-30T08:39:25.118Z",
    "lastChangedBy": "{userId}"
  }
}
```

---

#### 3.2.4 Update Intent

Updates the name or description of an existing intent. This endpoint allows the ecosystem lead to refine a workflow definition after it has been created.
> **Role required:** Ecosystem Lead

**Endpoint**

```
PUT /v1/intent/{intentId}
```

**Path Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `intentId` | UUID | Yes | The unique identifier of the intent to update |

**Request Body**

```json
{
  "name": "Boarding Updated",
  "description": "Updated boarding pass workflow for international flights"
}
```

**Response**

```json
{
  "statusCode": 200,
  "message": "Ecosystem intent updated successfully",
  "data": {
    "id": "{intentId}",
    "ecosystemId": "{ecosystemId}",
    "name": "Boarding Updated",
    "description": "Updated boarding pass workflow for international flights",
    "createDateTime": "2026-03-30T08:39:25.118Z",
    "createdBy": "{userId}",
    "lastChangedDateTime": "2026-03-31T10:00:00.000Z",
    "lastChangedBy": "{userId}"
  }
}
```

---

#### 3.2.5 Intent Template

An **Intent Template** links one or more credential templates to a specific intent, defining which credential types are required as part of that workflow. For example, the "Boarding" intent may require a Passport (Photo ID) credential template to be presented and verified at the gate.

Ecosystem leads use these endpoints to associate, retrieve, and update the credential templates tied to a given intent.

---

##### 3.2.5.1 Create Intent Template (Map intent to template)

Associates a credential template with a specific intent.
> **Role required:** Ecosystem Lead

**Endpoint**

```
POST /v1/intent/{intentId}/template
```

**Path Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `intentId` | UUID | Yes | The unique identifier of the intent to which the template is to be linked |

**Request Body**

```json
{
  "templateId": "{templateId}",
  "role": "verifier",
  "description": "Passport credential required for boarding gate verification"
}
```

**Key Fields**

| Field | Description |
|---|---|
| `templateId` | The unique identifier of the credential template to associate with this intent |
| `role` | The role this template serves within the intent: `issuer` or `verifier` |
| `description` | An optional description of why this template is required in this workflow |

**Response**

```json
{
  "statusCode": 201,
  "message": "Intent template created successfully",
  "data": {
    "id": "{intentTemplateId}",
    "intentId": "{intentId}",
    "templateId": "{templateId}",
    "role": "verifier",
    "description": "Passport credential required for boarding gate verification",
    "createDateTime": "2026-03-30T09:00:00.000Z",
    "createdBy": "{userId}"
  }
}
```

---

##### 3.2.5.2 Get Intent Templates

Retrieves all credential templates associated with a specific intent. This is used to determine which credentials are required or expected within a given workflow.
> **Role required:** Ecosystem Lead

**Endpoint**

```
GET /v1/intent/{intentId}/template
```

**Path Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `intentId` | UUID | Yes | The unique identifier of the intent whose templates are to be retrieved |

**Response**

```json
{
  "statusCode": 200,
  "message": "Intent templates fetched successfully",
  "data": [
    {
      "id": "{intentTemplateId}",
      "intentId": "{intentId}",
      "templateId": "{templateId}",
      "role": "verifier",
      "description": "Passport credential required for boarding gate verification",
      "createDateTime": "2026-03-30T09:00:00.000Z",
      "lastChangedDateTime": "2026-03-30T09:00:00.000Z"
    }
  ]
}
```

---

##### 3.2.5.3 Update Intent Template

Updates the role or description of a credential template already associated with an intent. Use this endpoint when the purpose or usage of a template within a workflow changes.
> **Role required:** Ecosystem Lead

**Endpoint**

```
PUT /v1/intent/{intentId}/template/{intentTemplateId}
```

**Path Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `intentId` | UUID | Yes | The unique identifier of the intent |
| `intentTemplateId` | UUID | Yes | The unique identifier of the intent-template association to update |

**Request Body**

```json
{
  "role": "issuer",
  "description": "Updated: Passport credential issued during check-in"
}
```

**Response**

```json
{
  "statusCode": 200,
  "message": "Intent template updated successfully",
  "data": {
    "id": "{intentTemplateId}",
    "intentId": "{intentId}",
    "templateId": "{templateId}",
    "role": "issuer",
    "description": "Updated: Passport credential issued during check-in",
    "lastChangedDateTime": "2026-03-31T12:00:00.000Z"
  }
}
```

---

#### 3.2.6 Intent Notice

An **Intent Notice** is a formal consent notice linked to a specific intent. It informs data subjects of how their personal data will be collected, processed, and used within the context of a particular ecosystem workflow. Each intent can have one associated notice.

The intent notice is aligned with **ISO/IEC TS 27560** and the **Data Privacy Vocabulary (DPV)** standards, ensuring compliance with global best practices for privacy and consent management.

---

##### 3.2.6.1 Create Intent Notice (Map intent to notice)

Creates a new consent notice and associates it with a specific intent.
> **Role required:** Ecosystem Lead

**Endpoint**

```
POST /v1/intent/{intentId}/notice
```

**Path Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `intentId` | UUID | Yes | The unique identifier of the intent to which the notice is to be linked |

---

##### 3.2.6.2 Get Intent Notice by Intent ID

Retrieves the consent notice associated with a specific intent. This endpoint is used to display the current notice to participants or to review its contents before issuance or verification.
> **Role required:** Ecosystem Lead and Member

**Endpoint**

```
GET /v1/intent/{intentId}/notice
```

**Path Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `intentId` | UUID | Yes | The unique identifier of the intent whose notice is to be retrieved |

---

##### 3.2.6.3 Update Intent Notice

Updates an existing consent notice linked to a specific intent. Use this endpoint when the terms, policies, or data processing rules of a workflow have changed and the notice needs to reflect the latest information.

> **Note:** Updating a notice typically results in a new version being issued. Participants who previously accepted the older version may or may not be affected, depending on the platform's consent management policy.

> **Role required:** Ecosystem Lead and Member

**Endpoint**

```
PUT /v1/intent/{intentId}/notice
```

**Path Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `intentId` | UUID | Yes | The unique identifier of the intent whose notice is to be updated |

---

*Sections covering the credential **Template** registry and **Cross-Ecosystem Access** are planned for a future update.*

*End of document*
