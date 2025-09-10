---
description: Follow this guides to setup STUDIO locally -
icon: browsers
---

# Studio

* Clone the studio repository:

```
git clone https://github.com/credebl/studio.git
```

```
cd studio
```

* Create a .env file and set the required environment variables as per the `.env.demo` file.
  *   Update the Keycloak credentials

      * For older version (>v2.1.0)
        * **`PUBLIC_KEYCLOAK_MANAGEMENT_CLIENT_SECRET`**
      * For newer version (v2.1.0)
        * **`NEXT_PUBLIC_KEYCLOAK_MANAGEMENT_CLIENT_SECRET`**

      You can get this value from your platform environment variables or directly from the Keyclock dashboard.
  * In version v2.1.0, we have implemented NextAuth for SSO. To run the application, please refer to the `env.demo` file for the required NextAuth-related values.
  * `NEXTAUTH_SECRET` Generate this secret by referring [here](https://next-auth.js.org/configuration/options#nextauth_secret.) (Only for v 2.1.0).
  *   Add the backend URL for `PUBLIC_ALLOW_DOMAIN`

      ```
      PUBLIC_ALLOW_DOMAIN=http://{your-ip}:{api-gateway-port}
      ```



* Build docker image:

```
docker build -t ui .
```

* Start Studio UI

```
docker run -d -p 3000:3000 --env-file .env --name UI-App ui
```

* Access the dockerized Studio UI by navigating to:

```
http://localhost:3000
```

