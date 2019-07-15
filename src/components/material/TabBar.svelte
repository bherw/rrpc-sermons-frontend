<script>
  import { MDCTabBar } from '@material/tab-bar'
  import TabScroller from './TabScroller.svelte'
  import { onMount } from 'svelte'

  let node, tabBar

  onMount(() => {
    tabBar = new MDCTabBar(node)
  })
</script>

<div class="mdc-tab-bar" role="tablist" bind:this={node}>
  <TabScroller>
    <slot />
  </TabScroller>
</div>
