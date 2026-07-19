/**
 * Admin UI — document head + stylesheet module.
 *
 * Owns `<!doctype html>`, `<head>` metadata, and the inlined stylesheet for
 * the control-plane admin SPA. The stylesheet itself lives in the sibling
 * `./styles/` modules — one raw CSS chunk per visual area — and is
 * concatenated here, in order, into a single inline `<style>` block. Keeping
 * each chunk small lets visual updates land as independent single-file
 * changes.
 *
 * Runtime values interpolated here:
 *   - `basePath`       — prefix mounted by the reverse proxy. Exposed via the
 *                        `<meta name="gateway-base-path">` tag consumed by
 *                        the client bootstrap.
 *   - `faviconDataUri` — inline favicon data URI (avoids a separate asset
 *                        route through the admin server).
 */
import { TOKENS_CSS } from './styles/tokens.ts';
import { BASE_CSS } from './styles/base.ts';
import { FORMS_CSS } from './styles/forms.ts';
import { DOCK_CSS } from './styles/dock.ts';
import { OPS_CARDS_CSS } from './styles/ops-cards.ts';
import { SHELL_NAV_CSS } from './styles/shell-nav.ts';
import { CONTENT_CARDS_CSS } from './styles/content-cards.ts';
import { RESPONSIVE_CSS } from './styles/responsive.ts';
import { WIZARDS_CSS } from './styles/wizards.ts';
import { ASSISTANT_CSS } from './styles/assistant.ts';
import { OVERVIEW_CSS } from './styles/overview.ts';

const STYLESHEET: string =
  TOKENS_CSS +
    BASE_CSS +
    FORMS_CSS +
    DOCK_CSS +
    OPS_CARDS_CSS +
    SHELL_NAV_CSS +
    CONTENT_CARDS_CSS +
    RESPONSIVE_CSS +
    WIZARDS_CSS +
    ASSISTANT_CSS +
    OVERVIEW_CSS;

export function renderAdminHead(basePath: string, faviconDataUri: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="gateway-base-path" content="${basePath}" />
  <title>Gateway Control Plane</title>
  <link rel="icon" type="image/svg+xml" href="${faviconDataUri}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Passion+One:wght@400;700;900&family=Karla:wght@400;500;700&family=Fira+Sans:wght@400;500;600;700&display=swap" />
  <style>
${STYLESHEET}  </style>
</head>
`;
}
