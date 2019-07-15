import VirtualListModel from '../VirtualList/VirtualListModel'
import { getSermons } from 'api/sermons'

const PAGE_SIZE = 25

export default class SermonListModel extends VirtualListModel {
  constructor({ query, preload, order }) {
    super()

    this._query = query
    this._order = order || 'newest_first'
    this._pages = []

    if (preload) {
      this._pages.push(Promise.resolve(preload.results))
      this._length = preload.total
    }
  }

  length() {
    return this._length
  }

  query() {
    return this._query
  }

  order() {
    return this._order
  }

  async get(index) {
    if (index < 0 || index >= this._length) {
      throw new Error(`Index out of bounds: ${index}`)
    }

    let pageNum = Math.floor(index / PAGE_SIZE)
    let page = await this.getPage(pageNum)

    return { sermon: page[index % PAGE_SIZE] }
  }

  async getPage(num) {
    if (
      (!this._length && num != 0) ||
      (this._length && (num < 0 || num > Math.ceil(this._length / PAGE_SIZE)))
    ) {
      throw new Error(`Page index out of bounds: ${num}`)
    }

    if (!(num in this._pages)) {
      this._pages[num] = getSermons(this._query, num, this._order).then(res => {
        this._length = res.total
        this.emit('loaded')
        return res.results
      })
    }

    return await this._pages[num]
  }
}
