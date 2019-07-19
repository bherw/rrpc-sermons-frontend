import { getContext, setContext } from 'svelte'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { query, mutate, subscribe, restore } from 'svelte-apollo'
import fetch from 'cross-fetch'

import { apiBase } from 'const/api'

const CLIENT = typeof Symbol !== 'undefined' ? Symbol('client') : '@@client'

export function getClient() {
  return getContext(CLIENT)
}

export function setClient(client) {
  setContext(CLIENT, client)
}

export class GraphQLClient {
  constructor(opts) {
    this.client = new ApolloClient(opts)
  }

  query(opts) {
    return query(this.client, opts)
  }

  mutate(opts) {
    return mutate(this.client, opts)
  }

  subscribe(opts) {
    return subscribe(this.client, opts)
  }

  restore(opts, data) {
    return restore(this.client, opts, data)
  }
}

export const client = new GraphQLClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        )
      if (networkError) console.log(`[Network error]: ${networkError}`)
    }),
    new HttpLink({
      uri: `${apiBase}/graphql`,
      credentials: 'same-origin',
      fetch,
    }),
  ]),
  cache: new InMemoryCache(),
})
