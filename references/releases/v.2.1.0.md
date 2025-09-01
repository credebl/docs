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
