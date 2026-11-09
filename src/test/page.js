import { JSDOM, VirtualConsole } from 'jsdom'
import { pageHtml } from '../utils/page.js'

/** A fresh jsdom window showing the step's page: what the probe frame is in the browser. */
export const openPage = (body) =>
  new JSDOM(pageHtml(body), { runScripts: 'outside-only', virtualConsole: new VirtualConsole() }).window
