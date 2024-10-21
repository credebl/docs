---
icon: browsers
description: Follow this guides to setup STUDIO locally -
---

# Studio

* Clone the studio repository:

```
git clone https://github.com/credebl/studio.git
```

```
cd studio
```

* Create a .env file.

{% hint style="warning" %}
**Note**: To quickly start your project, rename your '.env.demo' file to '.env'.&#x20;
{% endhint %}

{% hint style="info" %}
If you want to know more about the environment variables, please refer to `.env.sample` file which is given at root of the repository.
{% endhint %}

Please find `your-ip` in the `.env` file, and replace it with your machine's Ip address.

* Build docker image:

```
 docker build -t UI .
```

* Start Studio UI

```
docker run -d -p 8085:8085 --env-file .env --name UI-App UI
```

* Access the dockerized Studio UI by navigating to:

```
http://localhost:8085
```

