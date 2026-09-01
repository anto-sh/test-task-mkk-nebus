import { onMounted, onBeforeUnmount } from 'vue'

export function useGlobalUndoRedo(undo: () => void, redo: () => void) {
  function handleKeydown(e: KeyboardEvent) {
    const isUndo = (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z'
    const isRedo = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z'
    if (!isUndo && !isRedo) return

    const target = e.target as HTMLElement
    const isEditableField =
      target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
    if (isEditableField) return

    e.preventDefault()
    isUndo ? undo() : redo()
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
}
