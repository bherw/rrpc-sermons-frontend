import VirtualListModel from '../VirtualList/VirtualListModel'
import { client } from 'api/graphql'

export default class SermonListModel extends VirtualListModel {
  constructor({ query, variables }) {
    super()

    this._query = query
    this._variables = variables
  }

  length() {
    return this._sermons ? this._sermons.totalCount : 0
  }

  query() {
    return this._query
  }

  variables() {
    return this._variables
  }

  async get(index) {
    while (index >= this._sermons.nodes.length) {
      if (index < 0 || index >= this._length) {
        throw new Error(`Index out of bounds: ${index}`)
      }
      await this.loadMore()
    }

    return this._sermons.nodes[index]
  }

  async loadMore() {
    if (!this._loadingMore) {
      this._loadingMore = this._loadMore()
    }
    await this._loadingMore
  }

  async _loadMore() {
    const variables = this._sermons
      ? { ...this._variables, cursor: this._sermons.pageInfo.endCursor }
      : this._variables
    const result = await client.query({ query: this._query, variables }).result()

    if (!this._sermons) {
      this._sermons = result.data.sermons
      this._loadingMore = false
      return
    }

    const { __typename, nodes, pageInfo, totalCount } = result.data.sermons

    if (!nodes.length) return

    this._sermons = {
      __typename,
      nodes: [...this._sermons.nodes, ...nodes],
      pageInfo,
      totalCount,
    }
    this._loadingMore = false
  }
}
