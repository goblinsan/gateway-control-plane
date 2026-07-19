/**
 * Admin UI stylesheet — assistant builder stats, chips, review cards.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const ASSISTANT_CSS: string = `    .assistant-builder-summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: 0.9rem;
      margin-bottom: 1rem;
    }
    .assistant-builder-stat {
      border: 1px solid var(--line);
      border-radius: 10px;
      background: var(--bg-alt);
      padding: 0.9rem 1rem;
    }
    .assistant-builder-stat strong {
      display: block;
      font-size: 1.5rem;
      line-height: 1;
      color: var(--accent);
    }
    .assistant-builder-stat span {
      display: block;
      margin-top: 0.35rem;
      color: var(--muted);
      font-size: 0.85rem;
    }
    .assistant-builder-note {
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.5;
    }
    .assistant-builder-chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-top: 0.75rem;
    }
    .assistant-builder-chip {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: var(--bg-alt);
      padding: 0.3rem 0.7rem;
      font-size: 0.78rem;
      color: var(--text);
    }
    .assistant-builder-list {
      display: grid;
      gap: 0.85rem;
    }
    .assistant-builder-item {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 1rem;
      background: var(--bg-alt);
    }
    .assistant-builder-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }
    .assistant-builder-item-header strong {
      font-size: 0.95rem;
    }
    .assistant-builder-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.85rem 1rem;
    }
    .assistant-builder-grid .wizard-field {
      margin: 0;
    }
    .assistant-builder-grid .wizard-field.full {
      grid-column: 1 / -1;
    }
    .assistant-builder-textarea {
      min-height: 6rem;
      resize: vertical;
    }
    .assistant-builder-review {
      display: grid;
      gap: 1rem;
    }
    .assistant-builder-review-card {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 1rem;
      background: var(--bg-alt);
    }
    .assistant-builder-review-card h3 {
      margin: 0 0 0.6rem;
      font-size: 1rem;
    }
    .assistant-builder-review-card pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 20rem;
      overflow: auto;
      font-size: 0.82rem;
      line-height: 1.5;
    }
    .assistant-builder-meta {
      display: grid;
      gap: 0.4rem;
      color: var(--muted);
      font-size: 0.9rem;
    }
`;
