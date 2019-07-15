<script>
  import Button from 'components/material/Button'
  import MenuSurface from 'components/material/MenuSurface'
  import TextField from 'components/material/TextField'
  import { createEventDispatcher } from 'svelte'
  import { makeElasticQuery } from './util'

  const dispatch = createEventDispatcher()

  // TODO: parse the query into the fields
  export let query = ''
  export let open = false

  let queryParts = {
    title: '',
    scripture: '',
    speaker: '',
    series: '',
  }

  function search() {
    query = makeElasticQuery(queryParts)
    dispatch('search', { query })
    open = false
  }

  function onClosed() {
    open = false
    dispatch('closed')
  }
</script>

<style>
  :global().search-menu {
    min-width: 256px;
    max-width: 720px;
    width: 100%;
  }
  .search-menu__content {
    display: grid;
    grid-auto-rows: auto;
    grid-gap: 16px;
    margin: 16px;
  }
</style>

<MenuSurface {open} class="search-menu" on:closed={onClosed} on:opened>
  <div class="search-menu__content">
    <TextField label="Title">
      <input bind:value={queryParts.title} class="mdc-text-field__input" />
    </TextField>

    <TextField label="Scripture">
      <input bind:value={queryParts.scripture} class="mdc-text-field__input" />
    </TextField>

    <TextField label="Speaker">
      <input bind:value={queryParts.speaker} class="mdc-text-field__input" />
    </TextField>

    <TextField label="Series">
      <input bind:value={queryParts.series} class="mdc-text-field__input" />
    </TextField>

    <div class="level">
      <div class="level-left" />
      <div class="level-right">
        <Button elevated on:click={search}>Search</Button>
      </div>
    </div>
  </div>
</MenuSurface>
