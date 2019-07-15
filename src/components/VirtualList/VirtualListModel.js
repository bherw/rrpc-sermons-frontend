import EventEmitter from 'eventemitter3'

export default class VirtualListModel extends EventEmitter {
  async get(index) {
    throw new Error('Unimplemented in subclass')
  }

  length() {
    throw new Error('Unimplemented in subclass')
  }

  map(cb) {
    const ret = []
    const len = this.length()
    for (let i = 0; i < len; i++) {
      ret.push(this.get(i))
    }
    return ret
  }

  slice(start, end) {
    const ret = []
    for (let i = start; i < end; i++) {
      ret.push(this.get(i))
    }
    return ret
  }
}
