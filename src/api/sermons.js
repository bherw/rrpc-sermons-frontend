import { get } from './fetch'
import { apiBase } from 'const/api'

export async function getSermon(identifier) {
  const res = await get(`${apiBase}/v0/sermon/${identifier}.json`)
  return res.data
}

export async function getSermons(query, page, order) {
  query = typeof query !== 'undefined' ? query : ''
  page = typeof page !== 'undefined' ? page + 1 : 1
  order = typeof order !== 'undefined' ? order : 'newest_first'

  const res = await get(`${apiBase}/v0/sermon?query=${query}&page=${page}&order=${order}`)
  return res.data
}
