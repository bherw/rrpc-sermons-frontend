'use strict'

import Data from './data'
import range from 'util/range'

const chapterRegex = /^(\d+)(?::(\d+))?$/
const fullRegex = /^([^:]+?)(?: (\d+)(?::(\d+))?)?$/

class Reference {
  static fromOsis(str) {
    return Verse.fromOsis(str)
  }

  constructor(param) {
    if (typeof param === 'string') {
      this.ranges = param
        .trim()
        .split(/[;,]/)
        .map(r => Range.parse(r))
    } else if (Array.isArray(param)) {
      this.ranges = ranges
    } else {
      throw new TypeError('expected array or str, got ' + typeof param)
    }
  }

  index(val) {
    offset = 0
    for (var i = 0; i < this.ranges.length; i++) {
      if ((idx = this.ranges[i].index(val)) !== undefined) {
        return offset + idx
      }

      offset += this.ranges[i].verseCount()
    }

    return
  }

  firstVerse() {
    return this.ranges[0].firstVerse()
  }

  toString() {
    return this.ranges.map(r => r.toString()).join('; ')
  }

  verseCount() {
    return this.ranges.map(r => r.verseCount()).reduce((a, b) => a + b, 0)
  }

  verses() {
    return this.ranges.map(r => r.verses()).flat()
  }
}

class Range {
  static parse(str) {
    var m = str.trim().match(/^((?:[123]|[Ii]{1,3})?\s*[^\d]+)(.*)$/)
    if (!m) {
      throw new Error('Error parsing: no book found: ' + str)
    }

    var [_, book, rest] = m
    book = Book.byName(book.trim())

    if ((m = rest.match(/^(\d+)(?:-(\d+))?$/))) {
      var [_, from, to] = m

      from = book.chapter(from)
      if (to) {
        to = book.chapter(to)
      }

      return new Range(from, to)
    }

    if ((m = rest.match(/^(\d+)(?::(\d+))?(-.+)?/))) {
      var [_, fromChapter, fromVerse, to] = m
      var toChapter, toVerse
      if (to) {
        ;[_, toChapter, toVerse] = to.match(/^-(\d+)(?::(\d+))?$/)
        to = null
      }

      var from, to

      fromChapter = book.chapter(fromChapter)
      if (typeof fromVerse === 'undefined') {
        from = fromChapter
      } else {
        from = fromChapter.verse(fromVerse)
      }

      if (toChapter) {
        if (typeof toVerse === 'undefined') {
          if (from instanceof Chapter) {
            to = book.chapter(toChapter)
          } else if (toChapter) {
            to = fromChapter.verse(toChapter)
          }
        } else {
          toChapter = book.chapter(toChapter)
          to = toChapter.verse(toVerse)
        }
      }

      return new Range(from, to)
    }

    throw new Error(`unable to parse "${str}" as a scripture reference`)
  }

  constructor(a, b) {
    if (typeof b === 'undefined') {
      b = a
    }

    if (!(a instanceof Ref && b instanceof Ref)) {
      throw new TypeError('a and b must be Ref')
    }

    if (a.gt(b)) {
      throw new Error('a gt b in Range')
    }

    this.a = a
    this.b = b
  }

  books() {
    a = this._a.book().ord()
    b = this._b.book().ord()

    return range(a, b).map(i => Book.get(i))
  }

  chapters() {
    a = this.firstChapter()
    b = this.lastChapter()

    chapters = [a]
    while (!a.eq(b)) {
      chapters.push((a = a.next()))
    }
    return chapters
  }

  index(val) {
    if (val instanceof Range || val instanceof Reference) {
      val = val.firstVerse()
    }

    if (!(val instanceof SingleRef)) {
      throw new TypeError("can't find index of " + val)
    }

    val = val.absolute()
    if (this.a.gt(val) || this.b.lt(val)) {
      return
    }

    var offset = val.number() - this.a.firstVerse.number()
    var chapters = this.chapters()
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].eq(val.chapter())) {
        return offset
      }

      offset += chapters[i].verseCount()
    }

    return
  }

  firstVerse() {
    return this.a.firstVerse()
  }

  lastVerse() {
    return this.b.lastVerse()
  }

  toString() {
    return this.a == this.b
      ? this.a.toString()
      : [this.a.toString(), this.b.toString(this.a)].compact().join('-')
  }

  verseCount() {
    if (this.a == this.b) {
      return 1
    }

    var count = 1 - this.a.firstVerse.number() + this.b.lastVerse().number()
    Reference.chapterRange(this.a.chapter(), this.b.chapter().prev()).forEach(chapter => {
      count += chapter.verseCount()
    })

    return count
  }

  verses() {
    var a = this.firstVerse()
    const b = this.lastVerse()

    var verses = [a]
    while (!a.eq(b)) {
      verses.push((a = a.next()))
    }
    return verses
  }
}

class Ref {
  lt(other) {
    return this.cmp(other) < 0
  }

  gt(other) {
    return this.cmp(other) > 0
  }
}

var books = {}
class Book extends Ref {
  static byName(name) {
    const id = Data.books_by_name[name]

    if (!id) {
      throw new Error(`No such book: "${name}"`)
    }

    return Book.get(id)
  }

