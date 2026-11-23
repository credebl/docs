---
description: >-
  Issue mDoc and SD-JWT credentials with X.509 certificates, and understand
  wallet errors
---

# X.509 issuance and holder errors

Notes for issuers who sign credentials with an X.509 certificate chain (`x5c` signer or [did:x509](did-x509.md)), and for wallets that receive them.

## Full certificate chain in the credential

* Send the chain with the **signing (leaf) certificate first**, then the intermediate CA(s), then the root.
* The leaf signs the credential. All other certificates are added into the credential too.
* This works for **mDoc** and **SD-JWT VC** (`x5c` header).
* Why: the holder or verifier needs the whole chain to reach a root that it trusts. Earlier, only the leaf and one intermediate were added, so a wallet trusting only the root could not verify.

## mDoc validity dates

* `validityInfo.validFrom` and `validityInfo.validUntil` are required.
* `validUntil` must be after `validFrom`, and both must be valid dates. Otherwise you get a 400 error.
* `signed` is optional. By default it is the time of signing, but it is **never later than `validFrom`**. Wallets reject an mDoc that says it was signed after it became valid.
* So a `validFrom` of "now" or in the past works fine.

## Certificate subject and issuer format

When you create a certificate (`issuer` and `subject`), you can write the name in any of these ways:

* OpenSSL style: `/C=IN/O=Example/CN=Example CA`
* Comma style: `C=IN, O=Example, CN=Example CA`
* Name object

{% hint style="info" %}
For mDoc, the issuer certificate must have a country (`C`), and it must match the `issuing_country` of the credential.
{% endhint %}

## Holder errors in simple words

When a wallet (holder) cannot use a credential offer, the API now explains the reason. The original error is added at the end in brackets for debugging. This applies to resolve offer, authorize and request credential APIs.

| Status | What it means                                                                        | What to do                                                      |
| ------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| 400    | The offer needs a transaction code (PIN).                                            | Get the PIN from the issuer and send it as `txCode`.            |
| 404    | Offer already used, expired or withdrawn. An offer works only once.                  | Ask the issuer for a new offer.                                 |
| 502    | The issuer's configuration could not be read.                                        | Tell the issuer. No credential can be issued until it is fixed. |
| 422    | The wallet does not trust the certificate that signed the credential.                | Add the issuer's root certificate to the wallet's trust list.   |
| 422    | The credential is not valid at this time.                                            | The issuer may need to issue it with other dates.               |
| 422    | The credential was signed outside the validity of the signing certificate.           | Issue with a certificate that is valid at signing time.         |
| 422    | The issuing country in the credential does not match the country of the certificate. | Issuer fixes the credential or uses another certificate.        |
| 422    | The signing certificate has no country (`C`). mDoc needs it.                         | Use a certificate that has a country.                           |
| 422    | An mDoc cannot be bound to a DID.                                                    | Issuer should offer key (`jwk`) binding for this credential.    |

Errors that are not in this list behave as before.
