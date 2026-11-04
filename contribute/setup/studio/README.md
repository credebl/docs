---
icon: laptop
---

# Studio

Clone the studio repository:

<pre><code><strong>git clone https://github.com/credebl/studio.git &#x26;&#x26; cd studio
</strong></code></pre>

Create a .env file and set the required environment variables as per the `.env.demo` file.

*   Update the Keycloak&#x20;

    * For older version&#x20;
      * **`PUBLIC_KEYCLOAK_MANAGEMENT_CLIENT_SECRET`**
    * For newer version (v2.1.0)
      * **`NEXT_PUBLIC_KEYCLOAK_MANAGEMENT_CLIENT_SECRET`**

    You can get this value from your platform environment variables or directly from the Keyclock dashboard.
* In version v2.1.0, we have implemented NextAuth for SSO. To run the application, please refer to the `env.demo` file for the required NextAuth-related values.
* `NEXTAUTH_SECRET` Generate this secret by referring [here](https://next-auth.js.org/configuration/options#nextauth_secret.) (Only for v2.1.0).
*   Add the backend URL for `PUBLIC_ALLOW_DOMAIN`

    ```
    PUBLIC_ALLOW_DOMAIN=http://{your-ip}:{api-gateway-port}
    ```

Install dependencies and start the Studio UI:

```
npm i 
npm run start
```

Access the Studio UI by navigating to:

```
http://localhost:3000
```
