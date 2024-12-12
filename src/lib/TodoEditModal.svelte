<script lang="ts">
import { todoPut, todoDelete } from '../api/index'
import { untrack } from 'svelte'
import { useDialog } from '../hook/useDialog.svelte'
import Button from './components/Button.svelte'

const { refreshTodoList }: { refreshTodoList: () => void } = $props()

const { dialogInfo, closeDialog } = useDialog()
let dialogDom: HTMLDialogElement | undefined = $state()
let visible = $derived.by(() => !!dialogInfo.type && !!dialogInfo.todo)
let editTodo = $derived.by(() => dialogInfo.todo)
let loading = $state(false)
let formState = $state({
    title: '',
    content: ''
})

const updateTodo = async () => {
    if (!editTodo) return
    loading = true
    const { title, content } = formState
    const { code } = await todoPut({ id: editTodo.id, title, content })
    if (code === 0) {
        closeDialog()
        refreshTodoList()
    }
    loading = false
}

const deleteTodo = async () => {
    if (!editTodo) return
    loading = true
    const { code } = await todoDelete([editTodo.id])
    if (code === 0) {
        closeDialog()
        refreshTodoList()
    }
    loading = false
}

$effect(() => {
    console.log('TodoEdotModal effect')
    if (!dialogDom) return
    if (visible) {
        dialogDom.showModal()
        // untrack 防止 formState 的变化触发 effect
        untrack(() => {
            formState.title = editTodo?.title ?? ''
            formState.content = editTodo?.content ?? ''
        })
    } else {
        dialogDom.close()
    }
})
</script>

<dialog bind:this={dialogDom}>
    <h2>{ dialogInfo.type === 'edit' ? '编辑待办' : '删除待办' }</h2>
    {#if dialogInfo.type === 'edit'}
        <section class="todo-edit">
            <form onsubmit={(e) => e.preventDefault()}>
                <label>
                    <span>标题:</span>
                    <input type="text" bind:value={formState.title} />
                </label>
                <label>
                    <span>内容:</span>
                    <textarea bind:value={formState.content} rows="4" style="resize: none; line-height: 18px;"></textarea>
                </label>
                <div class="btns">
                    <Button
                        text='取消'
                        type='primary'
                        onclick={closeDialog}
                    />
                    <Button
                        text='保存'
                        type='success'
                        onclick={updateTodo}
                        {loading}
                    />
                </div>
            </form>
        </section>
    {:else}
        <div class="delete-tips">
            <p>确认删除 "{editTodo?.title ?? ''}" ?</p>
            <div class="btns">
                <Button
                    text='取消'
                    type='primary'
                    onclick={closeDialog}
                />
                <Button
                    text='删除'
                    type='danger'
                    onclick={deleteTodo}
                    {loading}
                />
            </div>
        </div>
    {/if}
</dialog>

<style lang="scss">
@keyframes slideDown {
    from {
        transform: translateY(-20px);
    }
    to {
        transform: translateY(0);
    }
}

dialog {
    animation: slideDown 0.2s ease;
    border: none;
    border-radius: 8px;
    background: var(--background-color);
    color: var(--text-color);
    &::backdrop {
        background: rgba(#000, 0.6);
        transition: all 0.25s;
    }

    h2 {
        margin-top: 0;
    }

    form {
        label {
            display: flex;
            margin-bottom: 30px;
            span {
                width: 100px;
                text-align: left;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
            input {
                height: 28px;
                width: 400px;
            }
            textarea {
                width: 400px;
            }
        }
        .btns {
            display: flex;
            justify-content: flex-end;
        }
    }

    .delete-tips {
        p {
            color: rgb(255, 77, 79);
        }
        .btns {
            margin-top: 20px;
            display: flex;
            justify-content: center;
        }
    }
}
</style>
