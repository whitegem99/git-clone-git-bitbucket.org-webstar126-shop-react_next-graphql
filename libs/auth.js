import React from 'react'
import Router from 'next/router'

import { getToken } from './util'

function withAuth(PageComponent, { ssr = true } = {}) {
  const WithAuth = props => <PageComponent {...props} />

  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'

    WithAuth.displayName = `withAuth(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    WithAuth.getInitialProps = async ctx => {
      const { req, res, pathname, query } = ctx
      const token = getToken(ctx)

      if (req && !token) {
        res.writeHead(302, { Location: '/login' })
        res.end()
        return {}
      }

      if (!token) {
        Router.replace('/login')
        return {}
      }

      if (pathname === '/search') {
        return {
          queryParams: query
        }
      }

      return {}
    }
  }

  return WithAuth
}

export default withAuth
