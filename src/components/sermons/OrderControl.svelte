<script>
  import IconButtonMenu from 'components/material/IconButtonMenu'
  import MenuItem from 'components/material/MenuItem'
  export let order
  let menuIsOpen = false

  const orders = {
    oldest_first: 'Oldest first',
    newest_first: 'Newest first',
  }
</script>

<IconButtonMenu icon="sort" label="Sort">
  {#each Object.entries(orders) as [id, name]}
    <MenuItem class={id === order ? 'mdc-list-item--selected' : ''} on:click={() => (order = id)}>
      {name}
    </MenuItem>
  {/each}
</IconButtonMenu>
<p class="desktop">{orders[order]}</p>
