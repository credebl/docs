---
description: >-
  How the platform sets cryptographic_binding_methods_supported for OID4VC
  issuers and templates.
icon: link
---

# Holder binding methods

`cryptographic_binding_methods_supported` in the issuer metadata tells a wallet which key types and DID methods it may use to bind an issued credential to itself (proof of possession). Credo's holder enforces this list, so a `did:web` wallet only gets a credential bound to its DID if the issuer advertises `did:web`. Since platform `v2.3.0` the list is configurable per template and per issuer.

## Allowed values

`jwk`, `did:key`, `did:web`, `did:jwk`, `did:indy`, `did:sov`, `did:cheqd`, `did:webvh`, `did:polygon`. `did:peer` is not offered because the issuer cannot resolve it publicly. The issuer agent must have the matching DID resolver registered (for example the polygon plugin for `did:polygon`).

## Resolution order

For each credential configuration the first of these that is set wins:

1. `cryptographicBindingMethods` on the credential template (`dc+sd-jwt`, `jwt_vc_json-ld`, `ldp_vc`).
2. `cryptographicBindingMethods` on the issuer (create and update issuer APIs).
3. The default for the format:
   * `dc+sd-jwt` and `jwt_vc_json-ld`: `did:key`, `did:web`, `did:jwk`, `jwk`
   * `ldp_vc`: `did:key`, `did:web` (new in `v2.3.0`: `did:web` is advertised by default)

`mso_mdoc` is always `jwk`. An empty or omitted list means no override at that level.

## RS256 proofs

Issuer metadata accepts `RS256` proofs for `dc+sd-jwt` and `jwt_vc_json-ld`, so a holder whose `did:web` uses an RSA key (for example an Indian Class 3 DSC) can receive a bound credential. `mso_mdoc` is unchanged.

## Existing issuers and templates

They keep the binding methods and proof algorithms already published in their agent metadata until the configuration is pushed again:

* Update the issuer (`POST /v1/orgs/{orgId}/oid4vc/issuers/{issuerId}`) to re-push the issuer configuration. A changed issuer default takes effect immediately.
* A template's list is pushed when the template is created or updated (`PATCH /v1/orgs/{orgId}/oid4vc/{issuerId}/template/{templateId}`).
* Issuers created after the upgrade get the new configuration directly.

## Database

The migration `add_cryptographic_binding_methods_to_oidc_issuer` adds `oidc_issuer.cryptographicBindingMethods TEXT[]` (default empty, no backfill). Run `npx prisma migrate deploy`.

See also [OpenID for Verifiable Credential Issuance APIs](openid-for-verifiable-credential-issuance-apis.md#holder-binding-methods) and, on the holder side, the `holderDidUrl` and `bindingPolicy` fields in [Cloud wallet APIs](../cloud-wallet-apis.md).
