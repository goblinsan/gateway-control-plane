/**
 * Admin UI stylesheet — narrow-viewport (max-width: 640px) media query.
 *
 * Raw CSS chunk. `head.ts` concatenates every style module, in order,
 * inside the inline `<style>` block of the rendered document head.
 */
export const RESPONSIVE_CSS: string = `
    /* ── Narrower laptop / tablet viewports ──
       Tighten chrome, allow tabs to wrap, and collapse multi-column grids
       so the rebuilt operational pages remain readable on narrower
       operator viewports. */
    @media (max-width: 640px) {
      header { padding: 14px 16px 12px; }
      h1 { font-size: 1.6rem; }
      main { padding: 16px; gap: 14px; }
      .panel { padding: 16px; }
      .header-actions { width: 100%; justify-content: flex-start; }
      .header-row { gap: 10px; }
      .header-row p { font-size: 0.92rem; }
      .top-tab-nav .tab-button { padding: 10px 12px; font-size: 14px; }
      .sub-tab-nav { overflow-x: auto; flex-wrap: nowrap; }
      /* On narrow viewports we prefer horizontal scrolling over wrapping
         the sub-tab strip into a multi-line stack — keeps the operator's
         eye on a single navigational row even when several sub-tabs are
         present. The default flex-wrap: wrap (above) still applies on
         wider viewports so unusually long sub-tab labels can flow. */
      .sub-tab-nav .sub-tab-button { padding: 8px 12px; font-size: 13px; }
      .split-actions { flex-direction: column; align-items: stretch; }
      .toolbar { gap: 8px; }
      .toolbar > button,
      .header-actions > button { flex: 1 1 auto; min-width: 0; }
      .row { grid-template-columns: 1fr; }
      .metric-grid { grid-template-columns: 1fr; }
      .overview-header { flex-direction: column; align-items: stretch; }
      .overview-target { flex-direction: column; align-items: flex-start; gap: 6px; }
      .wizard-form-grid { grid-template-columns: 1fr; }
      .wizard-preset-grid { grid-template-columns: 1fr; }
      .action-dock { width: auto; }
    }
`;
