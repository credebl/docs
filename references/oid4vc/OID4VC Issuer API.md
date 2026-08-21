---
description: Guide for OpenID for Verifiable Credential Issuance APIs
icon: layer-group
---

# OID4VC Issuer API

## Create Issuer

**`POST`** `/v1/orgs/{orgId}/oid4vc/issuers`

Creates a new issuer within the specified organization. The issuer acts as an identity provider that issues Verifiable Credentials (VCs) to holders using the OID4VC protocol.

---

## Path Parameters

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| `orgId`   | string | The unique identifier of the organization.       |

---

## Request Body

**Content-Type:** `application/json`

| Field                      | Type       | Required | Description                                                                                                                                                                          |
|----------------------------|------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `issuerId`                 | string     | Yes      | A unique name or identifier for the issuer within the organization. Used to identify and reference the issuer in subsequent API calls and credential flows (e.g. `"lemon-corp"`).    |
| `batchCredentialIssuanceSize` | integer | No       | Defines the maximum number of credentials that can be issued in a single batch operation. Reserved for future use — batch credential issuance is not yet supported.                  |
| `display`                  | array      | No       | An array of localized display objects containing the issuer's human-readable information. Presented to credential holders when they receive a credential offer or view a credential. |
| `authorizationServerUrl`   | string (URL) | Yes    | The URL of the authorization server for this issuer. Must be the agent endpoint URL, which is referenced during the credential offer flow to authorize and issue credentials.         |
| `authorizationServerConfigs` | object   | No       | Configuration for an external Identity Provider (IDP) used to authenticate users during the offer creation flow. Omit this field if user authentication via an IDP is not required.  |

---

## `display[]` — Object Fields

| Field          | Type        | Required | Description                                                           |
|----------------|-------------|----------|-----------------------------------------------------------------------|
| `locale`       | string      | Yes      | BCP-47 language tag for this display entry (e.g. `"en"`, `"fr"`).   |
| `name`         | string      | Yes      | The display name of the issuer shown to credential holders.           |
| `description`  | string      | No       | A short description of the issuer organization.                       |
| `logo.uri`     | string (URL)| No       | URL pointing to the issuer's logo image (SVG or PNG recommended).    |
| `logo.alt_text`| string      | No       | Accessibility alt text for the logo image.                            |

---

## `authorizationServerConfigs` — Object Fields

This object is used when the issuer wants to authenticate a user during the offer creation flow via an external IDP server.

| Field                                | Type   | Required | Description                                                                                 |
|--------------------------------------|--------|----------|---------------------------------------------------------------------------------------------|
| `issuer`                             | string | Yes      | The issuer URL of the external IDP (e.g. a Keycloak realm URL).                            |
| `clientAuthentication.clientId`      | string | Yes      | The client ID registered with the IDP for this issuer server.                              |
| `clientAuthentication.clientSecret`  | string | Yes      | The client secret associated with the `clientId` for authenticating with the IDP.          |

---

## Sample Request Payload

```json
{
  "issuerId": "lemon-corp",
  "batchCredentialIssuanceSize": 50,
  "display": [
    {
      "locale": "en",
      "name": "Lemon Corp",
      "description": "Lemon Corp is an agency",
      "logo": {
        "uri": "https://example.io/assets/logo-en.svg",
        "alt_text": "test logo"
      }
    }
  ],
  "authorizationServerUrl": "http://localhost:4002",
  "authorizationServerConfigs": {
    "issuer": "https://example.com/realms/abc",
    "clientAuthentication": {
      "clientId": "issuer-server",
      "clientSecret": "issuer-client-secret"
    }
  }
}
```

---

## Notes

- `issuerId` must be unique per organization. Attempting to create an issuer with a duplicate ID will return a conflict error.
- `batchCredentialIssuanceSize` is accepted and stored but has no effect until the batch issuance feature is enabled in a future release.
- Multiple `display` entries can be provided for different locales to support internationalization.
- `authorizationServerUrl` should point to the agent's base endpoint. This value is embedded in the credential offer metadata and used by wallets to initiate the authorization flow.
- `authorizationServerConfigs` is optional. Include it only when the issuer needs to authenticate users via an external IDP during the offer creation flow. If omitted, user authentication via IDP is skipped.

