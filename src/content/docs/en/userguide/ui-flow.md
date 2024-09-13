---
title: Studio UI flow
description: A reference page in my new CREDEBL docs site.
---

## Getting Started

- Let’s get started with creating an account if you are new to CREDEBL. If you already have an account, you can skip this section and continue with the next section.

## Create an account

- You will come across the Sign-Up button from where you can start the process of creating your account. It will ask you few details as -
1) **Email id**:  Valid email id where you will receive an email verification link to validate your email account.
2) **First Name and Last Name**: To address the user with the name.
3) **Authentication method**: There are 2 ways to secure your login to the application. 
You can choose any one of them according to your choice.  
    a. Password: Usual way of entering the password where you need to remember it. It will ask you to enter your password twice to confirm it and your sign up process will be done.     
    b. Passkey: An alternative secure way to login on multiple devices, where you don’t need to remember the complex password. There are different ways to save this passkey as mentioned below. You can choose any one according to your choice.                           
        i) iCloud Keychain                                   
        ii) Use a phone or tablet                                    
        iii) Your Chrome profile                                         
        iv) USB security key

- This will conclude your sign up process.
This concludes the successful creation of your account. Now, you are all set to login to the application.


## Create Organization

- Organization plays an important role in the SSI world, as it is very important to associate all the operations related to one entity at one place, and organization does that work.
- As soon as the user gets logged In, the first step is to set up the organization.
- Users will see the details screen in which they have to enter the information:
1. Logo - Users can provide the unique identification image for their organization.
2. Name- User has to provide the name for the organization, which is mandatory.
3. Description- The field is provided to fill in the details for the organization, providing description while creating the organization is mandatory.


## Create Wallet

- Digital wallet’s purpose is the same as the real world wallet. It is mandatory to have a wallet to be created, before we proceed to the further process.
When the user creates a wallet, the dedicated storage space gets allocated to the organization.
- Wallets can be created on different types of ledgers, each ledger has its own Methods and Network types. Indy, Polygon and No Ledger are the different types of ledgers.

There are different procedures to move ahead using each ledger, now we will understand one by one.


## 1. Working flow with Indy Ledger

- Now, we will understand the flow with the Indy ledger. There are multiple methods and networks which users can use. Once the user selects the required method and network which are going to be used in Indy Ledger, the wallet gets created. Users will see all the details of the wallet on the screen, the generated QR based on details, will also be a part display screen.
- To get connected with the organization, users have to Install the Adeya wallet and scan the QR using the application's scanner.
- Users need to connect with the organization, to establish secure and seamless exchange of information.
- Adeya wallet, this is the digital wallet application, which will be installed in the end user’s mobile for their use.


## 1.1. Create Schema

- Now, the next step is to provide the template in which we will be getting the information for the use. Schema is nothing but a template of the data, which the user is going to provide for the use. 
- User can reach the Schema creation screen using two ways:
1) One, User can click directly on the Schema’s tab on the dashboard and can reach the creation screen.
2) Second, from the organization details screen, User can click on the Schema tab.
- While creating the schema, the user has to enter the Schema name, Version and attributes.
Version means, if the schema is already created based on the certain attributes already, then that is version 1.
- Users can use already created attributes and modify schema as per choice, that can be called version 2.
- Version is option is provided, if the user wants to slightly modify the already created schema. User can provide multiple attributes to the schema. Attributes means the information which the user wants as an input for the use. User has to provide the attribute details such as Attribute name, Data type and Display name. Amongst this, the Display Name is not mandatory but we have to provide at least one attribute to create the schema.


## 1.2. Create Credential Definition
- Credential Definition can be defined as the entity which owns the schema. When the user is using the Indy ledger, it is mandatory to provide the credential definition before issuance. Users can create the credential definition, at the runtime as well while doing the issuance process.


## 1.3. Issuance
- Till now, we have done all the prerequisites which we will need to begin with the issuance process. Users can reach the issuance screen, by clicking “Issue” under the Credential Tab on the dashboard. Alternative way to reach the issuance screen is from the Schema Tab under the organization details.

There are three types of methods by which issuance can be done.
#### i. **Using the Connection**

- If the user chooses the Connection method for issuance and move forward.
User has to select the Schema, for which the user wants to issue the credential for, 
Once the schema is selected, the next step is to create the credential definition.
Users will be able to see the already created credential definitions against that particular schema. Once a user selects the schema and credential definition of choice they can proceed to the next step.
- Now, the user will see the connection list, the list will contain the list of the devices to which your organization is connected. Users can select the one from the list, and fill in the attribute details for the selected one and click on the Issue button.
- The user will get the notification inside the wallet on the smartphone, to accept or reject the credential. If User accepts the credential, he will see the credential under the credentials tab in his smartphone. 

