import test from 'node:test';
import assert from 'node:assert/strict';
import { renderAdminPage, renderAdminHead, ADMIN_MARKUP, renderAdminScript } from '../src/lib/admin-ui/index.ts';
import { WIRED_ELEMENT_IDS, STYLE_MODULE_CLASSES } from './admin-ui-invariants.ts';
import { TOKENS_CSS } from '../src/lib/admin-ui/styles/tokens.ts';
import { BASE_CSS } from '../src/lib/admin-ui/styles/base.ts';
import { FORMS_CSS } from '../src/lib/admin-ui/styles/forms.ts';
import { DOCK_CSS } from '../src/lib/admin-ui/styles/dock.ts';
import { OPS_CARDS_CSS } from '../src/lib/admin-ui/styles/ops-cards.ts';
import { SHELL_NAV_CSS } from '../src/lib/admin-ui/styles/shell-nav.ts';
import { CONTENT_CARDS_CSS } from '../src/lib/admin-ui/styles/content-cards.ts';
import { RESPONSIVE_CSS } from '../src/lib/admin-ui/styles/responsive.ts';
import { WIZARDS_CSS } from '../src/lib/admin-ui/styles/wizards.ts';
import { ASSISTANT_CSS } from '../src/lib/admin-ui/styles/assistant.ts';
import { OVERVIEW_CSS } from '../src/lib/admin-ui/styles/overview.ts';

const BASE = '/admin/';
const FAVICON = 'data:image/svg+xml;utf8,TEST';
const SEED_PATH = '/test/workflow-seed.json';

const STYLE_MODULES: Record<string, string> = {
  tokens: TOKENS_CSS,
  base: BASE_CSS,
  forms: FORMS_CSS,
  dock: DOCK_CSS,
  'ops-cards': OPS_CARDS_CSS,
  'shell-nav': SHELL_NAV_CSS,
  'content-cards': CONTENT_CARDS_CSS,
  responsive: RESPONSIVE_CSS,
  wizards: WIZARDS_CSS,
  assistant: ASSISTANT_CSS,
  overview: OVERVIEW_CSS,
};

function page(): string {
  return renderAdminPage({
    basePath: BASE,
    faviconDataUri: FAVICON,
    defaultWorkflowSeedPath: SEED_PATH,
  });
}

test('renderAdminHead interpolates basePath and favicon', () => {
  const head = renderAdminHead(BASE, FAVICON);
  assert.match(head, /^<!doctype html>/);
  assert.ok(head.includes(`<meta name="gateway-base-path" content="${BASE}" />`));
  assert.ok(head.includes(FAVICON));
  assert.ok(head.trimEnd().endsWith('</head>'), 'head ends with </head>');
  assert.ok(head.includes('</style>'), 'head contains the inline stylesheet');
});

test('ADMIN_MARKUP exposes the tab shell and shared action surface', () => {
  // The shell renderer in script.ts drives navigation off these stable hooks;
  // removing them would silently break lazy-load activation.
  assert.ok(ADMIN_MARKUP.startsWith('<body>'), 'markup starts with <body>');
  assert.ok(ADMIN_MARKUP.includes('data-tab="overview"'), 'overview tab button present');
  assert.ok(ADMIN_MARKUP.includes('data-tab="workloads"'), 'workloads tab button present');
  assert.ok(ADMIN_MARKUP.includes('data-tab="secrets"'), 'secrets tab button present');
  assert.ok(ADMIN_MARKUP.includes('data-tab="infra"'), 'infrastructure tab button present');
  assert.ok(ADMIN_MARKUP.includes('data-tab="monitoring"'), 'monitoring tab button present');
  assert.ok(ADMIN_MARKUP.includes('id="actionFeed"'), 'shared action feed surface present');
  assert.ok(ADMIN_MARKUP.includes('id="currentAction"'), 'current action surface present');
  assert.ok(ADMIN_MARKUP.includes('id="overviewProjectList"'), 'overview project tracking list present');
  assert.ok(ADMIN_MARKUP.includes('id="overviewProjectSummaryText"'), 'overview project summary surface present');
  assert.ok(ADMIN_MARKUP.includes('id="assistantBuilderSummary"'), 'assistant builder summary surface present');
  assert.ok(ADMIN_MARKUP.includes('id="assistantBuilderWizard"'), 'assistant builder wizard present');
});

