# Brick Shop: frontend

Browser-only React app (Vite) that teaches JavaScript and the DOM by making a toy brick shop work. No backend:
progress is stored in `localStorage`. See `README.md` for how to run it and for the architecture.

## Commands

```sh
npm run dev      # dev server on http://localhost:5173
npm test         # vitest (jsdom)
npm run lint     # eslint
npm run build    # production build in dist/
```

Run `npm test`, `npm run lint` and `npm run build` before reporting a change as done.

## Guidelines

- Avoid adding unnecessary comments, take into account I'm an experienced developer
- Components are grouped by feature
- No hard-coded user-facing text: every label, placeholder, attribute text (`title`, `aria-label`, `alt`), toast and error message goes through i18n, in every locale (`src/i18n/locales/<en|fr|es|it|de>/translation.json`, English is the default)
- The test suites must have at least two levels: first level is the name of the class/component, second level is the name of the test or another group of tests
- The `src` folder has the following structure:
  - assets with small images (icons, logos, background images)
  - components with the root components (buttons, inputs, dropdown...)
  - hooks with the shared React hooks
  - i18n with the translations: English, French, Spanish, Italian and German
  - layout with the private and public layouts
  - services to access the backend with or without the authentication
  - stores to manage the state of the application
  - styles with the style definition of all the design tokens: the style values are in `src/styles/_config.scss`, the typography definitions in `src/styles/_typography.scss`
  - types with all the entities and enums definitions
  - utils with the shared helper functions
  - views with all the pages
  - test with the shared test setup and helpers
- Never hard-code a color, spacing, radius or font that exists as a token in `src/styles/_config.scss` / `_typography.scss`; add a token when a new value is needed
- The SVG must be created inside components/icons as React components, with currentColor instead of hard coded colors
- Prefer using fluent method chaining for request calls (with then, catch and finally), instead of try-catch blocks
- Sort the definitions on each component as following:
  - first the context declaration (useTranslation, useNavigation...)
  - the useState variables
  - the useEffect
  - the constants
  - the useMemo
  - the private methods
  - the partial renders
  - the return statement

## Project specifics

- The project is plain JavaScript: entities are JSDoc typedefs in `src/types/entities.js`, enums are frozen objects in `src/types/*.js`.
- Utils return structured values (`RunErrorInfo`, `CheckResult`, `LogEntry`), never sentences: components translate them.
- A step's code lives in `src/views/playground/levels.js` (page `html`, starter `js`, `solution`, `example`, `checks`), its texts in the translations under `levels.<id>` (`title`, `intro`, `goal`, `hints`, `recap`, and `checks.<key>` for each check). Text fields accept `` `inline code` `` rendered by `RichText`, kept identical in every language.
- Comments inside a step's code are `// {{key}}` placeholders, translated under `codeComments.<key>` and filled with `fillComments`. They must stay on one line.
- The page of a step (its HTML and every string the checks expect, like `Sold out`) is the student's material, like code: it stays in English and is not translated.
- A check must pass with the solution and the starter must fail at least one check: `levels.test.js` runs both in jsdom. Checks read the page through the `CheckContext` helpers (`text`, `hasClass`, `click`, `submit`, `reload`…), which are null-safe, so a missing element fails the check instead of reporting an error to the student.
- The student's code only runs through `runCode` (`src/utils/runner.js`): it guards loops, captures `console` and errors, and swaps `localStorage` for an in-memory storage so the code never touches the app's own keys.
- Each component has its own `.scss` file next to it, starting with `@use 'config' as *;` (and `typography`, `mixins` when needed). Only `global.scss` defines global rules and the CSS custom properties used by the CodeMirror theme.
- The preview iframe (`src/utils/page.js`) is a separate document: its styles cannot use the SCSS tokens. `$color-preview-background` must stay equal to its body background.
- jsdom does not load an iframe's `srcdoc`, so `PageFrame`, `ProbeFrame` and `PlaygroundView` cannot be rendered in tests; test the utils (with the jsdom windows of `src/test/page.js`) and the other components instead.
