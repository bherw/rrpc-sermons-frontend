<script>
  import { MDCList } from '@material/list'
  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let elementComponent
  export let elements
  export let selected = null

  let node, list

  onMount(() => {
    list = new MDCList(node)

    list.listen('MDCList:action', async event => {
      dispatch('action', event.detail)
    })
  })

  $: tabindex = !selected ? [0] : elements.map(e => (e === selected ? 0 : -1))
</script>

<ul class="mdc-list {$$props.class ? $$props.class : ''}" bind:this={node}>
  {#each elements as element, i}
    <svelte:component
      this={elementComponent}
      selected={element === selected}
      tabindex={tabindex[i]}
      {...element} />
  {/each}
</ul>
