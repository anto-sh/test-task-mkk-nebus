import { describe, it, expect, vi } from 'vitest'
import { reactive, isReactive, watch, nextTick } from 'vue'
import { isObject, getRawData, toDeepRaw } from '~/utils/toDeepRaw'

describe('isObject', () => {
  it('true для простого объекта', () => {
    expect(isObject({})).toBe(true)
  })

  it('false для массива', () => {
    expect(isObject([])).toBe(false)
  })

  it('false для null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('false для примитивов', () => {
    expect(isObject('str')).toBe(false)
    expect(isObject(42)).toBe(false)
    expect(isObject(true)).toBe(false)
  })
})

describe('getRawData', () => {
  it('реактивный объект - возвращает нереактивный target с теми же данными', () => {
    const source = reactive({ a: 1 })

    const result = getRawData(source)

    expect(isReactive(result)).toBe(false)
    expect(result).toEqual({ a: 1 })
  })

  it('обычный объект - возвращает ту же ссылку без изменений', () => {
    const source = { a: 1 }

    expect(getRawData(source)).toBe(source)
  })
})

describe('toDeepRaw', () => {
  it('снимает реактивность со всей структуры, включая вложенные объекты в массиве', () => {
    const source = reactive({
      id: '1',
      title: 'Заметка',
      todos: [{ id: 't1', text: 'Купить молоко', done: false }],
    })

    const result = toDeepRaw(source)

    expect(isReactive(result)).toBe(false)
    expect(result).toEqual({
      id: '1',
      title: 'Заметка',
      todos: [{ id: 't1', text: 'Купить молоко', done: false }],
    })
  })

  it('обычные (нереактивные) данные проходят без изменений по значению', () => {
    const source = { id: '1', todos: [{ id: 't1', text: 'x', done: false }] }

    expect(toDeepRaw(source)).toEqual(source)
  })

  it('примитивы, null и undefined не роняют функцию', () => {
    expect(toDeepRaw(null)).toBeNull()
    expect(toDeepRaw(undefined)).toBeUndefined()
    expect(toDeepRaw('строка')).toBe('строка')
    expect(toDeepRaw(42)).toBe(42)
  })

  it('после вызова исходный реактивный объект остаётся рабочим (реактивность не ломается)', async () => {
    const source = reactive({ todos: [{ id: 't1', done: false }] })

    toDeepRaw(source)

    const spy = vi.fn()
    watch(() => source.todos[0]!.done, spy)

    source.todos[0]!.done = true
    await nextTick()

    expect(spy).toHaveBeenCalled()
  })
})
