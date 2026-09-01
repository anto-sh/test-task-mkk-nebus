export function debounce<T extends any[], R>(
  func: (this: any, ...args: T) => R,
  delay: number,
): [(this: any, ...args: T) => void, () => ReturnType<typeof setTimeout> | undefined] {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return [
    function (this: any, ...args: T): void {
      const context = this
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        func.apply(context, args)
      }, delay)
    },
    function () {
      return timeoutId
    },
  ]
}
