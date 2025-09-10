# v.2.1.0

## Platform

1. Updated routes for the agent's multi-tenancy APIs from the platform.

### Changes need to be applied

* **Configure Agent API Key**

Add the key and value to your `.env`\
`AGENT_API_KEY=<ENCRYPTED_VALUE>` # e.g., U2FsdGVkX19PZaXwvbgPkRNN+ACfxQgFxK3M0d5bQ=



* **Update the Platform Admin key**

Encrypt your **raw** Agent API key using **AES** with `CRYPTO_PRIVATE_KEY`. You can use any [tool](https://aw-aes-encrypt-dcrypt.onrender.com/)          (OpenSSL, a CLI/GUI, or a small script). Update the `platform_admin` API key in the `org_agent` table for the relevant agent (**Shared** or **Dedicated**).



## Credo-Controller

1. Removed the duplicate routes for multi-tenancy.

### Changes need to be applied

* Add the key–value pair **apiKey** to your `cliConfig.json`  (required if you are running the agent locally).\
  &#xNAN;_&#x45;xample:_ `"apiKey": "U2FsdGVkX19PZaXwvbgPkRNN+ACfxQgFxK3M0d5bQ="`
*   You can obtain the base wallet token by providing the **apiKey**.

    <pre><code><strong>base_URL/agent/token
    </strong></code></pre>
* You can access the tenant wallet and perform operations using the tenant bearer token, which is returned in the response during tenant creation.

### SSO (Single Sign-On)

* Studio
  * [NextAuth.js](http://nextauth.js) is used for implementing SSO.
  * To run the application, refer to the `env.demo` file for the required NextAuth-related values.
  * Make sure these values are added to your `.env` file.
* Platform
  * As part of the SSO implementation, additional environment variables need to be set on the backend side as well.Please refer to the `env.demo` file for the required values when running the Platform.
  * As part of session management, for users who want to use the client ID / client secret based token generation feature, we have updated the response to include cookies.\
    Using these cookies, users can fetch their session details.
    *   To fetch the session details, call the following API while passing the stored cookies in the request headers`:`

        * `/auth/sessionDetails`



**SSO Integration Between CREDEBL and Other Frontend Applications**

* Frontend
  * For applications that need to use SSO, implement [NextAuth.js](https://next-auth.js.org/getting-started/introduction) in your frontend by adding the required environment variables.
  * For reference, you can check the Studio code or the official [NextAuth.js documentation](https://next-auth.js.org/getting-started/introduction).
* Platform
  * When adding a new client application as an SSO-enabled application, you must configure the corresponding environment variables on the platform side as well.\
    Essentially, you need to replicate the SSO-related values with the client application's name.
  * Please refer to the example below or check the `env.demo` file for guidance.
    * Make sure to add these in your platform application env file (replace \<App name> with your specific application's name):
      * `<App name>_CLIENT_ALIAS`
      * `<App name>_DOMAIN`
      * `<App name>_KEYCLOAK_REDIRECT_INDEX`
      * `<App name>_KEYCLOAK_MANAGEMENT_CLIENT_ID`
      * `<App name>_KEYCLOAK_MANAGEMENT_CLIENT_SECRET`
      * `SUPPORTED_SSO_CLIENTS=CREDEBL,<App name>`

