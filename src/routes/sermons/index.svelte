<script context="module">
  import { client } from 'api/graphql'
  import SermonsQuery from './SermonsQuery.gql'
  import SermonListModel from 'components/sermons/SermonListModel'

  export async function preload({ params, query }) {
    const search = query.query || ''
    const order = query.order || 'newest_first'
    const preload = await client
      .query({
        query: SermonsQuery,
        variables: { search, order },
      })
      .result()

    return { search, order, preload }
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

  export let preload
  export let error = {}
  export let search = ''
  export let order = 'newest_first'

  client.restore(SermonsQuery, preload.data)

  let model = new SermonListModel({ query: SermonsQuery, variables: { search, order } })
  let modelLoaded = model.loadMore()

  let searchMenuIsOpen = false

  $: onSetSearch(search, order)

  function toggleSearchMenu() {
    searchMenuIsOpen = !searchMenuIsOpen
  }

  let onSearchChanged = throttle(
    event => {
      search = event.srcElement.value
    },
    500,
    { trailing: true }
  )

  async function onSetSearch(search, order) {
    // Initial setup phase
    if (typeof window === 'undefined') return

    // No change
    if (!model || (search === model.variables().search && order === model.variables().order)) return

    // Update location bar
    let url = new URL(window.location)
    url.pathname = '/sermons'
    url.search = ''
    if (search) {
      url.searchParams.append('query', search)
    }
    window.history.replaceState({}, 'Sermons — Russell RPC', url)

    const newModel = new SermonListModel({ query: SermonsQuery, variables: { search, order } })
    try {
      const newModelLoaded = newModel.loadMore()
      await newModelLoaded
      model = newModel
      modelLoaded = newModelLoaded
    } catch (err) {
      error[search] = err
    }
  }

  function clear() {
    search = ''
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
    <TextField outlined leadingIcon trailingIcon label="Search sermons" value={search}>
      <input type="text" class="mdc-text-field__input" on:keyup={onSearchChanged} value={search} />

      <!-- TODO: IconButton can't be clicked in here for some reason -->
      <i class="material-icons mdc-text-field__icon">search</i>
      <button
        class="mdc-icon-button material-icons mdc-text-field__icon dropdown-toggle"
        class:upside-down={searchMenuIsOpen}
        tabindex="0"
        on:click={toggleSearchMenu}
        aria-label="Advanced search">
        arrow_drop_down
      </button>
      {#if search}
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
        bind:query={search}
        on:closed={() => (searchMenuIsOpen = false)} />
    </div>
  </div>

  {#await modelLoaded then }
    {#if error[search]}
      <Error error={error[search]} />
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
  {/await}
</div>
