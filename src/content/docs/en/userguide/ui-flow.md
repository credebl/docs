---
title: Studio UI flow
description: A reference page in my new CREDEBL docs site.
---

## 1. User Sign-Up

- To get started with the workflow, Users need to register themselves on the platform. In order to register user needs to enter email id and click on verify email then one verifivcation link will be sent on entered email and when user clicks on that verify button email will be verifies and user will be able to create account. If the user account is already registered, User can proceed to login by entering email id.
- If the user is new, he has to create an account and sign-up.
- If the user chooses to create an account, the field of entering the email address will appear.
- User has to validate the email address by clicking the verify button sent in the email.
- Once the user is validated, he will be redirected to the signup page.
- There, User has to enter the first name and last name which is mandatory.
- After that, the user has to choose the authentication mechanism, he can use both.
- But for the start, users can proceed with one mechanism.
- If the user selects Password, then he has to set-up the password of choice.
- If the user selects Passkey, then one QR will appear on the screen and the user has to scan the QR with a scanner to get connected with the device.
- Once either of two authentication mechanisms is set, the user will get a message of Registration Successful and can proceed to login.


## 2. Organization Creation
- Once the user has been logged In, he has to set-up the organization.
- In the details screen, User has to provide Logo which is optional, then Name of the organization and Description of the organization.
- After filling all the details, click on Create Organization, and Organization will be created.


## 3. Creation of Wallet
- Once you have created the organization, the next step is the creation of a wallet.
- Wallets can be created on different types of ledgers, each ledger has its own Methods and Network types.
- Indy, Polygon and No Ledger are the different types of ledger.
- Once you select the required method and network which you want to use, the wallet gets created.
- You will see the wallet details along with QR.
- To get connected with the organization, users have to Install the Adeya wallet and scan the QR using the application's scanner.

- **Flow with Indy Ledger**
Once you select the required method and network which you want to use in Indy Ledger, the wallet gets created.

- **Flow with Polygon Ledger**
Once a user has created the organization, the next step is the creation of the wallet.
Here, the user has to select the method and the network which you are going to use.
After selecting the method and the network, you will also need the private Key while using the polygon.
Users can generate the new one, by clicking on the Generate button.
If the user already has a private key, he can mark the check box of already existed and paste the Private Key in the text box.
Once done, the wallet gets created for the organization.
Now, users can proceed for the schema creation and other processes.

- **Flow with NoLedger**
Assume that the user has already created the organization.
Now, we have to create the wallet for the organization.
We can do that by using two methods did : key and did : web

    1. **Using did : web**
    Once a user selects this method, the user has to enter the domain name and wallet label which is mandatory.
    After entering the domain name you will get the did document.
    You have to paste this did document in a .wellknown file.
    .wellknown file can be hosted anywhere on domain/server.
    Once, you paste the did doc to into the .wellknown file the wallet gets associated with the organization.
    Now, users can proceed for the schema creation and other processes.


    2. **Using did : key**
    Once a user selects this method, the user has to enter the domain name in the visible text field.
    After submission, the wallet gets associated with the organization.
    Now, users can proceed for the schema creation and other processes.



## 4. Schema Creation
- Next step is to create the schema, you can reach the Schema creation screen using two ways.
- One, you can click directly on the Schema’s tab on the dashboard and can reach on the creation screen.
- Second, from the organization details screen you can click on the Schema tab.
- While creating the schema, you have to enter the Schema name, Version and attributes.
- Version is option is provided, if the user wants to slightly modify the already created schema.
- You can provide multiple attributes to the schema.
- You have to provide the attribute details such as Attribute name, Data type and Display name.
- And for the schema to get created, you have to provide at least one attribute.

## 5. Creation of Credential Definition
- When the user is using the Indy ledger, he has to provide the credential definition before issuance.
- Users can create the credential definition, at the run time while doing the issuance process as well. 

## 6. Issuance
- Now after all the above settings, the issuance process begins.
- Users can start the issuance screen, by clicking Issue under the Credential Tab on the dashboard.
- Alternative way to reach the issuance screen, is from the Schema Tab under the organization details.
- There are three types of methods by which issuance can be done.

#### Using the Connection
If the user chooses the connection method for issuance and move forward.
User has to select the Schema, one for which the user wants to issue the credential for, next step is to create the credential definition.
Users will be able to see the already created credential definitions against that particular schema.
Once a user selects the schema and credential definition of choice he can proceed to the next step.
Now, the user will see the connection list, the list will contain the devices list to which your organization is connected.
Users can select the one from the list, and fill in the attribute details for the selected one.
Now, the user will get the notification inside the wallet on the smartphone, to accept or reject the credential.
If User accepts the credential, he will see the credential under the credentials tab in his smartphone. 


#### Using the Email
If the user chooses the Email method for issuance and move forward.
Users will see the list of already created credential definitions.
After selecting the credential definition, the user has to fill in the attribute details with the email id, to which he wants to icredential for.
Next user has to click on the Issue button, and give the confirmation to proceed.
After this process, User will receive an email for issuing credential.
Then, User has to scan the QR at the bottom of the email with the Adeya wallet.
Now, the user will get the notification inside the wallet on the smartphone, to accept or reject the credential.
If User accepts the credential, he will see the credential under the credentials tab in his smartphone. 

#### Using Bulk Issuance
Now, we will see how the issuance is done using the Bulk Issuance method.
While doing the issuance using this method, you need to select the Schema and Credential Definition from the drop-down.
Users can create the new schema and new Credential Definition at run time as well.
Once the user selects the schema and the credential definition, we can proceed to download the .CSV file.
.CSV file will have the columns in which you have to fill the respective associated values.
After finishing the data fill-up process, you have to upload the .CSV file.
Once the upload is successful, you will see the data in the window at downside.
If the data appears correct, you can click the Issue button and the issuance process will begin.



## 7. Verification Process
- Till now, we have seen how the issuance is done with the help of different methods using the ledger Indy.
- Now, we will see how the verification process takes place.
- You can reach the Verification Screen by clicking on the Verify button under the Credentials tab on the dashboard.
- Verification is done using two methods, one is using the Connection method and other is using the Email.
- To Initiate the verification process by any method, users need to click on the Request button.

#### Using the Connection Method
- After choosing this method for verification, first you have to select the schema for which you want to do the verification..
- Once the user selects the schema, the associated credential definitions to that schema will be displayed at the bottom.
- The user has to select the credential definition of choice, using the checkbox at the right end and click on the Continue button.
- Connection List will appear, this list shows you the devices connected to your organization.
- Once you select the connection which you want to verify, click on the Continue button.
- Now, you will see the Attributes associated with that schema, here you have to select the attributes you want to verify.
- Once the selection is done, the user has to click on the Request Proof button.
- On the mobile side, User will receive the Proof Request in the application, the user has to view the request and choose the operations to perform.
- Operation is to either share the requested information or to decline the request.


#### Using the Email Method
- After choosing this method for verification, first you have to select the schema for which you want to do the verification.
- Once the user selects the schema, the associated credential definitions to that schema will be displayed at the bottom.
- The user has to select the credential definition of choice, using the checkbox at the and click on the Continue button.
- Now, you will see the Attributes associated with that schema, here you have to select the attributes you want to verify.
- Once the selection is done, the user has to click on the Continue button.
- Here on the new screen, you will see the field of entering the email address.
- At least one email address is mandatory for the verification process to begin, you can add multiple addresses at the run time.
- After entering the email id, you have to click on the Request Proof button.
- On the mobile side, User will receive the Proof Request in the application, the user has to view the request and choose the operations to perform.
- Operation is to either share the requested information or to decline the request.











