<script>
  import { onMount } from 'svelte'
  import DownloadButton from '../DownloadButton'
  import PlayPauseButton from '../PlayPauseButton'
  import VolumeControl from '../VolumeControl'
  import ShareSermonMenu from './ShareSermonMenu'

  export let src, waveformUrl
  export let duration = 0
  export let seek = 0
  let volume = 100
  let isMuted = false
  let isLoaded = false
  let waveContainer
  let wave
  let peaks
  let isPaused = true
  let currentTime = seek

  onMount(async () => {
    const module = await import('wavesurfer.js')
    const Wavesurfer = module.default
    wave = Wavesurfer.create({
      container: waveContainer,

      // MediaElement allows playback to begin immediately
      backend: 'MediaElement',

      waveColor: 'lightskyblue',
      progressColor: 'cornflowerblue',
      responsive: true,
      partialRender: true,
    })

    wave.on('audioprocess', updateCurrentTime)
    wave.on('seek', updateCurrentTime)
    wave.on('error', err => {
      console.log('wavesurfer error: ' + err)
    })
    wave.on('ready', () => {
      duration = wave.getDuration()
      wave.seekTo(seek / duration)
    })

    peaks = await loadPeaks(waveformUrl)
    if (isLoaded) {
      wave.load(src, peaks)
    }
  })

  async function loadPeaks(url) {
    const res = await fetch(url)
    const ab = await res.arrayBuffer()
    const i16 = new Int16Array(ab)
    let peaks = []
    i16.forEach(x => peaks.push(x / 32768))

    if (wave !== undefined) {
      wave.backend.setPeaks(peaks)
      wave.drawBuffer()
    }

    return peaks
  }

  function setVolume() {
    if (isLoaded) {
      wave.setVolume(volume / 100)
    }
  }

  function toggleMute() {
    if (isLoaded) {
      wave.toggleMute()
    }
  }

  function togglePlay() {
    isPaused = !isPaused

    if (!isLoaded) {
      isLoaded = true
      wave.load(src, peaks)
      setVolume()

      if (isMuted) {
        toggleMute()
      }
    }

    wave.playPause()
  }

  function updateCurrentTime() {
    currentTime = wave.getCurrentTime()
  }

  function format(seconds) {
    if (isNaN(seconds)) return '...'

    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)
    if (seconds < 10) {
      seconds = '0' + seconds
    }

    return `${minutes}:${seconds}`
  }
</script>

<style>
  hr {
    border: 0;
    border-bottom: solid 1px rgba(0, 0, 0, 0.12);
  }
</style>

<div style="padding: 16px 0">
  <div bind:this={waveContainer} style="height:128px" />

  <hr />

  <div class="level">
    <div class="level-left">
      <PlayPauseButton {isPaused} on:click={togglePlay} />
      <VolumeControl bind:isMuted bind:volume on:toggleMute={toggleMute} on:setVolume={setVolume} />
      <div>{format(currentTime)} / {format(duration)}</div>
    </div>
    <div class="level-right">
      <ShareSermonMenu time={currentTime} />
      <DownloadButton {src} />
    </div>
  </div>
</div>
