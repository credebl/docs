# OID4VP Verifier API

## Create Verifier

**`POST`** `/v1/orgs/{orgId}/oid4vp/verifier`

Creates a new verifier within the specified organization. A verifier is an entity that requests and validates Verifiable Presentations (VPs) from credential holders using the OID4VP protocol.

---

## Path Parameters

| Parameter | Type   | Description                                        |
|-----------|--------|----------------------------------------------------|
| `orgId`   | string | The unique identifier of the organization.         |

---

## Request Body

**Content-Type:** `application/json`

| Field            | Type   | Required | Description                                                                                                                              |
|------------------|--------|----------|------------------------------------------------------------------------------------------------------------------------------------------|
| `verifierId`     | string | Yes      | A unique name or identifier for the verifier within the organization. Used to reference the verifier in subsequent API calls (e.g. `"verifier-12345"`). |
| `clientMetadata` | object | No       | Display and branding information about the verifier application, presented to the holder when a presentation request is received. See [Client Metadata Object](#client-metadata-object) below. |

---

## Client Metadata Object

| Field         | Type         | Required | Description                                                                                     |
|---------------|--------------|----------|-------------------------------------------------------------------------------------------------|
| `client_name` | string       | No       | Human-readable name of the verifier application shown to the holder (e.g. `"Example Verifier App"`). |
| `logo_uri`    | string (URL) | No       | URL of the verifier's logo image displayed to the holder during a presentation request.         |

---

## Sample Request Payload

```json
{
  "verifierId": "verifier-12345",
  "clientMetadata": {
    "client_name": "Example Verifier App",
    "logo_uri": "https://example.com/logo.png"
  }
}
```

---

## Notes

- `verifierId` must be unique per organization. Attempting to create a verifier with a duplicate ID will return a conflict error.
- `clientMetadata` is optional but recommended — it provides the holder's wallet with context about who is requesting the presentation, improving trust and user experience.

---

# OID4VP Verification Template API

## Create Verification Template

**`POST`** `/v1/orgs/{orgId}/oid4vp/verification-template`

Creates a new verification template for the specified organization. A verification template defines the credential query rules (using the DCQL standard) and signing configuration for a Verifiable Presentation (VP) request. Once created, the template can be assigned by an ecosystem lead to specific intents as needed.

---

## Path Parameters

| Parameter | Type   | Description                                        |
|-----------|--------|----------------------------------------------------|
| `orgId`   | string | The unique identifier of the organization.         |

---

## Request Body

**Content-Type:** `application/json`

| Field          | Type   | Required | Description                                                                                                                                                                   |
|----------------|--------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`         | string | Yes      | Human-readable name for the verification template (e.g. `"Verification Template"`).                                                                                          |
| `templateJson` | object | Yes      | Contains the DCQL query definition that specifies which credentials and claims are required from the holder. See [Template JSON Object](#template-json-object) below.          |
| `signerOption` | string | Yes      | Specifies the signing method used to sign the VP request sent to the holder's wallet. See [Signer Options](#signer-options) below.                                            |

---

## Signer Options

| Value          | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| `DID`          | Signs the VP request using a Decentralized Identifier (DID).            |
| `X509_P256`    | Signs the VP request using an X.509 certificate with P-256 key type.   |
| `X509_ED25519` | Signs the VP request using an X.509 certificate with Ed25519 key type. |

---

## Template JSON Object

| Field  | Type   | Required | Description                                                                                           |
|--------|--------|----------|-------------------------------------------------------------------------------------------------------|
| `dcql` | object | Yes      | Wrapper for the DCQL (Digital Credentials Query Language) query definition. See [DCQL Query](#dcql-query) below. |

---

## DCQL Query

The `dcql.query` object defines which credentials are required from the holder and how they are evaluated.

| Field              | Type   | Required | Description                                                                                                                                   |
|--------------------|--------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `combine`          | string | Yes      | Logical operator for evaluating the credential set. `"all"` requires all specified credential sets to be satisfied.                           |
| `credentials`      | array  | Yes      | Array of individual credential query definitions. See [Credential Query Object](#credential-query-object) below.                              |
| `credential_sets`  | array  | No       | Groups credential queries into sets with flexible options. Allows the verifier to accept alternative credentials. See [Credential Set Object](#credential-set-object) below. |

---

## Credential Query Object

Each entry in the `credentials` array defines a query for a specific credential the verifier wants to receive.

| Field                               | Type    | Required | Description                                                                                                                                        |
|-------------------------------------|---------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`                                | string  | Yes      | A unique identifier for this credential query within the template. Referenced in `credential_sets` to build flexible requirement groups.           |
| `format`                            | string  | Yes      | The expected credential format. Supported values: `dc+sd-jwt`, `mso_mdoc`.                                                                        |
| `meta`                              | object  | No       | Format-specific metadata to match the credential type. See [Meta Object](#meta-object) below.                                                      |
| `claims`                            | array   | No       | Array of specific claims the verifier is requesting from the credential. See [Claim Object](#claim-object) below.                                  |
| `require_cryptographic_holder_binding` | boolean | No    | If `true`, the wallet must prove cryptographic control of the credential (i.e. the holder must sign the presentation). Recommended to set `true`. |

### Meta Object

The `meta` object provides credential-type matching criteria and differs by format.

| Format      | Field           | Type            | Description                                                                                   |
|-------------|-----------------|-----------------|-----------------------------------------------------------------------------------------------|
| `mso_mdoc`  | `doctype_value` | string          | The mdoc document type to match (e.g. `"org.iso.23220.photoid.1"`).                         |
| `dc+sd-jwt` | `vct_values`    | array of string | Array of acceptable Verifiable Credential Type values (e.g. `["BirthCertificate-sdjwt"]`).  |

### Claim Object

Each entry in the `claims` array specifies a single claim the verifier wants disclosed from the credential.

| Field              | Type    | Required | Description                                                                                                                                                    |
|--------------------|---------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `path`             | array   | Yes      | JSON path to the claim within the credential. For `mso_mdoc`, the first element is the namespace and the second is the attribute key (e.g. `["org.iso.23220.1", "portrait"]`). For `dc+sd-jwt`, the path is the attribute key (e.g. `["first_name"]`). |
| `intent_to_retain` | boolean | No       | If `true`, the verifier intends to store the disclosed claim value after verification. Should be declared transparently to inform the holder.                  |

---

## Credential Set Object

`credential_sets` allows the verifier to define flexible requirements — for example, accepting either credential A or credential B to satisfy the same requirement.

| Field      | Type    | Required | Description                                                                                                                                                                   |
|------------|---------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `options`  | array   | Yes      | Array of options, where each option is an array of credential query `id` values. The holder must satisfy at least one option. Each option is a combination of credential IDs that together fulfil the requirement. |
| `required` | boolean | Yes      | If `true`, the holder must satisfy at least one of the listed options. If `false`, the set is optional.                                                                       |

---

## Sample Request Payload

```json
{
  "name": "Verification Template",
  "templateJson": {
    "dcql": {
      "query": {
        "combine": "all",
        "credentials": [
          {
            "id": "orgiso23220photoID1",
            "meta": {
              "doctype_value": "org.iso.23220.photoid.1"
            },
            "claims": [
              {
                "path": ["org.iso.23220.1", "portrait"],
                "intent_to_retain": true
              }
            ],
            "format": "mso_mdoc",
            "require_cryptographic_holder_binding": true
          },
          {
            "id": "BirthCertificate-dc_sd_jwt",
            "meta": {
              "vct_values": ["BirthCertificate-sdjwt"]
            },
            "claims": [
              {
                "path": ["first_name"],
                "intent_to_retain": true
              }
            ],
            "format": "dc+sd-jwt",
            "require_cryptographic_holder_binding": true
          }
        ],
        "credential_sets": [
          {
            "options": [
              ["BirthCertificate-dc_sd_jwt"],
              ["orgiso23220photoID1"]
            ],
            "required": true
          }
        ]
      }
    }
  },
  "signerOption": "DID"
}
```

---

## Notes

- Once created, this template is available to the ecosystem lead to assign to specific verification intents.

---

# OID4VP Presentation Request APIs

Two APIs are available for creating a Verifiable Presentation (VP) request. Both return a verification request that is sent to the holder's wallet.

| API | Use Case |
|-----|----------|
| [Intent-Based Verification Presentation](#intent-based-verification-presentation) | Uses a pre-defined intent mapped to a verification template by the ecosystem lead. Recommended for standardized, reusable verification flows. |
| [Create Presentation Request](#create-presentation-request) | Directly specify the DCQL query and configuration without any template or intent. Useful for custom or ad-hoc verification scenarios. |

---

## Intent-Based Verification Presentation

**`POST`** `/v1/orgs/{orgId}/oid4vp/intent-based-verification-presentation`

Creates a VP request using a pre-configured intent. An intent is defined by the ecosystem lead and mapped to a specific verification template. The mapping may be global (shared across organizations) or organization-specific depending on the use case.

### Path Parameters

| Parameter | Type   | Description                                        |
|-----------|--------|----------------------------------------------------|
| `orgId`   | string | The unique identifier of the organization.         |

### Query Parameters

| Parameter     | Type   | Required | Description                                                                                        |
|---------------|--------|----------|----------------------------------------------------------------------------------------------------|
| `verifierId`  | string | Yes      | The unique identifier of the verifier making the request.                                          |
| `ecosystemId` | string | Yes      | The unique identifier of the ecosystem. Used to resolve the intent-to-template mapping.            |

### Request Body

**Content-Type:** `application/json`

| Field             | Type   | Required | Description                                                                                                                                                      |
|-------------------|--------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `intent`          | string | Yes      | The intent key defined by the ecosystem lead (e.g. `"kyc-intent"`). Resolved to a specific verification template via the ecosystem's intent-to-template mapping. |
| `responseMode`    | string | Yes      | Defines how the holder's wallet should return the VP response. See [Response Modes](#response-modes) below.                                                      |
| `requestSigner`   | object | Yes      | Configuration for signing the VP request. See [Request Signer Object](#request-signer-object) below.                                                             |
| `expectedOrigins` | array  | No       | Array of allowed origin URLs. Required when `responseMode` is `dc_api` or `dc_api.jwt`. See [Expected Origins](#expected-origins) below.                        |

### Sample Request Payload

```json
{
  "intent": "kyc-intent",
  "responseMode": "direct_post.jwt",
  "requestSigner": {
    "method": "DID",
    "clientIdPrefix": "x509_hash"
  },
  "expectedOrigins": [
    "https://example.com"
  ]
}
```

---

## Create Presentation Request

**`POST`** `/v1/orgs/{orgId}/oid4vp/presentation`

Creates a VP request directly using a specified DCQL query and configuration, without requiring an intent or a pre-built verification template. This provides full flexibility for custom or ad-hoc verification scenarios.

### Path Parameters

| Parameter | Type   | Description                                        |
|-----------|--------|----------------------------------------------------|
| `orgId`   | string | The unique identifier of the organization.         |

### Query Parameters

| Parameter    | Type   | Required | Description                                                       |
|--------------|--------|----------|-------------------------------------------------------------------|
| `verifierId` | string | Yes      | The unique identifier of the verifier making the request.         |

### Request Body

**Content-Type:** `application/json`

| Field             | Type   | Required | Description                                                                                                                                       |
|-------------------|--------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `requestSigner`   | object | Yes      | Configuration for signing the VP request. See [Request Signer Object](#request-signer-object) below.                                             |
| `dcql`            | object | Yes      | The DCQL query defining which credentials and claims are required from the holder. Follows the same structure as `templateJson.dcql.query` in the [Create Verification Template API](#create-verification-template). |
| `responseMode`    | string | Yes      | Defines how the holder's wallet should return the VP response. See [Response Modes](#response-modes) below.                                       |
| `expectedOrigins` | array  | No       | Array of allowed origin URLs. Required when `responseMode` is `dc_api` or `dc_api.jwt`. See [Expected Origins](#expected-origins) below.         |

### Sample Request Payload

```json
{
  "requestSigner": {
    "method": "DID",
    "clientIdPrefix": "x509_hash"
  },
  "dcql": {},
  "responseMode": "direct_post.jwt",
  "expectedOrigins": [
    "https://example.com"
  ]
}
```

---

## Shared Field Reference

### Response Modes

The `responseMode` field controls how the holder's wallet submits the VP response back to the verifier.

| Value            | Description                                                                                                    |
|------------------|----------------------------------------------------------------------------------------------------------------|
| `direct_post`    | The wallet posts the VP response directly to the verifier's endpoint in plain form.                           |
| `direct_post.jwt`| The wallet posts the VP response directly to the verifier's endpoint, signed as a JWT.                        |
| `dc_api`         | The VP response is returned via the Digital Credentials API. `expectedOrigins` is required.                   |
| `dc_api.jwt`     | The VP response is returned via the Digital Credentials API, signed as a JWT. `expectedOrigins` is required.  |

---

### Request Signer Object

Defines how the VP request itself is signed before being sent to the holder's wallet.

| Field            | Type   | Required | Description                                                                                                                                              |
|------------------|--------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `method`         | string | Yes      | The signing method for the VP request. See [Signer Methods](#signer-methods) below.                                                                     |
| `clientIdPrefix` | string | No       | Applicable only for X.509-based methods. Specifies the client ID prefix format. See [Client ID Prefix](#client-id-prefix) below.                        |

#### Signer Methods

| Value          | Description                                                              |
|----------------|--------------------------------------------------------------------------|
| `DID`          | Signs the VP request using a Decentralized Identifier (DID).            |
| `X509_P256`    | Signs the VP request using an X.509 certificate with P-256 key type.   |
| `X509_ED25519` | Signs the VP request using an X.509 certificate with Ed25519 key type. |

#### Client ID Prefix

Only applicable when `method` is `X509_P256` or `X509_ED25519`.

| Value           | Description                                                                              |
|-----------------|------------------------------------------------------------------------------------------|
| `x509_san_dns`  | The client ID is derived from the Subject Alternative Name (SAN) DNS entry of the X.509 certificate. |
| `x509_hash`     | The client ID is derived from a hash of the X.509 certificate.                          |

---

### Expected Origins

`expectedOrigins` is an array of origin URLs (e.g. `["https://example.com"]`) that are permitted to receive the VP response when using the Digital Credentials API response modes (`dc_api` or `dc_api.jwt`). `expectedOrigins` must be specified to ensure the VP response is only accepted from trusted web origins.

- **Required** when `responseMode` is `dc_api` or `dc_api.jwt`.
- **Not applicable** for `direct_post` or `direct_post.jwt` modes.

---

## Notes

- **Intent resolution:** An intent may be mapped globally across all organizations in an ecosystem, or scoped to a specific organization. The `ecosystemId` query parameter determines the resolution scope.
- `clientIdPrefix` is only relevant for X.509-based `method` values (`X509_P256`, `X509_ED25519`). It has no effect when `method` is `DID`.
- When using `dc_api` or `dc_api.jwt` response modes, `expectedOrigins` must be specified to ensure the VP response is only accepted from trusted web origins.

---

# OID4VP Verifier Presentation Status APIs

Two APIs are available for retrieving the status and details of a verification session after a presentation request has been created.

| API | Use Case |
|-----|----------|
| [Get Verifier Presentation](#get-verifier-presentation) | Retrieves the record details and current status of one or all presentation sessions for an organization. |
| [Get Verifier Presentation Response](#get-verifier-presentation-response) | Retrieves the actual VP response data submitted by the holder. Only available once the session status is `ResponseVerified`. |

---

## Get Verifier Presentation

**`GET`** `/v1/orgs/{orgId}/oid4vp/verifier-presentation`

Retrieves details of all OID4VP verifier presentations or a single presentation by its ID for the specified organization. Returns the record details and current status of the session — it does **not** include the actual presentation data received from the holder.

### Path Parameters

| Parameter | Type   | Required | Description                                        |
|-----------|--------|----------|----------------------------------------------------|
| `orgId`   | string | Yes      | The unique identifier of the organization.         |

### Query Parameters

| Parameter                | Type   | Required | Description                                                                                    |
|--------------------------|--------|----------|------------------------------------------------------------------------------------------------|
| `publicVerifierId`       | string | No       | Public identifier of the verifier. Used to filter presentations by a specific verifier.        |
| `payloadState`           | string | No       | Opaque payload state value set by the client or verifier. Used to correlate sessions.         |
| `state`                  | string | No       | Filter by the current presentation session state. See [Presentation States](#presentation-states) below. |
| `authorizationRequestUri`| string | No       | The authorization request URI associated with the session (if present).                        |
| `authorizationRequestId` | string | No       | The public ID of the authorization request.                                                    |
| `nonce`                  | string | No       | Nonce value associated with the presentation session.                                          |
| `id`                     | string | No       | Optional ID to target and retrieve a specific presentation record.                             |

### Presentation States

The `state` query parameter can be used to filter sessions by their current status in the verification lifecycle.

| Value               | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| `RequestCreated`    | The VP request has been created but not yet scanned or accepted by the holder. |
| `RequestUriRetrieved`   | The holder's wallet has received the VP request.                      |
| `ResponseVerified`  | The VP response has been successfully verified. Presentation data is now accessible via the [Get Verifier Presentation Response](#get-verifier-presentation-response) API. |
| `Error`            | The verification session failed.                                            |

---

## Get Verifier Presentation Response

**`GET`** `/v1/orgs/{orgId}/oid4vp/verifier-presentation-response`

Retrieves the actual Verifiable Presentation data submitted by the holder and received at the verifier agent. **This API is only available when the session status is `ResponseVerified`.** Calling it before that state will give error and not return presentation data.

### Path Parameters

| Parameter | Type   | Required | Description                                        |
|-----------|--------|----------|----------------------------------------------------|
| `orgId`   | string | Yes      | The unique identifier of the organization.         |

### Query Parameters

| Parameter                    | Type   | Required | Description                                                                                          |
|------------------------------|--------|----------|------------------------------------------------------------------------------------------------------|
| `verificationPresentationId` | string | Yes      | The ID of the verification presentation session whose response data is to be retrieved.              |

---

## Notes

- **Use the correct API for the right stage:** Use [Get Verifier Presentation](#get-verifier-presentation) to poll the session status during the verification flow. Only call [Get Verifier Presentation Response](#get-verifier-presentation-response) once the session state is `ResponseVerified`.
- The `id` query parameter on the Get Verifier Presentation API can be used to fetch a single specific session record instead of listing all sessions.
- The `authorizationRequestId` is shared across session from verifier to holder so we treat it as sessionId/threadId in any functional usecases.

---

# OID4VP Verify Authorization Response API(DC API flow)

## Verify Authorization Response

**`POST`** `/v1/orgs/{orgId}/oid4vp/verify-authorization-response`

Submits the authorization response received on the browser back to the verifier system to update the associated verification session. This API is specific to the **DC API flow** (`dc_api` and `dc_api.jwt` response modes), where the holder's wallet returns the Verifiable Presentation directly to the browser rather than posting it to the verifier's endpoint.

The verifier backend receives the browser-side `authorizationResponse` object and forwards it via this API. The agent then verifies the presentation data and updates the verification session state accordingly.

---

## Path Parameters

| Parameter | Type   | Description                                        |
|-----------|--------|----------------------------------------------------|
| `orgId`   | string | The unique identifier of the organization.         |

---

## Request Body

**Content-Type:** `application/json`

| Field                   | Type   | Required | Description                                                                                                                                                                            |
|-------------------------|--------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `verificationSessionId` | string | Yes      | The ID of the verification session to update. This links the browser-received response to the correct pending session.                                                                 |
| `authorizationResponse` | object | Yes      | The raw authorization response object received on the browser from the Digital Credentials API. Pass this object directly without modification. See [Authorization Response](#authorization-response-object) below. |
| `origin`                | string | Yes      | The origin of the browser page that received the authorization response (e.g. `"https://example.com"`). Must match one of the `expectedOrigins` configured in the presentation request. |

---

## Authorization Response Object

The `authorizationResponse` is the raw object returned by the Digital Credentials API on the browser. It should be forwarded to this API as-is, without any transformation.

Its structure depends on the credential format and response mode used in the original presentation request. An example for a `dc_api.jwt` flow with an mdoc credential:

```json
"authorizationResponse": {
  "id_token": {
    "Passport": [
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    ]
  }
}
```

| Field      | Type   | Description                                                                                                        |
|------------|--------|--------------------------------------------------------------------------------------------------------------------|
| `id_token` | object | Map of credential identifier to an array of JWT tokens representing the holder's Verifiable Presentation response. |

---

## Sample Request Payload

```json
{
  "verificationSessionId": "93e156ca-a6b9-46ea-913d-f499be167d02",
  "authorizationResponse": {
    "id_token": {
      "Passport": [
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tL2F1dGgvdjEvcmVhbG0tY3JlZGVibCIsInN1YiI6IjEyMzQ1Njc4OTAiLCJhdWQiOiJhdXRoLWNlbnRlci1pZCIsImV4cCI6MTY5ODAwMDAwMCwiaWF0IjoxNjk3OTk2NDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      ]
    }
  },
  "origin": "https://example.com"
}
```

---

## Notes

- The `authorizationResponse` object must be passed exactly as received from the browser's Digital Credentials API. Do not modify or re-encode the object before forwarding it.
- On success, the agent verifies the presentation data and transitions the verification session state to `ResponseVerified`. The verified presentation data can then be retrieved via the [Get Verifier Presentation Response API](#get-verifier-presentation-response).

---

```mermaid
sequenceDiagram
    title OpenID4VP Proof Presentation Flow

    participant VS as Verifier Service
    participant CR as CREDEBL
    participant VA as Verifier Agent
    participant MB as Mobile App / Browser

    Note over VS,MB: Phase 1 — Verification Session Request

    VS->>CR: Create verification session request
    CR->>VA: Initiate verification session
    Note over VA: Create OID4VP request
    VA-->>CR: Return OID4VP request URL
    CR-->>VS: Return OID4VP request URL

    Note over VS,MB: Phase 2 — User Interaction & Proof Submission

    VS->>MB: Render OID4VP request (URL / QR / deep link / DCAPI)
    MB->>VA: Submit VP (proof response)
    Note over VA: Verify proof credentials

    Note over VS,MB: Phase 3 — Webhook Callbacks & State Update

    VA-->>CR: Webhook: proof.state_changed
    CR-->>VS: Webhook: proof verified / error
    Note over VS: Update request state

    Note over VS: Final state: ResponseVerified / Error / RequestCreated
```