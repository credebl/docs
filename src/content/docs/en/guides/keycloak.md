---
title: Keycloak Setup using Docker
description: A reference page in my new CREDEBL docs site.
---

Keycloak is an open source identity and access management solution.

This guide aims to walk you through the setup of Keycloak using Docker, facilitating easy authentication and authorization management within the application.

To set up Keycloak as a Docker image, follow these steps:

```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:23.0.6 start-dev
```

This command installs and starts Keycloak at the specified endpoints, locally accessible at http://localhost:8080.

## Once logged in:
This section guides you through the initial setup and configuration of Keycloak through its administration console.

1. Go to **administration console**
2. Login using username: admin,  password: admin.
3. Go to master and add a new realm as ***“credebl-platform”***.
4. Go to the client and add a new client as a ***clientId = “adminClient”***.
5. Click on **Next** Button
6. Set client authentication to **ON** mode.
7. Set Service Accounts Roles to **ON** mode.
8. Set Direct Access Grants to **ON** mode.
9. Click on **Next** Button
10. Add http://your-url/* (Eg.: http://localhost:3000/*) in ***Valid Redirect URIs***  as front-end url.
11. Add http://your-url/ (Eg.: http://localhost:8080/) in ***Root URL***.
12. Add http://your-url/ (Eg.: http://localhost:8080/) in ***Web Origins***.
13. Save the details
14. Goto **Realm settings** and click on the **Tokens** tab section
    1. Set ***Revoke refresh*** token ON.
    2. Set ***Access tokens*** lifespan.
14. Click on the **Save** button.

## Service Account Roles Settings:

This section outlines the configuration of service account roles to manage permissions and access control within Keycloak.

1. Go to **adminClient** by selecting from the clients side tab.
2. Go to the **Service account role** section.
3. Click on the **Assign role** button.
4. Select **Filter by clients** from the dropdown menu.
5. Select the below roles from the Available Roles and click on the **Assign** button:
    - Create-client
    - Manage-client
    - Manage-users
    - Query-clients
    - Query-users
    - View-clients
    - View-users

## Realm Roles Settings:
This section covers the configuration of realm role settings within Keycloak.

1. Under the **credebl-platform** realm, from the menu select **realm-roles**.
2. In **realm-roles**, click on **Create Role** and create a role with **Role name**=**"holder"**, as when a new user registers on the platform we are assigning him a **"holder"** role from the realm.

## SSO Session Settings:

Set SSO Session Idle to 2 days. This is the expiration time of the refresh token if the user is idle on the platform. We can configure this as per our need.


## Update the .env

This section covers the setup of environment variables for seamless integration with your application

Update the .env file for the Keycloak details:
```bash
KEYCLOAK_DOMAIN=http://localhost:8080/
KEYCLOAK_ADMIN_URL=http://localhost:8080
KEYCLOAK_MASTER_REALM=master
KEYCLOAK_MANAGEMENT_CLIENT_ID=adminClient
KEYCLOAK_MANAGEMENT_CLIENT_SECRET=
KEYCLOAK_REALM=credebl-platform
```

To set the env variable ***KEYCLOAK_MANAGEMENT_CLIENT_SECRET***, go to **clients >> Credentials** tab and copy the client secret

## Add users manually (Optional):

This section provides guidance on adding users manually to the Keycloak realm.

1. Go to **users**.
2. Add **username**: ***your.email@your.domain*** and **email**: ***your.email@your.domain***.
3. Enable user and email, then click on **save**.
4. Change the password in the credential section for user login.
5. Update the Keycloak userId in the users table in the local database.
6. Also update the ***client secret key*** in the .env file, which you will get in the credential section of **adminClient** in the **client** section.
7. Test the flow by logging in to platform admin.