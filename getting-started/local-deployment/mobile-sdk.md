---
description: React-Native Mobile SDK to build SSI powered identity apps & edge wallets
icon: wallet
layout:
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Mobile SDK

[![npm](https://img.shields.io/npm/v/@credebl/ssi-mobile.svg)](https://www.npmjs.com/package/@credebl/ssi-mobile)

* [Installing](mobile-sdk.md#installing)
* [Peer Dependencies](mobile-sdk.md#peer-dependencies)
* [Usage](mobile-sdk.md#usage)
* [API](mobile-sdk.md#api)
  * [Agent](mobile-sdk.md#agent)
  * [Wallet](mobile-sdk.md#wallet)
  * [Connections](mobile-sdk.md#connections)
  * [Credentials](mobile-sdk.md#credentials)
  * [Proofs](mobile-sdk.md#proofs)
  * [BasicMessages](mobile-sdk.md#basicmessages)
  * [PushNotifications](mobile-sdk.md#pushnotifications)
  * [Hooks](mobile-sdk.md#hooks)

## Installing

```sh
npm install @credebl/ssi-mobile

# or

yarn add @credebl/ssi-mobile

# or

pnpm add @credebl/ssi-mobile
```

## Peer Dependencies

* We also need to add the peer dependencies of this package to app.

```
"dependencies": {
  ...
  "@hyperledger/anoncreds-react-native": "^0.1.0",
  "@hyperledger/aries-askar-react-native": "^0.1.1",
  "@hyperledger/indy-vdr-react-native": "^0.1.0",
}
```

## Usage

```ts
import { useAdeyaAgent } from '@credebl/ssi-mobile'

const { agent } = useAdeyaAgent()
```

## API

### Agent

* **initializeAgent** - Initialize the agent with the given `Config` and `Agent Modules` . This includes all the config related to the wallet details and label.

```ts
import { initializeAgent } from '@credebl/ssi-mobile'

const config: InitConfig = {
  label: 'ADEYA Wallet',
  walletConfig: {
    id: 'adeya-wallet',
    key: 'adeya-wallet-key'
  },
  logger: new ConsoleLogger(LogLevel.debug),
  autoUpdateStorageOnStartup: true
}

const agent = await initializeAgent({
  agentConfig: config,
  modules: getAgentModules(mediatorUrl, indyLedgers)
})
```

* **getAgentModules** - Get the default agent modules which requires `mediatorURL` and `indyLedgers`

```ts
import { getAgentModules } from '@credebl/ssi-mobile'

const modules = getAgentModules(mediatorUrl, indyLedgers)
```

* **AdeyaAgent** - The agent instance type which helps in typing our agent object.

```ts
import { AdeyaAgent } from '@credebl/ssi-mobile'
```

### Wallet

* **isWalletPinCorrect** - Check if the wallet pin is correct.

```ts
import { isWalletPinCorrect } from '@credebl/ssi-mobile'

const isCorrect = await isWalletPinCorrect(walletConfig)
```

* **exportWallet** - Export the wallet and pass export config which includes `backupKey` and `path` where we want to export our wallet.

```ts
import { exportWallet } from '@credebl/ssi-mobile'

await exportWallet(agent, exportConfig)
```

* **importWalletWithAgent** - Import the wallet and start the agent with `importConfig` which includes `key` and `path` from where wallet can be imported&#x20;

```ts
import { importWalletWithAgent } from '@credebl/ssi-mobile'

const agent = await importWalletWithAgent({
  importConfig,
  agentConfig,
  modules
})
```

### Connections

* **createLegacyInvitation** - Create a legacy invitation which use the connection v1 protocol.

```ts
import { createLegacyInvitation } from '@credebl/ssi-mobile'

const connection = await createLegacyInvitation(agent, domain, config)
```

* **createLegacyConnectionlessInvitation** - Create a legacy connectionless invitation.

```ts
import { createLegacyConnectionlessInvitation } from '@credebl/ssi-mobile'

const connection = await createLegacyConnectionlessInvitation(agent, config)
```

* **createInvitation** - Create an Out-of-band invitation.

```ts
import { createInvitation } from '@credebl/ssi-mobile'

const connection = await createInvitation(agent, domain, config)
```

* **acceptInvitation** - Accept an invitation.

```ts
import { acceptInvitation } from '@credebl/ssi-mobile'

const connection = await acceptInvitation(agent, invitation, config)
```

* **parseInvitationFromUrl** - Parse an invitation from a url.

```ts
import { parseInvitationFromUrl } from '@credebl/ssi-mobile'

const invitation = await parseInvitationFromUrl(agent, invitationUrl)
```

* **acceptInvitationFromUrl** - Accept an invitation from a url.

```ts
import { acceptInvitationFromUrl } from '@credebl/ssi-mobile'

const connection = await acceptInvitationFromUrl(agent, invitationUrl, config)
```

* **getAllConnections** - Get all connections.

```ts
import { getAllConnections } from '@credebl/ssi-mobile'

const connections = await getAllConnections(agent)
```

* **getConnectionById** - Get a connection by id.

```ts
import { getConnectionById } from '@credebl/ssi-mobile'

const connection = await getConnectionById(agent, connectionId)
```

* **findConnectionById** - Find a connection by id.

```ts
import { findConnectionById } from '@credebl/ssi-mobile'

const connection = await findConnectionById(agent, connectionId)
```

* **findOutOfBandRecordById** - Find an out of band record by id.

```ts
import { findOutOfBandRecordById } from '@credebl/ssi-mobile'

const record = await findOutOfBandRecordById(agent, recordId)
```

* **findByReceivedInvitationId** - Find an out of band record by  invitation id.

```ts
import { findByReceivedInvitationId } from '@credebl/ssi-mobile'

const record = await findByReceivedInvitationId(agent, receivedInvitationId)
```

* **deleteConnectionRecordById** - Delete a connection record by id.

```ts
import { deleteConnectionRecordById } from '@credebl/ssi-mobile'

await deleteConnectionRecordById(agent, connectionId)
```

* **deleteOobRecordById** - Delete a out-of-band record by id.

```ts
import { deleteOobRecordById } from '@credebl/ssi-mobile'

await deleteOobRecordById(agent, outOfBandId)
```

### Credentials

* **getAllCredentialExchangeRecords** - Get all credential exchange records.

```ts
import { getAllCredentialExchangeRecords } from '@credebl/ssi-mobile'

const records = await getAllCredentialExchangeRecords(agent)
```

* **getFormattedCredentialData** - Retrieves the formatted data for a given credential record ID.

```ts
import { getFormattedCredentialData } from '@credebl/ssi-mobile'

const formattedData = await getFormattedCredentialData(agent, credentialRecordId)
```

* **acceptCredentialOffer** - Accept a credential offer.

```ts
import { acceptCredentialOffer } from '@credebl/ssi-mobile'

const credential = await acceptCredentialOffer(agent, options)
```

* **updateCredentialExchangeRecord** - Update a credential exchange record. This can be used to add or update the metadata of credential exchange record.

```ts
import { updateCredentialExchangeRecord } from '@credebl/ssi-mobile'

await updateCredentialExchangeRecord(agent, credentialRecord)
```

* **declineCredentialOffer** - Decline a credential offer.

```ts
import { declineCredentialOffer } from '@credebl/ssi-mobile'

const record = await declineCredentialOffer(agent, credentialRecordId)
```

* **deleteCredentialExchangeRecordById** - Delete a credential exchange record by id.

```ts
import { deleteCredentialExchangeRecordById } from '@credebl/ssi-mobile'

await deleteCredentialExchangeRecordById(agent, credentialRecordId, options)
```

* **sendCredentialProblemReport** - Send a credential problem report.

```ts
import { sendCredentialProblemReport } from '@credebl/ssi-mobile'

const record = await sendCredentialProblemReport(agent, options)
```

* **getW3cCredentialRecordById** - Get a W3C credential record by id.

```ts
import { getW3cCredentialRecordById } from '@credebl/ssi-mobile'

const record = await getW3cCredentialRecordById(agent, credentialRecordId)
```

* **getAllW3cCredentialRecords** - Get all W3C credential records.

```ts
import { getAllW3cCredentialRecords } from '@credebl/ssi-mobile'

const records = await getAllW3cCredentialRecords(agent)
```

### Proofs

* **getProofFormatData** - Get proof format data.

```ts
import { getProofFormatData } from '@credebl/ssi-mobile'

const data = await getProofFormatData(agent, proofRecordId)
```

* **getCredentialsForProofRequest** - Get credentials for a proof request.

```ts
import { getCredentialsForProofRequest } from '@credebl/ssi-mobile'

const credentials = await getCredentialsForProofRequest(agent, options)
```

* **selectCredentialsForProofRequest** - Select credentials for a proof request.

```ts
import { selectCredentialsForProofRequest } from '@credebl/ssi-mobile'

const credentials = await selectCredentialsForProofRequest(agent, options)
```

* **getProofRequestAgentMessage** - Get a proof request agent message.

```ts
import { getProofRequestAgentMessage } from '@credebl/ssi-mobile'

const message = await getProofRequestAgentMessage(agent, proofRecordId)
```

* **createProofRequest** - Create a proof request.

```ts
import { createProofRequest } from '@credebl/ssi-mobile'

const proofRequest = await createProofRequest(agent, options)
```

* **requestProof** - Request a proof.

```ts
import { requestProof } from '@credebl/ssi-mobile'

const proof = await requestProof(agent, options)
```

* **updateProofRecord** - Update a proof record.

```ts
import { updateProofRecord } from '@credebl/ssi-mobile'

await updateProofRecord(agent, proofRecord)
```

* **acceptProofRequest** - Accept a proof request.

```ts
import { acceptProofRequest } from '@credebl/ssi-mobile'

const proof = await acceptProofRequest(agent, options)
```

* **declineProofRequest** - Decline a proof request.

```ts
import { declineProofRequest } from '@credebl/ssi-mobile'

const proof = await declineProofRequest(agent, options)
```

* **sendProofProblemReport** - Send a proof problem report.

```ts
import { sendProofProblemReport } from '@credebl/ssi-mobile'

const proof = await sendProofProblemReport(agent, options)
```

### BasicMessages

* **sendBasicMessage** - Send a basic message.

```ts
import { sendBasicMessage } from '@credebl/ssi-mobile'

const record = await sendBasicMessage(agent, options)
```

### PushNotifications

* **setPushNotificationDeviceInfo** - Set the push notification device info.

```ts
import { setPushNotificationDeviceInfo } from '@credebl/ssi-mobile'

await setPushNotificationDeviceInfo(agent, options)
```

### Hooks

* **useAdeyaAgent** - React hooks to get the agent instance.

```ts
import { useAdeyaAgent } from '@credebl/ssi-mobile'

const { agent } = useAdeyaAgent()
```
