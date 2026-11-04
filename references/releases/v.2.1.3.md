# v.2.1.3

Released on **13 November 2025** for Platform, and on **7 May 2026** for Studio and Agent controller.

## Platform

### Highlights

* **Refresh-token based session management** — sessions are now managed through the refresh token, which keeps session listing, deletion, and sign-out consistent across clients.
* **Selectable email providers** — `EMAIL_PROVIDER` now chooses between Resend, SMTP, and SendGrid instead of a single hardcoded provider.

### Changes need to be applied

Set the provider and its credentials in the platform `.env` file. The demo file defaults to Resend:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxx
```

To send through your own SMTP server instead:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxxxxxx
```

SendGrid remains supported. Set `EMAIL_PROVIDER=sendgrid` and keep your existing `SENDGRID_API_KEY`.

{% hint style="warning" %}
Email sending is disabled when `EMAIL_PROVIDER` is not set. Existing deployments that relied on the previous implicit behaviour must set it during the upgrade.
{% endhint %}

## Studio

### Fixes

* Corrected token management for user sessions, so tokens are refreshed and cleared at the right time.

### Changes need to be applied

No new environment variables. Rebuild and redeploy Studio.

## Agent controller

No functional changes in this release. The version is aligned with Platform `v2.1.3`; no configuration updates are required.
