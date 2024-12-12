<script lang="ts">
interface Props {
    size?: number
    color?: string
}

const { size = 16, color = '#fff' }: Props = $props()
</script>

<svg
    class="animate-rotate icon"
    style="vertical-align: middle;fill: currentColor;overflow: hidden;"
    style:width={`${size}px`}
    style:height={`${size}px`}
    style:color={color}
    viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
>
    <path d="M475.428571 97.52381h73.142858v219.428571h-73.142858z m0 609.523809h73.142858v219.428571h-73.142858zM926.47619 475.428571v73.142858h-219.428571v-73.142858z m-609.523809 0v73.142858H97.52381v-73.142858zM779.215238 193.072762l51.712 51.687619-155.136 155.184762-51.736381-51.736381zM348.208762 624.054857l51.736381 51.736381-155.160381 155.136-51.712-51.687619zM193.097143 244.784762l51.687619-51.712 155.184762 155.136-51.736381 51.736381z m430.982095 431.006476l51.736381-51.736381 155.136 155.160381-51.687619 51.712z"></path>
</svg>
