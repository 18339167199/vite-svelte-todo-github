<script lang="ts">
import TodoInput from './lib/todoInput.svelte'
import TodoList from './lib/todoList.svelte'
import TodoEditModal from './lib/TodoEditModal.svelte'
</script>

<main>
    <section class="container">
        <TodoInput />
        <TodoList />
        <TodoEditModal />
    </section>
</main>

<style lang="scss">
main {
    padding: 10vh 0;
}
</style>
