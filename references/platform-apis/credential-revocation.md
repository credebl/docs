---
description: >-
  Revoke issued credentials with a W3C Bitstring Status List (DIDComm JSON-LD)
  or an OID4VC issuance session.
icon: ban
---

# Credential revocation

Since platform `v2.3.0`, credentials can be issued as revocable and later revoked. The platform allocates a status-list entry for each revocable credential (the shared `@credebl/status-list` library) and records the revocation time. Agent controller `v2.3.3` is required.

## What can be revoked

| Credential kind                      | How it is issued                            | Status mechanism                                       |
| ------------------------------------ | ------------------------------------------- | ------------------------------------------------------ |
| JSON-LD credentials over DIDComm     | `isRevocable: true` on the issuance request | W3C Bitstring Status List (`BitstringStatusListEntry`) |
| OID4VC `dc+sd-jwt`                   | `isRevocable: true` on the credential offer | Token Status List                                      |
| OID4VC `jwt_vc_json-ld` and `ldp_vc` | `isRevocable: true` on the credential offer | W3C Bitstring Status List                              |

`credentialVersion` (`v1.0` or `v2.0`, default `v1.0`) selects the credential data model version of the issued credential.

{% hint style="info" %}
The agent needs the status list settings, for example `STATUS_LIST_SERVER_URL`, `STATUS_LIST_API_KEY` and `STATUS_LIST_DEFAULT_SIZE` in `agent.env`. See [Status List Server](../status-list-server.md).
{% endhint %}

## Revoke a DIDComm credential

**`POST`** `/v1/orgs/{orgId}/credentials/{threadId}/revoke`

Revokes an issued JSON-LD credential by the thread id of its issuance. Allowed roles: owner, admin, issuer. The call is idempotent: revoking a credential that is already revoked succeeds.

```http
POST /v1/orgs/6d263944-84b0-42f4-8f4f-03fa9ca9a7dd/credentials/<threadId>/revoke
Authorization: Bearer <your_token>
```

Success (`200 OK`): `{ "statusCode": 200, "message": "Credential revoked successfully" }`.

The credential must have been issued with `isRevocable: true`.

## Revoke an OID4VC credential

**`POST`** `/v1/orgs/{orgId}/openid4vc/issuance-sessions/{issuanceSessionId}/revoke`

Revokes all credentials issued during an issuance session. See [Revoke Credential](oid4vc-apis/openid-for-verifiable-credential-issuance-apis.md#revoke-credential). The revocation time is stored as `revokedAt` on each credential.

## Verification of revoked credentials

OID4VP verification returns a structured result for a revoked or failed session instead of a generic error: `verificationStatus` (`pending`, `verified` or `failed`), `verified` and `error`. See [Get Verifier Presentation Response](oid4vc-apis/openid-for-verifiable-presentation-apis.md#get-verifier-presentation-response).

## Upgrade notes

The release adds database columns for status lists (`statusListId`, `statusListIndex`, `statusListUri`, `credentialVersion`, `revokedAt` on `credentials`, and `revokedAt` on `issued_oid4vc_credentials`). Run `npx prisma migrate deploy`. See [v.2.3.0](../releases/v.2.3.0-rc.md).
