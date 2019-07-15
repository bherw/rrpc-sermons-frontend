<script>
  import { makeTitleWithSeries } from './util'
  import {goto} from '@sapper/app'

  export let sermon
  export let showSpeaker = true
  export let showSeries = true

  // Ignored
  export let virtualIndex, virtualLength, virtualKey

  $: titleWithSeries = showSeries ? makeTitleWithSeries(sermon) : sermon.title
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

<li class="mdc-list-item" class:mdc-list-item--three-line={showSpeaker} on:click={() => goto(`/sermons/${sermon.identifier}`)}>
  <a href="/sermons/{sermon.identifier}">
    <div class="mdc-list-item__text">
      <div class="primary">
        <div class="title">{titleWithSeries}</div>
        <div class="mdc-typography--caption date">{sermon.identifier}</div>
      </div>
      <div class="mdc-list-item__secondary-text">
        <div>{sermon.scripture_focus || sermon.scripture_reading}</div>
        {#if showSpeaker}
          <div class="caption">{sermon.speaker_name}</div>
        {/if}
      </div>
    </div>
  </a>
</li>
