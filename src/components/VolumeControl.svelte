<script>
  import { createEventDispatcher } from 'svelte'
  import IconButton from './material/IconButton'

  export let isMuted = false
  export let volume = 100

  let slider

  const dispatch = createEventDispatcher()

  $: icon =
    isMuted || volume < 1
      ? 'volume_off'
      : volume < 33
      ? 'volume_mute'
      : volume < 66
      ? 'volume_down'
      : 'volume_up'

  function toggleMute() {
    if (volume == 0) {
      volume = 100
      setVolume()
      return
    }
    isMuted = !isMuted

    dispatch('toggleMute')
  }

  function setVolume() {
    dispatch('setVolume')
  }
</script>

<style>
  /* Generated by http://danielstern.ca/range.css/?ref=css-tricks#/ */
  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    margin: 3.5px 0;
  }
  input[type='range']:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
    background: rgba(48, 113, 169, 0.78);
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }
  input[type='range']::-webkit-slider-thumb {
    box-shadow: 0.5px 0.5px 1px #000031, 0px 0px 0.5px #00004b;
    border: 0.5px solid #00001e;
    height: 10px;
    width: 10px;
    border-radius: 27px;
    background: cornflowerblue;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -3.7px;
  }
  .controls:hover input[type='range']::-webkit-slider-thumb {
    height: 10px;
    width: 10px;
  }
  input[type='range']:focus::-webkit-slider-runnable-track {
    background: rgba(54, 126, 189, 0.78);
  }
  input[type='range']::-moz-range-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
    background: rgba(48, 113, 169, 0.78);
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }
  input[type='range']::-moz-range-thumb {
    box-shadow: 0.5px 0.5px 1px #000031, 0px 0px 0.5px #00004b;
    border: 0.5px solid #00001e;
    height: 10px;
    width: 10px;
    border-radius: 27px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type='range']::-ms-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type='range']::-ms-fill-lower {
    background: rgba(42, 100, 149, 0.78);
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
  }
  input[type='range']::-ms-fill-upper {
    background: rgba(48, 113, 169, 0.78);
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
  }
  input[type='range']::-ms-thumb {
    box-shadow: 0.5px 0.5px 1px #000031, 0px 0px 0.5px #00004b;
    border: 0.5px solid #00001e;
    height: 10px;
    width: 10px;
    border-radius: 27px;
    background: #ffffff;
    cursor: pointer;
    height: 3px;
  }
  input[type='range']:focus::-ms-fill-lower {
    background: rgba(48, 113, 169, 0.78);
  }
  input[type='range']:focus::-ms-fill-upper {
    background: rgba(54, 126, 189, 0.78);
  }
  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.75em;
  }

  .controls:hover input.slider,
  input.slider:focus {
    width: 64px;
    margin-right: 8px;
    overflow: inherit;
  }

  :global(.controls .button) {
    padding-left: 0;
  }

  input.slider {
    width: 0;
    min-width: 0;
    transition: margin 0.2s cubic-bezier(0.4, 0, 1, 1) 0s,
      padding 0.2s cubic-bezier(0.4, 0, 1, 1) 0s, width 0.2s cubic-bezier(0.4, 0, 1, 1) 0s;
    display: flex;
    overflow: hidden;
    z-index: 100;
  }
</style>

<div class="controls">
  <IconButton {icon} on:click={toggleMute} label={isMuted ? 'Unmute' : 'Mute'} />

  <input
    class="slider"
    type="range"
    bind:value={volume}
    aria-label="Volume"
    on:change={setVolume} />

</div>
