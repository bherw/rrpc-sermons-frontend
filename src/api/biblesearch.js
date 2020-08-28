import { get } from './fetch'
import { apiBase } from 'const/api'
import spanPassageText from 'util/spanPassageText'

const cache = {}

export async function getPassages(passages, version) {
  if (!(version in cache && passages in cache[version])) {
    cache[version] = {}
    cache[version][passages] = getPassagesFromNetwork(passages, version)
  }

  return await cache[version][passages]
}

export async function getPassagesFromNetwork(q, version) {
  const res = await get(`${apiBase}/v0/biblesearch/passages.js?q[]=${q}&version=${version}`)
  const passages = res.response.search.result.passages

  passages
    .forEach(passage => {
      passage.text = spanPassageText(passage.text)
    })
    .catch(e => {
      console.log('Error loading passages: ' + e)
      throw e
    })

  return { passages, meta: res.response.meta }
}
