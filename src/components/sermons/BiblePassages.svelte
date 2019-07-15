<script>
  import Reference from 'lib/bible/reference'
  import { onMount } from 'svelte'
  import { getPassages } from 'api/biblesearch'

  export let reading,
    focus,
    version = 'eng-NASB'
  let promise, label, parens, contentSection
  let resizeListener

  async function decorateFocus(focus) {
    if (typeof document === 'undefined') return

    focus = new Reference(focus)
    const { passages } = await promise
    const passageElems = contentSection.getElementsByClassName('passage')

    // TODO: read from computedStyles instead of hardcoding
    const fontSize = 16
    const lineHeight = 20
    const labelPadding = lineHeight - fontSize
    const lineHeightPadding = lineHeight - fontSize

    for (let i = 0; i < passages.length; i++) {
      const passage = passages[i]
      const passageElem = passageElems[i]

      if (!passageElem) continue

      const spans = []
      focus.verses().forEach(verse => {
        for (const span of passageElem.getElementsByClassName(verse.toCssClass())) {
          spans.push(span)
          span.classList.add('is-focus')
        }
      })

      if (spans.length < 1) continue

      const firstTop = spans[0].offsetTop
      const lastBottom = spans[spans.length - 1].offsetTop + spans[spans.length - 1].offsetHeight
      const width = lastBottom - firstTop + lineHeightPadding
      const top = firstTop - lineHeightPadding + width / 2

      const label = passageElem.getElementsByClassName('focus-label')[0]
      const parens = passageElem.getElementsByClassName('focus-parens')[0]

      label.style.display = 'block'
      label.style.top = top - labelPadding + 'px'
      label.style.padding = '0 ' + labelPadding + 'px'

      parens.style.display = 'block'
      parens.style.top = top + 'px'
      parens.style.right = '-' + (width / 2 + lineHeightPadding) + 'px'
      parens.style.width = width + 'px'
    }
  }

  function clearFocus() {
    if (typeof document === 'undefined') return

    for (const item of document.getElementsByClassName('focus')) {
      div.style.display = 'none'
    }
    for (const item of document.getElementsByClassName('is-focus')) {
      item.classList.remove('is-focus')
    }
  }

  $: promise = getPassages(reading, version)

  $: if (focus) {
    decorateFocus(focus)
    onMount(() => decorateFocus(focus))
  } else {
    clearFocus()
  }
</script>

<style type="scss">
  @import './../../scss/const';
  .focus-label,
  .focus-parens {
    display: none;
    position: absolute;
    transform: rotate(90deg);
    color: $mdc-theme-primary;
  }
  .focus-label {
    right: -28px;
    z-index: 1;
    background: $mdc-theme-background;
  }
  .focus-parens {
    height: 4px;
    border: 1px solid $mdc-theme-primary;
    border-bottom: 0;
  }
  .passages :global(.is-focus) {
    color: $mdc-theme-primary;
  }
  .passage {
    position: relative;
  }

  .passage :global(.s) {
    /* .md-subhead */
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.01em;
    line-height: 24px;
    margin: 0;
  }

  .passage :global(.d) {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 24px;
    margin-top: -1rem;
  }

  .passage :global(sup) {
    margin: 0;
    padding: 0 2px;
  }

  .passage :global(p) {
    margin: 0;
  }
  .passage :global(.p) {
    text-indent: 0.125in;
  }
  .passage :global(.b) {
    height: 20px;
  }
  .passage :global(.q1) {
    text-indent: 0.25in;
  }
  .passage :global(.q2) {
    text-indent: 0.5in;
  }
  .passage :global(.it) {
    font-style: italic;
  }
</style>

<svelte:window on:resize={() => decorateFocus(focus)} />

<section class="mdc-typography--body2" bind:this={contentSection}>
  {#await promise}
    <div class="passage">
      <h1 class="mdc-typography--headline6">{reading}</h1>
    </div>
    <p>Loading...</p>
  {:then res}
    <div class="passages">
      {#each res.passages as passage}
        <div class="passage">
          <h1 class="mdc-typography--headline6">{passage.display}</h1>
          <div class="content">
            {@html passage.text}
          </div>
          <div class="focus focus-label" style="display:none">focus</div>
          <div class="focus focus-parens" style="display:none" />
        </div>
      {/each}
      <div class="mdc-typography--caption">
        {@html res.passages[0].copyright}
      </div>
    </div>
  {:catch error}
    <div class="passage">
      <h1 class="mdc-typography--headline6">{reading}</h1>
    </div>
    <p class="error">Error loading passages: {error}</p>
  {/await}
</section>
