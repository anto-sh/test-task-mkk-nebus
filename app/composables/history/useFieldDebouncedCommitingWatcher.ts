export function useFieldDebouncedCommitingWatcher(
  source: MaybeRefOrGetter<string>,
  onCommit: (before: string, after: string) => void,
  debounceDelay: number = 300,
) {
  const sourceRef = toRef(source)
  let baseline = sourceRef.value
  let timer: ReturnType<typeof setTimeout> | null = null

  function debouncedCommit() {
    if (timer) {
      clearTimeout(timer)
    }
    if (sourceRef.value !== baseline) {
      timer = setTimeout(() => {
        onCommit(baseline, sourceRef.value)
        baseline = sourceRef.value
      }, debounceDelay)
    }
  }

  // watch(sourceRef, () => {
  //   if (ignoreUpdates.value) return
  //   if (timer) clearTimeout(timer)
  //   timer = setTimeout(debounedCommit, debounceDelay)
  // })

  return debouncedCommit
}
