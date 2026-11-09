import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from './memoryStorage.js'

describe('createMemoryStorage', () => {
  describe('Storage API', () => {
    it('stores values as strings and returns null for unknown keys', () => {
      const storage = createMemoryStorage()

      storage.setItem('count', 3)

      expect(storage.getItem('count')).toBe('3')
      expect(storage.getItem('missing')).toBeNull()
      expect(storage.length).toBe(1)
      expect(storage.key(0)).toBe('count')
    })

    it('removes one key or every key', () => {
      const storage = createMemoryStorage({ a: '1', b: '2' })

      storage.removeItem('a')
      expect(storage.getItem('a')).toBeNull()
      storage.clear()
      expect(storage.length).toBe(0)
    })
  })

  describe('data', () => {
    it('writes into the given object, so a later storage on the same data sees the values', () => {
      const data = {}
      createMemoryStorage(data).setItem('theme', 'dark')

      expect(createMemoryStorage(data).getItem('theme')).toBe('dark')
    })

    it('reports a copy of the data after every change', () => {
      const onChange = vi.fn()
      const storage = createMemoryStorage({}, onChange)

      storage.setItem('theme', 'dark')
      storage.removeItem('theme')

      expect(onChange.mock.calls).toEqual([[{ theme: 'dark' }], [{}]])
    })
  })
})
