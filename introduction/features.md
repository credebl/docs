---
icon: bird
---

# Features

With CREDEBL, end-to-end credential management can be enabled with these features.

* [User Registration](broken-reference)
* [Organization onboarding](broken-reference)
* [Team onboarding](broken-reference)
* [Web Wallet for Organizations](broken-reference)
* [ADEYA Mobile Wallet for Holders](broken-reference)
* [Credential Schema](broken-reference)
* [Credential Definition](broken-reference)
* [Issuance and Verification](broken-reference)

### **User Registration**

The platform provides an efficient user registration process through email-based verification. Furthermore, the platform offers modern & highly secure authentication mechanisms such as FIDO Passkey for phishing-resistent user verification. These measures establish a multi-layered approach to user authentication, mitigating the potential for unauthorized access and preserving the security of sensitive user data. Platform also provides highly secure mechanisms such as ClientId and ClientSecret for API authentication.

## **Organization onboarding**

Facilitates smooth enrollment of organizations into the decentralized identity platform, enabling them to establish a reliable presence and engage in secure digital interactions. This expedites the process for organizations to join the platform.

**Team onboarding**

Provides an efficient way to onboard team members for the organization through an email-based invitation. An organization owner can send invitation email to team members to join the platform & the organization.

**Web Wallet for Organizations**

Organizations can setup their own SSI Web Wallet based on a shared \[multi-tenant] Aries agent and on-prem \[dedicated] Hyperledger Aries agent. For multi-tenant agent platform handles all the processes. For dedicated agent currently platform supports on-prem agent. To know more about \[dedicated] on-prem agent please click here.

**ADEYA Mobile Wallet for Holders**

ADEYA wallet is a user-friendly mobile wallet app designed to store and manage digital identities. It also facilitates secure data sharing among trusted connections, all while ensuring privacy, security & selective disclosure. It harnesses the capabilities of decentralized identity components developed using DIDComm protocols and cutting-edge features from Hyperledger Aries Bifold project.

Here are some of the key features of using an ADEYA wallet:

* **Open Standards**: ADEYA wallet is built entirely on open standards, such as Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs).
* **Interoperable**: Built on open standards and technologies such as DIDs, VCs, Aries, W3C JSON-LD VCs, AnonCreds and more. Ensures that you won’t face vendor lock-in and will interoperate with global players.
* **Privacy-by-design**: The holders consent to what information they share with the verifying parties. Leverage privacy-preserving data exchanges using compounding, predicates, selective disclosure, restrictions, connection-less and more.
* **Multi-language Support**: Easy customization and multi-lingual support through localization and internationalization implementation.
* **DIDComm Messaging**: Communicate securely and privately while conducting various trust tasks.

**Credential Schema**

A credential schema serves as a machine-readable template outlining a collection of attributes, data types and formats. These attributes are utilized for the claims within a credential. For instance, envision a schema tailored for generating passport credentials. It would encompass definitions of attributes like _given name_, _family name_, _date of birth_, _passport number_, and more. The versatility of a schema definition allows multiple credential issuers to utilize it, promoting standardization across various issuers.

**Credential Definition**

Once a schema has been authored and added to the ledger, it becomes accessible for use by a diverse range of credential issuers, such as banks, passport offices, universities, employers, and more. These issuers can then formulate issuer-specific credential definitions, which are also registered on the ledger. Each of these credential definitions constitutes an instance of the underlying schema, supplemented by attribute-specific public verification keys that are securely linked to the corresponding private signing keys of the respective issuer. This approach enables an issuer to re-use an existing schema, and enables a verifier who receives a proof containing data from the issuer to look up the issuer’s credential definition on ledger, obtain their verification key(s) and verify the origin and integrity of that data.

Verifiable credentials (VCs) have these qualities:

* Portability: You can easily send them to others online.
* Verifiability: You can check who issued the credential, who holds it, if it’s unchanged, and if it’s valid.
* Privacy: You can choose what info to share using zero-knowledge proofs, giving you more control.Integrity: VCs can’t be changed or faked.”

Verification credential Stake-holders:

* Issuer: The entity that generates the Verifiable Credential and provides it to another entity.
* Holder: The entity that possesses the verifiable credential in their digital wallet.
* Verifier: The entity that gets and verifies instantly the shared information.

**Issuance and Verification**

The platform implements a secure and consistent procedure for creating and distributing VCs, upholding the credibility and confidentiality of the credentials. It empowers trusted entities (like universities, employers, or government agencies) to issue VCs to individuals.Furthermore, the platform furnishes a means for individuals or entities relying on the credentials to authenticate and confirm the legitimacy of VCs provided by individuals. These entities could be employers, educational institutions, or any entity requiring validation of someone’s qualifications or attributes.
