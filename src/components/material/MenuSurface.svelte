<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { MDCMenuSurface } from '@material/menu-surface'
  export let open = false
  export let quickOpen = false

  const dispatch = createEventDispatcher()

  let node, menu

  onMount(() => {
    menu = new MDCMenuSurface(node)
    menu.open = open
    menu.quickOpen = quickOpen

    menu.listen('MDCMenuSurface:closed', async event => {
      open = false
      dispatch('closed', event)
    })

    menu.listen('MDCMenuSurface:opened', event => {
      open = true
      dispatch('opened', event)
    })
  })

  $: if (menu && (true || open)) {
    menu.open = open
  }

  $: if (menu && (true || quickOpen)) {
    menu.quickOpen = quickOpen
  }
</script>

<div class="mdc-menu-surface {$$props.class ? $$props.class : ''}" bind:this={node}>
  <slot />
</div>
