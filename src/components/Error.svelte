<script>
  export let error

  const dev = process.env.NODE_ENV === 'development'
</script>

<p>{error.message}</p>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