---

# OID4VC Credential Template API

## Create Credential Template

**`POST`** `/v1/orgs/{orgId}/oid4vc/{issuerId}/template`

Creates a new credential template for the specified issuer. A credential template defines the structure, format, signing configuration, and visual appearance of a Verifiable Credential (VC). The template is later referenced when creating a credential offer.

---

## Path Parameters

| Parameter  | Type   | Description                                         |
|------------|--------|-----------------------------------------------------|
| `orgId`    | string | The unique identifier of the organization(uuid).          |
| `issuerId` | string | The unique identifier of the issuer (uuid). |

---

## Request Body

**Content-Type:** `application/json`

| Field          | Type    | Required | Description                                                                                                                                                                        |
|----------------|---------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`         | string  | Yes      | Human-readable name of the credential template (e.g. `"Birth Certificate"`).                                                                                                      |
| `description`  | string  | No       | A short description of the credential template.                                                                                                                                    |
| `signerOption` | string  | Yes      | Specifies the signing method to use when issuing credentials. See [Signer Options](#signer-options) below. At offer creation time, the platform fetches the organization's signing certificates configured for this option. |
| `format`       | string  | Yes      | The credential format. See [Credential Formats](#credential-formats) below.                                                                                                        |
| `template`     | object  | Yes      | The credential schema definition. Structure varies based on the `format` value. See [Template Object](#template-object) below.                                                     |
| `canBeRevoked` | boolean | No       | Indicates whether credentials issued from this template can be revoked. Currently has no effect — revocation support via a status list (revocation registry) will be enabled in a future release. |
| `appearance`   | object  | No       | Visual display configuration for how the credential appears in a wallet or app UI. See [Appearance Object](#appearance-object) below.                                              |
| `noticeUrl`    | string (URL) | No  | URL of a consent notice to be presented to the holder at the time of offer creation. The notice URL is generated via the Consent Service — refer to the [Consent Service documentation](#) for details. |

---

## Signer Options

The `signerOption` field determines how the issued credential will be signed. The platform uses this to look up the organization's configured signing certificates at offer creation time. Refer to the [Signing Certificates configuration guide](#) for details on how to set up certificates per option.

| Value          | Supported Formats     | Description                                                             |
|----------------|-----------------------|-------------------------------------------------------------------------|
| `DID`          | `dc+sd-jwt`, `jsonld`, `jwt` | Signs the credential using a Decentralized Identifier (DID).     |
| `x509_ED25519` | `mso_mdoc`, `dc+sd-jwt` | Signs the credential using an X.509 certificate with Ed25519 key type. |
| `X509_P256`    | `mso_mdoc`, `dc+sd-jwt` | Signs the credential using an X.509 certificate with P-256 key type. Required for `mso_mdoc` credentials. |

> **Note:** `mso_mdoc` credentials must always use an X.509-based signer option (`x509_ED25519` or `X509_P256`). DID-based signing is not supported for the mdoc format.

---

## Credential Formats

The `format` field defines the serialization and encoding format of the issued credential.

| Value       | Description                                                        |
|-------------|--------------------------------------------------------------------|
| `dc+sd-jwt` | SD-JWT-based Verifiable Credential (selective disclosure).         |
| `mso_mdoc`  | ISO 18013-5 / ISO 23220 mobile document format (mdoc). Requires an X.509-based `signerOption`. |
| `jsonld`    | JSON-LD Verifiable Credential (For future consideration).                                     |
| `jwt`       | Plain JWT Verifiable Credential (For future consideration).                                   |

---

## Template Object

The structure of the `template` object varies depending on the `format` value.

### `template` — `dc+sd-jwt` Fields

| Field        | Type   | Required | Description                                                                                                                              |
|--------------|--------|----------|------------------------------------------------------------------------------------------------------------------------------------------|
| `vct`        | string | Yes      | Verifiable Credential Type identifier. Mandatory for SD-JWT credentials. Uniquely identifies the credential type (e.g. `"BirthCertificateCredential-sdjwt"`). |
| `attributes` | array  | Yes      | Array of attribute definitions describing the claims in the credential. See [Attribute Object](#attribute-object) below.                 |

### `template` — `mso_mdoc` Fields

| Field        | Type   | Required | Description                                                                                                                                   |
|--------------|--------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `doctype`    | string | Yes      | The mdoc document type identifier, following ISO namespace conventions (e.g. `"org.iso.23220.photoid.1"`).                                   |
| `namespaces` | array  | Yes      | Array of namespace objects grouping attributes by ISO namespace. See [Namespace Object](#namespace-object-mso_mdoc) below.                    |

#### Namespace Object (`mso_mdoc`)

Each entry in the `namespaces` array groups a set of attributes under a specific ISO namespace.

| Field        | Type   | Required | Description                                                                                                  |
|--------------|--------|----------|--------------------------------------------------------------------------------------------------------------|
| `namespace`  | string | Yes      | The ISO namespace identifier for this group of attributes (e.g. `"org.iso.23220.1"`, `"org.iso.23220.photoid.1"`). |
| `attributes` | array  | Yes      | Array of attribute definitions within this namespace. Follows the same [Attribute Object](#attribute-object) structure. |

---

## Attribute Object

Applies to both `dc+sd-jwt` (top-level `attributes`) and `mso_mdoc` (per-namespace `attributes`).

For `mso_mdoc` — nested structures are instead modelled using separate namespaces.

| Field        | Type    | Required | Description                                                                                                                     |
|--------------|---------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| `key`        | string  | Yes      | The claim key / field name as it appears in the credential (e.g. `"first_name"`).                                              |
| `mandatory`  | boolean | Yes      | Whether this attribute is required to be present in the issued credential.                                                      |
| `value_type` | string  | Yes      | The data type of the attribute value (e.g. `"string"`, `"number"`, `"boolean"`).                                              |
| `disclose`   | boolean | Yes      | Controls selective disclosure. If `true`, the attribute can be disclosed by the holder during verification. If `false`, it is always hidden. |
| `display`    | array   | No       | Array of localized display labels for this attribute. See [Attribute Display Object](#attribute-display-object) below.          |
| `children`   | array   | No       | Nested child attributes for structured/object-type claims. Each child follows the same Attribute Object structure recursively. |

### Attribute `display[]` — Object Fields

| Field    | Type   | Required | Description                                                         |
|----------|--------|----------|---------------------------------------------------------------------|
| `name`   | string | Yes      | The human-readable label for this attribute (e.g. `"First Name"`). |
| `locale` | string | Yes      | BCP-47 language tag for this display entry (e.g. `"en"`).          |

---

## Appearance Object

The `appearance` object controls how the credential card is rendered in a wallet or app UI.

| Field       | Type  | Required | Description                                                    |
|-------------|-------|----------|----------------------------------------------------------------|
| `display`   | array | Yes      | Array of localized appearance configurations. See below.       |

### `appearance.display[]` — Object Fields

| Field              | Type        | Required | Description                                                                     |
|--------------------|-------------|----------|---------------------------------------------------------------------------------|
| `locale`           | string      | Yes      | BCP-47 language tag for this appearance entry (e.g. `"en"`).                  |
| `name`             | string      | Yes      | Display name of the credential as shown in the UI.                             |
| `logo.uri`         | string (URL)| No       | URL of the credential's logo image.                                            |
| `logo.alt_text`    | string      | No       | Accessibility alt text for the logo.                                           |
| `text_color`       | string      | No       | Hex color code for the credential card text (e.g. `"#FFFFFF"`).               |
| `background_color` | string      | No       | Hex color code for the credential card background (e.g. `"#140E30"`).         |
| `background_image.uri` | string (URL) | No | URL of a background image for the credential card.                         |

---

## Sample Request Payloads

### `dc+sd-jwt` — Birth Certificate

```json
{
  "name": "Birth Certificate",
  "description": "Birth Certificate",
  "signerOption": "DID",
  "format": "dc+sd-jwt",
  "template": {
    "vct": "BirthCertificateCredential-sdjwt",
    "attributes": [
      {
        "key": "first_name",
        "mandatory": true,
        "value_type": "string",
        "disclose": true,
        "display": [
          { "name": "First Name", "locale": "en" }
        ]
      },
      {
        "key": "address",
        "mandatory": true,
        "value_type": "string",
        "disclose": true,
        "display": [
          { "name": "Address", "locale": "en" }
        ],
        "children": [
          {
            "key": "state",
            "mandatory": true,
            "value_type": "string",
            "disclose": true,
            "display": [
              { "name": "State", "locale": "en" }
            ]
          },
          {
            "key": "city",
            "mandatory": true,
            "value_type": "string",
            "disclose": true,
            "display": [
              { "name": "City", "locale": "en" }
            ]
          }
        ]
      }
    ]
  },
  "canBeRevoked": false,
  "appearance": {
    "display": [
      {
        "name": "Birth certificate",
        "locale": "en",
        "logo": {
          "uri": "https://upload.wikimedia.org/wikipedia/commons/2/2f/ABC-2021-LOGO.svg",
          "alt_text": "birthCertificate_Logo"
        },
        "text_color": "#FFFFFF",
        "background_color": "#140E30",
        "background_image": {
          "uri": "https://test.net/images/credential-card-background.jpeg"
        }
      }
    ]
  },
  "noticeUrl": "https://test-consent.domain.com/api/consent-notice/CN-OGL70CWB"
}
```

### `mso_mdoc` — Passport (Photo ID)

```json
{
  "name": "Passport(PhotoId)",
  "description": "Passport travel credential",
  "signerOption": "X509_P256",
  "format": "mso_mdoc",
  "template": {
    "doctype": "org.iso.23220.photoid.1",
    "namespaces": [
      {
        "namespace": "org.iso.23220.1",
        "attributes": [
          {
            "key": "birth_date",
            "display": [{ "name": "Birth Date", "locale": "en" }],
            "disclose": true,
            "mandatory": true,
            "value_type": "string"
          },
          {
            "key": "family_name",
            "display": [{ "name": "Family Name", "locale": "en" }],
            "disclose": true,
            "mandatory": true,
            "value_type": "string"
          },
          {
            "key": "given_name",
            "display": [{ "name": "Given Name", "locale": "en" }],
            "disclose": true,
            "mandatory": true,
            "value_type": "string"
          },
          {
            "key": "issuing_country",
            "display": [{ "name": "Issuing Country", "locale": "en" }],
            "disclose": true,
            "mandatory": true,
            "value_type": "string"
          }
        ]
      },
      {
        "namespace": "org.iso.23220.datagroups.1",
        "attributes": [
          {
            "key": "sod",
            "display": [{ "name": "sod", "locale": "en" }],
            "disclose": true,
            "mandatory": true,
            "value_type": "string"
          }
        ]
      },
      {
        "namespace": "org.iso.23220.photoid.1",
        "attributes": [
          {
            "key": "travel_document_mrz",
            "display": [{ "name": "Travel Document MRZ", "locale": "en" }],
            "disclose": true,
            "mandatory": true,
            "value_type": "string"
          }
        ]
      }
    ]
  },
  "canBeRevoked": false,
  "appearance": {
    "display": [
      {
        "name": "Passport(PhotoId)",
        "locale": "en",
        "logo": {
          "uri": "https://upload.wikimedia.org/wikipedia/commons/2/2f/ABC-2021-LOGO.svg",
          "alt_text": "passport_logo"
        },
        "text_color": "#FFFFFF",
        "background_color": "#140E30",
        "background_image": {
          "uri": "https://test.net/images/credential-card-background.jpeg"
        }
      }
    ]
  },
  "noticeUrl": "https://test-consent.domain.com/api/consent-notice/CN-OGL70CHK"
}
```

---

## Notes

- The `template` object structure is specific to the credential `format`. Use the `dc+sd-jwt` structure for SD-JWT credentials and the `mso_mdoc` structure for mdoc credentials. Documentation for `jsonld` and `jwt` formats will be covered separately.
- `mso_mdoc` credentials must always use an X.509-based `signerOption` (`x509_ED25519` or `X509_P256`). DID-based signing is not supported for this format.
- `signerOption` is used at offer creation time — the platform looks up the organization's configured signing certificates for the selected option. Refer to the [X509 Certificates configuration guide](#) for setup instructions.
- `canBeRevoked` is accepted and stored but currently has no effect. Full revocation support via a status list / revocation registry will be enabled in a future release.
- `noticeUrl` is optional. If provided, the consent notice is presented to the holder during offer creation. Use the [Consent Service](#) to generate a notice and obtain its URL before assigning it here.
- Multiple `display` entries (in both `appearance` and attribute `display` arrays) can be provided per locale to support internationalization.

---

# OID4VC Credential Offer API

## Create Credential Offer

**`POST`** `/v1/orgs/{orgId}/oid4vc/{issuerId}/create-offer`

Creates a new credential offer for one or more Verifiable Credentials. The offer can be sent to a holder (wallet) who can then accept and receive the credentials. Both `dc+sd-jwt` and `mso_mdoc` credential formats are supported.

Two types of credential offers can be created: **Reach-out** (issuer initiates and sends the offer to the holder) and **Endorser** (offer is generated for the holder to scan/accept).

---

## Path Parameters

| Parameter  | Type   | Description                                                        |
|------------|--------|--------------------------------------------------------------------|
| `orgId`    | string | The unique identifier of the organization.                         |
| `issuerId` | string | The unique identifier of the issuer (e.g. `"lemon-corp"`).        |

---

## Request Body

**Content-Type:** `application/json`

| Field               | Type         | Required | Description                                                                                                                                                                                                          |
|---------------------|--------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `credentials`       | array        | Yes      | Array of credential objects to be issued as part of this offer. Multiple credentials can be included in a single offer. See [Credential Object](#credential-object) below.                                           |
| `authorizationType` | string       | Yes      | The authorization flow to use when the holder accepts the offer. See [Authorization Types](#authorization-types) below.                                                                                              |
| `noticeUrl`         | string (URL) | No       | If multiple credentials are included and their templates each carry their own notice URL, this field overrides the template-level `noticeUrl`. |

---

## Authorization Types

| Value                  | Description                                                                                                                                                                           |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `preAuthorizedCodeFlow` | The offer is protected by a PIN. When the holder accepts the offer, they are prompted to enter a PIN to complete issuance.                                                           |
| `authorizationCodeFlow` | The holder must authenticate using a username and password against the IDP server configured for the issuer in the [Create Issuer API](#create-issuer) (`authorizationServerConfigs`). |

---

## Credential Object

Each entry in the `credentials` array represents a single credential to be issued. The structure of the `payload` field differs based on the format of the referenced template.

| Field          | Type   | Required | Description                                                                                                                                                                    |
|----------------|--------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `templateId`   | string | Yes      | The UUID of the credential template to use. The template defines the credential format, attributes, signing option, and appearance. Refer to the [Create Template API](#create-credential-template). |
| `payload`      | object | Yes      | The claim data to embed in the credential. Structure varies by template format — see [Payload: dc+sd-jwt](#payload-dcsdjwt) and [Payload: mso_mdoc](#payload-mso_mdoc) below. |
| `validityInfo` | object | Yes      | Defines the validity period of the issued credential. See [Validity Info Object](#validity-info-object) below.                                                                  |

---

## Payload: `dc+sd-jwt`

For SD-JWT credentials, the payload is a flat or nested JSON object where keys map directly to the attribute keys defined in the template.

```json
"payload": {
  "first_name": "Rahul",
  "address": {
    "state": "MH",
    "city": "India"
  }
}
```

- Top-level keys correspond to root-level attributes defined in the template.
- Nested objects correspond to attributes that have `children` defined in the template (e.g. `address` with `state` and `city`).

---

## Payload: `mso_mdoc`

For mdoc credentials, the payload is wrapped in a `namespaces` object. Each key within `namespaces` corresponds to an ISO namespace defined in the template, and its value is an object of claim key-value pairs for that namespace.

```json
"payload": {
  "namespaces": {
    "org.iso.23220.photoid": {
      "family_name": "Müller-Lüdenscheid",
      "given_name": "Ford Praxibetel",
      "issuing_country": "NZL",
      "address": {
        "street_address": "M.G. Road",
        "locality": "Pune",
        "country": "India"
      }
    },
    "org.iso.23220.datagroups.1": {
      "sod": "data:application/octet-stream;base64,...",
      "dg1": "data:application/octet-stream;base64,...",
      "dg2": "data:application/octet-stream;base64,..."
    },
    "org.iso.23220.photoid.1": {
      "travel_document_mrz": "....."
    }
  }
}
```

- Each namespace key must match a namespace defined in the template.

---

## Validity Info Object

| Field        | Type             | Required | Description                                                             |
|--------------|------------------|----------|-------------------------------------------------------------------------|
| `validFrom`  | string (ISO 8601)| Yes      | The date and time from which the credential is valid (e.g. `"2025-04-23T14:34:09.188Z"`). |
| `validUntil` | string (ISO 8601)| Yes      | The date and time after which the credential expires (e.g. `"2026-05-03T14:34:09.188Z"`). |

---

## Sample Request Payloads

### `dc+sd-jwt` — Birth Certificate Offer

```json
{
  "credentials": [
    {
      "templateId": "6d263944-84b0-42f4-8f4f-03fa9ca9a7dd",
      "payload": {
        "first_name": "Rahul",
        "address": {
          "state": "MH",
          "city": "India"
        }
      },
      "validityInfo": {
        "validFrom": "2025-04-23T14:34:09.188Z",
        "validUntil": "2026-05-03T14:34:09.188Z"
      }
    }
  ],
  "authorizationType": "preAuthorizedCodeFlow",
  "noticeUrl": "https://test-consent.domain.com/api/consent-notice/CN-OGL70CWB"
}
```

### `mso_mdoc` — Passport Offer

```json
{
  "credentials": [
    {
      "templateId": "1800ce17-b170-465a-bbed-51a53dc06187",
      "payload": {
        "namespaces": {
          "org.iso.23220.photoid": {
            "family_name": "Müller-Lüdenscheid",
            "given_name": "Ford Praxibetel",
            "issuing_country": "NZL",
            "address": {
              "street_address": "M.G. Road",
              "locality": "Pune",
              "country": "India"
            }
          },
          "org.iso.23220.datagroups.1": {
            "sod": "data:application/octet-stream;base64,YV1fH1pJR...",
            "dg1": "data:application/octet-stream;base64,boIBfjGCA...",
            "dg2": "data:application/octet-stream;base64,dYJQKn9hg..."
          },
          "org.iso.23220.photoid.1": {
            "travel_document_mrz": "....."
          }
        }
      },
      "validityInfo": {
        "validFrom": "2025-12-15T14:34:09.188Z",
        "validUntil": "2026-03-01T14:34:09.188Z"
      }
    }
  ],
  "authorizationType": "preAuthorizedCodeFlow",
  "noticeUrl": "https://test-consent.domain.com/api/consent-notice/CN-OGL70CWB"
}
```

---

## Notes

- While creating offer it picks up a signing option defined in template and accordingly looks up for active primary DID or active x509 certificate and attaches to offer. So at time of offer creation either DID or x509 certificate should be present and active for that particular organization.

---

