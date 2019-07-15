<script>
  import * as state from 'state'
  import { onMount } from 'svelte'

  export let section
  export let title = ''

  onMount(() => {
    state.section.set(section)
  })
</script>

<svelte:head>
  <title>{title ? title : section} — Russell RPC</title>
</svelte:head>
