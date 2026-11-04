---
icon: rectangle-api
---

# OID4VC APIs

### 🔐 OID4VC (OpenID for Verifiable Credentials)

**OID4VC** is a set of specifications from the OpenID Foundation that defines how **Verifiable Credentials (VCs)** are **issued to a wallet** using OpenID Connect.

* Focus: **Credential Issuance**
* Key flow: Wallet requests and receives a VC from an issuer
* Based on: OAuth 2.0 / OpenID Connect

🔗 Spec: [https://openid.net/specs/openid-4-verifiable-credential-issuance-1\_0.html](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)

***

### 🪪 OID4VP (OpenID for Verifiable Presentations)

**OID4VP** defines how a wallet **presents verifiable credentials to a verifier** in response to a request, using OpenID-based protocols.

* Focus: **Credential Presentation / Verification**
* Key flow: Verifier requests proof → Wallet returns a Verifiable Presentation (VP)
* Supports selective disclosure and proof binding (nonce, audience)

🔗 Spec: [https://openid.net/specs/openid-4-verifiable-presentations-1\_0.html](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)

***

The **Credebl platform** provides flexible capabilities to onboard both issuers and verifiers, enabling end-to-end management of verifiable credential flows.

#### Issuer Capabilities

* Supports onboarding of issuers
* Allows configuration to issue multiple credential formats, such as:
  * SD-JWT
  * mdoc
* Enables creation of **credential templates** to define structure and issuance logic for different credential types

#### Verifier Capabilities

* Provides APIs to onboard verifiers
* Enables creation of **verification templates**
* Supports validation of credential presentations based on specific business use cases

