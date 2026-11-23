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

The grievance form submits JSON to `POST /api/grievances`. The job-fair form
submits a JSON `data` part and an optional PDF, DOC or DOCX attachment to
`POST /api/applications` (maximum attachment size: 10 MB). Both submissions require
a fresh Cloudflare Turnstile token in the `X-Turnstile-Token` header.
These endpoints require the database-submission version of the backend to be
deployed and configured. Deploy the updated backend before this frontend: it
emails attached CVs to the configured admin mailbox and reports the CV email
and applicant confirmation separately. SMTP acceptance does not guarantee
delivery. If either email cannot be confirmed, the form displays the saved
application ID and asks the applicant not to resubmit.
Grievances require a mobile number and accept an optional email. Apply the
backend's grievance email migration and deploy the updated backend before
deploying this frontend. The updated backend requires the new request format,
so older frontend builds cannot submit grievances after the backend update;
coordinate the deployments to minimize interruption.

Configure these frontend environment variables in the Render Static Site's
build settings:

VITE_API_BASE_URL=https://omraje-email-backend.onrender.com

VITE_TURNSTILE_SITE_KEY=YOUR_PUBLIC_SITE_KEY

VITE_CONSENT_TEXT_VERSION=v1

For the GitHub Pages workflow, configure the same values as GitHub Actions
repository variables. The API URL defaults to the production API above when
unset; the public Turnstile site key must be provided for submissions to work.

The Turnstile site key is public. Keep `TURNSTILE_SECRET_KEY`, SMTP credentials,
and all other backend secrets exclusively in the backend hosting environment.
The backend's `DATABASE_CORS_ALLOWED_ORIGINS` must include the exact HTTPS origin
serving the frontend (without a path or trailing slash). Configure the consent
text version to match an allowed version in the backend.

The API's `received` or `submitted` status confirms backend acceptance, not
delivery of a confirmation email. The production HTML sets a Content Security
Policy for the configured backend, Cloudflare Turnstile, and Google Analytics,
plus a strict referrer policy.

## Google Analytics

The site loads the Google tag for measurement ID `G-D0SJHKW8YV` on every page.
After deploying, check the Google Analytics Realtime report for activity.
To measure client-side navigation, enable page changes based on browser history
events in the GA4 web stream's enhanced measurement settings.
