import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadNotes, saveNotes, subscribeToExternalChanges } from '~/services/notes-storage.repository'
import type { Note } from '~/entities/note'

const STORAGE_KEY = 'notes:data'

function makeNote(overrides: Partial<Note> = {}): Note {
  return { id: 'a', title: 'Заметка', todos: [], ...overrides }
}

describe('notes-storage.repository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('loadNotes', () => {
    it('пусто в localStorage - возвращает []', () => {
      expect(loadNotes()).toEqual([])
    })

    it('читает и парсит ранее сохранённый payload', () => {
      const notes = [makeNote()]
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, notes }))

      expect(loadNotes()).toEqual(notes)
    })

    it('битый JSON - возвращает [], не падает', () => {
      localStorage.setItem(STORAGE_KEY, '{не json')

      expect(loadNotes()).toEqual([])
    })

    it('версия схемы без зарегистрированной миграции - не падает и не зацикливается', () => {
      const notes = [makeNote()]
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 0, notes }))

      expect(loadNotes()).toEqual(notes)
    })
  })

  describe('saveNotes', () => {
    it('пишет payload с текущей версией схемы', () => {
      const notes = [makeNote()]
      saveNotes(notes)

      const raw = localStorage.getItem(STORAGE_KEY)
      expect(raw).not.toBeNull()
      expect(JSON.parse(raw as string)).toEqual({ schemaVersion: 1, notes })
    })

    it('round-trip: saveNotes → loadNotes возвращает те же данные', () => {
      const notes = [makeNote({ id: 'x' }), makeNote({ id: 'y' })]
      saveNotes(notes)

      expect(loadNotes()).toEqual(notes)
    })
  })

  describe('subscribeToExternalChanges', () => {
    it('вызывает колбэк при storage-событии с совпадающим key', () => {
      const cb = vi.fn()
      subscribeToExternalChanges(cb)

      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))

      expect(cb).toHaveBeenCalledTimes(1)
    })

    it('игнорирует storage-событие с другим key', () => {
      const cb = vi.fn()
      subscribeToExternalChanges(cb)

      window.dispatchEvent(new StorageEvent('storage', { key: 'что-то-другое' }))

      expect(cb).not.toHaveBeenCalled()
    })

    it('возвращённая функция отписки снимает обработчик', () => {
      const cb = vi.fn()
      const unsubscribe = subscribeToExternalChanges(cb)

      unsubscribe()
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))

      expect(cb).not.toHaveBeenCalled()
    })
  })
})
