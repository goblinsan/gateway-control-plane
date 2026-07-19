/**
 * Admin UI stylesheet — health-first overview landing: summary cards, target lists, project summary.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const OVERVIEW_CSS: string = `
    /* ── Overview (health-first landing) ── */
    .overview-panel { font-family: var(--p26-font-body); }
    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: var(--p26-space-4);
      margin-bottom: var(--p26-space-5);
    }
    .overview-header h2 {
      font-family: var(--p26-font-display);
      font-weight: 700;
      letter-spacing: 0.02em;
      font-size: 1.8rem;
      margin: 0;
      color: var(--p26-accent-strong);
    }
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--p26-space-4);
      margin-bottom: var(--p26-space-6);
    }
    .overview-card {
      border: 1px solid var(--p26-border);
      background: var(--p26-surface);
      border-radius: var(--p26-radius);
      padding: var(--p26-space-5);
      box-shadow: var(--p26-shadow);
      border-left: 4px solid var(--p26-unknown);
    }
    .overview-card.is-healthy { border-left-color: var(--p26-healthy); }
    .overview-card.is-degraded { border-left-color: var(--p26-degraded); }
    .overview-card.is-down { border-left-color: var(--p26-down); }
    .overview-card.is-action { border-left-color: var(--p26-down); }
    .overview-card .overview-count {
      font-family: var(--p26-font-display);
      font-size: 2.6rem;
      font-weight: 700;
      line-height: 1;
      color: var(--p26-accent-strong);
    }
    .overview-card .overview-label {
      font-family: var(--p26-font-ui);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.82rem;
      color: var(--p26-text-muted);
      margin-top: var(--p26-space-2);
    }
    .overview-card .overview-detail {
      margin-top: var(--p26-space-3);
      font-size: 0.9rem;
      color: var(--p26-text-muted);
      line-height: 1.4;
    }
    .overview-section-title {
      font-family: var(--p26-font-ui);
      font-weight: 600;
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--p26-text-muted);
      margin: var(--p26-space-6) 0 var(--p26-space-3);
    }
    .overview-runtime {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--p26-space-3);
      margin-bottom: var(--p26-space-5);
    }
    .overview-runtime .metric {
      margin-top: 0;
    }
    .overview-target-list {
      display: grid;
      gap: var(--p26-space-2);
    }
    .overview-target {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--p26-space-3);
      padding: var(--p26-space-3) var(--p26-space-4);
      border: 1px solid var(--p26-border);
      background: var(--p26-surface);
      border-left: 3px solid var(--p26-unknown);
      border-radius: var(--p26-radius);
    }
    .overview-target.is-healthy { border-left-color: var(--p26-healthy); }
    .overview-target.is-degraded { border-left-color: var(--p26-degraded); }
    .overview-target.is-down { border-left-color: var(--p26-down); }
    .overview-target.is-stale { border-left-color: var(--p26-info); }
    .overview-target-meta {
      color: var(--p26-text-muted);
      font-size: 0.85rem;
      display: flex;
      gap: var(--p26-space-3);
      flex-wrap: wrap;
    }
    .overview-project-summary-card {
      margin-top: var(--p26-space-4);
      border: 1px solid var(--p26-border);
      background: linear-gradient(180deg, var(--p26-surface) 0%, var(--p26-surface-raised) 100%);
      border-radius: var(--p26-radius);
      padding: var(--p26-space-4);
      box-shadow: var(--p26-shadow);
    }
    .overview-project-summary-text {
      margin: 0;
      padding: var(--p26-space-4);
      border-radius: var(--p26-radius);
      background: #f3f6f3;
      border: 1px solid var(--p26-border);
      color: var(--p26-text);
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.82rem;
      line-height: 1.5;
      max-height: 20rem;
      overflow-y: auto;
    }
    .overview-project-name {
      display: flex;
      align-items: center;
      gap: var(--p26-space-2);
      flex-wrap: wrap;
    }
    .overview-priority-pill {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-family: var(--p26-font-ui);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: rgba(82, 121, 111, 0.12);
      color: var(--p26-accent-strong);
    }
    .overview-priority-pill.is-critical {
      background: rgba(166, 56, 56, 0.14);
      color: var(--p26-down);
    }
    .overview-priority-pill.is-high {
      background: rgba(184, 134, 11, 0.16);
      color: #7d5f08;
    }
    .overview-project-copy {
      color: var(--p26-text-muted);
      font-size: 0.87rem;
      line-height: 1.45;
      margin-top: var(--p26-space-2);
    }
    .overview-empty {
      padding: var(--p26-space-5);
      border: 1px dashed var(--p26-border);
      border-radius: var(--p26-radius);
      color: var(--p26-text-muted);
      text-align: center;
    }
    .overview-link-btn {
      background: var(--p26-accent);
      color: #fff;
      border-color: var(--p26-accent);
      font-family: var(--p26-font-ui);
      font-weight: 600;
    }
    .overview-link-btn:hover:not(:disabled) {
      background: var(--p26-accent-strong);
      border-color: var(--p26-accent-strong);
    }
`;
