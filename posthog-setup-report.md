<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your portfolio project. PostHog is now fully wired up with client-side initialization via `instrumentation-client.ts`, a reverse-proxy ingestion route in `next.config.ts`, and four targeted analytics events across two components.

## Changes made

| File | What changed |
|---|---|
| `instrumentation-client.ts` | **Created** — initializes PostHog on the client using `posthog-js`, with reverse-proxy host, exception capture, and debug mode in development |
| `next.config.ts` | Added `/ingest/*` rewrites to proxy PostHog requests through your domain, plus `skipTrailingSlashRedirect: true` |
| `app/components/portfolio/PortfolioApp.tsx` | Added `portfolio_panel_opened` capture in `openPanel` and `portfolio_panel_closed` capture in `closePanel` |
| `app/components/portfolio/InfoPanel.tsx` | Added `project_link_clicked` capture on the external link anchor and `email_copy_clicked` capture in `handleCopyEmail` |
| `.env.local` | Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|---|---|---|
| `portfolio_panel_opened` | Fired when the user clicks an orbiting project object or the center planet to open an info panel. Includes `panel` property. | `app/components/portfolio/PortfolioApp.tsx` |
| `portfolio_panel_closed` | Fired when the user closes an info panel (via close button or Escape key). Includes `panel` property. | `app/components/portfolio/PortfolioApp.tsx` |
| `project_link_clicked` | Fired when the user clicks the external link icon on a project panel. Includes `project_id`, `project_title`, and `href` properties. | `app/components/portfolio/InfoPanel.tsx` |
| `email_copy_clicked` | Fired when the user clicks "Email me" to copy the email address to clipboard. | `app/components/portfolio/InfoPanel.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/370308/dashboard/1433323
- **Most-opened portfolio panels** (bar chart by panel): https://us.posthog.com/project/370308/insights/yy8KAHGH
- **Portfolio panel opens & closes over time** (line chart): https://us.posthog.com/project/370308/insights/VjNviDcR
- **Project external link clicks by project** (bar chart by project_title): https://us.posthog.com/project/370308/insights/y9L1dKOH
- **Email copy clicks over time** (line chart): https://us.posthog.com/project/370308/insights/uVbuouUn
- **Panel open → project link click funnel** (conversion funnel): https://us.posthog.com/project/370308/insights/8aiIc063

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
