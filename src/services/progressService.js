const KEY = 'brick-shop:v1'

const EMPTY = { current: 0, completed: [], code: {}, hints: {} }

export function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return saved ? { ...EMPTY, ...saved } : EMPTY
  } catch {
    return EMPTY
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // Storage can be full or blocked (private mode): progress just won't survive a reload.
  }
}
