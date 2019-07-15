<script>
  import { MDCTabIndicator } from '@material/tab-indicator'
  import { onMount } from 'svelte'

  export let active

  let node, indicator

  onMount(() => {
    indicator = new MDCTabIndicator(node)
  })
</script>

<span class="mdc-tab-indicator" class:mdc-tab-indicator--active={active} bind:this={node}>
  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline" />
</span>
