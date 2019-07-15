<script context="module">
  import { getSermons } from 'api/sermons'
  import SermonListModel from 'components/sermons/SermonListModel'

  export async function preload({ params, query }) {
    let model
    let error = {}
    try {
      model = new SermonListModel({
        query: query.query || '',
        preload: await getSermons(query.query),
        order: query.order || 'newest_first',
      })
    } catch (e) {
      error[query.query] = e
    }
    return { query: query.query, order: query.order, model, error }
  }
</script>

<script>
  import Error from 'components/Error'
  import OrderControl from 'components/sermons/OrderControl'
  import SearchMenu from 'components/sermons/SearchMenu'
  import SermonList from 'components/sermons/SermonList'
  import TextField from 'components/material/TextField'
  import Title from 'components/Title'
  import throttle from 'lodash-es/throttle'

  export let model
  export let error = {}
  export let query = ''
  export let order = 'newest_first'

  let preload = {}

  let searchMenuIsOpen = false

  $: onSetQuery(query, order)

  function toggleSearchMenu() {
    searchMenuIsOpen = !searchMenuIsOpen
  }

  let onQueryChanged = throttle(
    event => {
      query = event.srcElement.value
    },
    500,
    { trailing: true }
  )

  async function onSetQuery(query, order) {
    // Initial setup phase
    if (typeof window === 'undefined') return

    if (!model || (query === model.query() && order === model.order())) return

    let url = new URL(window.location)
    url.pathname = '/sermons'
    url.search = ''
    if (query) {
      url.searchParams.append('query', query)
    }
    window.history.replaceState({}, 'Sermons — Russell RPC', url)

    let newModel = new SermonListModel({ query, preload: preload[query], order })
    newModel
      .getPage(0)
      .then(page => {
        model = newModel
      })
      .catch(err => {
        error[query] = err
      })
  }

  function search(event) {
    //query = event.detail.query
  }

  function clear() {
    query = ''
  }
</script>

<style>
  .dropdown-toggle {
    transform: rotate(0deg);
    transition: transform 0.2s ease-in-out;
  }
  .upside-down {
    transform: rotate(180deg);
    transition: transform 0.2s ease-in-out;
  }
  .mdc-icon-button.mdc-text-field__icon {
    bottom: 4px;
  }
  :global(.mdc-text-field--with-trailing-icon .mdc-icon-button.mdc-text-field__icon:nth-child(3)) {
    right: 0;
  }
  :global(.mdc-text-field--with-trailing-icon .mdc-icon-button.mdc-text-field__icon:nth-child(4)) {
    right: 48px;
  }
  :global() .search .mdc-text-field {
    min-width: 320px;
    max-width: 720px;
    width: 100%;
  }
  .search {
    margin-top: 16px;
  }
  .results-header {
    border-top: 1px rgba(0, 0, 0, 0.12) solid;
    border-bottom: 1px rgba(0, 0, 0, 0.12) solid;
    padding: 0 16px;
    margin-top: 16px;
  }
</style>

<Title section="Sermons" />

<div class="content-container">
  <div class="search">
    <TextField outlined leadingIcon trailingIcon label="Search sermons" value={query}>
      <input type="text" class="mdc-text-field__input" on:keyup={onQueryChanged} value={query} />

      <!-- TODO: IconButton can't be clicked in here for some reason -->
      <i class="material-icons mdc-text-field__icon" on:click={search}>search</i>
      <button
        class="mdc-icon-button material-icons mdc-text-field__icon dropdown-toggle"
        class:upside-down={searchMenuIsOpen}
        tabindex="0"
        on:click={toggleSearchMenu}
        aria-label="Advanced search">
        arrow_drop_down
      </button>
      {#if query}
        <button
          class="material-icons mdc-icon-button mdc-text-field__icon"
          tabindex="0"
          on:click={clear}>
          clear
        </button>
      {/if}

    </TextField>
    <div class="mdc-menu-surface--anchor">
      <SearchMenu
        open={searchMenuIsOpen}
        bind:query
        on:search={search}
        on:closed={() => (searchMenuIsOpen = false)} />
    </div>
  </div>

  {#if error[query]}
    <Error error={error[query]} />
  {:else}
    <div class="results-header level">
      <div class="level-left">
        <p>{model.length()} sermons found</p>
      </div>
      <div class="level-right">
        <OrderControl bind:order />
      </div>
    </div>
    <SermonList {model} />
  {/if}
</div>
