---
icon: rectangle-api
---

# Ecosystem APIs

## 1. Overview

The platform is organized into three functional layers, each building upon the one below it:

<table><thead><tr><th width="230.26171875">Layer</th><th>What it contains</th></tr></thead><tbody><tr><td><strong>Users &#x26; Organizations</strong></td><td>Platform users and the organizations they own and manage</td></tr><tr><td><strong>Ecosystems</strong></td><td>Groups of organizations governed and coordinated by an ecosystem lead</td></tr><tr><td><strong>Trust Service</strong></td><td>A centralized registry of trusted entities and their associated X.509 certificates</td></tr></tbody></table>

Users own organizations; organizations can form or join ecosystems; and ecosystems publish trust lists that are consumed during credential issuance and verification workflows.

## 2. Users & Organizations

The platform supports multiple concurrent users. Each user can create and own one or more organizations, each operating as a fully independent unit.

Every organization is capable of:

* Creating and managing its own **digital wallet**
* **Issuing** verifiable credentials to holders
* **Verifying** credentials presented by holders during interactions

```
Platform Admin
     ├── User A
     │     ├── Org 1  (Wallet · Issue · Verify)
     │     └── Org 2  (Wallet · Issue · Verify)
     └── User B
           ├── Org 3  (Wallet · Issue · Verify)
           └── Org 4  (Wallet · Issue · Verify)
```

## 3. Ecosystems

An ecosystem is a governed network of organizations coordinated by an **ecosystem lead**. The platform admin initiates this process by designating an organizations as the ecosystem lead. The formation process works in two stages:

{% stepper %}
{% step %}
### Platform Admin → Organizations

The platform administrator sends an invitation to a specific organization, designating it as the ecosystem lead.
{% endstep %}

{% step %}
### Ecosystem Lead → Member Organizations

Once the invitation is accepted, the ecosystem lead can invite other organizations to join as **ecosystem members**.
{% endstep %}
{% endstepper %}

An organization that receives a membership invitation may either:

* **Accept** - and become an active ecosystem member, gaining access to the ecosystem's shared trust data and workflows.
* **Reject** - and remain outside the ecosystem, with no access to its resources.

An ecosystem can include any number of member organizations, enabling large-scale, multi-party credential workflows.

```
Platform Admin
     │  (sends ecosystem invitation)
     ▼
Ecosystem Lead Org
     ├── Member Org 1  ← Accepted invitation
     ├── Member Org 2  ← Accepted invitation
     └── Org C         ← Rejected (not a member)
```

### 3.1. Ecosystem API Reference

This section documents the core API endpoints available for managing ecosystems and their memberships.

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

#### &#x20;3.1.5 Get Ecosystem Invitations<br>

Fetch all the invitation’s sent by platform admin

> **Role required:** Platform Admin

```
GET v1/invitations?pageNumber=1&pageSize=10
```

```json
{
  "statusCode": 200,
  "message": "Ecosystem invitations fetched successfully",
  "data": {
    "totalPages": 1,
    "data": [
      {
        "id": "72d6fa97-42b6-46df-bd92-df44e5d8ebd7",
        "email": "testuser@yopmail.com",
        "status": "accepted",
        "userId": "c7e85d96-4bcc-4f6a-8d76-ae977daf0c43",
        "type": "ecosystem",
        "ecosystemId": "0eae279b-1a4e-4f37-9472-4742cd7233c6",
        "invitedOrg": "1a574a6b-f535-4197-ab4c-a8d2fcb3d139",
        "createDateTime": "2026-05-06T07:07:18.545Z",
        "createdBy": "b1f6b53c-9155-40c2-96a9-9cb144dafe49",
        "lastChangedDateTime": "2026-05-06T07:07:18.545Z",
        "lastChangedBy": "b1f6b53c-9155-40c2-96a9-9cb144dafe49",
        "deletedAt": null,
        "ecosystem": {
          "id": "0eae279b-1a4e-4f37-9472-4742cd7233c6",
          "name": "Test Eco",
          "description": "description",
          "createDateTime": "2026-05-06T07:07:41.360Z"
        },
        "organisation": {
          "name": "Other Wallet"
        }
      }
    ]
  }
}

```

#### 3.1.6 Check if Ecosystem feature is enabled/disabled <a href="#id-316-check-ecosystem-feature-enableddisabled" id="id-316-check-ecosystem-feature-enableddisabled"></a>

```
GET /v1/ecosystem/status
```

Used for checking the Ecosystem feature if enabled or disabled

#### 3.1.7 Overview Summary for platform admin <a href="#id-317-overview-summary-for-platform-admin" id="id-317-overview-summary-for-platform-admin"></a>

```
GET /v1/ecosystem/dashboard/summary
```

> **Role required:** Platform Admin

Provides a summary count for actions performed in Admin portal

