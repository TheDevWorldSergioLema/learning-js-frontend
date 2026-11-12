# Brick Shop

A browser-only playground where students learn JavaScript by making a toy brick shop work. The lesson and the code
editor are on the left; on the right are the shop page, a console and the list of checks. Each of the 20 steps
explains one idea, gives a small page and a starter `script.js`, checks the code live and offers hints.

| Steps | Concept | What the student builds |
| --- | --- | --- |
| 1 | variables | the shop sign (`const`) |
| 2–3 | types | a brick count (`'8'` vs `8`, `Number()`) and a price tag (template literals) |
| 4–5 | conditions | the stock badge: `Sold out`, `Almost gone`, `In stock` (`if`, `else if`) |
| 6 | querySelector | the featured card (`querySelector`, `textContent`) |
| 7–8 | classList | the sale banner and the sold-out card (`add`, `remove`, `toggle`) |
| 9 | loops | a countdown (`for`) |
| 10–11 | querySelectorAll | the cart total and the empty shelves (`for...of`) |
| 12–13 | functions | `formatPrice` and `stockLabel` |
| 14–16 | map, filter, find | the catalog, the red bricks, the search |
| 17–18 | addEventListener | the Add to cart button and the night mode |
| 19 | localStorage | remembering the theme |
| 20 | FormData | the order form (`submit`, `preventDefault`) |

The interface and the lessons are available in English (default), French, Spanish, Italian and German, picked
from the selector at the right of the top bar. The shop page itself (its HTML and the texts the checks expect)
stays in English, like the code.

There is no backend: progress, code, hints and the chosen language are saved in the browser's `localStorage`.

## Run it

Requires Node.js 20.19+ (or 22.12+).

```sh
npm install
npm run dev        # http://localhost:5173 (also exposed on the network)
npm test           # unit and component tests (vitest + Testing Library, jsdom)
npm run lint       # eslint
npm run build      # static files in dist/
npm run preview    # serves dist/ on http://localhost:4173
```

`dist/` is a static site: it can be served by any web server, no runtime configuration needed.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`: lint, tests and build, then `dist/` is published to
GitHub Pages at https://learning-js.sergiolema.dev.

One-time setup:

- DNS: a `CNAME` record `learning-js` → `thedevworldsergiolema.github.io.`
- GitHub, repo **Settings → Pages**: source **GitHub Actions**, custom domain `learning-js.sergiolema.dev`,
  then **Enforce HTTPS** once the certificate is issued

## Stack

- React 19, built with Vite
- CodeMirror 6 (`@uiw/react-codemirror`) for the JavaScript editor and the read-only HTML
- zustand for the application state
- i18next / react-i18next for every user-facing text (English, French, Spanish, Italian, German)
- SCSS for the styles, with the design tokens in `src/styles`
- Vitest, Testing Library and jsdom for the tests

## Architecture

```
src/
├── main.jsx            entry point: loads i18n and the global styles, renders the view
├── components/         root components, shared by every feature
│   ├── button/         Button (primary, secondary, quiet)
│   ├── icons/          SVG icons as React components, drawn with currentColor
│   ├── language-select/ LanguageSelect: switches and saves the interface language
│   ├── rich-text/      RichText: text where `backticks` mark inline code
├── hooks/              useDebounced (run the code once typing stops), useErrorText (translated run errors),
│                       useLatest, useCodeComments (translated code comments)
├── i18n/               i18next setup and locales/<en|fr|es|it|de>/translation.json
├── layout/             PublicLayout: top bar with the brand, the step strip and the language selector; Footer with the project links
├── services/           progressService and languageService: read and write the progress and the language in localStorage
├── stores/             progressStore (zustand): current step, completed steps, code and hints per step
├── styles/             _config.scss (tokens), _typography.scss, _mixins.scss, global.scss
├── test/               shared test setup, render helpers and jsdom pages
├── types/              enums (EditorTab, RunError, LogLevel, CheckStatus, Notice, CharKind, ButtonVariant, Language, FooterLink) and JSDoc entities
├── utils/              page (the shop page document), runner (runs the student's code), checks (runs a step's checks),
│                       loopGuard and scan (stop endless loops), memoryStorage, formatValue (console output), codeComments
└── views/
    └── playground/     the only page, its components grouped by feature
        ├── PlaygroundView.jsx
        ├── levels.js   the 20 steps: page, starter code, solution, example, checks
        ├── check/      CheckList: passed checks, errors, success
        ├── console/    ConsolePanel: console output, errors, localStorage content
        ├── editor/     CodeEditor: script.js / index.html tabs, Run and Start over
        ├── lesson/     LessonPanel: explanation, goal, hints, solution
        ├── preview/    BrowserWindow (browser chrome), PageFrame (the page the student uses) and ProbeFrame (hidden)
        └── steps/      StepStrip: the 20 steps in the top bar
