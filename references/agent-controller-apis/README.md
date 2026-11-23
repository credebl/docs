---
description: APIs of the CREDEBL agent controller for DIDs and keys
icon: key
---

# Agent Controller APIs

The agent controller is the REST service that runs next to each CREDEBL agent (dedicated or tenant). These pages explain the APIs for bringing your **existing keys, certificates and DIDs** into the agent.

* Encrypted key import - how to send a private key to the agent safely, without plain text.
* Import did:web from an authority - use a did:web that is created and hosted by someone else, for example a government agency.
* did:x509 - import a CA issued certificate chain and use it as a DID, to sign and verify SD-JWT VC credentials.
* KMS backends - where the agent stores each key (Askar, Node or OpenBao) and how to check it.
* X.509 issuance and holder errors - full chain in mDoc and SD-JWT, mDoc dates, certificate name format and readable wallet errors.

{% hint style="warning" %}
These pages describe agent controller `v2.3.3`, paired with platform `v2.3.0`. With an older agent, did:x509 import, encrypted key import and KMS backend reporting are not available.
{% endhint %}

{% hint style="info" %}
You can call these APIs through the CREDEBL platform (Studio uses this way) or directly on the agent controller. The steps are the same, only the base URL is different.
{% endhint %}

Platform-side endpoints, `kmsBackend` values and migrations are in [did:x509 and KMS backend](../platform-apis/did-x509-and-kms-backend.md). Agent settings such as `ALLOW_PLAINTEXT_KEY_IMPORT` and `OPENBAO_*` are in [(Optional) Agent](../../contribute/setup/optional-agent/).
