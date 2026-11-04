---
icon: user-gear
---

# Admin portal

***

Clone the platform-admin repository:

<pre><code><strong>git clone https://github.com/credebl/platform-admin.git &#x26;&#x26; cd platform-admin/
</strong></code></pre>

Create a .env file and set the required environment variables as per the `.env.example` file.

*   Update the following environment variables:

    * `NEXT_PUBLIC_PLATFORM_CLIENT_ID`
    * `NEXT_PUBLIC_PLATFORM_CLIENT_SECRET`

    You can obtain these values from the platform environment variables `ADMIN_KEYCLOAK_ID` and `ADMIN_KEYCLOAK_SECRET`, or directly from the **Keycloak Dashboard** by navigating to the **`adminClient`** client within your realm.
* Before updating these variables, ensure that an Admin Portal client has been created in Keycloak. If the client does not exist, refer to the [**Create Admin Client**](https://docs.credebl.id/docs/contribute/setup/service-setup#create-adminclient) guide for setup instructions.
* When updating the `.env` file, set `NEXT_PUBLIC_PLATFORM_CLIENT_ID` and `NEXT_PUBLIC_PLATFORM_CLIENT_SECRET` using the raw Keycloak client ID and client secret values. Do not use encrypted or encoded values.
* The Platform admin portal requires bun package manager ensure the dependency is installed.
* For NextAuth SSO, please refer to the `env.demo` file for the required NextAuth-related values.
* `NEXTAUTH_SECRET` Generate this secret by referring [here](https://next-auth.js.org/configuration/options#nextauth_secret.) (Only for v2.1.0).
*   Add the backend URL for `PUBLIC_ALLOW_DOMAIN`

    ```
    PUBLIC_ALLOW_DOMAIN=http://{your-ip}:{api-gateway-port}
    ```
* Use the admin credentials generated from platform seed script to login and access the UI.&#x20;

Install dependencies and start the Admin Portal UI:

```
bun i 
bun run start
```

Access the Admin Portal UI by navigating to:

Note: the port could be different based on configuration and availability.&#x20;

```
http://localhost:3000
```
