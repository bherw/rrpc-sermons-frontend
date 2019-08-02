<script>
  import { makeTitleWithSeries } from './util'
  import { goto } from '@sapper/app'
  import { DateTime } from 'luxon'

  export let id, title, recordedAt, scriptureFocus, scriptureReading
  export let series = null
  export let speaker = null
  export let selected = false
  export let tabindex = -1

  // Ignored
  export let virtualIndex = null,
    virtualLength = null,
    virtualKey = null

  $: titleWithSeries = makeTitleWithSeries({ series, title })
  $: recordedAtStr = formatDate(recordedAt)

  function formatDate(recordedAt) {
    recordedAt = DateTime.fromISO(recordedAt)

    if (recordedAt > DateTime.local().minus({ days: 7 })) {
      return recordedAt.toFormat('ccc')
    }

    if (recordedAt.year === DateTime.local().year) {
      return recordedAt.toLocaleString({ month: 'short', day: 'numeric' })
    }

    return recordedAt.toLocaleString(DateTime.DATE_MED)
  }
</script>

<style>
  .mdc-list-item--three-line {
    height: 88px;
  }
  .mdc-list-item > a {
    display: block;
    width: 100%;
    color: inherit;
    text-decoration: none;
  }
  .mdc-list-item > a:focus {
    outline: none;
  }
  .primary {
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
  .mdc-list-item__secondary-text::before {
    content: none;
  }
  .title {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .date {
    margin-left: 8px;
  }
</style>

<svelte:options immutable />

<li
  aria-selected={selected}
  class="mdc-list-item"
  class:mdc-list-item--selected={selected}
  class:mdc-list-item--three-line={speaker}
  {tabindex}>
  <a href="/{id}">
    <div class="mdc-list-item__text">
      <div class="primary">
        <div class="title">{titleWithSeries}</div>
        <div class="mdc-typography--caption date">{recordedAtStr}</div>
      </div>
      <div class="mdc-list-item__secondary-text">
        <div>{scriptureFocus || scriptureReading}</div>
        {#if speaker}
          <div class="caption">{speaker.name}</div>
        {/if}
      </div>
    </div>
  </a>
</li>
