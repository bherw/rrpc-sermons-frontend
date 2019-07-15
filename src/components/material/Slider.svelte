<script context="module">
  let slider
  export function layoutSlider() {
    slider.layout()
  }
</script>

<script>
  import { MDCSlider } from '@material/slider'
  import { onMount, createEventDispatcher } from 'svelte'
  export let min, max, value, label, step, disabled, tabindex
  let node

  const dispatch = createEventDispatcher()

  onMount(() => {
    slider = new MDCSlider(node)
    slider.listen('MDCSlider:change', () => {
      value = slider.value
      dispatch('change')
    })
  })
</script>

<style type="scss">
  @import '@material/slider/mdc-slider';
</style>

<div
  bind:this={node}
  class="mdc-slider {$$props.class}"
  {tabindex}
  role="slider"
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuenow={value}
  aria-label={label}
  data-step="1">
  <div class="mdc-slider__track-container">
    <div class="mdc-slider__track" />
  </div>
  <div class="mdc-slider__thumb-container">
    <svg class="mdc-slider__thumb" width="21" height="21">
      <circle cx="10.5" cy="10.5" r="7.875" />
    </svg>
    <div class="mdc-slider__focus-ring" />
  </div>
</div>
