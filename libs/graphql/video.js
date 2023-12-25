import gql from 'graphql-tag'

export const LIST = gql`
  query($filterByState: String!, $brandId: String!, $page: Int!) {
    findVideos(filterByState: $filterByState, brandId: $brandId, page: $page) {
      videos {
        id
        title
        livestreamUrl
        publishUrl
        bannerUrl
        totalViews
        totalClicks
        totalComments
        totalViewers
        engagementRate
        clickRate
        active
        scheduledTime
        locked
        brand {
          id
          brandName
        }
      }
      filterByState
      filterOptions
      totalVideos
      totalViews
      totalClicks
      totalComments
      engagementRate
      clickRate
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

export const UPDATE = gql`
  mutation(
    $videoId: String!
    $title: String!
    $bannerUrl: String!
    $locked: Boolean!
    $scheduledTime: String!
  ) {
    videoUpdate(
      videoId: $videoId
      title: $title
      bannerUrl: $bannerUrl
      locked: $locked
      scheduledTime: $scheduledTime
    ) {
      video {
        id
        title
        scheduledTime
        bannerUrl
        locked
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND = gql`
  query($videoId: String!) {
    findVideoDetails(videoId: $videoId) {
      video {
        id
        title
        livestreamUrl
        promoVideoUrl
        scheduledTime
        createdAt
        status
        voucherEnabled
        voucher {
          voucherCode
          discountPercentage
          maximumRedemptionLimit
          leftCount
          timeLeft
        }
        brands {
          id
          logo
          brandName
          company {
            id
            companyName
            logo
          }
        }
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const APPROVE = gql`
  mutation($videoId: String!) {
    approveVideo(videoId: $videoId) {
      video {
        id
        title
        hashTags
        url
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const CHANGE = gql`
  mutation($videoId: String!, $message: String!) {
    requestChangeVideo(videoId: $videoId, message: $message) {
      video {
        id
        title
        hashTags
        url
        requestedChangesOn
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const REJECT = gql`
  mutation($videoId: String!, $message: String!) {
    rejectVideo(videoId: $videoId, message: $message) {
      video {
        id
        title
        hashTags
        url
        rejectedOn
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const STATUS = gql`
  mutation($videoId: String!, $active: Boolean!) {
    videoActivate(videoId: $videoId, active: $active) {
      video {
        id
        title
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const PUBLISH = gql`
  mutation($videoId: String!) {
    publishVideo(videoId: $videoId) {
      video {
        id
      }
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
    videoDelete(videoId: $videoId) {
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_ALL_PRODUCTS = gql`
  query($page: Int!, $search: String!, $brandId: String!) {
    findProducts(page: $page, search: $search, brandId: $brandId) {
      products {
        id
        name
        price
        images
        productPageUrl
        brand {
          currency
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

export const FIND_VIDEO_PRODUCTS = gql`
  query($page: Int!, $videoId: String!) {
    findProducts(page: $page, videoId: $videoId) {
      products {
        id
        name
        price
        images
        brand {
          currency
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

export const ADD_PRODUCT_VIDEO = gql`
  mutation($videoId: String!, $productId: String!) {
    videoAddProduct(videoId: $videoId, productId: $productId) {
      video {
        id
        title
        livestreamUrl
        products {
          id
          name
          price
          productPageUrl
          images
        }
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const SEND_VIDEO_CAMPAIGN = gql`
  mutation(
    $emailSubject: String!
    $videoId: String!
    $emailBody: String!
    $sentToAll: Boolean!
    $contactIds: [String!]
  ) {
    emailCampaignCreate(
      emailSubject: $emailSubject
      videoId: $videoId
      emailBody: $emailBody
      sentToAll: $sentToAll
      contactIds: $contactIds
    ) {
      emailCampaign {
        id
        emailSubject
        emailBody
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const REMOVE_PRODUCT_VIDEO = gql`
  mutation($videoId: String!, $productId: String!) {
    videoRemoveProduct(videoId: $videoId, productId: $productId) {
      video {
        id
        title
        livestreamUrl
        products {
          id
          name
          price
          productPageUrl
          images
        }
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const REMOVE_ALL_PRODUCT_VIDEO = gql`
  mutation($videoId: String!) {
    videoRemoveallProduct(videoId: $videoId) {
      video {
        id
        title
        livestreamUrl
        products {
          id
          name
          price
          productPageUrl
          images
        }
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const REPORT_VIDEO_VIEWS = gql`
  query(
    $groupType: String!
    $fromDate: String!
    $toDate: String!
    $videoId: String
  ) {
    reportVideoViews(
      groupType: $groupType
      fromDate: $fromDate
      toDate: $toDate
      videoId: $videoId
    ) {
      reports {
        groupId {
          day
          month
          year
        }
        count
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const REPORT_VIDEO_CLICKS = gql`
  query(
    $groupType: String!
    $fromDate: String!
    $toDate: String!
    $videoId: String
  ) {
    reportVideoClicks(
      groupType: $groupType
      fromDate: $fromDate
      toDate: $toDate
      videoId: $videoId
    ) {
      reports {
        groupId {
          day
          month
          year
        }
        count
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const REPORT_VIDEO_COMMENTS = gql`
  query(
    $groupType: String!
    $fromDate: String!
    $toDate: String!
    $videoId: String
  ) {
    reportVideoComments(
      groupType: $groupType
      fromDate: $fromDate
      toDate: $toDate
      videoId: $videoId
    ) {
      reports {
        groupId {
          day
          month
          year
        }
        count
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const REPORT_TOP_PRODUCTS = gql`
  query(
    $groupType: String!
    $fromDate: String!
    $toDate: String!
    $videoId: String
  ) {
    reportTopProducts(
      groupType: $groupType
      fromDate: $fromDate
      toDate: $toDate
      videoId: $videoId
    ) {
      reports {
        groupId {
          id
          productName
          productPageUrl
        }
        count
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const REPORT_TOP_COMMENTS = gql`
  query(
    $groupType: String!
    $fromDate: String!
    $toDate: String!
    $videoId: String
  ) {
    reportTopComments(
      groupType: $groupType
      fromDate: $fromDate
      toDate: $toDate
      videoId: $videoId
    ) {
      reports {
        groupId {
          id
          videoTitle
        }
        count
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const REPORT_TOP_VIEWS = gql`
  query(
    $groupType: String!
    $fromDate: String!
    $toDate: String!
    $videoId: String
  ) {
    reportTopViews(
      groupType: $groupType
      fromDate: $fromDate
      toDate: $toDate
      videoId: $videoId
    ) {
      reports {
        groupId {
          id
          videoTitle
        }
        count
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_CONTEXTUAL_CONTENTS = gql`
  query($page: Int!, $videoId: String!) {
    findContextualContents(page: $page, videoId: $videoId) {
      contextualContents {
        id
        frameSecond
        targetUrl
        imageUrl
        description
        product {
          id
          name
          brand {
            currency
          }
        }
        video {
          id
          title
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

export const CONTEXTUAL_CONTENT_CREATE = gql`
  mutation(
    $targetUrl: String!
    $imageUrl: String!
    $description: String!
    $videoId: String!
    $productId: String
  ) {
    contextualContentCreate(
      targetUrl: $targetUrl
      imageUrl: $imageUrl
      description: $description
      videoId: $videoId
      productId: $productId
    ) {
      contextualContent {
        id
        frameSecond
        targetUrl
        imageUrl
        description
        product {
          id
          name
          brand {
            currency
          }
        }
        video {
          id
          title
        }
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const CONTEXTUAL_CONTENT_DELETE = gql`
  mutation($contextualContentId: String!) {
    contextualContentDelete(contextualContentId: $contextualContentId) {
      contextualContent {
        id
        frameSecond
        targetUrl
        imageUrl
        description
        product {
          id
          name
          brand {
            currency
          }
        }
        video {
          id
          title
        }
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const CONTEXTUAL_CONTENT_DELETE_ALL = gql`
  mutation($videoId: String!) {
    contextualContentDeleteall(videoId: $videoId) {
      video {
        contextualContents {
          id
          targetUrl
          imageUrl
          description
        }
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_VIEWERS = gql`
  query($page: Int!, $videoId: String!) {
    findViewers(page: $page, videoId: $videoId) {
      viewers {
        id
        name
        email
      }
      totalCount
      totalPages
      currentPage
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_COMMENTS = gql`
  query($page: Int!, $videoId: String!) {
    findComments(page: $page, videoId: $videoId) {
      videoComments {
        id
        body
        frameSecond
        createdAt
        senderName
        senderEmail
        senderKlass
        senderId
        recipientKlass
        recipientId
      }
      totalCount
      totalPages
      currentPage
      errors {
        key
        message
      }
      status
    }
  }
`

export const CREATE_COMMENT = gql`
  mutation($body: String!, $videoId: String!,  $companyId: String!, $buyerId: String!,) {
    commentCreate(body: $body, videoId: $videoId, companyId: $companyId, buyerId: $buyerId) {
      comment {
        id
        body
        frameSecond
        createdAt
        senderName
        senderEmail
        senderKlass
        senderId
        recipientKlass
        recipientId
      }
      errors {
        key
        message
      }
      status
    }
  }
`
