<script>
  import { MDCRipple } from '@material/ripple'
  import { onMount } from 'svelte'

  export let icon
  export let label = ''

  let node, ripple

  onMount(() => {
    ripple = new MDCRipple(node)
    ripple.unbounded = true
  })
</script>

<button
  bind:this={node}
  on:click
  on:mouseover
  class="mdc-icon-button material-icons {$$props.class ? $$props.class : ''}"
  aria-label={label || icon}>
   {icon}
</button>
