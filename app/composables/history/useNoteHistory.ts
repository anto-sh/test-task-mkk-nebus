import { useHistory } from './useHistory'
import { applyPatch, type Note } from '~/entities/note'

export function useNoteHistory(note: Note) {
  return useHistory((patch, direction) => applyPatch(note, patch, direction))
}
