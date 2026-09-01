import { describe, it, expect, beforeEach } from 'vitest'
import { saveDraft, loadDraft, clearDraft } from '~/services/draft-storage.repository'
import type { Note } from '~/entities/note'

function makeNote(overrides: Partial<Note> = {}): Note {
  return { id: 'a', title: 'Черновик', todos: [], ...overrides }
}

describe('draft-storage.repository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('нет черновика - loadDraft возвращает null', () => {
    expect(loadDraft('a')).toBeNull()
  })

  it('round-trip: saveDraft → loadDraft возвращает ту же заметку', () => {
    const note = makeNote({ title: 'Не забыть про молоко' })
    saveDraft('a', note)

    expect(loadDraft('a')).toEqual(note)
  })

  it('работает для ключа "new" (черновик ещё не сохранённой заметки)', () => {
    const note = makeNote({ id: 'new', title: 'Новая заметка' })
    saveDraft('new', note)

    expect(loadDraft('new')).toEqual(note)
  })

  it('черновики разных noteId не пересекаются', () => {
    saveDraft('a', makeNote({ id: 'a', title: 'Первая' }))
    saveDraft('b', makeNote({ id: 'b', title: 'Вторая' }))

    expect(loadDraft('a')?.title).toBe('Первая')
    expect(loadDraft('b')?.title).toBe('Вторая')
  })

  it('битый JSON - возвращает null, не падает', () => {
    localStorage.setItem('notes:draft:a', '{не json')

    expect(loadDraft('a')).toBeNull()
  })

  it('clearDraft удаляет черновик', () => {
    saveDraft('a', makeNote())
    clearDraft('a')

    expect(loadDraft('a')).toBeNull()
  })

  it('clearDraft для отсутствующего черновика - no-op', () => {
    expect(() => clearDraft('ghost')).not.toThrow()
  })
})
