<script>
  import Error from 'components/Error'

  export let status
  export let error
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="content-container">
  <h1>{status}</h1>

  <Error {error} />
</div>
