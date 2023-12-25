import React from 'react'

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
      const { req, res } = ctx
      const token = getToken(ctx)

      if (req && !token) {
        res.writeHead(302, { Location: '/login' })
        res.end()
        return {}
      }

      if (!token) {
        // Router.replace('/login')
        return {}
      }

      return {}
    }
  }

  return WithAuth
}

export default withAuth
