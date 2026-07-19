/**
 * Admin UI stylesheet — design tokens (:root custom properties and legacy aliases).
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const TOKENS_CSS: string = `    :root {
      color-scheme: light;
      /* ── Operations-first palette (explicit hex tones) ────────────────────
         Structural dark:   #2F3E46, #354F52
         Primary accent:    #52796F
         Support accent:    #84A98C
         Light surface:     #CAD2C5
         Severity amber/red are outside the palette but kept for semaphore
         clarity on health status. */
      --p26-bg-base: #eef2ec;       /* tinted derivative of #CAD2C5 */
      --p26-surface: #ffffff;
      --p26-surface-raised: #f6f8f4;
      --p26-border: #CAD2C5;        /* light surface */
      --p26-border-strong: #84A98C; /* support accent */
      --p26-text: #2F3E46;          /* structural dark 1 */
      --p26-text-muted: #354F52;    /* structural dark 2 */
      --p26-accent: #52796F;        /* primary accent */
      --p26-accent-strong: #2F3E46; /* structural dark 1 */
      --p26-accent-soft: rgba(82, 121, 111, 0.14);
      --p26-shell: linear-gradient(90deg, #2F3E46 0%, #354F52 55%, #52796F 100%);
      --p26-healthy: #52796F;       /* primary accent = healthy */
      --p26-healthy-soft: #84A98C;  /* support accent, used for badges */
      --p26-degraded: #b8860b;      /* amber (outside named palette, severity) */
      --p26-down: #a63838;          /* red (outside named palette, severity) */
      --p26-unknown: #6b7a7d;
      --p26-info: #354F52;
      /* spacing scale */
      --p26-space-1: 4px;
      --p26-space-2: 8px;
      --p26-space-3: 12px;
      --p26-space-4: 16px;
      --p26-space-5: 20px;
      --p26-space-6: 24px;
      --p26-space-8: 32px;
      /* radii + shadow */
      --p26-radius: 4px;
      --p26-shadow: 0 10px 28px rgba(47, 62, 70, 0.10);
      /* typography */
      --p26-font-display: "Passion One", "Fira Sans", system-ui, sans-serif;
      --p26-font-body: "Karla", system-ui, "Helvetica Neue", sans-serif;
      --p26-font-ui: "Fira Sans", "Karla", system-ui, sans-serif;
      /* ── legacy aliases (preserved so existing panels keep rendering) ── */
      --bg: var(--p26-bg-base);
      --panel: var(--p26-surface);
      --line: var(--p26-border);
      --text: var(--p26-text);
      --muted: var(--p26-text-muted);
      --accent: var(--p26-accent);
      --accent-soft: var(--p26-accent-soft);
      --accent-strong: var(--p26-accent-strong);
      --sidebar: var(--p26-accent);
      --sidebar-soft: rgba(255, 255, 255, 0.14);
      --highlight: var(--p26-info);
      --danger: var(--p26-down);
      --ok: var(--p26-healthy);
      --shadow: rgba(47, 62, 70, 0.10);
    }
`;
