# v.2.1.2

Released on **23 October 2025** for Platform, Studio, and Agent controller.

## Platform

### Fixes

* The reset-password email now includes the client alias, so the correct logo is displayed.
* Version metadata corrected to `2.1.2`.

### Changes need to be applied

No new environment variables. Rebuild and redeploy the Platform image.

## Studio

### Fixes

* Corrected the logo shown on the verifier login page.
* Removed the schema type selector from all credential pages.

### Changes need to be applied

No new environment variables. Rebuild and redeploy Studio.

## Agent controller

### Highlights

* Added a **custom W3C document loader** that rewrites JSON-LD context URLs from a deprecated domain to your current domain, so agents keep resolving contexts after a domain migration.

### Changes need to be applied

Add the following keys to your agent environment file:

```env
ENABLE_CUSTOM_DOCUMENT_LOADER=false
DEPRECATED_DOMAIN=
CURRENT_DOMAIN=
```

Set `ENABLE_CUSTOM_DOCUMENT_LOADER=true` to enable the loader, then set `DEPRECATED_DOMAIN` to the old host and `CURRENT_DOMAIN` to the host that now serves the same context files. Any context URL under the deprecated domain is fetched from the current domain instead. Both values are required when the loader is enabled, and leaving the flag at `false` keeps the default public context resolution.
