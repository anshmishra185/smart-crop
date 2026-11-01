# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Supabase authentication

The app's `/auth` page provides account signup and login with OTP verification for both email and mobile. Signup verifies email first and then enrolls and verifies the mobile as a Supabase phone MFA factor. Login verifies email and then requires the SMS MFA code; the authenticated app state is exposed only after Supabase reports assurance level `aal2`.

1. Create a Supabase project and copy its project URL and publishable (or legacy anon) key into a local `.env` file using [.env.example](./.env.example) as a template. Never use a service-role key in the browser.
2. In Supabase Auth, enable email OTP and phone MFA. Configure an SMS provider and ensure the email OTP template displays the token (for example, `{{ .Token }}`), not only a confirmation link.
3. Add the local and deployed app URLs to Supabase's allowed redirect/site URL configuration.
4. Restart the Vite development server after editing `.env`.

The Supabase project controls OTP expiry, rate limits, email delivery, phone delivery, and associated provider costs. Real delivery will not work until the project settings and providers are configured. Protect any future user data with Row Level Security policies that require an `aal2` assurance level; a client-side session alone is not an authorization boundary.
