<script context="module">
  import { client } from 'api/graphql'
  import SermonQuery from './SermonQuery.gql'

  export async function preload({ params, query }) {
    const id = `sermons/${params.identifier}`
    const preload = await client
      .query({
        query: SermonQuery,
        variables: { id },
      })
      .result()

    if (!preload.data.node) {
      this.error(404, 'Not found')
      return
    }

    return {
      id,
      preload,
      seek: query.t || 0,
    }
  }
</script>

<script>
  import { makeTitleWithSeries, formatRecordedAt } from 'components/sermons/util'
  import AudioPlayer from 'components/sermons/AudioPlayer.svelte'
  import BiblePassages from 'components/sermons/BiblePassages.svelte'
  import Title from 'components/Title.svelte'

  export let id, preload, seek
  let speakerLink, seriesLink, titleWithSeries, recordedAt

  client.restore(SermonQuery, preload.data)
  $: promise = client
    .query({ query: SermonQuery, variables: { id } })
    .result()
    .then(res => {
      let sermon = res.data.node
      speakerLink = `/sermons?query=speaker:"${sermon.speaker.name}"`
      seriesLink = `/sermons?query=series:"${sermon.series.name}"&order=oldest_first`
      titleWithSeries = makeTitleWithSeries(sermon)
      recordedAt = new Date(sermon.recordedAt).toLocaleString(undefined, {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
      return sermon
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

{#await promise}
  Loading...
{:then sermon}
  <Title section={sermon.title} title={titleWithSeries} />

  <AudioPlayer
    src={sermon.audioUrl}
    waveformUrl={sermon.audioWaveformUrl}
    duration={sermon.duration}
    {seek} />
  <section>
    <div class="container" class:container--with-aside={sermon.series}>
      <div class="main">
        <h1 class="mdc-typography--headline5">{sermon.title}</h1>

        <div>
          <div class="mdc-typography--subtitle2">
            <a class="styled-text" href={speakerLink}>{sermon.speaker.name}</a>
          </div>
          <div class="mdc-typography--caption">{recordedAt}</div>
        </div>

        <BiblePassages reading={sermon.scriptureReading} focus={sermon.scriptureFocus} />
      </div>

      {#if sermon.series}
        <aside>
          <section>
            <header class="series-header">
              <h1 class="mdc-typography--headline6" style="margin-bottom:0">
                <a href={seriesLink} class="unstyled-link">{sermon.series.name}</a>
              </h1>
            </header>
          </section>
        </aside>
      {/if}
    </div>
  </section>
{/await}
