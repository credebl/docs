---
description: >-
  Cloud wallet credential management, OpenID4VC holder flows and DID binding
  (platform v2.3.0).
icon: wallet
---

# Cloud wallet APIs

The cloud wallet is the holder side of the platform: a user's wallet runs on an agent hosted by the platform. Platform `v2.3.0` adds credential management by format, OpenID4VC holder flows and binding of credentials to a DID of the wallet. All endpoints take the user's bearer token and are served under `/v1`.

{% hint style="warning" %}
Requires agent controller `v2.3.3`. DID binding needs `v2.3.1` or later.
{% endhint %}

## Credential management

| Method and path                | Purpose                                |
| ------------------------------ | -------------------------------------- |
| `GET /holder/sd-jwt-vcs`       | List SD-JWT credentials in the wallet. |
| `GET /holder/mdoc-vcs`         | List mdoc credentials.                 |
| `GET /holder/w3c-vcs`          | List W3C credentials.                  |
| `POST /holder/decode-sdjwt`    | Decode an SD-JWT credential.           |
| `POST /holder/mdoc-vcs/decode` | Decode an mdoc credential.             |
| `DELETE /holder/credential`    | Delete a credential from the wallet.   |

The platform calls the agent's list endpoints without query parameters and returns the plain array. Agent list endpoints return an envelope `{ data, pagination, filters? }` when any query parameter is sent; handle both shapes if you call the agent directly.

Holder wallet resolution is scoped to the authenticated user.

## OpenID4VCI holder flow

| Method and path                                | Purpose                            |
| ---------------------------------------------- | ---------------------------------- |
| `POST /oid4vc/holder/resolve-credential-offer` | Resolve a credential offer URI.    |
| `POST /oid4vc/holder/authorization-request`    | Start the authorization code flow. |
| `POST /oid4vc/holder/request-credential`       | Request and store the credential.  |

`request-credential` body:

| Field                               | Required | Description                                                                                                              |
| ----------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `credentialOfferUri`                | Yes      | The credential offer URI.                                                                                                |
| `credentialsToRequest`              | Yes      | Credential configuration ids to request.                                                                                 |
| `authorizationCode`, `codeVerifier` | No       | For the authorization code flow.                                                                                         |
| `txCode`                            | No       | Transaction code for the pre-authorized code flow.                                                                       |
| `holderDidUrl`                      | No       | DID or DID URL of a DID in the wallet. Credentials are bound to its key instead of a new key.                            |
| `bindingPolicy`                     | No       | With `holderDidUrl`: `require` (default) fails when the issuer cannot bind to the DID; `prefer` falls back to a new key. |
| `sendNotification`                  | No       | Send `credential_accepted` (or `credential_failure`) to the issuer. Default `true`.                                      |

Each returned credential has a `notification` field: `{ status: "sent", event }`, `{ status: "skipped", reason }` or `{ status: "failed", event, reason }`. A notification that cannot be sent never fails the request.

## OpenID4VP holder flow

| Method and path                             | Purpose                                                             |
| ------------------------------------------- | ------------------------------------------------------------------- |
| `POST /oid4vc/holder/resolve-proof-request` | Resolve a presentation request URI and see which credentials match. |
| `POST /oid4vc/holder/accept-proof-request`  | Accept the request and present credentials.                         |

## DID binding

A holder can bind OID4VC credentials to a DID of its wallet, for example a `did:web` whose key was imported from the holder's certificate.

1. Create an import session: `POST /did/import/session`. It accepts `polygon`, `key` and `web`, so an existing key can be imported as a `did:web`. The response holds the session id, its expiry and a public key. The key is then sent encrypted (`encryptedKey`).
2. Create the DID with `POST /did`.
3. Call `request-credential` with `holderDidUrl` (and optionally `bindingPolicy`).

The issuer must advertise the DID method in `cryptographic_binding_methods_supported`; see [Holder binding methods](oid4vc-apis/holder-binding-methods.md).

## Other changes in v2.3.0

* Creating a cloud wallet no longer fails on agents that run Credo 0.7.
* Base wallet configuration (`POST /configure/base-wallet`) is restricted to platform administrators.
* Agent health checks use the holder tenant token.
