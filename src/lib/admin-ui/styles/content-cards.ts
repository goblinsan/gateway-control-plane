/**
 * Admin UI stylesheet — split actions, metric grid, section cards, disclosure cards, wide-viewport media query.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const CONTENT_CARDS_CSS: string = `    .split-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .metric {
      border: 1px solid var(--line);
      border-radius: 0;
      padding: 12px;
      background: white;
      position: relative;
      overflow: hidden;
    }
    .metric::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(90deg, #1f5f56 0%, var(--accent) 100%);
    }
    .metric:nth-child(3n)::before {
      background: linear-gradient(90deg, var(--highlight) 0%, #ffce45 100%);
    }
    .metric strong {
      display: block;
      font-size: 30px;
      margin-bottom: 4px;
    }
    .meta-list {
      display: grid;
      gap: 8px;
      margin-top: 12px;
      font-size: 14px;
      color: var(--muted);
      word-break: break-word;
    }
    .hint-list {
      display: grid;
      gap: 6px;
      color: var(--muted);
    }
    .section-card {
      padding: 0;
      overflow: hidden;
    }
    .section-card summary {
      list-style: none;
      cursor: pointer;
      padding: 18px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }
    .section-card summary::-webkit-details-marker {
      display: none;
    }
    .section-card summary::after {
      content: "+";
      flex: 0 0 auto;
      color: var(--muted);
      font-size: 20px;
      line-height: 1;
      margin-top: 2px;
    }
    .section-card[open] summary::after {
      content: "−";
    }
    .section-card summary p {
      margin-bottom: 0;
    }
    .section-card .section-body {
      border-top: 1px solid var(--line);
      padding: 18px;
      background: #fcfcfa;
    }
    .section-card .section-body > :first-child {
      margin-top: 0;
    }
    .section-card .section-body .card {
      background: #fff;
    }
    .section-summary-copy {
      display: grid;
      gap: 6px;
    }
    .section-summary-copy h3 {
      margin-bottom: 0;
    }
    .section-summary-copy p {
      font-size: 14px;
    }
    .card-quiet {
      background: #fcfcfa;
    }
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-auto-rows: 1fr;
      gap: 16px;
      margin-top: 18px;
    }
    .overview-card {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: 180px;
    }
    .overview-card strong {
      font-size: 20px;
      font-weight: 600;
    }
    .overview-card p {
      flex: 1 1 auto;
    }
    .overview-card button {
      width: 100%;
      margin-top: auto;
    }
    .disclosure-card > summary {
      display: block;
      padding-bottom: 12px;
      margin-bottom: 14px;
      border-bottom: 1px solid var(--line);
    }
    .disclosure-card {
      margin-top: 20px;
    }
    .disclosure-card .row:first-of-type {
      margin-top: 16px;
    }
    details:not(.section-card) > summary {
      list-style: none;
      cursor: pointer;
      user-select: none;
    }
    details:not(.section-card) > summary::-webkit-details-marker {
      display: none;
    }
    details:not(.section-card) > summary::before {
      content: "+";
      display: inline-block;
      width: 16px;
      margin-right: 8px;
      color: var(--muted);
    }
    details[open]:not(.section-card) > summary::before {
      content: "−";
    }
    .aside-stack > details.panel {
      padding: 18px 20px;
    }
    @media (max-width: 980px) {
      .action-dock {
        left: 12px;
        right: 12px;
        bottom: 12px;
        width: auto;
      }
      main { grid-template-columns: 1fr; }
      .editor-panel { order: 1; }
      .aside-stack { order: 2; }
      .header-row { align-items: stretch; }
      .top-tab-nav {
        display: flex;
        overflow-x: auto;
        width: 100%;
      }
      .top-tab-nav .tab-button {
        min-width: max-content;
      }
      .overview-grid {
        grid-template-columns: 1fr;
      }
    }
`;
