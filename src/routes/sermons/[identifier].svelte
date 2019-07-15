<script context="module">
  import { getSermon } from 'api/sermons'

  export async function preload({ params, query }) {
    return { sermon: await getSermon(params.identifier), seek: query.t || 0 }
  }
</script>

<script>
  import { makeTitleWithSeries, formatRecordedAt } from 'components/sermons/util'
  import AudioPlayer from 'components/sermons/AudioPlayer.svelte'
  import BiblePassages from 'components/sermons/BiblePassages.svelte'
  import Title from 'components/Title.svelte'

  export let sermon, seek

  $: speakerLink = `/sermons?query=speaker:"${sermon.speaker}"`
  $: titleWithSeries = makeTitleWithSeries(sermon)
  $: recordedAt = new Date(sermon.recorded_at).toLocaleString(undefined, {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
</script>

<style>
  .container {
    grid-gap: -1rem;
    margin: 0 16px;
  }
  .container--with-aside {
    display: grid;
    grid-template-columns: [main] auto [aside] 25%;
  }
  .main {
    grid-area: main;
    padding: 16px;
    max-width: 1060px;
  }
  .container:not(.container--with-aside) .main {
    margin: 0 auto;
  }
  aside {
    grid-area: aside;
    padding: 16px;
  }

  @media screen and (max-width: 770px) {
    .container {
      margin: 0;
    }
    .main {
      padding: 16px;
    }
    aside {
      border-left: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
  }
</style>

<Title section={sermon.title} title={titleWithSeries} />

<AudioPlayer
  src={sermon.audio_url}
  waveformUrl={sermon.audio_waveform_url}
  duration={sermon.duration}
  {seek} />

<section>

  <div class="container" class:container--with-aside={sermon.series}>
    <div class="main">
      <h1 class="mdc-typography--headline5">{sermon.title}</h1>
      <div>
        <div class="mdc-typography--subtitle2">
          <a class="styled-text" href={speakerLink}>{sermon.speaker_name}</a>
        </div>
        <div class="mdc-typography--caption">{recordedAt}</div>
      </div>
      <BiblePassages reading={sermon.scripture_reading} focus={sermon.scripture_focus} />
    </div>
    {#if sermon.series}
      <aside>
        <section>
          <header class="series-header">
            <h1 class="mdc-typography--headline6">{sermon.series}</h1>
          </header>
        </section>
      </aside>
    {/if}
  </div>
</section>
