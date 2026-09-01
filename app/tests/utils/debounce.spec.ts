import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from '~/utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('не вызывает функцию сразу', () => {
    const fn = vi.fn()
    const [debounced] = debounce(fn, 500)

    debounced('a')

    expect(fn).not.toHaveBeenCalled()
  })

  it('вызывает функцию после задержки с переданными аргументами', () => {
    const fn = vi.fn()
    const [debounced] = debounce(fn, 500)

    debounced('a')
    vi.advanceTimersByTime(500)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('a')
  })

  it('повторные вызовы в течение задержки сбрасывают таймер - func вызывается один раз с последними аргументами', () => {
    const fn = vi.fn()
    const [debounced] = debounce(fn, 500)

    debounced('a')
    vi.advanceTimersByTime(300)
    debounced('b')
    vi.advanceTimersByTime(300)
    debounced('c')
    vi.advanceTimersByTime(500)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })

  it('вызовы за пределами задержки - func вызывается для каждого', () => {
    const fn = vi.fn()
    const [debounced] = debounce(fn, 500)

    debounced('a')
    vi.advanceTimersByTime(500)
    debounced('b')
    vi.advanceTimersByTime(500)

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenNthCalledWith(1, 'a')
    expect(fn).toHaveBeenNthCalledWith(2, 'b')
  })

  it('сохраняет this-контекст вызова', () => {
    let capturedThis: unknown
    const obj = {
      value: 42,
      method(this: { value: number }) {
        capturedThis = this
      },
    }
    const [debounced] = debounce(obj.method, 500)

    debounced.call(obj)
    vi.advanceTimersByTime(500)

    expect(capturedThis).toBe(obj)
  })

  it('второй элемент кортежа возвращает текущий id запланированного таймера', () => {
    const fn = vi.fn()
    const [debounced, getTimeoutId] = debounce(fn, 500)

    expect(getTimeoutId()).toBeUndefined()

    debounced('a')

    expect(getTimeoutId()).toBeDefined()
  })
})