```json
{
  "statusCode": 200,
  "message": "Dashboard data for ecosystem fetched successfully",
  "data": {
    "ecosystem": 1,
    "invitations": 1,
    "activeOrgs": 1
  }
}
```

#### 3.1.8 Get all Ecosystem’s for Organizations <a href="#id-318-get-all-ecosystems-for-organization" id="id-318-get-all-ecosystems-for-organization"></a>

Fetch all ecosystem’s related to the organization may it be a ecosystem member or ecosystem Lead.

```
GET /v1/ecosystem
```

```json
{
  "statusCode": 200,
  "message": "All Ecosystems fetched successfully",
  "data": {
    "totalPages": 1,
    "data": [
      {
        "id": "0eae279b-1a4e-4f37-9472-4742cd7233c6",
        "name": "Zxaes",
        "description": "Zwe sd",
        "memberCount": 1,
        "role": "Ecosystem Lead",
        "leadOrg": {
          "id": "1a574a6b-f535-4197-ab4c-a8d2fcb3d139",
          "name": "Other Wallet"
        }
      }
    ]
  }
}
```

#### 3.1.9 Get Ecosystem Members <a href="#id-319-get-ecosystem-members" id="id-319-get-ecosystem-members"></a>

> **Role required:** Ecosystem Lead

Fetch all member’s belonging to a particular ecosystem.

```
GET /v1/ecosystem/members
```

```json
{
  "statusCode": 200,
  "message": "Ecosystem members fetched successfully",
  "data": {
    "totalPages": 1,
    "data": [
      {
        "id": "eeea0842-9054-450a-9c98-49dff6968681",
        "status": "ACTIVE",
        "createDateTime": "2026-05-06T08:22:54.449Z",
        "ecosystem": {
          "id": "0eae279b-1a4e-4f37-9472-4742cd7233c6",
          "name": "Zxaes"
        },
        "organisation": {
          "id": "b0105fc4-f9b2-43ab-b069-a659d239a55b",
          "name": "Member org"
        },
        "user": {
          "id": "ed4cfec4-7328-419c-9986-5c5679514c5b",
          "email": "Testuser@yopmail.com"
        }
      }
    ]
  }
}
```

### 3.2. Intent

An **Intent** represents a named business workflow or use case within an ecosystem - for example, "Airport Boarding" or "Age Verification at a Venue." Ecosystem leads define intents to establish the purpose and context of credential-based interactions, enabling all participating organizations to align on the goals of each workflow.

Each intent can optionally have:

* An **Intent Template** - defining which credential templates are required as part of this workflow (section 3.2.5).
* An **Intent Notice** - a formal consent notice informing data subjects of how their personal data will be processed (section 3.2.6).

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

#### 3.2.2 Get All Intents

Retrieves a paginated list of all intents defined within a given ecosystem. Useful for displaying available workflows to ecosystem participants.

> **Role required:** Ecosystem Lead

**Endpoint**

```
GET /v1/intent/ecosystem/{ecosystemId}?pageNumber=1&pageSize=10
```

**Query Parameters**

<table><thead><tr><th width="124.921875">Parameter</th><th width="99.89453125">Type</th><th width="107.578125">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>pageNumber</code></td><td>integer</td><td>No</td><td>The page number to retrieve (default: <code>1</code>)</td></tr><tr><td><code>pageSize</code></td><td>integer</td><td>No</td><td>The number of records per page (default: <code>10</code>)</td></tr></tbody></table>

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

#### 3.2.3 Get Intent by ID

Retrieves the full details of a specific intent using its unique identifier. This is typically used when loading the details of a selected workflow for review or configuration.

**Endpoint**

```
GET /v1/intent/{intentId}
```

**Path Parameters**

<table><thead><tr><th width="125.28125">Parameter</th><th width="100.16796875">Type</th><th width="107.84765625">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>intentId</code></td><td>UUID</td><td>Yes</td><td>The unique identifier of the intent to retrieve</td></tr></tbody></table>

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

#### 3.2.4 Update Intent

Updates the name or description of an existing intent. This endpoint allows the ecosystem lead to refine a workflow definition after it has been created.

> **Role required:** Ecosystem Lead

**Endpoint**

```
PUT /v1/intent/{intentId}
```

**Path Parameters**

<table><thead><tr><th width="125.0078125">Parameter</th><th width="99.6796875">Type</th><th width="107.58984375">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>intentId</code></td><td>UUID</td><td>Yes</td><td>The unique identifier of the intent to update</td></tr></tbody></table>

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

#### 3.2.5 Intent Template

An **Intent Template** links one or more credential templates to a specific intent, defining which credential types are required as part of that workflow. For example, the "Boarding" intent may require a Passport (Photo ID) credential template to be presented and verified at the gate.