test('ADMIN_MARKUP exposes accessibility hooks for keyboard + screen reader operators', () => {
  // Skip-link target main-content, with focusable main landmark.
  assert.ok(ADMIN_MARKUP.includes('class="skip-link" href="#main-content"'), 'skip-link present');
  assert.ok(ADMIN_MARKUP.includes('id="main-content"'), 'main landmark id present');
  // Initially-active top-tab and sub-tab buttons advertise current state.
  assert.ok(
    ADMIN_MARKUP.includes('class="tab-button active" aria-current="page" data-nav-id="overview"'),
    'initial top-tab marks aria-current=page',
  );
  assert.ok(
    ADMIN_MARKUP.includes('aria-current="page" data-sub-tab="infra-gateway"'),
    'initial infra sub-tab marks aria-current=page',
  );
  // Icon-only header buttons get accessible names.
  assert.ok(ADMIN_MARKUP.includes('aria-label="Edit raw config JSON"'), 'gear button has aria-label');
  assert.ok(ADMIN_MARKUP.includes('aria-label="Restart control-plane container"'), 'restart button has aria-label');
  // Sub-tab nav landmarks are individually labeled.
  for (const label of ['Infrastructure sub-sections', 'Services sub-sections', 'Monitoring sub-sections', 'Workloads sub-sections']) {
    assert.ok(ADMIN_MARKUP.includes('aria-label="' + label + '"'), 'sub-tab nav labeled: ' + label);
  }
  // Header action toolbars carry role + label.
  assert.ok(ADMIN_MARKUP.includes('role="toolbar" aria-label="Global actions"'), 'global toolbar labeled');
});

test('renderAdminHead provides visible focus + responsive narrow-viewport rules', () => {
  const head = renderAdminHead(BASE, FAVICON);
  // Visible focus ring on interactive controls.
  assert.ok(head.includes(':focus-visible'), 'focus-visible rule present');
  assert.ok(head.includes('.skip-link'), 'skip-link styles present');
  // Active state alias for aria-current.
  assert.ok(head.includes('.top-tab-nav .tab-button[aria-current="page"]'), 'top-tab aria-current style');
  assert.ok(head.includes('.sub-tab-nav .sub-tab-button[aria-current="page"]'), 'sub-tab aria-current style');
  // Narrow-viewport responsive rules exist beyond the existing 980px breakpoint.
  assert.ok(head.includes('@media (max-width: 640px)'), 'narrow-viewport media query present');
});

test('renderAdminScript preserves critical state invariants', () => {
  const script = renderAdminScript({ defaultWorkflowSeedPath: SEED_PATH });
  assert.ok(script.trimStart().startsWith('<script>'));
  assert.ok(script.trimEnd().endsWith('</script>'));

  // Issue hardening guardrails: these invariants must survive modularization.
  assert.ok(script.includes('const state = {'), 'shared state object declared');
  assert.ok(script.includes('activeTab'), 'activeTab key present');
  assert.ok(script.includes('activeSubTabs'), 'activeSubTabs key present');
  assert.ok(script.includes('dataLoaded'), 'dataLoaded key present');
  assert.ok(script.includes('subTabLoading'), 'subTabLoading key present');
  assert.ok(script.includes('projectTrackingOverview'), 'project tracking overview state key present');
  assert.ok(script.includes('assistantBuilderState'), 'assistant builder wizard state present');

  // Server-side seed path is injected rather than hard-coded.
  assert.ok(
    script.includes(`workflowSeedPath: '${SEED_PATH}'`),
    'defaultWorkflowSeedPath is interpolated into state defaults',
  );

  // fetchRuntime() is called unconditionally on every tab activation; isStale()
  // guards apply only to health snapshot (via overview) and per-sub-tab data.
  assert.ok(script.includes('fetchRuntime()'), 'fetchRuntime unconditional call present');
  assert.ok(script.includes('isStale('), 'isStale staleness guard present for sub-tab data');
  assert.ok(script.includes('/api/project-tracking/overview'), 'project tracking overview fetch present');
});

