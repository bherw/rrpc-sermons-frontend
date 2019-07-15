<script>
  import IconButton from './IconButton'
  import Menu from './Menu'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let open = false
  export let icon, label

  function onClosed() {
    open = false
    dispatch('closed')
  }
</script>

<div class={$$props.class ? $$props.class : ''}>
  <IconButton {icon} {label} on:click={() => (open = !open)} />
  <div class="mdc-menu-surface--anchor">
    <Menu {open} on:opened on:closed={onClosed} on:selected>
      <slot />
    </Menu>
  </div>
</div>
