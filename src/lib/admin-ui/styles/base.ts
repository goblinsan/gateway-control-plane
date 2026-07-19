/**
 * Admin UI stylesheet — reset, focus rings, skip link, body/header/typography, main layout.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const BASE_CSS: string = `    * { box-sizing: border-box; }
    /* ── Accessibility: visible focus on all interactive controls ──
       Browser default focus rings on rectangular ("border-radius: 0") buttons
       can be hard to see against the operator palette, so we render an
       explicit, high-contrast 2px ring whenever a control receives focus
       from the keyboard. Pointer focus stays clean via :focus-visible. */
    :focus { outline: none; }
    a:focus-visible,
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible,
    summary:focus-visible,
    [tabindex]:focus-visible {
      outline: 2px solid var(--p26-accent-strong);
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(82, 121, 111, 0.25);
    }
    .skip-link {
      position: absolute;
      left: -9999px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
      z-index: 1000;
    }
    .skip-link:focus {
      position: fixed;
      left: 12px;
      top: 12px;
      width: auto;
      height: auto;
      padding: 10px 14px;
      background: #fff;
      color: var(--p26-accent-strong);
      border: 2px solid var(--p26-accent-strong);
      border-radius: 4px;
      font-family: var(--p26-font-ui);
      font-weight: 600;
      text-decoration: none;
      box-shadow: 0 8px 20px rgba(16, 50, 53, 0.25);
    }
    body {
      margin: 0;
      font-family: var(--p26-font-body);
      background:
        linear-gradient(180deg, #f3f6f5 0%, var(--bg) 100%);
      color: var(--text);
    }
    header {
      padding: 20px 28px 16px;
      border-bottom: 1px solid rgba(16, 50, 53, 0.12);
      background: var(--p26-shell);
      color: #f5fbfa;
      font-family: var(--p26-font-ui);
    }
    h1 {
      margin: 0 0 10px;
      font-family: var(--p26-font-display);
      font-weight: 700;
      letter-spacing: 0.02em;
      font-size: 2.1rem;
    }
    h2, h3 {
      margin: 0 0 10px;
      font-family: var(--p26-font-ui);
      font-weight: 600;
    }
    p { margin: 0 0 10px; color: var(--muted); }
    .section-note { margin-top: 10px; font-size: 0.92rem; }
    main {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;
      padding: 28px;
      align-items: start;
      max-width: 1460px;
      margin: 0 auto;
    }
`;
