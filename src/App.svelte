<script lang="ts">
import TodoInput from './lib/todoInput.svelte'
import TodoList from './lib/todoList.svelte'
import TodoEditModal from './lib/TodoEditModal.svelte'

let todoListComponent: { getTodoList: () => void } | undefined = $state()
const refreshTodoList = () => {
    todoListComponent && todoListComponent.getTodoList()
}
</script>

<main>
    <section class="container">
        <TodoInput refreshTodoList={refreshTodoList} />
        <TodoList refreshTodoList={refreshTodoList} bind:this={todoListComponent} />
        <TodoEditModal refreshTodoList={refreshTodoList} />
    </section>
</main>

<style lang="scss">
main {
    padding: 10vh 0;
}
</style>
