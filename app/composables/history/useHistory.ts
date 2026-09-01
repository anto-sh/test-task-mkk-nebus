import { ref, computed } from 'vue'
import type { NotePatch } from '~/entities/note'

const MAX_HISTORY = 50

export function useHistory(
  applyPatch: (patch: NotePatch, direction: 'forward' | 'backward') => void,
) {
  const past = ref<NotePatch[]>([])
  const future = ref<NotePatch[]>([])
  const historyMoveInProgress = ref(false)

  const canUndo = computed(() => past.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)
  const undoStackSize = computed(() => past.value.length)
  const redoStackSize = computed(() => future.value.length)

  function commit(patch: NotePatch) {
    past.value.push(patch)
    if (past.value.length > MAX_HISTORY) past.value.shift()
    future.value = []
  }

  function undo() {
    const patch = past.value.pop()
    if (!patch) return
    historyMoveInProgress.value = true
    applyPatch(patch, 'backward')
    future.value.push(patch)
    historyMoveInProgress.value = false
  }

  function redo() {
    const patch = future.value.pop()
    if (!patch) return
    historyMoveInProgress.value = true
    applyPatch(patch, 'forward')
    past.value.push(patch)
    historyMoveInProgress.value = false
  }

  function reset() {
    past.value = []
    future.value = []
  }

  return {
    commit,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    undoStackSize,
    redoStackSize,
    past,
    future,
    historyMoveInProgress,
  }
}
