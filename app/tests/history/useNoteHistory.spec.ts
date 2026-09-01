import { describe, it, expect, vi } from 'vitest'
import { useNoteHistory } from '~/composables/history/useNoteHistory'
import { applyPatch } from '~/entities/note'
import type { Note, NotePatch } from '~/entities/note'

vi.mock('~/entities/note', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/entities/note')>()
  return { ...actual, applyPatch: vi.fn() }
})

function makeNote(overrides: Partial<Note> = {}): Note {
  return { id: 'n1', title: 'Заметка', todos: [], ...overrides }
}

describe('useNoteHistory', () => {
  it('undo вызывает applyPatch(note, patch, "backward") с переданной заметкой', () => {
    const note = makeNote()
    const history = useNoteHistory(note)
    const patch: NotePatch = { type: 'title', before: '', after: 'Новый заголовок' }

    history.commit(patch)
    history.undo()

    expect(applyPatch).toHaveBeenCalledWith(note, patch, 'backward')
  })

  it('redo вызывает applyPatch(note, patch, "forward")', () => {
    const note = makeNote()
    const history = useNoteHistory(note)
    const patch: NotePatch = { type: 'title', before: '', after: 'X' }

    history.commit(patch)
    history.undo()
    vi.mocked(applyPatch).mockClear()

    history.redo()

    expect(applyPatch).toHaveBeenCalledWith(note, patch, 'forward')
  })

  it('каждый вызов useNoteHistory привязан к своей заметке', () => {
    const noteA = makeNote({ id: 'a' })
    const noteB = makeNote({ id: 'b' })
    const historyA = useNoteHistory(noteA)
    useNoteHistory(noteB)
    const patch: NotePatch = { type: 'title', before: '', after: 'X' }

    historyA.commit(patch)
    historyA.undo()

    expect(applyPatch).toHaveBeenCalledWith(noteA, patch, 'backward')
    expect(applyPatch).not.toHaveBeenCalledWith(noteB, patch, 'backward')
  })
})
