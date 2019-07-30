<script>
  import { registerResizeListener } from 'util/resize'
  import { onMount } from 'svelte'

  export let index, key, component, offset, itemHeights, model, tabindex

  let node // ref
  let resizeListener
  let shown = itemHeights[index] > 0
  let length = model.length()
  let promise = model.get(index)

  onMount(async () => {
    await promise
    requestAnimationFrame(() => {
      if (!node || typeof index === 'undefined') return

      recalculateHeight()
      resizeListener = registerResizeListener(recalculateHeight)
    })
  })

  function recalculateHeight() {
    if (typeof node === 'undefined') return

    let rect = node.getBoundingClientRect()
    if (itemHeights[index] != rect.height) {
      itemHeights[index] = rect.height
      shown = true
    }
  }
</script>

<style>
  .virtual-list-item {
    position: absolute;
    width: 100%;
    top: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.333s linear;
    contain: content; /* see https://www.w3.org/TR/2018/CR-css-contain-1-20181108/#valdef-contain-content */
  }
  .shown {
    opacity: 1;
    pointer-events: auto;
  }
</style>

<svelte:options />
<div
  class="virtual-list-item"
  class:shown
  aria-hidden={!shown}
  bind:this={node}
  style="transform: translateY({offset}px);">
  {#await promise then props}
    <svelte:component
      this={component}
      {...props}
      {tabindex}
      virtualIndex={index}
      virtualLength={length}
      virtualKey={index}
      on:recalculateHeight={recalculateHeight} />
  {/await}
</div>
