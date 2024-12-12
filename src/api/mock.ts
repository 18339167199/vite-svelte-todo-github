import Mock from 'mockjs'
import { Method, type Todo, type TodoId } from './'
import { v4 } from 'uuid';

const LOCALSTORAGE_KEY = 'todo-list'
const defaultTodoList: Todo[] = [
    {
        id: v4(),
        done: false,
        title: 'At Home',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus rem suscipit obcaecati magni nulla itaque ut pariatur incidunt vero inventore sed ea culpa optio aut beatae animi, quasi temporibus iusto?',
        createDate: 1733662906965,
        doneDate: null
    },
    {
        id: v4(),
        done: false,
        title: 'At Home',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus rem suscipit obcaecati magni nulla itaque ut pariatur incidunt vero inventore sed ea culpa optio aut beatae animi, quasi temporibus iusto?',
        createDate: 1733669906965,
        doneDate: null
    }
]

if (!localStorage.getItem(LOCALSTORAGE_KEY)) {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(defaultTodoList));
}

let todoList: Todo[] = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? '[]');
const storageTodoList = () => window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(todoList))

Mock.setup({
    timeout: 500
})

Mock.mock('/api/todo', Method.GET, () => {
    return {
        code: 0,
        data: todoList,
        msg: 'success'
    }
})

Mock.mock('/api/todo', Method.PUT, (requestOptions) => {
    const { body } = requestOptions
    const data: Partial<Todo> = JSON.parse(body ?? '{}')
    const { id } = data
    const todo = id ? todoList.find(todo => todo.id === id) : undefined
    if (!id || !todo) {
        return {
            code: 400,
            data: null,
            msg: 'todo id not exist'
        }
    }

    const { done, title, content } = data
    if (done !== undefined) {
        todo.done = done
        todo.doneDate = done ? Date.now() : null
    }
    if (title) todo.title = title
    if (content) todo.content = content
    storageTodoList()
    return {
        code: 0,
        data: todo,
        msg: 'success'
    };
})

Mock.mock('/api/todo', Method.DELETE, (requestOptions) => {
    const { body } = requestOptions
    const data: { idList: Todo['id'][] } = JSON.parse(body ?? '{}')
    const { idList } = data
    if (!idList || idList.length === 0) {
        return {
            code: 400,
            data: null,
            msg: 'todo id not exist'
        }
    }
    todoList = todoList.filter(todo => !idList.includes(todo.id))
    storageTodoList()
    return {
        code: 0,
        data: null,
        msg: 'success'
    }
})

Mock.mock('/api/todo', Method.POST, (requestOptions) => {
    const { body } = requestOptions
    const data: Partial<Todo> = JSON.parse(body ?? '{}')
    const { content, title } = data
    if (!content || !title) {
        return {
            code: 400,
            data: null,
            msg: 'title or content empty!'
        }
    }

    const todo: Todo = {
        title,
        content,
        done: false,
        id: v4(),
        createDate: Date.now(),
        doneDate: null
    }

    todoList.push(todo)
    storageTodoList()
    return {
        code: 0,
        data: todo,
        msg: 'success'
    }
})

Mock.mock('/api/todo/batch-update', Method.PUT, (requestOptions) => {
    const data: {
        idList: TodoId[]
        state: Partial<Todo>
    } = JSON.parse(requestOptions.body ?? '{}')
    const { idList, state } = data
    if (!idList?.length || !state) {
        return {
            code: 400,
            data: null,
            msg: `params error: ${requestOptions.body}`
        }
    }
    for (let i = 0; i < todoList.length; i++) {
        if (idList.includes(todoList[i].id)) Object.assign(todoList[i], state)
    }
    storageTodoList()
    return {
        code: 0,
        data: todoList,
        msg: 'success'
    }
})
