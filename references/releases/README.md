---
description: In this section, you will review the release changes.
icon: file-lines
---

# Releases

This section lists every CREDEBL release, newest first, along with the upgrade steps needed when moving between versions.

| Release              | Released         | Status        | Component versions                                                   |
| -------------------- | ---------------- | ------------- | -------------------------------------------------------------------- |
| [v2.3.0](v.2.3.0.md) | 23 November 2026 | Latest stable | Platform `v2.3.0`, Agent controller `v2.3.3`                         |
| [v2.2.1](v.2.2.1.md) | 11 November 2026 | Stable        | Platform and Agent controller `v2.2.1`                               |
| v2.2.0               | 13 May 2026      | Stable        | Platform, Studio, Agent controller `v2.2.0`                          |
| v2.1.3               | 13 November 2025 | Stable        | Platform and Agent controller `v2.1.3`, Studio `v2.1.3` (7 May 2026) |
| v2.1.2               | 23 October 2025  | Stable        | Platform, Studio, Agent controller `v2.1.2`                          |
| v2.1.1               | 15 October 2025  | Stable        | Platform, Studio, Agent controller `v2.1.1`                          |
| v2.1.0               | 9 September 2025 | Stable        | Platform, Studio, Agent controller `v2.1.0`                          |

{% hint style="info" %}
Upgrade in order. Each page describes only the changes introduced by that release, so apply every intermediate page when jumping several versions — for example, go from `v2.1.3` through `v2.2.0` before attempting `v2.3.0`.
{% endhint %}

## Choosing a version

* **Production** — use `v2.3.0`, the latest stable release (platform `v2.3.0` with agent controller `v2.3.3`).
* **Staying on the previous line** — `v2.2.0` and `v2.2.1` remain available. Moving to `v2.3.0` adds eight database migrations and new environment variables; read the upgrade checklist first.

## Related

* [Platform deployment](../../getting-started/local-deployment/platform.md)
* [Service setup](../../contribute/setup/service-setup.md)
* [Status List Server](../status-list-server.md)