```

### Data flow

```
progressStore ──► PlaygroundView ──► LessonPanel, CodeEditor ──(edits)──► progressStore ──► progressService (localStorage)
                        │
                        │  code, 600ms after the last keystroke (or on Run / Ctrl+Enter)
                        ├──► PageFrame  ──► runCode ──► console lines, errors ──► ConsolePanel
                        └──► ProbeFrame ──► runChecks ──► CheckResult[] ──► CheckList (+ step completed)
```

### How a step is checked

- The page is written into a same-origin iframe with `document.open/write/close` (`src/utils/page.js`), which also
  removes the listeners of the previous run; its timers are cleared.
- `runCode` (`src/utils/runner.js`) compiles the code with the frame's own `Function`, so `document` and `window`
  are the page's. Before that, it:
  - adds a guard to the condition of every `while`, `do...while` and `for (;;)` loop (`src/utils/loopGuard.js`):
    a loop running more than 100,000 turns in one go is stopped with a `RunError.InfiniteLoop` instead of
    freezing the tab, and line numbers stay the same;
  - replaces `console` (output formatted by `formatValue`) and `localStorage` (an in-memory storage, kept per step
    until the app reloads, so the student's keys never mix with the app's);
  - reports errors thrown later by event listeners, and turns a form submitted without `preventDefault` into a
    simulated reload with a notice in the console.
- Each check of the step (`levels.js`) runs on a fresh page in the hidden probe frame: the code runs, then the
  check reads or drives the page through a `CheckContext` (`text`, `hasClass`, `click`, `type`, `submit`, `reload`,
  the functions the step `exports`, and the code without its comments to look for the API the step teaches).
  A check can use its own page, so the same code is tried with several stocks, carts or form values.

Because checks look at the result, any code that produces it passes, except where a step asks for a given API
(`map`, `filter`, `find`, `addEventListener`, `new FormData`…).

### Styles

Every color, spacing, radius, shadow and breakpoint is a token in `src/styles/_config.scss`, every font
family, size, weight and line height in `src/styles/_typography.scss`. Each component has its own
`.scss` file next to it, which `@use`s them (Vite adds `src/styles` to the SCSS load paths, so
`@use 'config' as *;` works from anywhere). The CodeMirror theme is defined in JS, so the few tokens
it needs are exposed as CSS custom properties in `global.scss`.

The shop page is a separate document: its look (sign, cards, badges, form, dark theme) is defined in
`src/utils/page.js`.

## Adding or changing a step

- Code lives in `src/views/playground/levels.js`: the page `html` (read-only for the student), the starter `js`,
  the `solution`, an optional `example`, the `concept` (a key of `concepts` in the translations), `exports` when the
  checks call functions of the code, and the `checks`: `{ key, html?, test(ctx) }`.
- Texts live in every `src/i18n/locales/<language>/translation.json` under `levels.<id>`: `title`, `intro`
  (paragraphs), `goal`, progressive `hints`, the `recap` shown on success and one label per check under `checks`.
  They accept `` `inline code` ``, which must stay identical in every language.
- Comments in the code are written as `// {{key}}` placeholders and translated under `codeComments.<key>`
  (`fillComments` in `src/utils/codeComments.js`), so the starter code, examples and solutions follow the
  chosen language.

`levels.test.js` runs every step in jsdom: the solution must pass every check, the starter must fail at least one
without crashing, and every text must exist in every language. `locales.test.js` checks that every language has the
same keys, placeholders, inline code and tags as English.

## Contributing

Contributions are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md). To report a vulnerability, see
[SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © Sergio Lema
