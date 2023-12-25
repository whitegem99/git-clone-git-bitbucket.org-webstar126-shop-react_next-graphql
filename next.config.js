const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer(
  withSass(
    withCSS({
      compress: false,
      poweredByHeader: false,
      env: {
        GRAPHQL_URL: 'https://apiws.playback.ai/graphql',
        X_PQ_APP:
          'eyJhbGciOiJub25lIn0.eyJkYXRhIjoiNWY5ZmYxYmVlMGQzZWQxNTdiMjNhYTYzIn0.',
        UPLOADCARE_KEY: '9d05941948ec6565a085',
        APP_URL: 'https://buyer.playback.ai/',
        DOMAIN: 'buyer.playback.ai'
      },
      webpack: function (config) {
        config.module.rules.push({
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: '[name].[ext]'
            }
          }
        })
        return config
      }
    })
  )
)
