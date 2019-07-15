<script>
  import { MDCTextField } from '@material/textfield'
  import { onMount } from 'svelte'

  export let outlined = false
  export let label = ''
  export let leadingIcon = ''
  export let trailingIcon = ''
  export let value = ''

  let node, textField
  let hadValueOnLoad = !!value

  onMount(() => {
    textField = new MDCTextField(node)
  })

  $: if (textField && (true || value)) {
    textField.value = value
  }
</script>

<div
  class="mdc-text-field {$$props.class ? $$props.class : ''}"
  class:mdc-text-field--outlined={outlined}
  class:mdc-text-field--with-leading-icon={leadingIcon}
  class:mdc-text-field--with-trailing-icon={trailingIcon}
  bind:this={node}>
  {#if leadingIcon.toString().includes('<')}
    {@html leadingIcon}
  {/if}
  {#if trailingIcon.toString().includes('<')}
    {@html leadingIcon}
  {/if}
  <slot />

  {#if outlined}
    <div class="mdc-notched-outline" class:mdc-notched-outline--no-label={!!label}>
      <div class="mdc-notched-outline__leading" />
      <div class="mdc-notched-outline__notch">
        {#if hadValueOnLoad}
          <label class="mdc-floating-label mdc-floating-label--float-above"> {label} </label>
        {:else}
          <label class="mdc-floating-label"> {label} </label>
        {/if}
      </div>
      <div class="mdc-notched-outline__trailing" />
    </div>
  {:else}
    <div class="mdc-line-ripple" />
    <label class="mdc-floating-label">{label}</label>
  {/if}
</div>
