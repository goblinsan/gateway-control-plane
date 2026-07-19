/**
 * Admin UI stylesheet — floating action dock, feed entries, current-action banner.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const DOCK_CSS: string = `    .action-dock {
      position: fixed;
      right: 18px;
      bottom: 18px;
      width: min(420px, calc(100vw - 36px));
      display: grid;
      gap: 10px;
      z-index: 999;
      pointer-events: none;
    }
    .action-dock > * {
      pointer-events: auto;
    }
    .action-dock-header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
    }
    .action-dock-toggle {
      padding: 6px 10px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.96);
    }
    .action-feed {
      border: 1px solid rgba(16, 50, 53, 0.18);
      background: rgba(255, 255, 255, 0.96);
      box-shadow: 0 12px 28px rgba(17, 30, 38, 0.16);
      max-height: 220px;
      overflow: auto;
    }
    .action-feed.is-collapsed {
      display: none;
    }
    .action-feed-empty {
      margin: 0;
      padding: 12px;
      font-size: 13px;
      color: var(--muted);
    }
    .action-entry {
      padding: 10px 12px;
      border-top: 1px solid rgba(16, 50, 53, 0.08);
      background: rgba(255, 255, 255, 0.96);
    }
    .action-entry:first-child {
      border-top: 0;
    }
    .action-entry strong {
      display: block;
      margin-bottom: 4px;
      font-size: 13px;
    }
    .action-entry time {
      display: block;
      font-size: 11px;
      color: var(--muted);
    }
    .action-entry.error strong {
      color: #7c1f1f;
    }
    .action-entry.progress strong {
      color: #8b5d00;
    }
    .inline-action-output {
      border: 1px solid var(--line);
      background: #fcfcfa;
      padding: 12px;
      font-size: 14px;
    }
    .inline-action-output.is-error {
      border-color: rgba(143, 48, 48, 0.45);
      background: #fff3f3;
    }
    .inline-action-output.is-progress {
      border-color: rgba(183, 128, 0, 0.35);
      background: #fff8e6;
    }
    .inline-action-output strong {
      display: block;
      margin-bottom: 6px;
    }
    .action-dock-title {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      margin-right: auto;
      padding-left: 4px;
    }
    .current-action {
      border: 1px solid rgba(16, 50, 53, 0.18);
      background: rgba(255, 255, 255, 0.96);
      box-shadow: 0 12px 28px rgba(17, 30, 38, 0.16);
      padding: 12px 14px;
      border-left: 4px solid rgba(16, 50, 53, 0.28);
      display: grid;
      gap: 4px;
    }
    .current-action.is-progress {
      border-left-color: rgba(183, 128, 0, 0.75);
      background: rgba(255, 246, 220, 0.98);
    }
    .current-action.is-ok {
      border-left-color: rgba(32, 120, 80, 0.75);
    }
    .current-action.is-error {
      border-left-color: rgba(143, 48, 48, 0.75);
      background: rgba(255, 235, 235, 0.96);
    }
    .current-action-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .current-action-message {
      font-size: 13px;
      font-weight: 600;
      color: #163336;
      line-height: 1.35;
    }
    .current-action.is-error .current-action-message {
      color: #7c1f1f;
    }
    .current-action.is-progress .current-action-message {
      color: #8b5d00;
    }
    .current-action-time {
      font-size: 11px;
      color: var(--muted);
    }
`;
