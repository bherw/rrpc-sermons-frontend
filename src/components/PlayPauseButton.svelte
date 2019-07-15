<script>
  import IconButton from './material/IconButton'
  export let isPaused = true
</script>

<IconButton label={isPaused ? 'Play' : 'Pause'} on:click icon={isPaused ? 'play_arrow' : 'pause'} />
