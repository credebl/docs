---
title: Studio UI
description: A reference page in my new CREDEBL docs site.
---

## Getting Started

Let’s get started with creating an account if you are new to CREDEBL. If you already have an account, you can skip this section and continue with the next section.

## Create an account

You will come across the Sign-Up button from where you can start the process of creating your account. It will ask you few details, such as:
1) **Email id**: Valid email id where you will receive an email verification link to validate your email account.
2) **First Name and Last Name**: To address you by your name.
3) **Authentication Method**: There are two ways to secure your login to the application. 
     You can choose either one according to your preference.  
    a. Password: The usual method of entering a password, which you will need to remember. It will ask you to enter your password twice to confirm it, and then your sign-up process will be complete.     
    b. Passkey: An alternative secure method to log in on multiple devices, where you don’t need to remember a complex password. There are different ways to save this passkey, as mentioned below. You can choose any of the following options:                           
        i) iCloud Keychain                                   
        ii) Use a phone or tablet                                    
        iii) Your Chrome profile                                         
        iv) USB security key                  
        This will conclude your sign-up process. 

This concludes the successful creation of your account. Now, you are all set to login to the application.

## Create Organization
An organization plays an important role in the SSI world, as it is very important to associate all the operations related to one entity at one place, and organization does that work.    
As soon as you get log in, the first step is to set up the organization.     
You will see a details screen where you need to enter the following information:
1. Logo: You can provide a unique identification image for their organization.
2. Name: You must provide the name of the organization (this is mandatory).
3. Description: This field is provided to fill in details about the organization, and providing a description while creating the organization is mandatory.

## Create Wallet

- A digital wallet serves as a secure storage space for managing credentials, just like a real-world wallet stores physical cards and cash. In this context, the wallet is essential for handling decentralized identity credentials.
- The wallet you will be working with is the [Askar Aries Wallet](https://credo.js.org/guides/getting-started/set-up/aries-askar), a key component in SSI ecosystems. Before proceeding with further steps, it is mandatory to create a wallet, as it is crucial for managing verifiable credentials and facilitating interactions within the network.
- When you create an Askar Aries wallet, a secure storage space is allocated for the organization, enabling it to hold and manage digital credentials.


## 1. Workflow with Indy Ledger

- Now, we will understand the flow with the Indy ledger. There are multiple methods and networks that can be used. Once you select the required method and network within the Indy Ledger, the wallet gets created. You will see all the wallet details on the screen, including a generated QR code based on the details, which will also be displayed.
- To get connected with the organization, you have to Install the Adeya wallet and scan the QR using the application's scanner.
- You need to connect with the organization, to establish secure and seamless exchange of information.
- Adeya wallet, this is the digital wallet application, which will be installed in your mobile for your use.

## 1.1. Create Schema

- Now, the next step is to provide the template in which we will be getting the information for the use.
- Schema serves as a template that specifies the data fields for credentials, which are stored on a distributed ledger. You can reach the Schema creation screen using two ways:
1) One, You can click directly on the Schema’s tab on the dashboard and can reach the creation screen.
2) Second, from the organization details screen, You can click on the Schema tab.
While creating a schema, you must define the following:
- **Schema Name**: A unique name for your schema
- **Version**: This indicates the iteration of the schema. Version 1 will be the initial schema created with specific attributes. If you modify it later, the new version (e.g., version 2) will reflect those changes.
- **Attributes**: These are the fields that will appear in the credential based on this schema. Each attribute requires:                   
        i. Attribute Name: The specific name of the data field (e.g., "First Name").        
        ii. Data Type: The type of data (e.g., text, number, date).            
        iii. Display Name: An optional label for how the attribute will appear in the UI (not mandatory).

- You can use existing attributes to create new schemas or modify them to create updated versions.
- You can also utilize schemas created by other organizations by switching from your organization’s schema list to the All Schemas option.
- Once the schema is created, it will be registered on the distributed ledger, making it available for use in issuing verifiable credentials within the SSI framework. The ledger ensures the schema's immutability and accessibility for future credential issuance.



## 1.2. Create Credential Definition
- Credential Definition can be defined as the entity which owns the schema. When you are using the Indy ledger, it is mandatory to provide the credential definition before issuance. You can create the credential definition, at the runtime as well while doing the issuance process.

## 1.3. Issuance
- Till now, we have done all the prerequisites which we will need to begin with the issuance process. You can reach the issuance screen, by clicking “Issue” under the Credential Tab on the dashboard. Alternative way to reach the issuance screen is from the Schema Tab under the organization details.

There are three types of methods by which issuance can be done.

#### i. **Using the Connection**

