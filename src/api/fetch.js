import fetch from 'cross-fetch'

function makeFetchOptions(method, headers, options) {
  let ret = {
    method,
    headers: Object.assign(headers || {}, {
      Accept: 'application/json',
    }),
  }
  return ret
}

async function throwErrorIfInvalid(res) {
  let json = await res.json()
  if (res.status >= 200 && res.status < 300) {
    return json
  }
  if (json && json.error) {
    throw new Error(`${res.status}: ${json.error}`)
  }
  throw new Error(`Request failed: ${res.status}: ${res.message}`)
}

async function _fetch(url, fetchOptions, options) {
  let res = await fetch(url, fetchOptions)
  return throwErrorIfInvalid(res)
}

export async function get(url, headers, options) {
  return _fetch(url, makeFetchOptions('GET', headers, options), options)
}
