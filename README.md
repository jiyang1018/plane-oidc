<br /><br />

<p align="center">
<a href="https://plane.so">
  <img src="https://media.docs.plane.so/logo/plane_github_readme.png" alt="Plane Logo" width="400">
</a>
</p>
<p align="center"><b>Modern project management for all teams</b></p>

<p align="center">
    <a href="https://plane.so/"><b>Website</b></a> •
    <a href="https://forum.plane.so"><b>Forum</b></a> •
    <a href="https://x.com/planepowers"><b>X</b></a> •
    <a href="https://docs.plane.so/"><b>Documentation</b></a>
</p>

> This is a fork of [makeplane/plane](https://github.com/makeplane/plane) with OIDC/SSO support added to the Community Edition. For general Plane documentation, see the [official docs](https://docs.plane.so/).

## 🔐 What's different in this fork

### OIDC / SSO Authentication
Plane Community Edition does not support OIDC/SSO. This fork adds it.

- OIDC login button on the login page (configurable display name and icon)
- OIDC configuration page in God Mode (`/god-mode/authentication/oidc/`)
- OIDC users bypass the signup restriction — existing accounts log in normally, new accounts are created automatically
- Works with any OIDC-compliant provider: Authentik, Keycloak, Nextcloud, Azure AD, etc.

### God Mode enhancements
- **Members page** (`/god-mode/members/`) — list all users, activate/deactivate/delete
- **Auto Assign workspaces** — in the Workspaces page, check which workspaces new OIDC users are automatically added to (supports multiple). Only visible when "Prevent workspace creation" is enabled.

---

## 🐳 Docker images

Pre-built images on GitHub Container Registry, updated on every push to `preview`:

| Service | Image |
|---|---|
| Backend | `ghcr.io/jiyang1018/plane-backend-oidc:preview` |
| Web | `ghcr.io/jiyang1018/plane-web-oidc:preview` |
| Admin | `ghcr.io/jiyang1018/plane-admin-oidc:preview` |
| Space | `ghcr.io/jiyang1018/plane-space-oidc:preview` |
| Live | `ghcr.io/jiyang1018/plane-live-oidc:preview` |

Use the official `makeplane` images for `proxy`, `db`, `redis`, `minio`, and `mq` — they are unchanged.

---

## 🚀 Setup

### 1. Deploy Plane
Follow the [official self-hosting guide](https://developers.plane.so/self-hosting/methods/docker-compose), then replace the `makeplane/*` images in your `docker-compose.yml` with the images above.

### 2. Configure OIDC
Go to `https://your-plane-domain/god-mode/authentication/oidc/` and fill in:

| Field | Description |
|---|---|
| Discovery URL | Your provider's `.well-known/openid-configuration` URL |
| Client ID | From your OIDC provider |
| Client Secret | From your OIDC provider |
| Display Name | Label on the login button (e.g. `SSO`, `Authentik`, `Nextcloud`) |
| Icon URL | Optional — URL to a custom icon for the login button |

Enable the toggle and save. Then register the callback URL with your OIDC provider:
```
https://your-plane-domain/auth/oidc/callback/
```

### 3. NAT hairpinning (self-hosted OIDC providers)
If your OIDC provider is on the same local network as Plane, add `extra_hosts` to all backend services in `docker-compose.yml`:
```yaml
    extra_hosts:
      - "your-oidc-domain.com:your-server-ip"
```

---

## ✅ Tested with
- Nextcloud (with OIDC provider app)
- Authentik

---

## 🔄 Keeping up to date with upstream

```bash
git remote add upstream https://github.com/makeplane/plane.git
git fetch upstream
git merge upstream/preview
git push origin preview
```

---

## 📄 License

[GNU Affero General Public License v3.0](https://github.com/makeplane/plane/blob/master/LICENSE.txt)
