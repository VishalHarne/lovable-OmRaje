# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Backend Integration

This React + Vite website is deployed as a Render Static Site and sends form
submissions to the separately hosted backend over HTTPS.

Production API:
https://omraje-email-backend.onrender.com

The grievance form submits JSON to `POST /submitgrievances`. The job-fair form
submits a JSON `data` part and an optional PDF, DOC or DOCX attachment to
`POST /submitResume` (maximum attachment size: 10 MB). Both submissions require
a fresh Cloudflare Turnstile token in the `X-Turnstile-Token` header.

Configure these frontend environment variables in the Render Static Site's
build settings:

VITE_API_BASE_URL=https://omraje-email-backend.onrender.com

VITE_TURNSTILE_SITE_KEY=YOUR_PUBLIC_SITE_KEY

The Turnstile site key is public. Keep `TURNSTILE_SECRET_KEY`, SMTP credentials,
and all other backend secrets exclusively in the backend hosting environment.
The backend's `CORS_ALLOWED_ORIGINS` must include the exact HTTPS origin serving
the frontend (without a path or trailing slash). Its current Render
configuration includes `https://omraje.in` and `https://vishalharne.github.io`;
add the Render Static Site URL if it is also used.

The API's `{"status":"sent"}` response confirms backend/SMTP acceptance, not
delivery to the recipient's inbox. The production HTML sets a Content Security
Policy for the configured backend and Cloudflare Turnstile, plus a strict
referrer policy.
