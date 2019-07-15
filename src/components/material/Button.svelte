<script>
  import { MDCRipple } from '@material/ripple'
  import { onMount } from 'svelte'

  export let elevated = false

  let node, ripple

  onMount(() => {
    ripple = new MDCRipple(node)
  })
</script>

<button
  bind:this={node}
  class="mdc-button {$$props.class ? $$props.class : ''}"
  class:mdc-button--elevated={elevated}
  on:click>
  <slot />
</button>