- If you choose the Connection method for issuance and move forward.
You have to select the Schema, for which you want to issue the credential for, 
Once the schema is selected, the next step is to create the credential definition.
You will be able to see the already created credential definitions against that particular schema. Once you select the schema and credential definition of choice they can proceed to the next step.
- Now, you will see the connection list, the list will contain the list of the devices to which your organization is connected. You can select the one from the list, and fill in the attribute details for the selected one and click on the Issue button.
- You will get the notification inside the wallet on the smartphone, to accept or reject the credential. If You accept the credential, you will see the credential under the credentials tab on your smartphone.

#### ii. **Using the Email**

- If you choose the Email method for issuance and move forward.
You will see the list of already created credential definitions.
After selecting the schema as well as credential definition, you have to fill in the attribute details with the email id, on which you want to issue credential for.
- Next, you have to click on the Issue button, and give the confirmation to proceed. After this process, you will receive an email for issuing credentials.
You have to scan the QR at the bottom of the email with the Adeya wallet QR scanner.  
- Now, you will get the notification inside the wallet on the smartphone, to accept or reject the credential. If you accept the credential, the credential will get stored under the credentials tab in your smartphone. 

#### iii. **Using Bulk Issuance**

- Now, we will see how the issuance is done using the Bulk Issuance method.
While doing the issuance using this method, you need to select the Schema and Credential Definition from the drop-down.
- You can create the new schema and new Credential Definition at run time as well. Once you select the schema and the credential definition, you can proceed to download the .CSV file. This file will have the columns in which you have to fill the respective associated values. After finishing the data fill-up process, you have to upload the .CSV file. Once the upload is successful, you will see the data in the window at downside. If the data appears correct, you can click the Issue button and the issuance process will begin.

## 1.4. Verification
- Till now, we have seen how the issuance is done with the help of different methods using the ledger Indy. Now, we will see how the verification process takes place.  
- You can reach the verification screen by clicking on the Verify button under the Credentials tab. To Initiate the verification process by any method, you need to click on the Request button on the Verification screen. As we seen in the issuance process, for the verification also we have two methods:

#### i. **Using the Connection Method**

- After choosing the Connection method for verification, first you have to select the schema for which you want to do the verification. Once you select the schema, the associated credential definitions to that schema will be displayed at the bottom.
- You have to select the credential definition of choice, using the checkbox at the right end and click on the Continue button. Connection List will appear, this list shows you, the devices connected to your organization.
- Once you select the connection which you want to verify, click on the Continue button. Now, you will see the Attributes associated with that schema, here you have to select the attributes you want to verify.
- Once the selection is done, you have to click on the Request Proof button.
On the mobile side, you will receive the Proof Request in the mobile application, you have to view the request and choose the action to perform. Action is to either share the requested information or to decline the request.

#### ii. **Using the Email Method**

- After choosing this method for verification, first you have to select the schema for which you want to do the verification. Once you select the schema, the associated credential definitions to that schema will be displayed at the bottom. Then you have to select the credential definition of choice, using the checkbox at the and click on the Continue button.
- Now, you will see the Attributes associated with that schema, here you have to select the attributes you want to verify. Once the selection is done, you have to click on the Continue button.
- Here on the new screen, you will see the field of entering the email address. At least one email address is mandatory for the verification process to begin, you can add multiple addresses at the run time. After entering the email id, you have to click on the Request Proof button.
- On the mobile side, you will receive the Proof Request in the application, you have to view the request and choose the operations to perform. Operation is to either share the requested information or to decline the request.

## 2. Workflow with the W3C standards

