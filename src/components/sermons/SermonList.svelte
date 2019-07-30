<script>
  import { goto } from '@sapper/app'
  import SermonListItem from './SermonListItem'
  import SermonListModel from './SermonListModel'
  import VirtualList from 'components/VirtualList/VirtualList'

  export let model
</script>

<VirtualList
  {model}
  component={SermonListItem}
  on:action={event => model.get(event.detail.index).then(sermon => goto(`/${sermon.id}`))} />
