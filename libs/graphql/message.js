import gql from 'graphql-tag'

export const LIST = gql`
  query($page: Int!, $videoId: String!) {
    listMessages(page: $page, videoId: $videoId) {
      messages {
        id
        body
        senderName
        createdAt
      }
      currentPage
      totalPages
      errors {
        key
        message
      }
      status
    }
  }
`

export const SEND = gql`
  mutation($videoId: String!, $body: String!) {
    sendMessage(videoId: $videoId, body: $body) {
      message {
        id
        body
        senderName
        createdAt
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const CHAT_MESSAGE_LIST = gql`
  query($page: Int!) {
    findConversations(page: $page) {
      conversations {
        id
        participantOneCompanyName
        participantTwoCompanyName
        participantOneContactName
        participantTwoContactName
        lastMessage
        lastMessageTime
      }
      currentPage
      totalPages
      errors {
        key
        message
      }
      status
    }
  }
`

export const CHAT_MESSAGE_SEND = gql`
  mutation(
    $recipientId: String!
    $recipientKlass: String!
    $body: String
    $attachmentUrl: String
    $attachmentType: String
    $sellerBrandId: String!
  ) {
    commentCreateByCompany(
      recipientId: $recipientId
      recipientKlass: $recipientKlass
      body: $body
      attachmentUrl: $attachmentUrl
      attachmentType: $attachmentType
      sellerBrandId: $sellerBrandId
    ) {
      comment {
        id
        body
        attachmentUrl
        attachmentType
        recipientName
        senderName
        senderKlass
        recipientKlass
        senderId
        recipientId
        createdAt
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_BUYERS_OF_SELLER = gql`
  query($page: Int!) {
    findBuyersOfSeller(page: $page) {
      companies {
        id
        companyName
        firstName
        lastName
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_BRANDS = gql`
  query($page: Int!) {
    findBrands(page: $page) {
      brands {
        id
        brandName
        logo
      }
      errors {
        key
        message
      }
      status
    }
  }
`
