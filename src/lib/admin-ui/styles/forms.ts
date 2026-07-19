/**
 * Admin UI stylesheet — panels, toolbar, buttons, inputs, pills, status line.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const FORMS_CSS: string = `    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 2px;
      padding: 24px;
      box-shadow: 0 12px 32px var(--shadow);
    }
    .editor-panel { order: 1; }
    .toolbar {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 14px;
    }
    button {
      border: 1px solid rgba(16, 50, 53, 0.42);
      background: var(--panel);
      color: var(--text);
      border-radius: 0;
      padding: 11px 16px;
      font: inherit;
      cursor: pointer;
      transition: opacity 120ms ease, transform 120ms ease, background 120ms ease, border-color 120ms ease, color 120ms ease;
    }
    button.button-tapped,
    button:active {
      transform: translateY(1px);
      opacity: 0.82;
    }
    button:disabled,
    button.is-busy,
    button[aria-busy="true"],
    button[aria-disabled="true"] {
      cursor: progress;
      opacity: 0.52;
      filter: grayscale(0.3);
      background: #e7eceb;
      border-color: rgba(16, 50, 53, 0.16);
      color: rgba(22, 51, 54, 0.72);
    }
    button.primary {
      background: var(--accent-strong);
      border-color: var(--accent-strong);
      color: #fff;
    }
    button.primary:hover:not(:disabled) {
      background: #184247;
      border-color: #184247;
    }
    button.danger {
      border-color: var(--danger);
      color: var(--danger);
    }
    .section-list {
      display: grid;
      gap: 16px;
      margin-top: 18px;
    }
    .card {
      border: 1px solid var(--line);
      border-radius: 0;
      padding: 18px;
      background: #fff;
    }
    .row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }
    label {
      display: grid;
      gap: 6px;
      font-size: 14px;
      color: var(--muted);
    }
    input, textarea, select {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 0;
      padding: 10px 12px;
      font: inherit;
      background: white;
      color: var(--text);
    }
    textarea {
      min-height: 96px;
      resize: vertical;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 13px;
    }
    .check {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text);
    }
    .check input {
      width: auto;
    }
    .pill {
      display: inline-block;
      border-radius: 0;
      padding: 3px 8px;
      background: rgba(108, 152, 148, 0.14);
      color: #27555a;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 10px;
    }
    #status {
      min-height: 0;
      font-size: 13px;
      color: #163336;
      border: 1px solid rgba(16, 50, 53, 0.18);
      background: rgba(255, 255, 255, 0.96);
      padding: 10px 12px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .status-ok {
      color: #163336;
      border-color: rgba(16, 50, 53, 0.18);
    }
    .status-error {
      color: #7c1f1f;
      border-color: rgba(143, 48, 48, 0.65);
      background: rgba(255, 235, 235, 0.96);
    }
    .status-progress {
      color: #6c4a00;
      border-color: rgba(183, 128, 0, 0.45);
      background: rgba(255, 246, 220, 0.98);
    }
`;
