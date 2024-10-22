---
icon: clipboard-question
cover: .gitbook/assets/Gitbook Cover Image.png
coverY: 0
layout:
  cover:
    visible: true
    size: hero
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Overview

CREDEBL is an industry-leading Verifiable Credential & Decentralised Identity management platform which builds scalable, secure and user-centric SSI solutions. The multi-tenant platform offers straightforward interactions, enabling rapid configuration & deployment of your DID/VC solution.

### Highlights <a href="#key-features" id="key-features"></a>

#### **Open Standards, Open Source**

CREDEBL is intricately woven upon robust open standards, notably including W3C specifications such as Decentralized Identifiers (DID) and Verifiable Credentials (VC), along with contributions from the Decentralized Identity Foundation (DIF), Trust over IP Foundation (ToIP), as well as the collaborative efforts of the Hyperledger Indy and Aries open-source initiatives.

#### **Built for Scalability**

CREDEBL spans the gamut from initial proof-of-concept endeavors to the expansive demands of enterprise settings, ensuring a seamless transition as needs evolve.

#### **Privacy-by-Design**

A steadfast commitment to data privacy underscores CREDEBL’s design philosophy, steadfastly embracing core tenets such as Privacy by Design and the sovereign control of data.

#### **Tested for Market Scenarios**

CREDEBL consistently hones its capabilities across an array of industry verticals, delivering tangible value within domains including Citizen Identity, Healthcare, Financial Services, Education, Governments, and other sectors.

### CREDEBL PLATFORM <a href="#platform" id="platform"></a>

[Platform](https://github.com/credebl/platform) provides a set of scalable services to manage decentralized identity and verifiable credentials (VC) system. It enables developers to build Self-Sovereign Identity (SSI) solutions that provide enhanced privacy and security. It is designed for scalability to support population-scale SSI implementations.&#x20;

It provides tools for digital credential management and verification, allowing organizations to easily issue and manage credentials with ease. It is built on a micro-services architecture to support large-scale enterprise applications.

Platform supports multiple ledger options (like Indy and Polygon) and also ledger-less credential issuance using methods like did:web, did:key and did:peer.

### CREDEBL STUDIO <a href="#studio" id="studio"></a>

[Studio](https://github.com/credebl/studio) is web front-end for the entire Platform, built using Astro, React, Flowbite, and Tailwind CSS, allowing administrators & users to easily access & manage all the Platform features using a simple web interface.

### ARIES AGENT

In the context of decentralized identity systems, an agent generally refers to a software component or service that facilitates peer-to-peer interactions and data exchange operations between various entities in the system.

Agents leverage the Aries protocol implementations built into **Credo** & **ACA-Py**.

There are two types of agents that organizations can use, each serving different needs based on the deployment model and use case: **Shared Agents** and **Dedicated Agents**.

A shared agent refers to an agent that is used by multiple entities or tenants, rather than being dedicated to a single entity. If the tenancy is set to true, it typically means that the system or agent supports multi-tenancy, or if the tenancy is set to false, it means that the agent does not support the multi-tenancy.

### **ADEYA Mobile SDK**

Built on the strong foundation of Credo, the ADEYA Mobile Wallet SDK is a React-Native SDK helps mobile developers to easily build SSI features with into existing mobile apps or a new one, enables interoperability and seamless connectivity for secure data exchange.

{% hint style="info" %}
**ADEYA Mobile SDK** enables rapid development of applications for secure, peer-to-peer credentials and message sharing across various sectors, including public administration, healthcare, finance, services, mobility, education, and more.
{% endhint %}
