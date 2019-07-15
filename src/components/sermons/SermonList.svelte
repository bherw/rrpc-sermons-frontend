<script>
  import SermonListItem from './SermonListItem'
  import SermonListModel from './SermonListModel'
  import VirtualList from 'components/VirtualList/VirtualList'

  export let model
</script>

<VirtualList {model} component={SermonListItem} />
