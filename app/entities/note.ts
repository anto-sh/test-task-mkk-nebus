export interface TodoItem {
  id: string
  text: string
  done: boolean
}

export interface Note {
  id: string
  title: string
  todos: TodoItem[]
}

export type NotePatch =
  | { type: 'title'; before: string; after: string }
  | { type: 'todo-text'; todoId: string; before: string; after: string }
  | { type: 'todo-done'; todoId: string; before: boolean; after: boolean }
  | { type: 'todo-add'; todo: TodoItem; index: number }
  | { type: 'todo-remove'; todo: TodoItem; index: number }

export function applyPatch(note: Note, patch: NotePatch, direction: 'forward' | 'backward'): void {
  switch (patch.type) {
    case 'title':
      note.title = direction === 'forward' ? patch.after : patch.before
      return
    case 'todo-text': {
      const todo = note.todos.find((t) => t.id === patch.todoId)
      if (todo) todo.text = direction === 'forward' ? patch.after : patch.before
      return
    }
    case 'todo-done': {
      const todo = note.todos.find((t) => t.id === patch.todoId)
      if (todo) todo.done = direction === 'forward' ? patch.after : patch.before
      return
    }
    case 'todo-add':
      if (direction === 'forward') note.todos.splice(patch.index, 0, patch.todo)
      else
        note.todos.splice(
          note.todos.findIndex((t) => t.id === patch.todo.id),
          1,
        )
      return
    case 'todo-remove':
      if (direction === 'forward')
        note.todos.splice(
          note.todos.findIndex((t) => t.id === patch.todo.id),
          1,
        )
      else note.todos.splice(patch.index, 0, patch.todo)
      return
  }
}
