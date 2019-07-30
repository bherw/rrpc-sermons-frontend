<script>
  import { MDCRipple } from '@material/ripple'
  import { onMount } from 'svelte'

  export let elevated = false
  export let href = null

  let node, ripple

  onMount(() => {
    ripple = new MDCRipple(node)
  })
</script>

{#if href}
  <a
    {href}
    bind:this={node}
    class="mdc-button {$$props.class ? $$props.class : ''}"
    class:mdc-button--elevated={elevated}
    on:click>
    <slot />
  </a>
{:else}
  <button
    bind:this={node}
    class="mdc-button {$$props.class ? $$props.class : ''}"
    class:mdc-button--elevated={elevated}
    on:click>
    <slot />
  </button>
{/if}
