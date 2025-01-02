<script lang=ts>
import { todoAdd } from '../api'
import Loading from './components/Loading.svelte'
import { getTodoList } from '../stores/todoStore'

let loading = $state(false)
const formState = $state({
    title: '',
    content: ''
})
const error = $state({
    title: false,
    content: false
})

const addTodo = async () => {
    const { title, content } = formState
    if (!title || !content || loading) {
        error.title = !title
        error.content = !content
        return
    }
    loading = true
    const { code } = await todoAdd({ title, content })
    if (code === 0) {
        formState.title = ''
        formState.content = ''
        getTodoList()
    }
    loading = false
}
</script>

<div class="todo-input">
    <div class="title-input">
        <input
            type="text"
            placeholder="请输入标题"
            class:error={error.title}
            bind:value={formState.title}
            onblur={() => error.title = !formState.title}
        />
        <span class="btn">
            <button class:loading onclick={addTodo} aria-label="add todo">
                {#if loading}
                    <Loading size={24} color='#000' />
                {:else}
                    <svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M810.666667 477.866667h-264.533334V213.333333c0-17.066667-12.8-34.133333-29.866666-34.133333-17.066667 0-29.866667 12.8-34.133334 29.866667v268.8H213.333333c-17.066667 0-34.133333 12.8-34.133333 34.133333s12.8 34.133333 34.133333 34.133333h268.8V810.666667c0 17.066667 12.8 34.133333 29.866667 34.133333 17.066667 0 29.866667-12.8 34.133333-29.866667v-268.8H810.666667c17.066667 0 34.133333-12.8 34.133333-34.133333s-17.066667-34.133333-34.133333-34.133333z"></path></svg>
                {/if}
            </button>
        </span>
    </div>
    <div class="content-input">
        <textarea
            class:error={error.content}
            rows="4"
            placeholder="请输入待办内容"
            bind:value={formState.content}
            onblur={() => error.content = !formState.content}
        ></textarea>
    </div>
</div>

<style lang=scss>
.todo-input {
    border-radius: 12px;
    background-color: var(--text-color);
    display: flex;
    flex-direction: column;
    margin: 0 auto 80px auto;
    width: 450px;
    position: relative;
    padding: 10px;
    .title-input {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        > input {
            height: 32px;
            outline: none;
            border: none;
            background-color: transparent;
            padding: 0;
            margin: 0;
            color: var(--background-color);
            font-size: 16px;
            flex: 1;
            padding: 0 5px;
        }
        .btn {
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
            > button {
                padding: 0;
                display: flex;
                align-items: center;
                background: var(--text-color);
                color: var(--background-color);
                font-size: 24px;
                border-radius: 50%;
                padding: 5px;
                transition: all 0.25s;
                &.loading {
                    cursor: not-allowed;
                }
                &:not(.loading) {
                    &:hover {
                        transform: rotate(180deg);
                        color: var(--text-color);
                        background: var(--background-color);
                    }
                    &:active {
                        transform: rotate(180deg) scale(1.08);
                    }
                }
            }
        }
    }
    .content-input {
        width: 100%;
        box-sizing: border-box;
        > textarea {
            width: 100%;
            box-sizing: border-box;
            background-color: var(--text-color);
            border: none;
            padding: 5px;
            color: var(--background-color);
            resize: none;
            outline: none;
        }
    }

    input, textarea {
        border-bottom: 1px solid var(--background-color);
        transition: all 0.25s;
        &.error {
            &::placeholder {
                color: #ff4d4f;
            }
        }
    }
}
</style>