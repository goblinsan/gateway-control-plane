/**
 * Admin UI stylesheet — bootstrap task list, nodes inventory, monitor dashboard cards, secrets guard, log output.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const OPS_CARDS_CSS: string = `    .bootstrap-task-list {
      list-style: none;
      margin: 12px 0 0;
      padding: 0;
      display: grid;
      gap: 8px;
    }
    .bootstrap-task-list li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 10px 12px;
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 4px;
    }
    .bootstrap-task-list li > div {
      display: grid;
      gap: 2px;
    }
    .bootstrap-task-list li strong {
      font-size: 14px;
    }
    .bootstrap-task-list li span:not(.bootstrap-task-num) {
      font-size: 12px;
      color: var(--muted);
    }
    .bootstrap-task-num {
      flex: 0 0 auto;
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--accent-strong);
      color: #fff;
      font-weight: 700;
      font-size: 13px;
    }
    .nodes-inventory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }
    .nodes-inventory-card {
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 4px;
      padding: 12px 14px;
      border-left: 3px solid var(--accent-strong);
    }
    .nodes-inventory-count {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 1.1;
      color: #163336;
    }
    .nodes-inventory-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      margin-top: 2px;
    }
    .nodes-inventory-detail {
      margin-top: 6px;
      font-size: 12px;
      color: var(--muted);
      line-height: 1.35;
    }
    .monitor-dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }
    .monitor-dashboard-card {
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 4px;
      padding: 12px 14px;
      border-left: 3px solid var(--muted);
      color: inherit;
      cursor: pointer;
      font: inherit;
      text-align: left;
      width: 100%;
    }
    .monitor-dashboard-card:hover,
    .monitor-dashboard-card.is-selected {
      border-color: var(--accent-strong);
      box-shadow: 0 0 0 2px rgba(22, 51, 54, 0.08);
    }
    .monitor-dashboard-card.is-healthy { border-left-color: var(--color-success, #2ecc71); }
    .monitor-dashboard-card.is-degraded { border-left-color: var(--color-warning, #e6a419); }
    .monitor-dashboard-card.is-action { border-left-color: var(--color-error, #c0392b); }
    .monitor-dashboard-count {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 1.1;
      color: #163336;
    }
    .monitor-dashboard-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      margin-top: 2px;
    }
    .monitor-dashboard-detail {
      margin-top: 6px;
      font-size: 12px;
      color: var(--muted);
      line-height: 1.35;
    }
    .monitor-drilldown-card {
      margin-top: 12px;
    }
    .monitor-drilldown-warning {
      margin: 8px 0;
      padding: 8px 10px;
      border: 1px solid var(--color-warning);
      border-radius: 4px;
      background: rgba(230, 164, 25, 0.08);
      color: #6c4a00;
      font-size: 12px;
    }
    .monitor-drilldown-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .monitor-drilldown-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 4px;
      background: var(--panel);
    }
    .monitor-action-copy {
      margin-top: 6px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.4;
    }
    .monitor-drilldown-meta {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      min-width: 220px;
      color: var(--muted);
      font-size: 12px;
    }
    .monitor-target-details {
      margin: 8px 0 0;
      max-height: 8rem;
      overflow: auto;
      background: var(--color-card);
      border: 1px solid var(--line);
      border-radius: 4px;
      padding: 8px;
      font-size: 11px;
      white-space: pre-wrap;
    }
    .secrets-intro {
      border-left: 4px solid rgba(183, 128, 0, 0.6);
    }
    .secrets-guard-note {
      margin-top: 6px;
      font-size: 12px;
      color: #6c4a00;
    }
    .secrets-guard-actions {
      display: flex;
      align-items: flex-start;
    }
    .secrets-reveal-btn[aria-pressed="true"] {
      background: rgba(183, 128, 0, 0.12);
      border-color: rgba(183, 128, 0, 0.65);
      color: #6c4a00;
    }
    body.is-secrets-revealed .secrets-reveal-btn::before {
      content: "👁 ";
    }
    .log-output {
      margin: 12px 0 0;
      padding: 12px;
      border: 1px solid var(--line);
      background: #f7faf8;
      font-family: "SFMono-Regular", ui-monospace, monospace;
      font-size: 12px;
      line-height: 1.45;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 320px;
      overflow: auto;
    }
`;
