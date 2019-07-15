import Reference from 'lib/bible/reference'

// XXX: Gross regex hacks, but it works
// Wrap verses with spans so it can be manipulated for focuses later
function spanPassageText(text) {
  var verses = text.split('<sup id=')
  for (var i = 1; i < verses.length; i++) {
    const m = verses[i].match(/^"([^"]+)"/)

    const verseClass = Reference.fromOsis(m[1]).toCssClass()

    verses[i] = verses[i]
      // Readd the sup tag
      .replace(/^"([^"]+)"/, '<sup id="$1"')

      // Handle verses that span multiple paragraphs
      .replace(/<p class="(\w+)">/g, '<p class="$1"><span class="' + verseClass + '">')
      .replace(/<\/p>/g, '</span></p>')

    // Wrap the verse itself
    verses[i] = `<span class="${verseClass}">${verses[i]}</span>`
      // Remove empty
      .replace(/<span class="verse-[^"]+">\s*<\/span>/g, '')
  }
  return verses.join('')
}

export default spanPassageText
