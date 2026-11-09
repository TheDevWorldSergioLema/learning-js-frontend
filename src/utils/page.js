// The preview is a separate document (an iframe): its styles cannot use the SCSS tokens.
// `$color-preview-background` in _config.scss must stay equal to the body background below.

const STUDS = (light, dark) =>
  `radial-gradient(circle at 8px 8px, ${light} 0 4px, ${dark} 4.5px 5.5px, transparent 6px)`

const PAGE_CSS = `
*, *::before, *::after { box-sizing: border-box; }
html { color-scheme: light; }
body {
  margin: 0; padding: 20px;
  font: 15px/1.45 'Atkinson Hyperlegible', 'Segoe UI', system-ui, sans-serif;
  color: #1b2838; background: #f3f5f8;
  transition: background 0.2s, color 0.2s;
}
body.dark { color: #e8edf3; background: #18212d; }
h1, h2 { font-family: 'Fredoka', 'Trebuchet MS', system-ui, sans-serif; font-weight: 600; margin: 0; line-height: 1.15; }
h1 { font-size: 26px; }
h2 { font-size: 17px; }
p { margin: 0; }
button, input, select { font: inherit; }

.sign {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  padding: 14px 18px; margin-bottom: 16px;
  background: #f6c90e; color: #1b2838; border-radius: 8px;
  box-shadow: 0 3px 0 #c99f00;
}
.sign .city { font-weight: 700; opacity: 0.75; }
.sign .cart { margin-left: auto; font-weight: 700; }
.logo {
  width: 40px; height: 24px; flex-shrink: 0; border-radius: 3px; background-color: #c8102e;
  background-image: ${STUDS('rgba(255,255,255,0.35)', 'rgba(0,0,0,0.25)')}; background-size: 16px 16px;
}

.panel, .card, .form {
  background: #ffffff; border: 1px solid #cdd6e0; border-radius: 10px; padding: 14px 16px;
  box-shadow: 0 1px 0 rgba(27, 40, 56, 0.06), 0 6px 18px rgba(27, 40, 56, 0.07);
}
body.dark .panel, body.dark .card, body.dark .form { background: #223042; border-color: #33475e; }
.panel { display: grid; gap: 8px; margin-bottom: 14px; }

.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.card { display: grid; gap: 6px; align-content: start; position: relative; transition: opacity 0.2s; }
.card.highlight { outline: 3px solid #f6c90e; outline-offset: 2px; }
.card.featured::before {
  content: "\\2605"; position: absolute; top: 8px; right: 10px; color: #c99f00;
}
.card.sold-out { opacity: 0.55; }
.card.sold-out .swatch { filter: grayscale(1); }
.price { font-weight: 700; }
.stock { font-size: 13px; color: #5b6b80; }
body.dark .stock { color: #9fb0c3; }

.swatch {
  width: 64px; height: 32px; border-radius: 3px; background-color: #d9bb7b;
  background-image: ${STUDS('rgba(255,255,255,0.32)', 'rgba(0,0,0,0.22)')}; background-size: 16px 16px;
  box-shadow: inset 0 -3px 0 rgba(0,0,0,0.16);
}
.swatch.red { background-color: #c8102e; }
.swatch.blue { background-color: #0b5cad; }
.swatch.yellow { background-color: #f6c90e; }
.swatch.green { background-color: #1f7a3d; }

.badge {
  justify-self: start; min-height: 24px; padding: 2px 10px; border-radius: 999px;
  font-size: 13px; font-weight: 700; background: #e3f3e8; color: #1f7a3d;
}
.badge:empty { background: transparent; border: 2px dashed #cdd6e0; min-width: 80px; }
.sold-out .badge, .badge.sold-out { background: #fde8eb; color: #8c0b20; }

.banner {
  padding: 10px 16px; margin-bottom: 14px; border-radius: 8px;
  background: #c8102e; color: #ffffff; font-weight: 700;
}
.hidden { display: none; }

.out {
  min-height: 34px; padding: 6px 12px; border-radius: 6px;
  background: #e6ecf2; border: 2px dashed #cdd6e0;
  font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 14px;
}
.out:not(:empty) { border-style: solid; background: #fff4d1; border-color: #ecd78a; }
body.dark .out { background: #2b3b50; border-color: #33475e; color: #e8edf3; }
.big { font-size: 22px; text-align: center; }
.label { font-size: 13px; font-weight: 700; color: #5b6b80; }
body.dark .label { color: #9fb0c3; }

ul.list { margin: 0; padding-left: 20px; }

button {
  justify-self: start; cursor: pointer; padding: 8px 16px; border-radius: 8px;
  border: 2px solid #1b2838; background: #ffffff; color: #1b2838; font-weight: 700;
}
button.primary { border-color: transparent; background: #f6c90e; box-shadow: 0 3px 0 #c99f00; }
button:active { transform: translateY(2px); }
body.dark button { background: #e8edf3; }

.form { display: grid; gap: 10px; margin-bottom: 14px; }
.form label { display: grid; gap: 4px; font-size: 13px; font-weight: 700; }
.form input, .form select {
  padding: 7px 10px; border: 1px solid #cdd6e0; border-radius: 6px; background: #ffffff; color: #1b2838;
}
`

/** @param {string} body the HTML of the step's page */
export const pageHtml = (body) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${PAGE_CSS}</style></head><body>${body}</body></html>`

/**
 * Replaces the document of `win` with the step's page. `document.open` also removes the event listeners
 * the previous run added to the document and the window; the timers are cleared by hand.
 * @param {Window} win
 * @param {string} body
 */
export function writePage(win, body) {
  const last = win.setTimeout(() => {})
  for (let id = 0; id <= last; id++) {
    win.clearTimeout(id)
    win.clearInterval(id)
  }
  const doc = win.document
  doc.open()
  doc.write(pageHtml(body))
  doc.close()
}
