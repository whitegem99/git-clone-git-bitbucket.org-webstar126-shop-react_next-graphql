import React from 'react'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import Cookies from 'universal-cookie'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
// import Router from 'next/router'
import get from 'lodash/get'

import { getToken } from './util'

let globalApolloClient = null

function createApolloClient(initialState = {}, ctx) {
  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors && graphQLErrors.length) {
      if (graphQLErrors.includes('Invalid login token X-PQ-Authorisation')) {
        const res = get(ctx, 'res', null)

        if (res) {
          res.writeHead(302, { Location: '/login' })
          res.end()
        } else {
          const cookies = new Cookies()

          cookies.remove('authToken')
          // Router.replace('/login')
        }
      }
    }
  })

  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_URL,
    fetch
  })

  const authLink = setContext((_, { headers }) => {
    const token = getToken(ctx)

    return {
      headers: {
        ...headers,
        'X-PQ-App': process.env.X_PQ_APP,
        'X-PQ-Authorisation': token,
        'X-PQ-Locale': 'en'
      }
    }
  })

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            searchBrands: {
              keyArgs: ['page'],
              merge(existing = [], incoming) {
                return [...existing, ...incoming]
              }
            }
          }
        }
      }
    }).restore(initialState),
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-and-network'
      }
    }
  })
}

function initApolloClient(initialState, ctx) {
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, ctx)
  }

  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState)
  }

  return globalApolloClient
}

function withApollo(PageComponent, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient || initApolloClient(apolloState)
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    )
  }

  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'

    WithApollo.displayName = `withApollo(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      const { AppTree } = ctx

      const apolloClient = initApolloClient({}, ctx)
      ctx.apolloClient = apolloClient

      let pageProps = {}
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx)
      }

      if (typeof window === 'undefined') {
        if (ctx.res && ctx.res.finished) {
          return pageProps
        }

        if (ssr) {
          try {
            const { getDataFromTree } = await import('@apollo/react-ssr')

            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
              />
            )
          } catch (error) {
            //
          }

          Head.rewind()
        }
      }

      const apolloState = apolloClient.cache.extract()

      return {
        ...pageProps,
        apolloState
      }
    }
  }

  return WithApollo
}

export default withApollo
