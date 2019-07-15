<script>
  import { MDCTabScroller } from '@material/tab-scroller'
  import { onMount } from 'svelte'

  let node, tabScroller

  onMount(() => {
    tabScroller = new MDCTabScroller(node)
  })
</script>

<div class="mdc-tab-scroller" bind:this={node}>
  <div class="mdc-tab-scroller__scroll-area">
    <div class="mdc-tab-scroller__scroll-content">
      <slot />
    </div>
  </div>
</div>
