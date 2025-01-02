<script lang="ts">
import { todoDelete, todoPut, batchTodoPut, type Todo } from '../api'
import { flip } from 'svelte/animate'
import { useDialog } from '../hook/useDialog.svelte'
import Button from './components/Button.svelte'
import { todoList, getTodoList } from '../stores/todoStore'

interface LoadingState {
    /** todo id */
    id: Todo['id'] | null
    /** 0: 完成/未完成，1: 编辑，2: 删除 */
    loadingType: 0 | 1 | 2 | null
}

type TodoListType = 'done' | 'undone'

let finishTodoList = $derived.by(() => $todoList.filter(({ done }) => done).sort((a, b) => b.createDate - a.createDate))
let unFinishTodoList = $derived.by(() => $todoList.filter(({ done }) => !done).sort((a, b) => b.createDate - a.createDate))
const loading: LoadingState = $state({ id: null, loadingType: null })
const { openDialog } = useDialog()
let selecteeTodoList: Todo['id'][] = $state([])
$inspect(selecteeTodoList)

$inspect($todoList, finishTodoList, unFinishTodoList)

const setLoading = (params?: LoadingState) => {
    loading.id = params?.id ?? null
    loading.loadingType = params?.loadingType ?? null
}

const changeTodo = async (id: Todo['id'], todo: Partial<Todo>) => {
    if (loading.id) return
    setLoading({ id, loadingType: 0 })
    const { code } = await todoPut({ id, ...todo })
    if (code === 0) await getTodoList()
    setLoading()
}

let deleteTodosLoading = $state(false)
const deleteTodos = async(ids: Todo['id'][]) => {
    if (selecteeTodoList.length === 0 || deleteTodosLoading) return
    deleteTodosLoading = true
    const { code } = await todoDelete(selecteeTodoList)
    if (code === 0) {
        selecteeTodoList = []
        getTodoList()
    }
    deleteTodosLoading = false
}

let batchTodoUpdateDoneLoading = $state(false)
const batchTodoUpdateDone = async (done: boolean) => {
    if (selecteeTodoList.length === 0 || batchTodoUpdateDoneLoading) return
    batchTodoUpdateDoneLoading = true
    const { code } = await batchTodoPut({ idList: selecteeTodoList, state: { done } })
    if (code === 0) {
        selecteeTodoList = []
        getTodoList()
    }
    batchTodoUpdateDoneLoading = false
}
</script>

