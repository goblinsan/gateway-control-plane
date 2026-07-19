/**
 * Admin UI stylesheet — wizard dialogs, preset/catalog cards, wizard log, mini table.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const WIZARDS_CSS: string = `
    .wizard-dialog {
      border: none;
      border-radius: 10px;
      padding: 0;
      max-width: 640px;
      width: 90vw;
      max-height: 85vh;
      box-shadow: 0 8px 32px var(--shadow);
      background: #fff;
      color: var(--text);
    }
    .wizard-dialog::backdrop {
      background: rgba(16, 50, 53, .45);
    }
    .wizard-content {
      display: flex;
      flex-direction: column;
      max-height: 85vh;
    }
    .wizard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--line);
      background: #fff;
    }
    .wizard-header h2 {
      margin: 0;
      font-size: 1.15rem;
      color: var(--text);
    }
    .wizard-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--muted);
      padding: 0 .25rem;
      line-height: 1;
    }
    .wizard-close:hover {
      color: var(--text);
    }
    .wizard-step {
      padding: 1.25rem;
      overflow-y: auto;
      background: #fff;
    }
    .wizard-desc {
      margin: 0 0 1rem;
      color: var(--muted);
    }
    .wizard-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: .75rem;
    }
    .wizard-field {
      display: flex;
      flex-direction: column;
      gap: .25rem;
    }
    .wizard-field span {
      font-size: .85rem;
      font-weight: 600;
      color: var(--text);
    }
    .wizard-field small {
      font-weight: 400;
      color: var(--muted);
    }
    .wizard-field input,
    .wizard-field select {
      padding: .4rem .5rem;
      border: 1px solid var(--line);
      border-radius: 0;
      background: white;
      color: var(--text);
      font-size: .9rem;
    }
    .wizard-field input:focus,
    .wizard-field select:focus {
      outline: 2px solid var(--accent);
      outline-offset: -1px;
    }
    .wizard-actions {
      display: flex;
      justify-content: flex-end;
      gap: .5rem;
      padding-top: 1rem;
    }
    .wizard-btn-primary,
    .wizard-btn-secondary {
      padding: .5rem 1.25rem;
      border-radius: 0;
      border: 1px solid var(--line);
      cursor: pointer;
      font-size: .9rem;
    }
    .wizard-btn-primary {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
      font-weight: 600;
    }
    .wizard-btn-primary:disabled {
      opacity: .5;
      cursor: not-allowed;
    }
    .wizard-btn-secondary {
      background: #fff;
      color: var(--text);
    }
    .wizard-btn-secondary:hover {
      background: var(--bg);
    }
    .wizard-preset-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: .75rem;
      margin-bottom: 1rem;
    }
    .wizard-preset-card {
      border: 2px solid var(--line);
      border-radius: 0;
      padding: 1rem;
      cursor: pointer;
      background: #fff;
      text-align: left;
      transition: border-color .15s;
    }
    .wizard-preset-card:hover {
      border-color: var(--accent);
    }
    .wizard-preset-card.selected {
      border-color: var(--accent);
      background: var(--accent-soft);
    }
    .wizard-preset-card strong {
      display: block;
      color: var(--text);
      margin-bottom: .25rem;
    }
    .wizard-preset-card small {
      color: var(--muted);
      font-size: .8rem;
    }
    .svc-catalog-card {
      border: 2px solid var(--line);
      border-radius: 0;
      padding: 1rem;
      cursor: pointer;
      background: #fff;
      text-align: left;
      transition: border-color .15s;
    }
    .svc-catalog-card:hover {
      border-color: var(--accent);
    }
    .svc-catalog-card.selected {
      border-color: var(--accent);
      background: var(--accent-soft);
    }
    .svc-catalog-card strong {
      display: block;
      color: var(--text);
      margin-bottom: .25rem;
    }
    .svc-catalog-card small {
      color: var(--muted);
      font-size: .8rem;
    }
    .wizard-form-grid {
      display: flex;
      flex-direction: column;
      gap: .75rem;
      max-height: 55vh;
      overflow-y: auto;
      padding-right: .5rem;
    }
    .wizard-field {
      display: flex;
      flex-direction: column;
      gap: .2rem;
    }
    .wizard-label {
      font-weight: 600;
      font-size: .85rem;
      color: var(--text);
    }
    .wizard-field input,
    .wizard-field select {
      padding: .45rem .6rem;
      border: 1px solid var(--line);
      font-size: .85rem;
      font-family: inherit;
      background: #fff;
      color: var(--text);
    }
    .wizard-field input:focus,
    .wizard-field select:focus {
      outline: 2px solid var(--accent);
      outline-offset: -1px;
    }
    .wizard-hint {
      font-size: .75rem;
      color: var(--muted);
    }
    .mini-table { width: 100%; border-collapse: collapse; font-size: .82rem; margin-top: .25rem; }
    .mini-table th, .mini-table td { text-align: left; padding: .2rem .5rem; border-bottom: 1px solid var(--line); }
    .mini-table th { font-weight: 600; color: var(--muted); }
    .mini-table td code { font-size: .78rem; }
    .mini-table td.ok { color: #1a7a4c; }
    .mini-table td.error { color: #c0392b; }
    .wizard-log-line.success { color: #1a7a4c; }
    .wizard-log-line.error { color: #c0392b; }
    .wizard-log-line.info { color: var(--muted); }
    .wizard-log {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: .82rem;
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 0;
      padding: .75rem 1rem;
      min-height: 200px;
      max-height: 50vh;
      overflow-y: auto;
      line-height: 1.6;
      color: var(--text);
    }
    .wizard-log-entry {
      display: flex;
      align-items: flex-start;
      gap: .5rem;
      padding: .15rem 0;
      color: var(--text);
    }
    .wizard-log-icon {
      flex-shrink: 0;
      width: 1.2em;
      text-align: center;
    }
    .wiz-running .wizard-log-icon { color: var(--highlight); }
    .wiz-ok .wizard-log-icon { color: var(--ok); }
    .wiz-warn .wizard-log-icon { color: #b8860b; }
    .wiz-error .wizard-log-icon { color: var(--danger); }
    .wiz-complete .wizard-log-icon { color: var(--ok); }
    button.primary-action {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
      font-weight: 600;
    }
`;
