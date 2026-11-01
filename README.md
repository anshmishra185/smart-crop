# Smart Crop AI - Intelligent Crop Recommendations

A modern precision agriculture web application built with React 19, TypeScript, Vite, and Tailwind CSS.

## Features

- **Crop Recommendation Dashboard**: Input soil nutrients (N, P, K) and environmental metrics (temperature, humidity, pH, rainfall) to view tailored crop recommendations.
- **Crop Catalog Explorer**: Search and filter curated crops with environmental requirements and descriptions.
- **Google Sign-In Modal (Apple macOS / iOS Design)**:
  - Responsive Apple Human Interface Design principles:
    - Frosted glass vibrancy backdrop blur (`backdrop-blur-2xl bg-white/90`).
    - iOS bottom sheet on mobile screens with drag handle.
    - macOS centered floating card on desktop screens.
    - Subtle specular border highlight and rounded corners (`rounded-[32px]`).
    - Circular Apple-style dismiss button.
    - ESC key dismiss and click-outside handling.
  - Powered by official Google Identity Services (GIS).
  - Includes a quick demo mode for instant testing before setting up Google Cloud Console credentials.

---

## Google Cloud Console Setup (Google Sign-In)

Follow these steps to configure your own Google OAuth 2.0 Web Client ID:

### Step 1: Open Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one (e.g. `smart-crop-ai`).

### Step 2: Configure OAuth Consent Screen
1. In the left navigation, go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** user type and click **Create**.
3. Fill in:
   - **App name**: `Smart Crop AI`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Under **Scopes**, add the standard scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
5. Under **Test users**, add your own Google email address while the app is in testing mode.
6. Save and continue.

### Step 3: Create OAuth 2.0 Client ID
1. Navigate to **APIs & Services** > **Credentials**.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. Set **Application type** to **Web application**.
4. Set **Name** to `Smart Crop Web Client`.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173`
   - `http://localhost:4173` (for preview)
   - Your production URL (e.g. `https://your-domain.com`)
6. Click **Create**.
7. Copy the generated **Client ID** (looks like: `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`).

### Step 4: Configure Local Environment
1. Create a `.env` file in the project root (using `.env.example` as a template):
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```
2. Restart the Vite development server (`npm run dev`).

---

## Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run linter
npm run lint

# Build production bundle
npm run build
```
