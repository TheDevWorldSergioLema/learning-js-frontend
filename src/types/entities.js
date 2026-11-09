/**
 * @typedef {import('./editorTab.js').EditorTab[keyof import('./editorTab.js').EditorTab]} EditorTabValue
 * @typedef {import('./runError.js').RunError[keyof import('./runError.js').RunError]} RunErrorValue
 * @typedef {import('./logLevel.js').LogLevel[keyof import('./logLevel.js').LogLevel]} LogLevelValue
 * @typedef {import('./checkStatus.js').CheckStatus[keyof import('./checkStatus.js').CheckStatus]} CheckStatusValue
 * @typedef {import('./notice.js').Notice[keyof import('./notice.js').Notice]} NoticeValue
 * @typedef {import('./language.js').Language[keyof import('./language.js').Language]} LanguageValue
 */

/**
 * Its texts live in the translations, under `levels.<id>`, the label of each check under `levels.<id>.checks.<key>`.
 * The `{{key}}` placeholders in its code are comments, translated under `codeComments.<key>`.
 * @typedef {Object} Level
 * @property {string} id
 * @property {string} concept key under `concepts`
 * @property {string} html the body of the step's page, fixed
 * @property {string} js the starter code
 * @property {string} solution
 * @property {string} [example]
 * @property {string[]} [exports] top-level names of the code the checks call
 * @property {Check[]} checks
 */

/**
 * Runs on a fresh page where the code has already run; `html` replaces the step's page for this check only.
 * @typedef {Object} Check
 * @property {string} key
 * @property {string} [html]
 * @property {(ctx: CheckContext) => boolean} test
 */

/**
 * What a check sees. `code` is the student's code without its comments. `reload` runs the code again on a fresh
 * page that keeps the same `storage`.
 * @typedef {Object} CheckContext
 * @property {string} code
 * @property {LogEntry[]} logs
 * @property {Storage} storage
 * @property {Window} win
 * @property {Document} doc
 * @property {Record<string, any>} exports
 * @property {(selector: string) => Element | null} $
 * @property {(selector: string) => Element[]} $$
 * @property {(selector: string) => string | null} text
 * @property {(selector: string) => string[]} texts
 * @property {(selector: string, name: string) => boolean} hasClass
 * @property {(selector: string, times?: number) => void} click
 * @property {(selector: string, value: string) => void} type
 * @property {(selector: string) => Event} submit
 * @property {() => void} reload
 */

/**
 * @typedef {Object} RunErrorInfo
 * @property {RunErrorValue} type
 * @property {string} [name]
 * @property {string} [message]
 * @property {number} [line]
 */

/**
 * @typedef {Object} LogEntry
 * @property {LogLevelValue} level
 * @property {string} text
 */

/**
 * A line of the console panel: a log, an error or a notice from the playground.
 * @typedef {Object} ConsoleEntry
 * @property {number} id
 * @property {LogLevelValue} level
 * @property {string} [text]
 * @property {RunErrorInfo} [error]
 * @property {NoticeValue} [notice]
 */

/**
 * @typedef {Object} CheckResult
 * @property {string} key
 * @property {CheckStatusValue} status
 * @property {RunErrorInfo} [error]
 */

/**
 * @typedef {Object} Progress
 * @property {number} current
 * @property {string[]} completed
 * @property {Record<string, string>} code
 * @property {Record<string, number>} hints
 */

export {}
