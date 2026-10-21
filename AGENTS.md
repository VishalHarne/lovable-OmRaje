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

- Keep the Om Raje public-service home page and dedicated video collection bilingual and static; forms do not transmit submissions, so no storage or service integrations are needed.
- Curate Instagram reels as verified public permalinks with stored original cover assets and accessible preview dialogs linking to Instagram playback; unauthenticated embeds were unavailable, so do not show empty players.