#### ii. **Using the Email**

- If the user chooses the Email method for issuance and move forward.
They will see the list of already created credential definitions.
After selecting the schema as well as credential definition, the user has to fill in the attribute details with the email id, on which user wants to issue credential for.
- Next, the user has to click on the Issue button, and give the confirmation to proceed. After this process, User will receive an email for issuing credentials.
Then, User has to scan the QR at the bottom of the email with the Adeya wallet QR scanner. 
- Now, the user will get the notification inside the wallet on the smartphone, to accept or reject the credential. If User accepts the credential, the credential will get stored under the credentials tab in his smartphone. 

#### iii. **Using Bulk Issuance**

- Now, we will see how the issuance is done using the Bulk Issuance method.
While doing the issuance using this method, users need to select the Schema and Credential Definition from the drop-down.
- Users can create the new schema and new Credential Definition at run time as well. Once the user selects the schema and the credential definition, we can proceed to download the .CSV file. This file will have the columns in which you have to fill the respective associated values. After finishing the data fill-up process, you have to upload the .CSV file. Once the upload is successful, you will see the data in the window at downside. If the data appears correct, you can click the Issue button and the issuance process will begin.


## 1.4. Verification
- Till now, we have seen how the issuance is done with the help of different methods using the ledger Indy. Now, we will see how the verification process takes place. 
- You can reach the Verification Screen by clicking on the Verify button under the Credentials tab on the dashboard. Verification is done using two methods, one is using the Connection method and other is using the Email.
Users can reach the verification screen by clicking on the Verify button under the Credentials tab. 
- To Initiate the verification process by any method, users need to click on the Request button on the Verification screen. 

As we seen in the issuance process, for the verification also we have two methods:
#### i. **Using the Connection Method**

- After choosing the Connection method for verification, first user has to select the schema for which you want to do the verification. Once the user selects the schema, the associated credential definitions to that schema will be displayed at the bottom.
- The user has to select the credential definition of choice, using the checkbox at the right end and click on the Continue button. Connection List will appear, this list shows the user, the devices connected to your organization.
- Once the user selects the connection which you want to verify, click on the Continue button. Now, you will see the Attributes associated with that schema, here you have to select the attributes you want to verify.
- Once the selection is done, the user has to click on the Request Proof button.
On the mobile side, User will receive the Proof Request in the mobile application, the user has to view the request and choose the action to perform. Action is to either share the requested information or to decline the request.

#### ii. **Using the Email Method**

- After choosing this method for verification, first you have to select the schema for which you want to do the verification. Once the user selects the schema, the associated credential definitions to that schema will be displayed at the bottom. The user has to select the credential definition of choice, using the checkbox at the and click on the Continue button.
- Now, user will see the Attributes associated with that schema, here you have to select the attributes you want to verify. Once the selection is done, the user has to click on the Continue button.
- Here on the new screen, user will see the field of entering the email address. At least one email address is mandatory for the verification process to begin, you can add multiple addresses at the run time. After entering the email id, user has to click on the Request Proof button.
- On the mobile side, User will receive the Proof Request in the application, the user has to view the request and choose the operations to perform.Operation is to either share the requested information or to decline the request.


## 2. Working Flow with using the W3C standards


