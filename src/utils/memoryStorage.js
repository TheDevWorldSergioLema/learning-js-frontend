/**
 * A `localStorage` lookalike kept in memory, so the student's code never touches the app's own storage.
 * `data` is mutated in place: the same object can be handed to the next run to simulate a page reload.
 * @param {Record<string, string>} [data]
 * @param {(data: Record<string, string>) => void} [onChange] receives a copy after every change
 */
export function createMemoryStorage(data = {}, onChange = () => {}) {
  const changed = () => onChange({ ...data })

  return {
    get length() {
      return Object.keys(data).length
    },
    key: (index) => Object.keys(data)[index] ?? null,
    getItem: (key) => (Object.hasOwn(data, String(key)) ? data[String(key)] : null),
    setItem: (key, value) => {
      data[String(key)] = String(value)
      changed()
    },
    removeItem: (key) => {
      delete data[String(key)]
      changed()
    },
    clear: () => {
      for (const key of Object.keys(data)) delete data[key]
      changed()
    },
  }
}
