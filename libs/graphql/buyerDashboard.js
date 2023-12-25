import gql from 'graphql-tag'

// eslint-disable-next-line import/prefer-default-export
export const FIND_BUYER_MARKETPLACES = gql`
  {
    findBuyerMarketplaces {
      marketplaces {
        id
        title
        thumbBanner
        handle
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_MARKETPLACE_BRANDS = gql`
  query($search: String!, $page: Int!, $domain: String!) {
    findMarketplaceBrands(page: $page, search: $search, domain: $domain) {
      brands {
        id
        brandName
        logo
        createdAt
        company {
          id
        }
      }
      currentPage
      totalPages
      totalCount
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_BUYER_BRANDS = gql`
  query($page: Int!, $search: String!) {
    findBuyerBrands(page: $page, search: $search) {
      brands {
        id
        brandName
        logo
        company {
          id
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

export const CHAT_MESSAGE_SEND = gql`
  mutation(
    $brandId: String!
    $companyId: String!
    $body: String!
    $buyerId: String!
  ) {
    commentCreate(
      brandId: $brandId
      companyId: $companyId
      body: $body
      buyerId: $buyerId
    ) {
      comment {
        id
        body
        #        firebaseId
        attachmentType
        attachmentUrl
        #        conversation
        #        video
        #        brand
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

export const CHAT_MESSAGE_SEND_VIDEO = gql`
  mutation(
    $recipientId: String!
    $recipientKlass: String!
    $body: String!
    $sellerBrandId: String!
    $videoId: String!
  ) {
    commentCreateByCompany(
      recipientId: $recipientId
      recipientKlass: $recipientKlass
      body: $body
      sellerBrandId: $sellerBrandId
      videoId: $videoId
    ) {
      comment {
        id
        body
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

export const FIND_VIDEOS_BY_MARKETPLACE = gql`
  query($domain: String!, $page: Int!) {
    findVideosByMarketplace(domain: $domain, page: $page) {
      videos {
        id
        livestreamUrl
        title
        bannerUrl
        brand {
          id
          logo
          brandName
          createdAt
          company {
            id
          }
        }
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

export const FIND_VIDEO_BY_STATUS = gql`
  query($filterByStatus: String!, $page: Int!) {
    findVideos(filterByStatus: $filterByStatus, page: $page) {
      videos {
        id
        livestreamUrl
        promoVideoUrl
        scheduledTime
        startTime
        createdAt
        title
        bannerUrl
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
          createdAt
          company {
            id
          }
        }
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
