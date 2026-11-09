/** @typedef {import('../../types/entities.js').Level} Level */

const card = ({ color, name, price, stock, extra = '', attrs = '', classes = '' }) =>
  [
    `<article class="card${classes ? ` ${classes}` : ''}"${attrs}>`,
    `  <span class="swatch ${color}"></span>`,
    `  <h2 class="name">${name}</h2>`,
    price !== undefined && `  <p class="price">${price}</p>`,
    stock !== undefined && `  <p class="stock">Stock: <b class="count">${stock}</b></p>`,
    extra && `  ${extra}`,
    '</article>',
  ]
    .filter(Boolean)
    .join('\n')

const cards = (list) => `<div class="cards">\n${list.map(card).join('\n')}\n</div>`

const sign = (right = '') =>
  `<header class="sign">\n  <span class="logo"></span>\n  <h1>Brick Shop</h1>${right ? `\n  ${right}` : ''}\n</header>`

const stockCard = (stock) => `<article class="card">
  <span class="swatch blue"></span>
  <h2 class="name">Blue brick</h2>
  <p class="stock">Stock: <b id="stock">${stock}</b></p>
  <p id="status" class="badge"></p>
</article>`

const toggleCard = (stock, soldOut) => `<article id="card" class="card${soldOut ? ' sold-out' : ''}">
  <span class="swatch green"></span>
  <h2 class="name">Green plate</h2>
  <p class="stock">Stock: <b id="stock">${stock}</b></p>
</article>`

const cartPanel = (items) => `<section class="panel">
  <h2>Your cart</h2>
  <ul class="list">
${items.map(([name, price]) => `    <li>${name}: <span class="price">${price}</span> €</li>`).join('\n')}
  </ul>
  <p class="label">Total (€)</p>
  <p id="cart-total" class="out big"></p>
</section>`

const shelf = (stocks) =>
  cards([
    { color: 'red', name: 'Red brick', stock: stocks[0] },
    { color: 'blue', name: 'Blue roof', stock: stocks[1] },
    { color: 'yellow', name: 'Yellow window', stock: stocks[2] },
    { color: 'green', name: 'Green plate', stock: stocks[3] },
  ])

const searchPanel = (value) => `<section class="panel">
  <h2>Find a brick</h2>
  <input id="search" value="${value}">
  <p id="result" class="out"></p>
</section>`

const BRICKS = `const bricks = [
  { name: 'Red brick', color: 'red', price: 0.5, stock: 12 },
  { name: 'Blue roof', color: 'blue', price: 1.2, stock: 0 },
  { name: 'Yellow window', color: 'yellow', price: 0.8, stock: 3 },
  { name: 'Red door', color: 'red', price: 1.5, stock: 7 },
  { name: 'Green plate', color: 'green', price: 2, stock: 4 },
]
`

const uses = (pattern) => (ctx) => pattern.test(ctx.code)
const textIs = (selector, expected) => (ctx) => ctx.text(selector) === expected
const sameList = (a, b) => a.length === b.length && a.every((item, i) => item === b[i])

const STOCK_STARTER = `const stock = Number(document.querySelector('#stock').textContent)
const status = document.querySelector('#status')
`

const SOLD_OUT = `if (stock === 0) {
  status.textContent = 'Sold out'
} else {
  status.textContent = 'In stock'
}
`

const THEME_TOGGLE = `button.addEventListener('click', () => {
  document.body.classList.toggle('dark')
  const dark = document.body.classList.contains('dark')
  button.textContent = dark ? 'Light mode' : 'Dark mode'
`

const ORDER_FORM = `<form id="order" class="form">
  <h2>Order bricks</h2>
  <label>Your name <input name="customer" required></label>
  <label>Brick
    <select name="brick">
      <option>Red brick</option>
      <option>Blue roof</option>
      <option>Yellow window</option>
    </select>
  </label>
  <label>Quantity <input name="quantity" type="number" min="1" value="1"></label>
  <button class="primary">Order</button>
</form>
<p id="confirmation" class="out"></p>`

const order = (ctx, customer, brick, quantity) => {
  ctx.type('[name="customer"]', customer)
  ctx.type('[name="brick"]', brick)
  ctx.type('[name="quantity"]', quantity)
  ctx.submit('#order')
}

