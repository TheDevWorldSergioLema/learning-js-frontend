# Contributing

Thanks for your interest in Brick Shop! Contributions are welcome: bug fixes, new steps, better explanations,
translations, accessibility and design improvements.

## License and attribution

The project is released under the [MIT license](LICENSE): you're free to reuse its code and lessons, as long as
you keep the copyright notice. A link back to the project or to [sergiolema.dev](https://sergiolema.dev) is
appreciated. By opening a pull request, you agree that your contribution is released under the same license.
Contributors are credited through the Git history of their pull requests.

## Before you start

- **Small fixes** (typos, wrong translation, small bug): open a pull request directly.
- **Larger changes** (a new step, a new feature, a redesign): open an issue first to describe what you want to do,
  so we can agree on it before you spend time on the code.
- **Bugs, ideas and translations**: open an issue, the templates ask for what's needed (for a bug: the step, the
  browser, the language selected and the code you typed).
- **Questions**: open an issue too, there's no silly question.
- **First contribution?** Look for the issues labeled
  [`good first issue`](../../issues?q=is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22).
- **Security issues**: don't open a public issue, follow [`SECURITY.md`](SECURITY.md).

## Workflow

1. Fork the repository and create a branch from `main`, named `<type>/<scope>/<description>`, for example
   `feat/levels/fetch-steps` or `fix/i18n/german-hints`. Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.
2. Make your change, with tests.
3. Check everything passes:

   ```sh
   npm install
   npm test
   npm run lint
   npm run build
   ```

4. Open a pull request to `main`. Describe what changed and why, link the issue if there is one, and add a
   screenshot for any visual change.

I'll review it as soon as possible. I may ask for changes before merging; that's a normal part of the process.

## Guidelines

The full conventions are in [`CLAUDE.md`](CLAUDE.md) and the architecture in [`README.md`](README.md). The main ones:

- **No hard-coded text.** Every user-facing text (labels, `title`, `aria-label`, `alt`, messages) goes through i18n,
  in all five locales: `src/i18n/locales/<en|fr|es|it|de>/translation.json`. If you don't speak a language, add the
  English text there and say so in the pull request: someone will translate it.
- **Design tokens only.** Colors, spacing, radii and fonts come from `src/styles/_config.scss` and
  `src/styles/_typography.scss`. Add a token when you need a new value.
- **One `.scss` file per component**, next to it, starting with `@use 'config' as *;`.
- **Icons** are React components in `src/components/icons`, using `currentColor`.
- **Plain JavaScript**: entities are JSDoc typedefs in `src/types/entities.js`, enums are frozen objects in
  `src/types`.
- **Tests** are grouped in at least two levels: the component or module name, then the test or group of tests.
- **Few comments**: the code should explain itself; comment only what isn't obvious.
- **Accessibility**: keyboard navigation and visible focus must keep working, and texts must keep a WCAG AA contrast.
- **Keep pull requests focused**: one subject per pull request, no unrelated reformatting.

## Adding or changing a step

- The code of a step lives in `src/views/playground/levels.js` (page `html`, starter `js`, `solution`, `example`,
  `checks`); its texts in the translations under `levels.<id>` (`title`, `intro`, `goal`, `hints`, `recap`, and
  `checks.<key>` for each check).
- A check must pass with the solution, and the starter must fail at least one check: `levels.test.js` runs both.
- The shop page of a step (its HTML and the strings the checks expect) is the student's material: it stays in
  English, like the code.
- Comments in a step's code are `// {{key}}` placeholders, translated under `codeComments.<key>`, on one line.
- The student's code only runs through `runCode` (`src/utils/runner.js`).
- Inline code in texts uses backticks and stays identical in every language.

## Translations

You can help without writing any code: fixing a translation only means editing
`src/i18n/locales/<language>/translation.json`.

- Keep the keys, the `{{placeholders}}` and the `` `inline code` `` exactly as in English: `npm test` checks it.
- Translate the meaning, not word by word, and keep the tone friendly and short: the readers are beginners.
- Code comments (`codeComments`) must stay on one line, so they stay `//` comments.
- To add a new language, open an issue first: it needs a new locale folder, its import in `src/i18n/index.js`, an
  entry in `src/types/language.js`, its name under `language.names` and a translation of every text.

## Code of conduct

Be kind and constructive. Criticize code, not people. This project is made for learners: questions are welcome.
