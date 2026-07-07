# Nuxt Studio setup (manual steps)

Status: `nuxt-studio` (v1.7.0, self-hosted OSS) is installed and configured in `apps/site/nuxt.config.ts` (`studio.repository` points at `joaodallarosa/joaodallarosa.dev`, branch `main`). What's left requires your own Google and GitHub accounts, so it can't be automated — do these once, locally and again in Vercel once the site is deployed.

Auth (who can log in to `/_studio`) and the Git provider (where commits land) are independent in Nuxt Studio: login uses **Google OAuth**, commits still go to the **GitHub** repo via a personal access token.

## 1. Google OAuth client (login)

1. [Google Cloud Console](https://console.cloud.google.com/) → select or create a project.
2. APIs & Services → Credentials → **Create OAuth client ID** → application type **Web application**.
3. Authorized redirect URI: `<your-site-origin>/_studio/auth/google` (e.g. `http://localhost:3000/_studio/auth/google` for local dev, and the production URL once deployed — add both as separate authorized redirect URIs on the same client, or create separate clients per environment).
4. Copy the **Client ID** and **Client secret**.

## 2. GitHub token (commits)

1. GitHub → Settings → Developer settings → **Fine-grained personal access tokens** → generate new token.
2. Scope it to the `joaodallarosa.dev` repository only, with **Contents: Read and write** permission.
3. Copy the token.

## 3. Set environment variables

Copy `apps/site/.env.example` to `apps/site/.env` (gitignored) and fill in:

```
NUXT_STUDIO_AUTH_GOOGLE_CLIENT_ID=<from step 1>
NUXT_STUDIO_AUTH_GOOGLE_CLIENT_SECRET=<from step 1>
NUXT_STUDIO_AUTH_GOOGLE_MODERATORS=<your Google account email>
NUXT_STUDIO_GIT_GITHUB_TOKEN=<from step 2>
```

`NUXT_STUDIO_AUTH_GOOGLE_MODERATORS` is a comma-separated allowlist of emails permitted to edit — without it, anyone with a Google account could log in.

Repeat the same four variables in the Vercel project's environment variables once the site is deployed there, using the production redirect URI from step 1.

## 4. Deployment constraint

Nuxt Studio's editing UI needs a live server-side auth route, so the deployed site must run with `nuxt build` (SSR), not `nuxt generate` (static export). This doesn't change anything in this phase's code, just something to keep in mind when the Vercel project is created (not part of Phase 1).
