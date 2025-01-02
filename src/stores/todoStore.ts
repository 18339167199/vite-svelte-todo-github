import { derived, writable } from 'svelte/store'
import type { Todo } from '../api'
import { todoGet } from '../api'

const _todoList = writable<Todo[]>([])
const _loading = writable<boolean>(false)

export const todoList = derived(_todoList, (value) => value)
export const loading = derived(_loading, (value) => value)

/** 获取 todo list */
export const getTodoList = async () => {
    _loading.set(true)
    const { code, data } = await todoGet()
    _todoList.set(code === 0 ? data : [])
    _loading.set(false)
}