test('renderAdminPage composes head + markup + script into a full document', () => {
  const html = page();
  assert.ok(html.startsWith('<!doctype html>'));
  assert.ok(html.endsWith('</body>\n</html>'));
  // The composed document must contain each page-level module output.
  assert.ok(html.includes(FAVICON));
  assert.ok(html.includes('data-tab="overview"'));
  assert.ok(html.includes('const state = {'));
});

test('composition does not double-emit structural tags', () => {
  const html = page();
  // These singletons should appear exactly once each.
  for (const tag of ['<!doctype html>', '<html lang="en">', '<head>', '</head>', '<body>', '</body>', '</html>']) {
    const count = html.split(tag).length - 1;
    assert.equal(count, 1, `expected exactly one ${tag}, got ${count}`);
  }
});

// The byte-exact golden fixture was retired when the stylesheet split into
// independently rewritable modules. The structural tests below pin what the
// golden actually protected: the script↔markup wiring contract, tab routing
// integrity, each style module's selector coverage, and the token closure —
// while leaving declaration values free to change.

test('every markup element the script wires up stays present', () => {
  const script = renderAdminScript({ defaultWorkflowSeedPath: SEED_PATH });
  for (const id of WIRED_ELEMENT_IDS) {
    assert.ok(ADMIN_MARKUP.includes(`id="${id}"`), `markup is missing id="${id}" which the client script looks up`);
    assert.ok(script.includes(`getElementById('${id}')`) || script.includes(`getElementById("${id}")`), `script no longer references id="${id}"; prune it from admin-ui-invariants.ts in the same change that removed the feature`);
  }
});

test('tab and sub-tab buttons target panels that exist', () => {
  const tabTargets = [...ADMIN_MARKUP.matchAll(/data-tab="([a-z0-9-]+)"/g)].map((m) => m[1]);
  for (const tab of new Set(tabTargets)) {
    assert.ok(ADMIN_MARKUP.includes(`data-tab-panel="${tab}"`), `no panel for data-tab="${tab}"`);
  }
  const subTargets = [...ADMIN_MARKUP.matchAll(/data-sub-tab="([a-z0-9-]+)"/g)].map((m) => m[1]);
  for (const sub of new Set(subTargets)) {
    assert.ok(ADMIN_MARKUP.includes(`data-sub-tab-panel="${sub}"`), `no panel for data-sub-tab="${sub}"`);
  }
});

test('each style module keeps styling its frozen class inventory', () => {
  for (const [moduleName, classes] of Object.entries(STYLE_MODULE_CLASSES)) {
    const css = STYLE_MODULES[moduleName];
    assert.ok(typeof css === 'string' && css.length > 0, `style module ${moduleName} is empty`);
    for (const className of classes) {
      assert.ok(css.includes(`.${className}`), `style module ${moduleName} dropped .${className}; restore the selector or prune it from admin-ui-invariants.ts alongside the markup/script change that removed it`);
    }
  }
});

test('every CSS variable referenced anywhere is defined in the tokens module', () => {
  const defined = new Set([...TOKENS_CSS.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  const sources = [...Object.values(STYLE_MODULES), ADMIN_MARKUP, renderAdminScript({ defaultWorkflowSeedPath: SEED_PATH })];
  for (const src of sources) {
    for (const m of src.matchAll(/var\((--[a-z0-9-]+)/g)) {
      assert.ok(defined.has(m[1]), `var(${m[1]}) is referenced but never defined in styles/tokens.ts`);
    }
  }
});

test('document head has no external stylesheet or font dependencies', () => {
  const head = renderAdminHead(BASE, FAVICON);
  assert.ok(!head.includes('fonts.googleapis.com'), 'external Google Fonts reference reintroduced');
  assert.ok(!head.includes('rel="preconnect"'), 'external preconnect reintroduced');
  assert.ok(!/<link rel="stylesheet"/.test(head), 'external stylesheet link reintroduced');
});
