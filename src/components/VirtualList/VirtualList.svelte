<script>
  import { onMount } from 'svelte'
  import range from 'util/range'
  import VirtualListModel from './VirtualListModel'
  import throttle from 'lodash-es/throttle'
  import { getScrollContainer, registerEventListener } from 'util/events'
  import { registerResizeListener } from 'util/resize'
  import VirtualListItem from './VirtualListItem'

  const SCROLL_EVENT_DELAY = 300
  const DEFAULT_ITEM_HEIGHT = 100
  const RENDER_BUFFER_FACTOR = 2.5

  export let component
  export let model

  let scrollTop = 0
  let scrollHeight = 0
  let offsetHeight = 0
  let itemHeights = {}
  let listOffset = 0

  let container // refs

  let scrollListener, resizeListener

  onMount(() => {
    if (!(model instanceof VirtualListModel)) {
      throw new TypeError('model must be instance of VirtualListModel')
    }

    scrollListener = registerEventListener(
      document,
      'scroll',
      throttle(onScroll, SCROLL_EVENT_DELAY, { leading: true, trailing: true }),
      { passive: true }
    )

    resizeListener = registerResizeListener(onResize)
    onResize()
  })

  $: meanHeight = computeMeanHeight(itemHeights)
  $: height = computeHeight(model, meanHeight)
  $: visibleItems = calculateVisibleItems(
    model,
    scrollTop,
    itemHeights,
    offsetHeight,
    listOffset,
    meanHeight
  )

  function calculateVisibleItems(
    model,
    scrollTop,
    itemHeights,
    offsetHeight,
    listOffset,
    meanHeight
  ) {
    if (!(model instanceof VirtualListModel)) {
      throw new TypeError('model must be instance of VirtualListModel')
    }

    let effectiveScrollTop = scrollTop - listOffset
    let renderBuffer = RENDER_BUFFER_FACTOR * offsetHeight
    let visibleItems = []
    let totalOffset = 0
    let len = model.length()

    for (let i = 0; i < len; i++) {
      let height = itemHeights[i] || meanHeight
      let currentOffset = totalOffset
      totalOffset += height
      let isAboveViewport = currentOffset < effectiveScrollTop
      if (isAboveViewport) {
        if (effectiveScrollTop - height - renderBuffer > currentOffset) {
          continue // above the render area
        }
      } else {
        if (currentOffset > effectiveScrollTop + offsetHeight + renderBuffer) {
          break // below the render area
        }
      }

      visibleItems.push({
        offset: currentOffset,
        key: i,
        index: i,
      })
    }

    return visibleItems
  }

  function computeHeight(model, meanHeight) {
    if (!(model instanceof VirtualListModel)) {
      throw new TypeError('model must be instance of VirtualListModel')
    }

    return model.length() * meanHeight
  }

  function computeMeanHeight(itemHeights) {
    let vals = Object.values(itemHeights)
    return vals.length ? vals.reduce((a, b) => a + b) / (vals.length || 1) : DEFAULT_ITEM_HEIGHT
  }

  function onScroll() {
    requestAnimationFrame(() => {
      scrollTop = getScrollContainer().scrollTop
      scrollHeight = getScrollContainer().scrollHeight
    })
  }

  function onResize() {
    scrollHeight = getScrollContainer().scrollHeight
    offsetHeight = window.innerHeight
  }
</script>

<style>
  .virtual-list {
    position: relative;
    width: 100%;
  }
</style>

<svelte:options />
<ul class="virtual-list mdc-list" style="height: {height}px;" bind:this={container}>
  {#if visibleItems}
    {#each visibleItems as visibleItem (visibleItem.key)}
      <VirtualListItem
        {component}
        {model}
        offset={visibleItem.offset}
        key={visibleItem.key}
        index={visibleItem.index}
        bind:itemHeights />
    {/each}
  {/if}
</ul>
