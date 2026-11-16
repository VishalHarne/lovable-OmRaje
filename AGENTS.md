<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application structure

- ### Form Submission and Backend Integration

The website is a production React + Vite frontend hosted as a Render Static Site.

Forms must support real submission through the separately hosted backend APIs.

Production backend:
https://omraje-email-backend.onrender.com

Supported integrations:
- Grievance submission: POST /submitgrievances
- Resume submission: POST /submitResume
- Health monitoring: GET /health

Requirements:
- Forms must transmit submissions using HTTPS.
- Use VITE_API_BASE_URL for backend configuration.
- Never use localhost URLs in production.
- Integrate Cloudflare Turnstile where required by the backend.
- Preserve existing UI, validation and responsive design.
- Display success only after successful backend confirmation.
- Handle API errors and network failures gracefully.
- Never expose SMTP credentials or Turnstile secret keys in frontend code.

Static hosting does not restrict the frontend from communicating with external backend APIs.

The frontend must remain a Render Static Site. The backend is independently hosted as a Render Web Service.
- Curate Instagram reels as verified public permalinks with stored original cover assets and accessible preview dialogs linking to Instagram playback; unauthenticated embeds were unavailable, so do not show empty players.