/** @type {Level[]} */
export const levels = [
  {
    id: 'shop-sign',
    concept: 'variables',
    example: "const greeting = 'Hello'\nlet visits = 3\nvisits = visits + 1 // {{letChanges}}",
    html: `<header class="sign">
  <span class="logo"></span>
  <h1 id="shop-name"></h1>
  <span id="shop-city" class="city"></span>
</header>
<section class="panel">
  <p>Welcome! The sign above is still blank.</p>
</section>`,
    js: `// {{nameYourShop}}
const shopName = ''
const city = ''

document.querySelector('#shop-name').textContent = shopName
document.querySelector('#shop-city').textContent = city
`,
    solution: `const shopName = 'Brick Shop'
const city = 'Lisbon'

document.querySelector('#shop-name').textContent = shopName
document.querySelector('#shop-city').textContent = city
`,
    checks: [
      { key: 'named', test: (ctx) => Boolean(ctx.text('#shop-name')) },
      { key: 'hasCity', test: (ctx) => Boolean(ctx.text('#shop-city')) },
      { key: 'usesVariables', test: uses(/textContent\s*=\s*shopName[\s\S]*textContent\s*=\s*city/) },
    ],
  },
  {
    id: 'brick-count',
    concept: 'types',
    example: "console.log(1 + 1)             // 2\nconsole.log('1' + 1)           // '11'\nconsole.log(Number('1') + 1)   // 2",
    html: `<section class="panel">
  <p>Red bricks: <b>12</b></p>
  <p>Blue bricks: <b>8</b></p>
  <p class="label">Total</p>
  <p id="total" class="out big"></p>
</section>`,
    js: `const redBricks = 12
const blueBricks = '8'

// {{typeofHint}}
console.log(typeof redBricks, typeof blueBricks)

const total = redBricks + blueBricks
document.querySelector('#total').textContent = total
`,
    solution: `const redBricks = 12
const blueBricks = '8'

console.log(typeof redBricks, typeof blueBricks)

const total = redBricks + Number(blueBricks)
document.querySelector('#total').textContent = total
`,
    checks: [
      { key: 'total', test: textIs('#total', '20') },
      { key: 'keepsText', test: uses(/blueBricks\s*=\s*(['"`])8\1/) },
    ],
  },
  {
    id: 'price-tag',
    concept: 'types',
    example: "const name = 'Ada'\nconst age = 36\nconst text = `${name} is ${age + 1} next year`",
    html: `<article class="card">
  <span class="swatch red"></span>
  <h2 class="name">Red brick</h2>
  <p id="summary" class="out"></p>
</article>`,
    js: `const brick = 'Red brick'
const price = 0.5
const quantity = 4

// {{summaryGoal}}
document.querySelector('#summary').textContent = quantity + ' × ' + brick
`,
    solution: `const brick = 'Red brick'
const price = 0.5
const quantity = 4

document.querySelector('#summary').textContent = \`\${quantity} × \${brick} = \${quantity * price} €\`
`,
    checks: [
      { key: 'summary', test: textIs('#summary', '4 × Red brick = 2 €') },
      { key: 'usesTemplate', test: uses(/`[^`]*\$\{/) },
    ],
  },
  {
    id: 'sold-out',
    concept: 'conditions',
    example: "if (age >= 18) {\n  console.log('adult')\n} else {\n  console.log('minor')\n}",
    html: stockCard(0),
    js: `${STOCK_STARTER}
// {{soldOutRule}}
status.textContent = 'In stock'
`,
    solution: `${STOCK_STARTER}
${SOLD_OUT}`,
    checks: [
      { key: 'soldOut', html: stockCard(0), test: textIs('#status', 'Sold out') },
      { key: 'inStock', html: stockCard(7), test: textIs('#status', 'In stock') },
    ],
  },
  {
    id: 'almost-gone',
    concept: 'conditions',
    example: "if (score > 90) {\n  grade = 'A'\n} else if (score > 70) {\n  grade = 'B'\n} else {\n  grade = 'C'\n}",
    html: stockCard(3),
    js: `${STOCK_STARTER}
// {{almostGoneRule}}
${SOLD_OUT}`,
    solution: `${STOCK_STARTER}
if (stock === 0) {
  status.textContent = 'Sold out'
} else if (stock < 5) {
  status.textContent = 'Almost gone'
} else {
  status.textContent = 'In stock'
}
`,
    checks: [
      { key: 'zero', html: stockCard(0), test: textIs('#status', 'Sold out') },
      { key: 'few', html: stockCard(3), test: textIs('#status', 'Almost gone') },
      { key: 'five', html: stockCard(5), test: textIs('#status', 'In stock') },
      { key: 'many', html: stockCard(20), test: textIs('#status', 'In stock') },
    ],
  },
  {
    id: 'featured',
    concept: 'querySelector',
    example: "document.querySelector('#cart')     // {{byId}}\ndocument.querySelector('.card')     // {{firstOfClass}}\ndocument.querySelector('.card h2')  // {{inside}}",
    html: `<p id="banner" class="banner"></p>
${cards([
  { color: 'red', name: 'Red brick', price: '0.50 €' },
  { color: 'yellow', name: '', price: '', classes: 'featured' },
  { color: 'blue', name: 'Blue roof', price: '1.20 €' },
])}`,
    js: `const name = 'Yellow window'
const price = '0.80 €'

document.querySelector('#banner').textContent = 'Brick of the week: ' + name

// {{fillFeatured}}
`,
    solution: `const name = 'Yellow window'
const price = '0.80 €'

document.querySelector('#banner').textContent = 'Brick of the week: ' + name

document.querySelector('.featured .name').textContent = name
document.querySelector('.featured .price').textContent = price
`,
    checks: [
      { key: 'featuredName', test: textIs('.featured .name', 'Yellow window') },
      { key: 'featuredPrice', test: textIs('.featured .price', '0.80 €') },
      {
        key: 'othersKept',
        test: (ctx) =>
          sameList(ctx.texts('.card .name'), ['Red brick', 'Yellow window', 'Blue roof']) &&
          sameList(ctx.texts('.card .price'), ['0.50 €', '0.80 €', '1.20 €']),
      },
    ],
  },
  {
    id: 'spotlight',
    concept: 'classList',
    example: "const box = document.querySelector('.box')\nbox.classList.add('big')\nbox.classList.remove('small')\nconsole.log(box.classList.contains('big')) // true",
    html: `<p id="sale-banner" class="banner hidden">Spring sale: 20% off every brick!</p>
${cards([
  { color: 'red', name: 'Red brick', price: '0.50 €', attrs: ' id="red"' },
  { color: 'yellow', name: 'Yellow window', price: '0.80 €', attrs: ' id="yellow"' },
  { color: 'blue', name: 'Blue roof', price: '1.20 €', attrs: ' id="blue"' },
])}`,
    js: `const banner = document.querySelector('#sale-banner')
const yellowCard = document.querySelector('#yellow')

// {{showBanner}}

// {{highlightCard}}
`,
    solution: `const banner = document.querySelector('#sale-banner')
const yellowCard = document.querySelector('#yellow')

banner.classList.remove('hidden')

yellowCard.classList.add('highlight')
`,
    checks: [
      { key: 'bannerShown', test: (ctx) => !ctx.hasClass('#sale-banner', 'hidden') && ctx.hasClass('#sale-banner', 'banner') },
      { key: 'highlighted', test: (ctx) => ctx.hasClass('#yellow', 'highlight') },
      { key: 'keepsCard', test: (ctx) => ctx.hasClass('#yellow', 'card') },
      { key: 'onlyYellow', test: (ctx) => !ctx.hasClass('#red', 'highlight') && !ctx.hasClass('#blue', 'highlight') },
    ],
  },
  {
    id: 'sold-out-badge',
    concept: 'classList',
    example: "box.classList.toggle('open')           // {{toggleFlip}}\nbox.classList.toggle('open', isOpen)   // {{toggleForce}}",
    html: toggleCard(0, false),
    js: `const card = document.querySelector('#card')
const stock = Number(document.querySelector('#stock').textContent)

// {{toggleRule}}
`,
    solution: `const card = document.querySelector('#card')
const stock = Number(document.querySelector('#stock').textContent)

card.classList.toggle('sold-out', stock === 0)
`,
    checks: [
      { key: 'addsWhenEmpty', html: toggleCard(0, false), test: (ctx) => ctx.hasClass('#card', 'sold-out') },
      { key: 'removesWhenRestocked', html: toggleCard(6, true), test: (ctx) => !ctx.hasClass('#card', 'sold-out') },
      { key: 'staysSoldOut', html: toggleCard(0, true), test: (ctx) => ctx.hasClass('#card', 'sold-out') },
      { key: 'staysAvailable', html: toggleCard(6, false), test: (ctx) => !ctx.hasClass('#card', 'sold-out') },
    ],
  },
  {
    id: 'countdown',
    concept: 'loops',
    example: 'for (let i = 1; i <= 3; i++) {\n  console.log(i) // 1, 2, 3\n}',
    html: `<section class="panel">
  <h2>New bricks arrive in…</h2>
  <p id="countdown" class="out big"></p>
</section>`,
    js: `let text = ''

// {{countdownLoop}}

text = text + 'Go!'
document.querySelector('#countdown').textContent = text
`,
    solution: `let text = ''

for (let i = 5; i >= 1; i--) {
  text = text + i + ' '
}

text = text + 'Go!'
document.querySelector('#countdown').textContent = text
`,
    checks: [
      { key: 'countsDown', test: textIs('#countdown', '5 4 3 2 1 Go!') },
      { key: 'usesLoop', test: uses(/\b(for|while)\s*\(/) },
    ],
  },
  {
    id: 'cart-total',
    concept: 'querySelectorAll',
    example: "const items = document.querySelectorAll('li')\nconsole.log(items.length)\nfor (const item of items) {\n  console.log(item.textContent)\n}",
    html: cartPanel([['Red brick', 0.5], ['Yellow window', 0.8], ['Blue roof', 1.2], ['Green plate', 2]]),
    js: `const prices = document.querySelectorAll('.price')
let total = 0

// {{addEveryPrice}}

document.querySelector('#cart-total').textContent = total
`,
    solution: `const prices = document.querySelectorAll('.price')
let total = 0

for (const price of prices) {
  total = total + Number(price.textContent)
}

document.querySelector('#cart-total').textContent = total
`,
    checks: [
      { key: 'total', test: textIs('#cart-total', '4.5') },
      { key: 'otherCart', html: cartPanel([['Red door', 1.5], ['Green plate', 2], ['Red brick', 3]]), test: textIs('#cart-total', '6.5') },
    ],
  },
  {
    id: 'sold-out-cards',
    concept: 'querySelectorAll',
    example: "for (const card of document.querySelectorAll('.card')) {\n  const name = card.querySelector('.name') // {{searchInside}}\n  console.log(name.textContent)\n}",
    html: shelf([12, 0, 3, 0]),
    js: `const cards = document.querySelectorAll('.card')

for (const card of cards) {
  const stock = Number(card.querySelector('.count').textContent)
  // {{markIfEmpty}}
}
`,
    solution: `const cards = document.querySelectorAll('.card')

for (const card of cards) {
  const stock = Number(card.querySelector('.count').textContent)
  if (stock === 0) {
    card.classList.add('sold-out')
  }
}
`,
    checks: [
      { key: 'emptyMarked', test: (ctx) => sameList(ctx.$$('.card').map((c) => c.classList.contains('sold-out')), [false, true, false, true]) },
      { key: 'otherShelf', html: shelf([0, 5, 0, 0]), test: (ctx) => sameList(ctx.$$('.card').map((c) => c.classList.contains('sold-out')), [true, false, true, true]) },
    ],
  },
  {
    id: 'format-price',
    concept: 'functions',
    example: 'function double(n) {\n  return n * 2\n}\nconsole.log(double(21))          // 42\nconsole.log((3.14159).toFixed(2)) // \'3.14\'',
    exports: ['formatPrice'],
    html: cards([
      { color: 'red', name: 'Red brick', price: '0.5' },
      { color: 'yellow', name: 'Yellow window', price: '0.8' },
      { color: 'blue', name: 'Blue roof', price: '1.2' },
      { color: 'green', name: 'Green plate', price: '2' },
    ]),
    js: `// {{formatPriceRule}}
function formatPrice(amount) {
  return amount
}

for (const price of document.querySelectorAll('.price')) {
  price.textContent = formatPrice(Number(price.textContent))
}
`,
    solution: `function formatPrice(amount) {
  return amount.toFixed(2) + ' €'
}

for (const price of document.querySelectorAll('.price')) {
  price.textContent = formatPrice(Number(price.textContent))
}
`,
    checks: [
      { key: 'formatsTwo', test: (ctx) => ctx.exports.formatPrice?.(2) === '2.00 €' },
      { key: 'formatsHalf', test: (ctx) => ctx.exports.formatPrice?.(0.5) === '0.50 €' },
      { key: 'pricesOnPage', test: (ctx) => sameList(ctx.texts('.price'), ['0.50 €', '0.80 €', '1.20 €', '2.00 €']) },
    ],
  },
  {
    id: 'stock-label',
    concept: 'functions',
    example: "function greet(name) {\n  if (name === '') {\n    return 'Hello, stranger'\n  }\n  return 'Hello, ' + name\n}",
    exports: ['stockLabel'],
    html: cards([
      { color: 'red', name: 'Red brick', stock: 12, extra: '<p class="badge status"></p>' },
      { color: 'blue', name: 'Blue roof', stock: 0, extra: '<p class="badge status"></p>' },
      { color: 'yellow', name: 'Yellow window', stock: 3, extra: '<p class="badge status"></p>' },
    ]),
    js: `function stockLabel(stock) {
  // {{stockLabelRule}}
  return ''
}

for (const card of document.querySelectorAll('.card')) {
  const stock = Number(card.querySelector('.count').textContent)
  card.querySelector('.status').textContent = stockLabel(stock)
}
`,
    solution: `function stockLabel(stock) {
  if (stock === 0) {
    return 'Sold out'
  }
  if (stock < 5) {
    return 'Almost gone'
  }
  return 'In stock'
}

for (const card of document.querySelectorAll('.card')) {
  const stock = Number(card.querySelector('.count').textContent)
  card.querySelector('.status').textContent = stockLabel(stock)
}
`,
    checks: [
      { key: 'labelZero', test: (ctx) => ctx.exports.stockLabel?.(0) === 'Sold out' },
      { key: 'labelFew', test: (ctx) => ctx.exports.stockLabel?.(4) === 'Almost gone' },
      { key: 'labelMany', test: (ctx) => ctx.exports.stockLabel?.(40) === 'In stock' },
      { key: 'cardsLabelled', test: (ctx) => sameList(ctx.texts('.status'), ['In stock', 'Sold out', 'Almost gone']) },
    ],
  },
  {
    id: 'catalog',
    concept: 'map',
    example: 'const numbers = [1, 2, 3]\nconst doubled = numbers.map((n) => n * 2)\nconsole.log(doubled) // [2, 4, 6]',
    html: `<section class="panel">
  <h2>Catalog</h2>
  <p class="label">Names</p>
  <p id="names" class="out"></p>
  <p class="label">Prices</p>
  <p id="prices" class="out"></p>
</section>`,
    js: `${BRICKS}
// {{mapNames}}
const names = []
// {{mapPrices}}
const prices = []

document.querySelector('#names').textContent = names.join(', ')
document.querySelector('#prices').textContent = prices.join(', ')
`,
    solution: `${BRICKS}
const names = bricks.map((brick) => brick.name)
const prices = bricks.map((brick) => brick.price + ' €')

document.querySelector('#names').textContent = names.join(', ')
document.querySelector('#prices').textContent = prices.join(', ')
`,
    checks: [
      { key: 'names', test: textIs('#names', 'Red brick, Blue roof, Yellow window, Red door, Green plate') },
      { key: 'prices', test: textIs('#prices', '0.5 €, 1.2 €, 0.8 €, 1.5 €, 2 €') },
      { key: 'usesMap', test: uses(/\.map\s*\(/) },
    ],
  },
  {
    id: 'red-only',
    concept: 'filter',
    example: 'const numbers = [4, 8, 15, 16, 23, 42]\nconst big = numbers.filter((n) => n > 10)\nconsole.log(big) // [15, 16, 23, 42]',
    html: `<section class="panel">
  <h2>Catalog</h2>
  <p class="label">Red bricks</p>
  <p id="red-list" class="out"></p>
  <p class="label">Bricks in stock</p>
  <p id="in-stock" class="out"></p>
</section>`,
    js: `${BRICKS}
// {{filterRed}}
const redBricks = bricks
// {{filterInStock}}
const inStock = bricks

document.querySelector('#red-list').textContent = redBricks.map((brick) => brick.name).join(', ')
document.querySelector('#in-stock').textContent = inStock.length
`,
    solution: `${BRICKS}
const redBricks = bricks.filter((brick) => brick.color === 'red')
const inStock = bricks.filter((brick) => brick.stock > 0)

document.querySelector('#red-list').textContent = redBricks.map((brick) => brick.name).join(', ')
document.querySelector('#in-stock').textContent = inStock.length
`,
    checks: [
      { key: 'redOnly', test: textIs('#red-list', 'Red brick, Red door') },
      { key: 'inStockCount', test: textIs('#in-stock', '4') },
      { key: 'usesFilter', test: uses(/\.filter\s*\(/) },
    ],
  },
  {
    id: 'find-brick',
    concept: 'find',
    example: "const users = [{ name: 'Ada' }, { name: 'Grace' }]\nconst grace = users.find((user) => user.name === 'Grace')\nconsole.log(grace) // { name: 'Grace' }",
    html: searchPanel('Blue roof'),
    js: `${BRICKS}
const wanted = document.querySelector('#search').value

// {{findByName}}
const found = undefined

if (found) {
  document.querySelector('#result').textContent = \`\${found.name}: \${found.price} €\`
} else {
  document.querySelector('#result').textContent = 'Not found'
}
`,
    solution: `${BRICKS}
const wanted = document.querySelector('#search').value

const found = bricks.find((brick) => brick.name === wanted)

if (found) {
  document.querySelector('#result').textContent = \`\${found.name}: \${found.price} €\`
} else {
  document.querySelector('#result').textContent = 'Not found'
}
`,
    checks: [
      { key: 'blueRoof', test: textIs('#result', 'Blue roof: 1.2 €') },
      { key: 'otherBrick', html: searchPanel('Green plate'), test: textIs('#result', 'Green plate: 2 €') },
      { key: 'notFound', html: searchPanel('Pink brick'), test: textIs('#result', 'Not found') },
      { key: 'usesFind', test: uses(/\.find\s*\(/) },
    ],
  },
  {
    id: 'add-to-cart',
    concept: 'addEventListener',
    example: "const button = document.querySelector('button')\nbutton.addEventListener('click', () => {\n  console.log('clicked!')\n})",
    html: `${sign('<span class="cart">Cart: <span id="cart-count">0</span></span>')}
${cards([{ color: 'red', name: 'Red brick', price: '0.50 €', extra: '<button id="add" class="primary">Add to cart</button>' }])}`,
    js: `const button = document.querySelector('#add')
const counter = document.querySelector('#cart-count')
let count = 0

// {{onClick}}
`,
    solution: `const button = document.querySelector('#add')
const counter = document.querySelector('#cart-count')
let count = 0

button.addEventListener('click', () => {
  count = count + 1
  counter.textContent = count
})
`,
    checks: [
      { key: 'startsEmpty', test: textIs('#cart-count', '0') },
      {
        key: 'oneClick',
        test: (ctx) => {
          ctx.click('#add')
          return ctx.text('#cart-count') === '1'
        },
      },
      {
        key: 'threeClicks',
        test: (ctx) => {
          ctx.click('#add', 3)
          return ctx.text('#cart-count') === '3'
        },
      },
      { key: 'usesListener', test: uses(/addEventListener\s*\(/) },
    ],
  },
  {
    id: 'dark-mode',
    concept: 'addEventListener',
    example: "document.body.classList.toggle('big') // {{addsOrRemoves}}\nconst isBig = document.body.classList.contains('big')\nconst label = isBig ? 'yes' : 'no'",
    html: `${sign('<button id="theme" class="cart">Dark mode</button>')}
<section class="panel">
  <h2>Open late tonight</h2>
  <p>Build after dark with the night theme.</p>
</section>`,
    js: `const button = document.querySelector('#theme')

// {{toggleTheme}}
`,
    solution: `const button = document.querySelector('#theme')

${THEME_TOGGLE}})
`,
    checks: [
      {
        key: 'turnsDark',
        test: (ctx) => {
          ctx.click('#theme')
          return ctx.hasClass('body', 'dark')
        },
      },
      {
        key: 'turnsBack',
        test: (ctx) => {
          ctx.click('#theme', 2)
          return !ctx.hasClass('body', 'dark')
        },
      },
      {
        key: 'labelFollows',
        test: (ctx) => {
          ctx.click('#theme')
          const dark = ctx.text('#theme')
          ctx.click('#theme')
          return dark === 'Light mode' && ctx.text('#theme') === 'Dark mode'
        },
      },
    ],
  },
  {
    id: 'remember-theme',
    concept: 'localStorage',
    example: "localStorage.setItem('color', 'red')\nconsole.log(localStorage.getItem('color')) // 'red'\nconsole.log(localStorage.getItem('size'))  // null",
    html: `${sign('<button id="theme" class="cart">Dark mode</button>')}
<section class="panel">
  <h2>Open late tonight</h2>
  <p>Your favourite theme should still be there tomorrow.</p>
</section>`,
    js: `const button = document.querySelector('#theme')

// {{readSavedTheme}}

${THEME_TOGGLE}  // {{saveTheme}}
})
`,
    solution: `const button = document.querySelector('#theme')

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark')
  button.textContent = 'Light mode'
}

${THEME_TOGGLE}  localStorage.setItem('theme', dark ? 'dark' : 'light')
})
`,
    checks: [
      { key: 'startsLight', test: (ctx) => !ctx.hasClass('body', 'dark') },
      {
        key: 'saves',
        test: (ctx) => {
          ctx.click('#theme')
          return ctx.storage.getItem('theme') === 'dark'
        },
      },
      {
        key: 'restores',
        test: (ctx) => {
          ctx.click('#theme')
          ctx.reload()
          return ctx.hasClass('body', 'dark') && ctx.text('#theme') === 'Light mode'
        },
      },
      {
        key: 'backToLight',
        test: (ctx) => {
          ctx.click('#theme', 2)
          ctx.reload()
          return !ctx.hasClass('body', 'dark') && ctx.text('#theme') === 'Dark mode'
        },
      },
    ],
  },
  {
    id: 'order-form',
    concept: 'FormData',
    example: "form.addEventListener('submit', (event) => {\n  event.preventDefault() // {{noReload}}\n  const data = new FormData(form)\n  console.log(data.get('email'))\n})",
    html: ORDER_FORM,
    js: `const form = document.querySelector('#order')
const confirmation = document.querySelector('#confirmation')

form.addEventListener('submit', (event) => {
  // {{preventReload}}
  // {{readForm}}
  confirmation.textContent = 'Thanks!'
})
`,
    solution: `const form = document.querySelector('#order')
const confirmation = document.querySelector('#confirmation')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const data = new FormData(form)
  confirmation.textContent = \`Thanks \${data.get('customer')}! \${data.get('quantity')} × \${data.get('brick')} are on their way.\`
})
`,
    checks: [
      { key: 'preventsReload', test: (ctx) => ctx.submit('#order').defaultPrevented },
      {
        key: 'confirms',
        test: (ctx) => {
          order(ctx, 'Ada', 'Blue roof', '3')
          return ctx.text('#confirmation') === 'Thanks Ada! 3 × Blue roof are on their way.'
        },
      },
      {
        key: 'otherOrder',
        test: (ctx) => {
          order(ctx, 'Grace', 'Red brick', '10')
          return ctx.text('#confirmation') === 'Thanks Grace! 10 × Red brick are on their way.'
        },
      },
      { key: 'usesFormData', test: uses(/new\s+FormData\s*\(/) },
    ],
  },
]
