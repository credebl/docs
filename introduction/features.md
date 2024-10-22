---
icon: bird
description: Walk though of all CREDEBL and ADEYA Mobile SDK features
---

# Features

## CREDEBL Features

CREDEBL enables end-to-end verifiable credential management with following key features.

* [User Registration](features.md#user-registration)
* [Organization onboarding](features.md#organization-onboarding)
* [Team Onboarding](features.md#team-onboarding)
* [Cloud Wallet for Organizations](features.md#cloud-wallet-for-organizations)
* [Credential Schema](features.md#credential-schema)
* [Credential Definition](features.md#credential-definition)
* [Issuance and Verification](features.md#issuance-and-verification)

### **User Registration**

The platform provides an efficient user registration process through email-based verification. Furthermore, the platform offers modern & highly secure authentication mechanisms such as FIDO Passkey for phishing-resistent user verification. These measures establish a multi-layered approach to user authentication, mitigating the potential for unauthorized access and preserving the security of sensitive user data. Platform also provides highly secure mechanisms such as ClientId and ClientSecret for API authentication.

### **Organization Onboarding**

Facilitates smooth enrolment of organizations into the decentralized identity platform, enabling them to establish a reliable presence and engage in secure digital interactions. This expedites the process for organizations to join the platform.

### **Team Onboarding**

Provides an efficient way to onboard team members for the organization through an email-based invitation. An organization owner can send invitation email to team members to join the platform & the organization.

### **Wallet for Organizations**

Organizations can setup their own SSI Web Wallet based on a shared \[multi-tenant] Aries agent or on-prem \[dedicated] Aries agent. For multi-tenant agent, platform handles all the processes. For dedicated agent, platform supports on-prem agent.

### **Credential Schema**

A credential schema serves as a machine-readable template outlining a collection of attributes, data types and formats. These attributes are utilized for the claims within a credential. For instance, envision a schema tailored for generating passport credentials. It would encompass definitions of attributes like _given name_, _family name_, _date of birth_, _passport number_, and more. The versatility of a schema definition allows multiple credential issuers to utilize it, promoting standardization across various issuers.

### **Credential Definition**

Once a schema has been authored and added to the ledger, it becomes accessible for use by a diverse range of credential issuers, such as banks, passport offices, universities, employers, and more. These issuers can then formulate issuer-specific credential definitions, which are also registered on the ledger. Each of these credential definitions constitutes an instance of the underlying schema, supplemented by attribute-specific public verification keys that are securely linked to the corresponding private signing keys of the respective issuer. This approach enables an issuer to re-use an existing schema, and enables a verifier who receives a proof containing data from the issuer to look up the issuer’s credential definition on ledger, obtain their verification key(s) and verify the origin and integrity of that data.

Verifiable credentials (VCs) have these qualities:

* Portability: You can easily send them to others online.
* Verifiability: You can check who issued the credential, who holds it, if it’s unchanged, and if it’s valid.
* Privacy: You can choose what info to share using zero-knowledge proofs, giving you more control.Integrity: VCs can’t be changed or faked.”

Verification credential Stake-holders:

* Issuer: The entity that generates the Verifiable Credential and provides it to another entity.
* Holder: The entity that possesses the verifiable credential in their digital wallet.
* Verifier: The entity that gets and verifies instantly the shared information.

### **Issuance and Verification**

The platform implements a secure and consistent procedure for creating and distributing VCs, upholding the credibility and confidentiality of the credentials. It empowers trusted entities (like universities, employers, or government agencies) to issue VCs to individuals.Furthermore, the platform furnishes a means for individuals or entities relying on the credentials to authenticate and confirm the legitimacy of VCs provided by individuals. These entities could be employers, educational institutions, or any entity requiring validation of someone’s qualifications or attributes.

## ADEYA Mobile SDK features

ADEYA Mobile SDK enables holders to store credentials and present proof with following features:

* [Built using Open Standards](features.md#built-using-open-standards)
* [Multi ledger & Multi network Support](features.md#multi-ledger-and-multi-network-support)
* [Multiple DID method VC format](features.md#multiple-did-method-vc-format-support)
* [Backup and restore](features.md#backup-and-restore)
* [Interoperable](features.md#interoperable)

### Built using Open Standards

Designed with user's **data privacy** and **user control** in mind to store and share verifiable credential

### Multi ledger & Multi network Support

Our SSI SDK supports **multi-ledger** functionality, allowing you to interact with and utilize more than one blockchain or distributed ledger, including Indy and Polygon. Additionally, it offers **multi-network** capabilities, enabling operate seamlessly across different network types, such as Sovrin, Indicio, and BCovrin.

### Multiple DID Methods VC formats support

Supports multiple **DID methods**, including **did:indy**, **did:polygon**, **did:web**, **did:key** ensuring flexibility across various decentralized identity systems.

It also accommodates different **Verifiable Credential (VC) formats**, such as **AnonCreds** and **W3C**, ensuring broad compatibility for secure and verifiable digital credentials

### Backup and Restore

Regularly **backup data** on your preferred storage media and **restore as needed**

### Interoperable

Interoperable with other wallets and SSI providers/platforms that follow open standards
