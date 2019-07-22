export function makeTitleWithSeries(sermon) {
  return sermon.title + (sermon.series ? ' — ' + sermon.series.name : '')
}

export function makeElasticQuery(parts) {
  return Object.entries(parts)
    .map(([key, val]) => (val ? `${key}:${maybeParenStr(val)}` : ''))
    .filter(Boolean)
    .join(' ')
}

function maybeParenStr(val) {
  return val.includes(' ') ? `(${val})` : val
}