- #### Flow with Polygon Ledger
- Before we start with the issuance using Polygon Ledger. It is important to create an organization which we saw earlier ( Refer: [Create Organization](https://docs.google.com/document/d/1W5GcUOELbmM7d12bsPFNLkB2Db6qlPTHW40VxujT_SI/edit#heading=h.rilblg99kjuh)). Once a user has created the organization, the next step is the creation of the wallet.
Here, the user has to select the method and the network which you are going to use.
- After selecting the method and the network, the user will also need the private Key while using the polygon.
Users can generate the new key, by clicking on the Generate button.
- If the user already has a private key, the user can mark the check box of already existed and paste the Private Key in the text box. Once done, the wallet gets created for the organization. Now, users can proceed for the schema creation and other processes.


- #### Flow with NoLedger
- Before we start with the issuance using NoLedger. It is important to create an organization which we saw earlier ( Refer: [Create Organization](https://docs.google.com/document/d/1W5GcUOELbmM7d12bsPFNLkB2Db6qlPTHW40VxujT_SI/edit#heading=h.rilblg99kjuh)). 
- Once a user has created the organization, the next step is the creation of the wallet. Assume that the user has already created the organization. Now, we have to create the wallet for the organization.

We can do that by using two methods, did : key and did : web.

1. Using did : web
- Once a user selects this method, the user has to enter the domain name and wallet label which is mandatory. After entering the domain name, the user will get the did document. User has to paste this did document in a .wellknown file.
- .wellknown file can be hosted anywhere on domain/server. Once, the user pastes the did doc to into the .wellknown file the wallet gets associated with the organization.They can proceed for the schema creation and other processes.

2. Using did : key
- Once a user selects this method, the user has to enter the domain name in the visible text field. After submission, the wallet gets associated with the organization. Now, users can proceed for the schema creation and other processes.


## 2.1. Create Schema
- Now, the next step is to provide the template in which we will be getting the information for the use. Schema is nothing but a template of the data, which the user is going to provide for the use. 
- User can reach the Schema creation screen using two ways:
1) One, User can click directly on the Schema’s tab on the dashboard and can reach the creation screen.
2) Second, from the organization details screen, User can click on the Schema tab.
- While creating the schema, the user has to enter the Schema name, attributes.
- User can provide multiple attributes to the schema. Attributes means the information which the user wants as an input for the use. User has to provide the attribute details such as Attribute name, Data type and Display name. Amongst this, the Display Name is not mandatory but we have to provide at least one attribute to create the schema.

## 2.2. Issuance Using W3C standards
- After the creation of the Organization and wallet, user will proceed to the issuance.Now they have to create the schema for the organization. Unlike the Indy ledger, we are not able to create the versions of the schema here.
- Once a schema is created, we can see the standard by which it has been created.
Users can also select the schema from the existing ones. 
- Once the user has the schema, they can proceed to issuance by any of the three issuing methods which are, Connection, Email and Bulk issuance.

#### i. Using Connection Method

- User has already selected the Schema, one for which the user wants to issue the credential. If the user chooses the connection method for issuance and move forward. Now, the user will see the connection list, the list will contain the devices list to which your organization is connected.
- Users can select the one from the list, and fill in the attribute details for the selected one. Now, the user will get the notification inside the wallet on the smartphone, to accept or reject the credential.
- If User accepts the credential, they will see the credential under the credentials tab in their smartphone. 

#### ii. Using Email Method

- Once the user has the schema, either created or selected from the drop-down and selects the email method for issuance. After this process, the user has to fill in the attribute details with the email id, to which he wants to issue credentials for.
- Next user has to click on the Issue button, and give the confirmation to proceed. After this process, they will receive an email for issuing credentials.
Then, User has to scan the QR at the bottom of the email with the Adeya wallet. Now, the user will get the notification inside the wallet on their smartphone, to accept or reject the credential.
- If User accepts the credential, the credential will get stored under the credentials tab in his smartphone. 

#### iii. Using Bulk Issuance

- When users choose issuance using this method, they need to select the Schema from the drop-down. Users can create the new schema at run time as well.
Once the user selects the schema, the next step is to download the .CSV file.
- .CSV file will have the columns in which they have to fill the respective associated values. After finishing the data fill-up process, they have to upload the .CSV file.
- Once the upload is successful, users will see the data in the window at downside. If the data appears correct, the user can click the Issue button and the issuance process will begin.

## 2.3. Verification Using W3C standards
- You can reach the Verification Screen by clicking on the Verify button under the Credentials tab on the dashboard. Verification is done using two methods, one is using the Connection method and other is using the Email.
- Users can reach the verification screen by clicking on the Verify button under the Credentials tab. To Initiate the verification process by any method, users need to click on the Request button on the Verification screen. As we seen in the issuance process, for the verification also we have two methods:


#### i. Using the Connection Method

After choosing this method for verification, the first user has to select the schema for which you want to do the verification. Once the user selects the schema, connection List will appear, this list shows them the devices connected to the organization.
Once the user has to select the connection which they want to verify, and then click on the Continue button. Now, the user will see the Attributes associated with that schema, here they have to select the attributes you want to verify. Once the selection is done, the user has to click on the Request Proof button.
On the mobile side, User will receive the Proof Request in the application, the user has to view the request and choose the action to perform. Action is to either share the requested information or to decline the request.

#### ii. Using the Email Method

After choosing this method for verification, first users have to select the schema for which they want to do the verification. Once the user selects the schema, they will see the Attributes associated with that schema, here the user has to select the attributes they want to verify.
Once the selection is done, the user has to click on the Continue button. Here on the new screen, they will see the field of entering the email address. At least one email address is mandatory for the verification process to begin, they can add multiple addresses at the run time. After entering the email id, users have to click on the Request Proof button.
On the mobile side, User will receive the Proof Request in the application, the user has to view the request and choose the action to perform. Action is to either share the requested information or to decline the request.








