<script>
  import 'scss/global.scss'
  import { MDCDrawer } from '@material/drawer'
  import { MDCTopAppBar } from '@material/top-app-bar'
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import { registerEventListener } from 'util/events'
  import TabBar from 'components/material/TabBar.svelte'
  import Tab from 'components/material/Tab.svelte'
  import { section } from 'state'
  import { setClient, client } from 'api/graphql'

  export let segment

  let drawerNode, appBarNode, mainNode // ref
  let drawer, appBar

  const routes = ['sermons']

  setClient(client)

  onMount(() => {
    drawer = MDCDrawer.attachTo(drawerNode)
    appBar = MDCTopAppBar.attachTo(appBarNode)
    appBar.setScrollTarget(mainNode)

    registerEventListener(document.body, 'MDCDrawer:closed', () => {
      let el
      if ((el = mainNode.querySelector('input, button'))) {
        el.focus()
      }
    })
  })

  function toggleDrawer() {
    drawer.open = !drawer.open
  }

  function closeDrawer() {
    drawer.open = false
  }
</script>

<aside class="mdc-drawer mdc-drawer--modal" bind:this={drawerNode}>
  <div class="mdc-drawer__header">
    <a href="//russellrpc.org" class="" padding="0px 12px">
      <img
        src="https://sermons.russellrpc.org/assets/logo.png"
        style="max-height:none"
        width="224"
        height="68"
        alt="RRPC" />
    </a>
  </div>
  <div class="mdc-drawer__content">
    <nav class="mdc-list">
      {#each routes as route}
        <a
          href={route}
          aria-current={route === segment}
          class="mdc-list-item"
          class:mdc-list-item--activated={route === segment}
          click={closeDrawer}>
          <span class="mdc-list-item__text">{route}</span>
        </a>
      {/each}
    </nav>
  </div>
</aside>
<div class="mdc-drawer-scrim" />
<header class="mdc-top-app-bar" bind:this={appBarNode}>
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <button
        class="mdc-top-app-bar__navigation-icon mobile"
        style="padding:0 0 0 12px; margin-right:12px"
        on:click={toggleDrawer}>
        <picture>
          <source srcset="/favicon.png 1x" type="image/png" />
          <source srcset="/favicon-512.webp 3x" type="image/webp" />
          <img src="/favicon.png" style="margin-right:16px" width="48" height="48" alt="RRPC" />
        </picture>
      </button>
      <a href="//russellrpc.org" class="desktop" style="padding-right:16px">
        <picture>
          <source srcset="/logo-48.webp 1x, /logo-96.webp 2x, /logo.webp" type="image/webp" />
          <source srcset="/logo-48.png 1x, /logo-96.png 2x, /logo.png" />
          <img
            src="https://sermons.russellrpc.org/assets/logo-48.png"
            style="max-height:none"
            width="157"
            height="48"
            alt="RRPC" />
        </picture>
      </a>
      <TabBar>
        {#each routes as route}
          <Tab
            href={route}
            label={route}
            active={route === segment}
            tabindex={route === routes ? 0 : -1} />
        {/each}
      </TabBar>
      <h1 class="mdc-typography--headline6">{$section}</h1>
    </section>
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" />
  </div>
</header>
<main class="container main-content" bind:this={mainNode}>
  <slot />
</main>
