/**
 * Admin UI stylesheet — header shell rows, top tab nav, sub-tab nav, legacy nav card and tab buttons.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const SHELL_NAV_CSS: string = `    .aside-stack {
      order: 2;
      display: grid;
      gap: 18px;
    }
    .header-shell {
      display: grid;
      gap: 18px;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .header-row h1,
    .header-row p {
      color: inherit;
    }
    .header-row p {
      color: rgba(245, 251, 250, 0.78);
      max-width: 760px;
    }
    .top-tab-nav {
      display: grid;
      grid-template-columns: repeat(6, minmax(110px, 1fr));
      gap: 8px;
      padding-bottom: 2px;
      width: min(1380px, 100%);
      margin: 0 auto;
      font-family: var(--p26-font-ui);
    }
    .top-tab-nav .tab-button {
      width: 100%;
      min-width: 0;
      text-align: center;
      border: 1px solid transparent;
      background: transparent;
      color: rgba(245, 251, 250, 0.88);
      padding: 12px 18px;
      font-size: 15px;
      white-space: nowrap;
    }
    .top-tab-nav .tab-button:hover,
    .top-tab-nav .tab-button.active,
    .top-tab-nav .tab-button[aria-current="page"] {
      background: #ffffff;
      color: var(--accent-strong);
      border-color: #ffffff;
    }
    .sub-tab-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 18px;
      border-bottom: 2px solid var(--border);
      padding-bottom: 0;
    }
    .sub-tab-nav .sub-tab-button {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--muted);
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: -2px;
      white-space: nowrap;
    }
    .sub-tab-nav .sub-tab-button:hover {
      color: var(--fg);
    }
    .sub-tab-nav .sub-tab-button.active,
    .sub-tab-nav .sub-tab-button[aria-current="page"] {
      color: var(--accent-strong);
      border-bottom-color: var(--accent-strong);
    }
    .sub-tab-panel { display: none; }
    .sub-tab-panel.active { display: block; }
    .nav-card {
      background: linear-gradient(180deg, var(--sidebar) 0%, #214c44 100%);
      color: #f3f7f5;
      border-color: rgba(255, 255, 255, 0.08);
      min-height: 320px;
    }
    .nav-card p,
    .nav-card h2 {
      color: inherit;
    }
    .nav-card p {
      opacity: 0.76;
    }
    .tab-nav {
      display: grid;
      gap: 10px;
      margin-top: 22px;
    }
    .tab-button {
      width: 100%;
      text-align: left;
      border: 0;
      background: transparent;
      color: rgba(255, 255, 255, 0.82);
      border-radius: 0;
      padding: 14px 16px;
      font: inherit;
      font-size: 16px;
    }
    .tab-button:hover,
    .tab-button.active {
      background: var(--sidebar-soft);
      color: white;
    }
    .tab-panel[hidden] {
      display: none !important;
    }
`;
