<script>
  import IconButtonMenu from 'components/material/IconButtonMenu'
  import MenuItem from 'components/material/MenuItem'

  export let time
  let copyInput
  let menuIsOpen = false

  function copyUrl(query) {
    var url = new URL(window.location)
    if (query !== undefined) {
      url.search = '?' + query
    } else {
      url.search = ''
    }

    // Note: Copy doesn't work when display: none,
    // but we need display: none to have the right tab order
    copyInput.value = url
    copyInput.style.display = 'block'
    copyInput.select()
    document.execCommand('copy')
    copyInput.style.display = 'none'
  }

  function onCopyUrl() {
    copyUrl()
    menuIsOpen = false
  }

  function onCopyUrlAtTime() {
    var t = Math.floor(time)
    copyUrl('t=' + t)
    menuIsOpen = false
  }

  function toggleMenuOpen() {
    menuIsOpen = !menuIsOpen
  }
</script>

<input class="hidden" type="text" bind:this={copyInput} />

<IconButtonMenu icon="share" label="Open share menu">
  <MenuItem on:click={onCopyUrl}>Copy sermon URL</MenuItem>
  <MenuItem on:click={onCopyUrlAtTime}>Copy sermon URL at current time</MenuItem>
</IconButtonMenu>
