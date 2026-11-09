import { create } from 'zustand'
import { loadProgress, saveProgress } from '../services/progressService.js'

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<import('../types/entities.js').Progress & {
 *   goTo: (index: number) => void,
 *   complete: (levelId: string) => void,
 *   setCode: (levelId: string, code: string) => void,
 *   resetCode: (levelId: string) => void,
 *   showHint: (levelId: string) => void,
 * }>>}
 */
export const useProgressStore = create((set) => ({
  ...loadProgress(),
  goTo: (index) => set({ current: index }),
  complete: (levelId) => set((p) => (p.completed.includes(levelId) ? {} : { completed: [...p.completed, levelId] })),
  setCode: (levelId, code) => set((p) => ({ code: { ...p.code, [levelId]: code } })),
  resetCode: (levelId) => set((p) => {
    const rest = { ...p.code }
    delete rest[levelId]
    return { code: rest }
  }),
  showHint: (levelId) => set((p) => ({ hints: { ...p.hints, [levelId]: (p.hints[levelId] ?? 0) + 1 } })),
}))

useProgressStore.subscribe(({ current, completed, code, hints }) => saveProgress({ current, completed, code, hints }))