Ecosystem leads use these endpoints to associate, retrieve, and update the credential templates tied to a given intent.

**3.2.5.1 Create Intent Template (Map intent to template)**

Associates a credential template with a specific intent.

> **Role required:** Ecosystem Lead

**Endpoint**

```
POST /v1/intent/{intentId}/template
```

**Path Parameters**

<table><thead><tr><th width="124.81640625">Parameter</th><th width="99.703125">Type</th><th width="107.6640625">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>intentId</code></td><td>UUID</td><td>Yes</td><td>The unique identifier of the intent to which the template is to be linked</td></tr></tbody></table>

**Request Body**

```json
{
  "templateId": "{templateId}",
  "role": "verifier",
  "description": "Passport credential required for boarding gate verification"
}
```

**Key Fields**

<table><thead><tr><th width="144.85546875">Field</th><th>Description</th></tr></thead><tbody><tr><td><code>templateId</code></td><td>The unique identifier of the credential template to associate with this intent</td></tr><tr><td><code>role</code></td><td>The role this template serves within the intent: <code>issuer</code> or <code>verifier</code></td></tr><tr><td><code>description</code></td><td>An optional description of why this template is required in this workflow</td></tr></tbody></table>

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

**3.2.5.2 Get Intent Templates**

Retrieves all credential templates associated with a specific intent. This is used to determine which credentials are required or expected within a given workflow.

> **Role required:** Ecosystem Lead

**Endpoint**

```
GET /v1/intent/{intentId}/template
```

**Path Parameters**

<table><thead><tr><th width="125.3125">Parameter</th><th width="99.71875">Type</th><th width="107.82421875">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>intentId</code></td><td>UUID</td><td>Yes</td><td>The unique identifier of the intent whose templates are to be retrieved</td></tr></tbody></table>

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

**3.2.5.3 Update Intent Template**

Updates the role or description of a credential template already associated with an intent. Use this endpoint when the purpose or usage of a template within a workflow changes.

> **Role required:** Ecosystem Lead

**Endpoint**

```
PUT /v1/intent/{intentId}/template/{intentTemplateId}
```

**Path Parameters**

<table><thead><tr><th width="165.2734375">Parameter</th><th width="100.29296875">Type</th><th width="108.30078125">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>intentId</code></td><td>UUID</td><td>Yes</td><td>The unique identifier of the intent</td></tr><tr><td><code>intentTemplateId</code></td><td>UUID</td><td>Yes</td><td>The unique identifier of the intent-template association to update</td></tr></tbody></table>

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

#### 3.2.6 Intent Notice

An **Intent Notice** is a formal consent notice linked to a specific intent. It informs data subjects of how their personal data will be collected, processed, and used within the context of a particular ecosystem workflow. Each intent can have one associated notice.

The intent notice is aligned with **ISO/IEC TS 27560** and the **Data Privacy Vocabulary (DPV)** standards, ensuring compliance with global best practices for privacy and consent management.

**3.2.6.1 Create Intent Notice (Map intent to notice)**

Creates a new consent notice and associates it with a specific intent.

> **Role required:** Ecosystem Lead

**Endpoint**

```
POST /v1/intent/{intentId}/notice
```

**Path Parameters**

<table><thead><tr><th width="125.17578125">Parameter</th><th width="99.80078125">Type</th><th width="108.3046875">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>intentId</code></td><td>UUID</td><td>Yes</td><td>The unique identifier of the intent to which the notice is to be linked</td></tr></tbody></table>

**3.2.6.2 Get Intent Notice by Intent ID**

Retrieves the consent notice associated with a specific intent. This endpoint is used to display the current notice to participants or to review its contents before issuance or verification.

> **Role required:** Ecosystem Lead and Member

**Endpoint**

```
GET /v1/intent/{intentId}/notice
```

**Path Parameters**

<table><thead><tr><th width="125.34765625">Parameter</th><th width="100.09375">Type</th><th width="106.19140625">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>intentId</code></td><td>UUID</td><td>Yes</td><td>The unique identifier of the intent whose notice is to be retrieved</td></tr></tbody></table>

**3.2.6.3 Update Intent Notice**

Updates an existing consent notice linked to a specific intent. Use this endpoint when the terms, policies, or data processing rules of a workflow have changed and the notice needs to reflect the latest information.

> **Note:** Updating a notice typically results in a new version being issued. Participants who previously accepted the older version may be may not effect, depending on the platform's consent management policy.

> **Role required:** Ecosystem Lead and Member

**Endpoint**

```
PUT /v1/intent/{intentId}/notice
```

**Path Parameters**

<table><thead><tr><th width="124.83203125">Parameter</th><th width="99.5703125">Type</th><th width="108.15625">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>intentId</code></td><td>UUID</td><td>Yes</td><td>The unique identifier of the intent whose notice is to be updated</td></tr></tbody></table>
