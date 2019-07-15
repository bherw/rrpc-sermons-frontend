<script>
  import { MDCTab } from '@material/tab'
  import { onMount } from 'svelte'
  import TabIndicator from './TabIndicator.svelte'

  export let active, label, tabindex
  export let icon = undefined
  export let href = undefined

  let node, tab

  onMount(() => {
    tab = new MDCTab(node)
  })
</script>

{#if href}
  <a {href} on:click class="mdc-tab" role="tab" {tabindex} aria-selected={active} bind:this={node}>
    <span class="mdc-tab__content">
      {#if icon}
        <span class="mdc-tab__icon material-icons" aria-hidden="true">{icon}</span>
      {/if}
      <span class="mdc-tab__text-label">{label}</span>
    </span>
    <TabIndicator {active} />
    <span class="mdc-tab__ripple" />
  </a>
{:else}
  <button on:click class="mdc-tab" role="tab" aria-selected={active} {tabindex} bind:this={node}>
    <span class="mdc-tab__content">
      {#if icon}
        <span class="mdc-tab__icon material-icons" aria-hidden="true">{icon}</span>
      {/if}
      <span class="mdc-tab__text-label">{label}</span>
    </span>
    <TabIndicator {active} />
    <span class="mdc-tab__ripple" />
  </button>
{/if}
