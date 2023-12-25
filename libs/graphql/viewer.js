import gql from 'graphql-tag'

export const LIST = gql`
  query($page: Int!, $videoId: String!) {
    findViewers(videoId: $videoId, page: $page) {
      viewers {
        id
        name
        email
        comments {
          id
          body
          videoId
          createdAt
        }
      }
      totalCount
      totalPages
      errors {
        key
        message
      }
      status
    }
  }
`

export const DELETE = gql`
  mutation($videoId: String!) {
    viewerDelete(videoId: $videoId) {
      errors {
        key
        message
      }
      status
    }
  }
`
