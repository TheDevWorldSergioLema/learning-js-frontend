import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounced } from './useDebounced.js'

const render = (value, key = 'a') =>
  renderHook((props) => useDebounced(props.value, 500, props.key), { initialProps: { value, key } })

describe('useDebounced', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  describe('delay', () => {
    it('keeps the previous value until the new one stopped changing for the delay', () => {
      const { result, rerender } = render('one')

      rerender({ value: 'two', key: 'a' })
      act(() => vi.advanceTimersByTime(400))
      expect(result.current[0]).toBe('one')

      act(() => vi.advanceTimersByTime(100))
      expect(result.current[0]).toBe('two')
    })

    it('restarts the delay on every change', () => {
      const { result, rerender } = render('one')

      rerender({ value: 'two', key: 'a' })
      act(() => vi.advanceTimersByTime(400))
      rerender({ value: 'three', key: 'a' })
      act(() => vi.advanceTimersByTime(400))

      expect(result.current[0]).toBe('one')
    })
  })

  describe('without waiting', () => {
    it('returns the new value at once when the key changes', () => {
      const { result, rerender } = render('one')

      rerender({ value: 'other step', key: 'b' })

      expect(result.current[0]).toBe('other step')
    })

    it('returns the current value at once after a flush', () => {
      const { result, rerender } = render('one')

      rerender({ value: 'two', key: 'a' })
      act(() => result.current[1]())

      expect(result.current[0]).toBe('two')
    })
  })
})