  static get(id) {
    if (!books[id]) {
      books[id] = new Book(id)
    }

    return books[id]
  }

  constructor(id) {
    super()
    const data = Data.books[id]

    if (!data) {
      throw new Error(`Invalid book id: ${id}`)
    }

    this._chapterCount = Object.keys(data.chapters).length
    this._chapters = {}
    this._abbr = data.abbr
    this._name = data.name
    this._ord = data.ord * 1
  }

  book() {
    return this
  }

  chapter(num) {
    if (!this._chapters[num]) {
      if (num < 1 || num > this._chapterCount) {
        throw new Error(
          `Chapter value of ${num} invalid for ${this._name}, which has ${
            this._chapterCount
          } chapters`
        )
      }

      this._chapters[num] = new Chapter(this, num)
    }

    return this._chapters[num]
  }

  chapterCount() {
    return this._chapterCount
  }

  cmp(that) {
    if (!that || !(that instanceof Book)) {
      throw new Error(`unable to compare Book with ${that}`)
    }

    return this._ord - that._ord
  }

  eq(to) {
    return this === to || (to && to instanceof Book && this._id == to._id)
  }

  firstVerse() {
    return this.chapter(1).verse(1)
  }

  lastChapter() {
    return this.chapter(this.chapterCount())
  }

  lastVerse() {
    return this.chapter(this.chapterCount()).lastVerse()
  }

  name() {
    return this._name
  }

  next() {
    return Book.get(this._ord + 1)
  }

  ord() {
    return this._ord
  }

  osis(relative) {
    return this._abbr
  }

  prev() {
    return Book.get(this._ord - 1)
  }

  toCssClass() {
    return ['verse', this._abbr].join('-')
  }

  toString() {
    return this._name
  }
}

class Chapter extends Ref {
  constructor(book, num) {
    super()

    var data = Data.books[book.ord()].chapters[num]
    if (!data) {
      throw new Error(`no such chapter: "${book.toString()} ${num}"`)
    }

    this._book = book
    this._num = num * 1
    this._verseCount = data.verse_count * 1
  }

  book() {
    return this._book
  }

  chapter() {
    return this
  }

  cmp(that) {
    if (!that || !(that instanceof Chapter)) {
      throw new Error(`unable to compare Chapter with ${that}`)
    }

    var cmp = this._book.cmp(that._book)
    if (cmp != 0) return cmp

    return this._num - that._num
  }

  eq(that) {
    return (
      this === that ||
      (that && that instanceof Chapter && this._num == that._num && this.book().eq(that.book()))
    )
  }

  firstVerse() {
    return this.verse(1)
  }

  lastVerse() {
    return this.verse(this._verseCount)
  }

  next() {
    if (this._num < this._book.chapterCount()) {
      return this._book.chapter(this._num + 1)
    }

    return this._book.next().chapter(1)
  }

  num() {
    return this._num
  }

  number() {
    return this._num
  }

  osis() {
    return this._book.osis() + '.' + this._num
  }

  prev() {
    if (this._num > 1) {
      return this._book.chapter(this._num - 1)
    }

    return this._book.prev().lastChapter()
  }

  toCssClass() {
    return [this._book.toCssClass(), this._num].join('-')
  }

  toString(relative) {
    if (this.eq(relative)) return

    return [this._book.toString(), this._num].filter(Boolean).join(' ')
  }

  verse(num) {
    if (num < 1 || num > this._verseCount) {
      throw new Error(`There are less than num verses in ${this.toString()}`)
    }

    return new Verse(this, num)
  }

  verseCount() {
    return this._verseCount
  }
}

class Verse extends Ref {
  static fromOsis(id) {
    const [b, c, v] = id.split('.')
    return Book.byName(b)
      .chapter(c)
      .verse(v)
  }

  constructor(ch, num) {
    super()

    if (!num || num < 1 || num > ch.verseCount()) {
      throw new Error(`There is no "${num}" verse in ${ch.toString()}`)
    }

    this._ch = ch
    this._num = num * 1
  }

  book() {
    return this._ch.book()
  }

  chapter() {
    return this._ch
  }

  cmp(that) {
    if (!that || !(that instanceof Verse)) {
      throw new Error(`Unable to compare with ${that}`)
    }

    var cmp = this._ch.cmp(that._ch)
    if (cmp != 0) return cmp

    return this._num - that._num
  }

  eq(that) {
    return (
      this === that ||
      (that && that instanceof Verse && this._ch.eq(that._ch) && this._num === that._num)
    )
  }

  firstVerse() {
    return this
  }

  lastVerse() {
    return this
  }

  next() {
    if (this._num < this._ch.verseCount()) {
      return this._ch.verse(this._num + 1)
    }

    return this._ch.next().verse(1)
  }

  num() {
    return this._num
  }

  number() {
    return this._number
  }

  osis() {
    return this._ch.id() + '.' + this._num
  }

  toCssClass() {
    return this._ch.toCssClass() + '-' + this._num
  }

  toString(relative) {
    if (this.eq(relative)) return

    return [this._ch.toString(relative), this._num].filter(Boolean).join(':')
  }
}

export default Reference
