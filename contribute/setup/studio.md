---
icon: laptop
---

# Studio

Clone the studio repository:

<pre><code><strong>git clone https://github.com/credebl/studio.git &#x26;&#x26; cd studio
</strong></code></pre>

Create a .env file and set the required environment variables as per the `.env.sample` file.\


* Update the Keycloak `PUBLIC_KEYCLOAK_MANAGEMENT_CLIENT_SECRET`\
  You can get this value from your platform environment variables or directly from the Keycloak dashboard.
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
