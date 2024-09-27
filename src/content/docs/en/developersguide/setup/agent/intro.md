---
title: Intro
description: Introduction to Agent
---

### What is Agent?
In the context of blockchain, particularly within decentralized identity systems or distributed ledger technology, an agent generally refers to a software component or service that facilitates interactions and operations between various entities in the system

There are two main types of agents that organizations can use, each serving different needs based on the deployment model and use case: Shared Agents and Dedicated Agents.

A shared agent refers to an agent that is used by multiple entities or tenants, rather than being dedicated to a single entity. If tenancy is set to true, it typically means that the system or agent supports multi-tenancy, or if tenancy is set to false, it means that the agent not support the multi-tenancy.


### What is Shared Agent?
A shared agent refers to an agent that acts on behalf of multiple entities (nodes) to perform tasks within the network.

To know more about shared agents and multi-tenancy, refer to the following documents :

1. <a href = "https://aca-py.org/main/features/Multitenancy/">Multi-tenancy is Aries framework</a>
2. <a href = "https://aca-py.org/main/features/Multitenancy/">Multi-tenancy in Aca-py framework</a>
3. <a href = "https://github.com/openwallet-foundation/credo-ts/tree/main/packages/tenants">Multi-tenancy in Credo-controller</a>


### What is Dedicated or on-premises agent?
A Dedicated Agent is an agent that is deployed and managed exclusively for a single organization. Unlike shared agents, a dedicated agent operates solely for one tenant and is typically deployed either on-premises or in a private cloud environment

To know more about shared agents and multi-tenancy, refer to the following documents :

1. <a href = "https://aries-cloud-agent-python.readthedocs.io/en/latest/"> Aries Cloud Agent-Python (ACA-Py)</a>
2. <a href = "https://aca-py.org/latest/">ACA-Py Deployment Model</a>