- #### Workflow with Polygon Ledger
- Before we start with the issuance using Polygon Ledger. It is important to create an organization which we saw earlier ( Refer: [Create Organization](https://docs.google.com/document/d/1W5GcUOELbmM7d12bsPFNLkB2Db6qlPTHW40VxujT_SI/edit#heading=h.rilblg99kjuh)). Once you have created the organization, the next step is the creation of the wallet.
- Here, you have to select the method and the network which you are going to use.
After selecting the method and the network, you will also need the private Key while using the polygon.
- You can generate the new key, by clicking on the Generate button.
If you already have a private key, then you can mark the check box of already existed and paste the Private Key in the text box. Once done, the wallet gets created for the organization. Now, you can proceed with the schema creation and other processes.

- #### Workflow with NoLedger
- Before we start with the issuance using NoLedger. It is important to create an organization which we saw earlier ( Refer: [Create Organization](https://docs.google.com/document/d/1W5GcUOELbmM7d12bsPFNLkB2Db6qlPTHW40VxujT_SI/edit#heading=h.rilblg99kjuh)). 
- Once you have created the organization, the next step is the creation of the wallet. Assume that you have already created the organization. Now, we have to create the wallet for the organization.
We can do that by using two methods, did : key and did : web.

1. Using did : web
- Once you select this method, you have to enter the domain name and wallet label which is mandatory. After entering the domain name, you will get the did document. You have to paste this did document in a .wellknown file.
- .wellknown file can be hosted anywhere on domain/server. Once, you paste the did doc to into the .wellknown file the wallet gets associated with the organization.
You can proceed for the schema creation and other processes.

2. Using did : key
- Once you select this method, then you have to enter the domain name in the visible text field. After submission, the wallet gets associated with the organization. Now, you can proceed for the schema creation and other processes.

## 2.1. Create Schema using W3C standards
- Now, the next step is to provide the template in which we will be getting the information for the use.
- Schema serves as a template that specifies the data fields for credentials, which are stored on a distributed ledger. You can reach the Schema creation screen using two ways:
1) One, You can click directly on the Schema’s tab on the dashboard and can reach the creation screen.
2) Second, from the organization details screen, You can click on the Schema tab.
While creating a schema with W3C standards, you must define the following:
- **Schema Name**: A unique name for your schema
- **Attributes**: These are the fields that will appear in the credential based on this schema. Each attribute requires:                   
        i. Attribute Name: The specific name of the data field (e.g., "First Name").        
        ii. Data Type: The type of data (e.g., text, number, date).            
        iii. Display Name: An optional label for how the attribute will appear in the UI (not mandatory).

- You can use existing attributes to create new schemas or modify them to create updated versions.
- You can also utilize schemas created by other organizations by switching from your organization’s schema list to the All Schemas option.
- Once the schema is created, it will be registered on the distributed ledger, making it available for use in issuing verifiable credentials within the SSI framework. The ledger ensures the schema's immutability and accessibility for future credential issuance.

## 2.2. Issuance Using W3C standards
- After the creation of the Organization and wallet, you will proceed to the issuance. Now they have to create the schema for the organization. Unlike the Indy ledger, we are not able to create the versions of the schema here.
- Once a schema is created, we can see the standard by which it has been created.
You can also select the schema from the existing ones.  
- Once you have the schema, you can proceed to issuance by any of the three issuing methods which are, Connection, Email and Bulk issuance.

#### i. Using Connection Method

- You have already selected the Schema, one for which you want to issue the credential. If you choose the connection method for issuance and move forward. Now, you will see the connection list, the list will contain the devices list to which your organization is connected.
- You can select the one from the list, and fill in the attribute details for the selected one. Now, you will get the notification inside the wallet on the smartphone, to accept or reject the credential.
- If you accept the credential, you will see the credential under the credentials tab in your smartphone. 

#### ii. Using Email Method

- Once you have the schema, either created or selected from the drop-down and select the email method for issuance. After this process, you have to fill in the attribute details with the email id, to which you want to issue credentials for.
- Next, you have to click on the Issue button, and give the confirmation to proceed. After this process, you will receive an email for issuing credentials.
- Then, you have to scan the QR at the bottom of the email with the Adeya wallet. Now, you will get the notification inside the wallet on their smartphone, to accept or reject the credential.
- If you accept the credential, the credential will get stored under the credentials tab in your smartphone.  

#### iii. Using Bulk Issuance

- When you choose issuance using this method, you need to select the Schema from the drop-down. You can create the new schema at run time as well.
Once you select the schema, the next step is to download the .CSV file.
- .CSV file will have the columns in which they have to fill the respective associated values. After finishing the data fill-up process, you have to upload the .CSV file.
- Once the upload is successful, you will see the data in the window at downside. If the data appears correct, you can click the Issue button and the issuance process will begin.

## 2.3. Verification Using W3C standards
- You can reach the Verification Screen by clicking on the Verify button under the Credentials tab on the dashboard. Verification is done using two methods, one is using the Connection method and other is using the Email.
- You can reach the verification screen by clicking on the Verify button under the Credentials tab. To Initiate the verification process by any method, you need to click on the Request button on the Verification screen. As we seen in the issuance process, for the verification also we have two methods:

#### i. Using the Connection Method

- After choosing this method for verification, first you have to select the schema for which you want to do the verification. Once you select the schema, connection List will appear, this list shows them the devices connected to the organization.
- Once you have selected the connection which they want to verify, and then click on the Continue button. Now, you will see the Attributes associated with that schema, here they have to select the attributes you want to verify. Once the selection is done, you have to click on the Request Proof button.
- On the mobile side, You will receive the Proof Request in the application, you have to view the request and choose the action to perform. Action is to either share the requested information or to decline the request.

#### ii. Using the Email Method

- After choosing this method for verification, first you have to select the schema for which they want to do the verification. Once you select the schema, you will see the Attributes associated with that schema, here you have to select the attributes they want to verify
- Once the selection is done, you have to click on the Continue button. Here on the new screen, you will see the field of entering the email address. At least one email address is mandatory for the verification process to begin, you can add multiple addresses at the run time. After entering the email id, you have to click on the Request Proof button.
- On the mobile side, you will receive the Proof Request in the application, you have to view the request and choose the action to perform. Action is to either share the requested information or to decline the request.





