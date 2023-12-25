import gql from 'graphql-tag'

export const FIND_MARKETPLACES = gql`
  query {
    findMarketplaces {
      marketplaces {
        id
        title
        thumbBanner
        handle
        firstBrandId
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const COMPANY_JOIN_MARKETPLACES = gql`
  mutation($marketplaceIds: [String!]!) {
    companyJoinMarketplaces(marketplaceIds: $marketplaceIds) {
      company {
        marketplaces {
          id
          title
          thumbBanner
          handle
          firstBrandId
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

export const FIND_BUYER_MARKETPLACES = gql`
  query {
    findBuyerMarketplaces {
      marketplaces {
        id
        title
        thumbBanner
        handle
        firstBrandId
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const COMPANY_EXIT_MARKETPLACES = gql`
  mutation($marketplaceId: String!) {
    companyExitMarketplace(marketplaceId: $marketplaceId) {
      company {
        marketplaces {
          id
          title
          thumbBanner
          handle
          firstBrandId
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

export const BUYER_HOME_DETAILS = gql`
  query {
    findBuyerHomeDetails {
      buyerDashboardHome {
        creditEarned
        ordersCompleted
        paymentOutstanding
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_BUYER_ORDERS = gql`
  query($page: Int!, $status: String!, $search: String!) {
    findBuyerOrders(page: $page, status: $status, search: $search) {
      orders {
        id
        orderNumber
        waitingShipmentAt
        estimatedShipAt
        sellerName
        status
        paymentStatus
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

export const FIND_BUYER_ORDER_DETAILS = gql`
  query($orderId: String!) {
    findBuyerOrderDetails(orderId: $orderId) {
      order {
        id
        orderNumber
        waitingShipmentAt
        status
        shippingAddress
        estimatedShipAt
        deliveryTrackingUrl
        deliveryTrackingNumber
        sellerName
        sellerWebsite
        sellerAddress
        eligibleForCancellation
        preferredShipDateFrom
        preferredShipDateTo
        buyerSignatureName
        buyerInvoices {
          invoiceNumber
          invoiceStatus
          invoicePdf
        }
        lineItems {
          variant {
            id
            image
            name
            sku
            retailPrice
            wholesalePrice
          }
          id
          itemPrice
          itemQuantity
          itemUnit
          availableQuantity
          availableUnit
          oneUnitToQuantity
          total
          status
        }
        itemTotal
        deliveryTotal
        discountTotal
        total
        stripeCardId
        stripeCardBrand
        stripeCardExpMonth
        stripeCardExpYear
        stripeCardLast4
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_ORDER_STATUS = gql`
  query {
    findOrderStatusCounts {
      orderStatusCounts {
        id
        statusName
        count
        allStatuses
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_INVOICE_STATUS = gql`
  query {
    findInvoiceStatusCounts {
      invoiceStatusCounts {
        id
        statusName
        count
        allStatuses
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const RE_CONFIRM_ORDER = gql`
  mutation(
    $orderNote: String
    $orderId: String!
    $removeItems: [Boolean!]!
    $updatedUnits: [Int!]!
    $lineItemIds: [String!]!
  ) {
    buyerReconfirmOrder(
      orderId: $orderId
      orderNote: $orderNote
      lineItemIds: $lineItemIds
      updatedUnits: $updatedUnits
      removeItems: $removeItems
    ) {
      order {
        id
        status
        total
        itemTotal
        lineItems {
          id
          status
          total
          itemQuantity
          itemUnit
          availableUnit
          availableQuantity
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

export const BUYER_CANCEL_ORDER = gql`
  mutation($orderId: String!) {
    buyerCancelOrder(orderId: $orderId) {
      order {
        id
        status
        eligibleForCancellation
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const BUYER_ORDER_TIMELINE = gql`
  query($orderId: String!) {
    findBuyerOrderTimelines(orderId: $orderId, page: 1) {
      orderTimelines {
        id
        createdAt
        eventDescription
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_BUYER_INVOICES = gql`
  query($page: Int!, $invoiceStatus: String!, $search: String!) {
    findBuyerInvoices(
      page: $page
      invoiceStatus: $invoiceStatus
      search: $search
    ) {
      buyerInvoices {
        id
        invoiceNumber
        invoiceStatus
        invoicePdf
        brand {
          logo
          brandName
        }
        order {
          id
          orderNumber
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

export const BUYER_SETTINGS = gql`
  query {
    buyerSetting {
      buyer {
        id
        firstName
        lastName
        email
        companyName
        phoneNumber
        website
        stripeCardBrand
        stripeCardExpMonth
        stripeCardExpYear
        stripeCardLast4
        stripeCustomerId
        stripeCardId
        shippingCity
        shippingState
        shippingAddressLineOne
        shippingAddressLineTwo
        shippingCountry
        shippingPostalCode
        billingAddressLineOne
        billingAddressLineTwo
        billingCity
        billingState
        billingPostalCode
        billingCountry
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const BUYER_UPDATE_ACCOUNT = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $companyName: String!
    #    $buyerType: String!
    $phoneNumber: String!
    $website: String!
  ) {
    buyerUpdateProfile(
      firstName: $firstName
      lastName: $lastName
      companyName: $companyName
      #      buyerType: $buyerType
      phoneNumber: $phoneNumber
      website: $website
    ) {
      buyer {
        id
        firstName
        lastName
        companyName
        website
        phoneNumber
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const BUYER_UPDATE_PASSWORD = gql`
  mutation($currentPassword: String!, $newPassword: String!) {
    buyerUpdatePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      buyer {
        id
        firstName
        lastName
        companyName
        #        buyerType
        website
        phoneNumber
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const BUYER_UPDATE_BILLING_ADDRESS = gql`
  mutation(
    $billingAddressLineOne: String!
    $billingAddressLineTwo: String!
    $billingCity: String!
    $billingState: String!
    $billingPostalCode: String!
    $billingCountry: String!
  ) {
    buyerUpdateBillingAddress(
      billingAddressLineOne: $billingAddressLineOne
      billingAddressLineTwo: $billingAddressLineTwo
      billingCity: $billingCity
      billingState: $billingState
      billingPostalCode: $billingPostalCode
      billingCountry: $billingCountry
    ) {
      buyer {
        id
        billingAddressLineOne
        billingAddressLineTwo
        billingCity
        billingState
        billingPostalCode
        billingCountry
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const BUYER_UPDATE_SHIPPING_ADDRESS = gql`
  mutation(
    $shippingAddressLineOne: String!
    $shippingAddressLineTwo: String!
    $shippingCity: String!
    $shippingState: String!
    $shippingPostalCode: String!
    $shippingCountry: String!
  ) {
    buyerUpdateShippingAddress(
      shippingAddressLineOne: $shippingAddressLineOne
      shippingAddressLineTwo: $shippingAddressLineTwo
      shippingCity: $shippingCity
      shippingState: $shippingState
      shippingPostalCode: $shippingPostalCode
      shippingCountry: $shippingCountry
    ) {
      buyer {
        id
        shippingAddressLineOne
        shippingAddressLineTwo
        shippingCity
        shippingState
        shippingPostalCode
        shippingCountry
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const BUYER_CARD_AUTHORIZE_PAYMENT = gql`
  mutation {
    companyAuthorizePaymentMethod {
      company {
        id
        stripePaymentIntendId
        stripeClientSecretId
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const BUYER_CARD_UPDATE_PAYMENT_METHOD = gql`
  mutation {
    companyUpdatePaymentMethod {
      company {
        id
        stripeCardBrand
        stripeCardExpMonth
        stripeCardExpYear
        stripeCardLast4
      }
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

export const REMOVE_SELLER_AS_CLIENT = gql`
  mutation($brandId: String!) {
    removeSellerAsClient(clientSellerBrandId: $brandId) {
      clientSellerBrands {
        id
        brandName
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const ADD_SELLER_AS_CLIENT = gql`
  mutation($brandId: String!) {
    addSellerAsClient(clientSellerBrandId: $brandId) {
      clientSellerBrands {
        id
        brandName
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const FIND_ORDER_NOTES = gql`
  query($orderId: String!, $page: Int!) {
    findOrderNotes(orderId: $orderId, page: $page) {
      orderNotes {
        id
        senderFullName
        senderType
        senderCompanyName
        body
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

export const ORDER_ADD_SELLER_NOTE = gql`
  mutation($orderId: String!, $body: String!) {
    orderAddBuyerNote(orderId: $orderId, body: $body) {
      orderNote {
        id
        senderFullName
        senderType
        senderCompanyName
        body
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
