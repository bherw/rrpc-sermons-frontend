<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { MDCMenu } from '@material/menu'
  export let open = false
  export let quickOpen = false

  const dispatch = createEventDispatcher()

  let node, menu

  onMount(() => {
    menu = new MDCMenu(node)
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

    menu.listen('MDCMenu:selected', event => {
      dispatch('selected', event)
    })
  })

  $: if (menu && (true || open)) {
    menu.open = open
  }

  $: if (menu && (true || quickOpen)) {
    menu.quickOpen = quickOpen
  }
</script>

<div class="mdc-menu mdc-menu-surface {$$props.class ? $$props.class : ''}" bind:this={node}>
  <ul class="mdc-list" role="menu" aria-hidden={!open} aria-orientation="vertical" tabindex="-1">
    <slot />
  </ul>
</div>