{#snippet TodoList(todoList: Todo[], type: TodoListType)}
    {@const done = type === 'done'}
    {@const undone = type === 'undone'}
    <ul class="todo-list" class:done class:undone>
        <h2>{ done ? '已完成待办' : '未完成待办' }:</h2>
        {#if todoList.length > 0}
            {#each todoList as todo (todo.id)}
                <li animate:flip>
                    <input type="checkbox" bind:group={selecteeTodoList} value={todo.id}>
                    <div class="content">
                        <h3 class="title">{ todo.title }</h3>
                        <p class="content">{ todo.content }</p>
                        <span class="date">
                            创建时间: {(new Date(todo.createDate)).toLocaleString()}
                            {#if done && todo.doneDate}
                                完成时间: {(new Date(todo.doneDate)).toLocaleString()}
                            {/if}
                        </span>
                    </div>
                    <div class='btns'>
                        <Button
                            text={type === 'done' ? '未完成' : '完成'}
                            onclick={() => changeTodo(todo.id, { done: !todo.done })}
                            loading={loading.id === todo.id && loading.loadingType === 0}
                            type='success'
                        />
                        <Button
                            text='编辑'
                            onclick={() => openDialog('edit', todo)}
                            loading={loading.id === todo.id && loading.loadingType === 1}
                            type='primary'
                        />
                        <Button
                            text='删除'
                            onclick={() => openDialog('delete', todo)}
                            loading={loading.id === todo.id && loading.loadingType === 2}
                            type='danger'
                        />
                    </div>
                </li>
            {/each}
        {:else}
            <div class="empty-view">
                <svg class="icon" style="width: 5em;height: 5em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M821.333333 132.266667H264.533333c-38.4 0-70.4 29.866667-74.666666 66.133333v678.4c0 2.133333 0 2.133333 2.133333 4.266667s0 4.266667 0 4.266666c2.133333 2.133333 2.133333 2.133333 4.266667 2.133334s4.266667 2.133333 6.4 2.133333c2.133333 0 4.266667 0 6.4-2.133333 2.133333 0 2.133333-2.133333 4.266666-2.133334l140.8-113.066666 128 113.066666c2.133333 0 2.133333 2.133333 2.133334 2.133334s2.133333 0 2.133333 2.133333c2.133333 0 4.266667 2.133333 6.4 2.133333s4.266667 0 4.266667-2.133333c0 0 2.133333 0 2.133333-2.133333 2.133333 0 2.133333-2.133333 2.133333-2.133334l149.333334-121.6 149.333333 121.6c2.133333 2.133333 2.133333 2.133333 4.266667 2.133334s4.266667 2.133333 6.4 2.133333c2.133333 0 4.266667 0 6.4-2.133333 4.266667-2.133333 6.4-4.266667 8.533333-8.533334 0-2.133333 2.133333-4.266667 2.133333-4.266666V281.6c38.4-4.266667 68.266667-36.266667 68.266667-74.666667-4.266667-38.4-36.266667-70.4-74.666667-74.666666z" fill="#40455A"></path><path d="M797.866667 851.2L661.333333 736c-6.4-6.4-14.933333-6.4-19.2 0l-149.333333 119.466667-128-113.066667s-2.133333 0-2.133333-2.133333l-2.133334-2.133334h-4.266666-4.266667l-2.133333 2.133334s-2.133333 0-2.133334 2.133333l-130.133333 106.666667V213.333333c0-25.6 19.2-53.333333 49.066667-53.333333 25.6 0 49.066667 21.333333 46.933333 53.333333-2.133333 25.6-19.2 40.533333-46.933333 40.533334-8.533333 0-12.8 6.4-12.8 12.8s6.4 12.8 19.2 12.8h526.933333v571.733333z" fill="#FAFADE"></path><path d="M817.066667 253.866667H322.133333c10.666667-12.8 17.066667-29.866667 17.066667-46.933334 0-17.066667-4.266667-34.133333-14.933333-46.933333h501.333333c25.6 0 40.533333 27.733333 40.533333 53.333333-2.133333 19.2-23.466667 40.533333-49.066666 40.533334z m-499.2 177.066666h379.733333c4.266667 0 6.4-4.266667 6.4-6.4v-12.8c0-4.266667-4.266667-6.4-6.4-6.4H317.866667c-4.266667 0-6.4 4.266667-6.4 6.4v12.8c-2.133333 4.266667 2.133333 6.4 6.4 6.4z m0 93.866667h379.733333c4.266667 0 6.4-4.266667 6.4-6.4v-12.8c0-4.266667-4.266667-6.4-6.4-6.4H317.866667c-4.266667 0-6.4 4.266667-6.4 6.4v12.8c-2.133333 4.266667 2.133333 6.4 6.4 6.4z m0 96h379.733333c4.266667 0 6.4-4.266667 6.4-6.4v-12.8c0-4.266667-4.266667-6.4-6.4-6.4H317.866667c-4.266667 0-6.4 4.266667-6.4 6.4v12.8c-2.133333 2.133333 2.133333 6.4 6.4 6.4z" fill="#97D5EB"></path></svg>
                <span>暂无数据</span>
            </div>
        {/if}
    </ul>
{/snippet}

{#await getTodoList()}
    Loading...
{:then}
    {@render TodoList(unFinishTodoList, 'undone')}
    {@render TodoList(finishTodoList, 'done')}
{/await}

{#if selecteeTodoList.length > 0}
    {@const unFinishTodoListIds = unFinishTodoList.map(todo => todo.id)}
    {@const finishTodoLostIds = finishTodoList.map(todo => todo.id)}
    <div class="operation-btns">
        {#if selecteeTodoList.every(todoId => unFinishTodoListIds.includes(todoId))}
            <Button
                text="批量完成"
                onclick={() => batchTodoUpdateDone(true)}
                type='success'
                loading={batchTodoUpdateDoneLoading}
            />
        {/if}
        {#if selecteeTodoList.every(todoId => finishTodoLostIds.includes(todoId))}
            <Button
                text="批量未完成"
                onclick={() => batchTodoUpdateDone(false)}
                type='success'
                loading={batchTodoUpdateDoneLoading}
            />
        {/if}
        <Button text="批量删除" type='danger' onclick={deleteTodos} loading={deleteTodosLoading} />
    </div>
{/if}

<style lang=scss>
.todo-list {
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: left;
    margin-bottom: 70px;
    &:last-of-type { margin-bottom: 0; }
    &.done {
        > li {
            .content {
                p, h3 {
                    opacity: 0.6;
                    text-decoration: line-through rgba(#ff4d4f, 0.8);
                }
            }
        }
    }
    > h2 {
        margin-top: 0;
        margin-bottom: 10px;
    }
    > li {
        display: flex;
        margin-bottom: 15px;
        &:last-of-type { margin-bottom: 0; }
        input[type=checkbox] {
            zoom: 200%;
            margin: 0;
        }
        .content {
            padding: 0 10px 0 30px;
            flex: 1;
            width: 600px;
            > p, h3 {
                margin: 0;
                padding: 0;
            }
            h3 {
                font-size: 16px;
                line-height: 20px;
                padding-bottom: 5px;
            }
            p {
                font-size: 14px;
                line-height: 18px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }
            .date {
                font-size: 12px;
                opacity: 0.5;
            }
        }
        .btns {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .empty-view {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
        font-size: 16px;
        font-weight: bolder;
        > span {
            margin-top: 5px;
        }
    }
}

.operation-btns {
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
}
</style>
