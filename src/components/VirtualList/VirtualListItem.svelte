<script>
  import { registerResizeListener } from 'util/resize'
  import { onMount } from 'svelte'

  export let index, key, component, offset, itemHeights, model

  let node // ref
  let resizeListener

  $: length = model.length()
  $: shown = itemHeights[index] > 0
  $: props = model.get(index)

  onMount(async () => {
    await props
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
  {#await props}
    <span />
  {:then props}
    <svelte:component
      this={component}
      {...props}
      virtualIndex={index}
      virtualLength={length}
      virtualKey={index}
      on:recalculateHeight={recalculateHeight} />
  {:catch}
    <span />
  {/await}
</div>
