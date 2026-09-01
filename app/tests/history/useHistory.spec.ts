import { describe, it, expect, vi } from 'vitest'
import type { NotePatch } from '~/entities/note'
import { useHistory } from '~/composables/history/useHistory'

function makePatch(after = 'a'): NotePatch {
  return { type: 'title', before: '', after }
}

describe('useHistory', () => {
  it('начальное состояние - пустая история', () => {
    const history = useHistory(vi.fn())

    expect(history.canUndo.value).toBe(false)
    expect(history.canRedo.value).toBe(false)
    expect(history.undoStackSize.value).toBe(0)
    expect(history.redoStackSize.value).toBe(0)
    expect(history.historyMoveInProgress.value).toBe(false)
  })

  describe('commit', () => {
    it('добавляет патч в past, не вызывая applyPatch', () => {
      const applyPatch = vi.fn()
      const history = useHistory(applyPatch)

      history.commit(makePatch())

      expect(history.undoStackSize.value).toBe(1)
      expect(history.canUndo.value).toBe(true)
      expect(applyPatch).not.toHaveBeenCalled()
    })

    it('очищает redo-ветку', () => {
      const history = useHistory(vi.fn())
      history.commit(makePatch('a'))
      history.undo()
      expect(history.canRedo.value).toBe(true)

      history.commit(makePatch('b'))

      expect(history.canRedo.value).toBe(false)
      expect(history.redoStackSize.value).toBe(0)
    })

    it('ограничивает историю 50 записями', () => {
      const history = useHistory(vi.fn())

      for (let i = 0; i < 60; i++) history.commit(makePatch(String(i)))

      expect(history.undoStackSize.value).toBe(50)
    })

    it('при превышении лимита теряются самые старые записи', () => {
      const history = useHistory(vi.fn())
      for (let i = 0; i < 51; i++) history.commit(makePatch(String(i)))

      const afters = history.past.value.map((p) => ('after' in p ? p.after : undefined))
      expect(afters).not.toContain('0') // первый коммит вытолкнут
      expect(afters).toContain('50') // последний остался
    })
  })

  describe('undo', () => {
    it('вызывает applyPatch с direction "backward" и переносит патч в future', () => {
      const applyPatch = vi.fn()
      const history = useHistory(applyPatch)
      const patch = makePatch('a')
      history.commit(patch)

      history.undo()

      expect(applyPatch).toHaveBeenCalledWith(patch, 'backward')
      expect(history.undoStackSize.value).toBe(0)
      expect(history.redoStackSize.value).toBe(1)
      expect(history.canUndo.value).toBe(false)
      expect(history.canRedo.value).toBe(true)
    })

    it('пустой past - ничего не делает', () => {
      const applyPatch = vi.fn()
      const history = useHistory(applyPatch)

      expect(() => history.undo()).not.toThrow()
      expect(applyPatch).not.toHaveBeenCalled()
    })

    it('historyMoveInProgress истинен во время применения патча, затем снова false', () => {
      let observedDuringApply: boolean | undefined
      let history: ReturnType<typeof useHistory>
      const applyPatch = vi.fn(() => {
        observedDuringApply = history.historyMoveInProgress.value
      })
      history = useHistory(applyPatch)
      history.commit(makePatch())

      history.undo()

      expect(observedDuringApply).toBe(true)
      expect(history.historyMoveInProgress.value).toBe(false)
    })
  })

  describe('redo', () => {
    it('вызывает applyPatch с direction "forward" и переносит патч обратно в past', () => {
      const applyPatch = vi.fn()
      const history = useHistory(applyPatch)
      const patch = makePatch('a')
      history.commit(patch)
      history.undo()
      applyPatch.mockClear()

      history.redo()

      expect(applyPatch).toHaveBeenCalledWith(patch, 'forward')
      expect(history.undoStackSize.value).toBe(1)
      expect(history.redoStackSize.value).toBe(0)
    })

    it('пустой future - ничего не делает', () => {
      const applyPatch = vi.fn()
      const history = useHistory(applyPatch)

      expect(() => history.redo()).not.toThrow()
      expect(applyPatch).not.toHaveBeenCalled()
    })
  })

  it('полный цикл commit → undo → redo сохраняет консистентность стеков', () => {
    const applyPatch = vi.fn()
    const history = useHistory(applyPatch)
    const patch = makePatch('x')

    history.commit(patch)
    history.undo()
    history.redo()

    expect(history.undoStackSize.value).toBe(1)
    expect(history.redoStackSize.value).toBe(0)
    expect(applyPatch).toHaveBeenNthCalledWith(1, patch, 'backward')
    expect(applyPatch).toHaveBeenNthCalledWith(2, patch, 'forward')
  })

  describe('reset', () => {
    it('очищает past и future', () => {
      const history = useHistory(vi.fn())
      history.commit(makePatch('a'))
      history.commit(makePatch('b'))
      history.undo()

      history.reset()

      expect(history.canUndo.value).toBe(false)
      expect(history.canRedo.value).toBe(false)
      expect(history.undoStackSize.value).toBe(0)
      expect(history.redoStackSize.value).toBe(0)
    })
  })
})
