<script lang="ts">
import Loading from "./Loading.svelte"

interface ButtonProps {
    text: string
    onclick: (...args: any[]) => void
    loading?: boolean
    type?: 'primary' | 'danger' | 'success' 
}

const { text, onclick, loading = false, type = 'primary' }: ButtonProps = $props()
</script>

<button class={type} onclick={onclick}>
    {#if loading}
        <Loading />
    {:else}
        { text }        
    {/if}
</button>

<style lang="scss">
@mixin createBtnStyle($theme) {
    background: rgba($theme, 0.5);
    &:hover { background: $theme; }
}

button {
    height: 32px;
    border-radius: 8px;
    box-shadow: 0 2px 0 rgba(255, 38, 5, 0.06);
    min-width: 60px;
    margin-right: 8px;
    transition: all 0.25s;
    &:last-of-type { margin-right: 0; }
    &.success { @include createBtnStyle(#389e0d) }
    &.primary { @include createBtnStyle(#1677ff); }
    &.danger { @include createBtnStyle(#ff4d4f); }
}
</style>