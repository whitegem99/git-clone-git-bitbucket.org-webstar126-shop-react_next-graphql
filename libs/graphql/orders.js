import gql from 'graphql-tag'

export const LIST = gql`
  query($page: Int!, $status: String!, $search: String!) {
    findOrders(page: $page, status: $status, search: $search) {
      orders {
        id
        buyerName
        sellerName
        buyerId
        sellerId
        orderNumber
        waitingShipmentAt
        total
        payoutTotal
        commission
        status
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const DETAILS = gql`
  query($page: Int!, $orderId: String!) {
    findOrders(page: $page, orderId: $orderId) {
      orders {
        id
        buyerName
        sellerName
        buyerId
        sellerId
        orderNumber
        waitingShipmentAt
        total
        payoutTotal
        commission
        status
        shippingAddressLineOne
        shippingAddressLineTwo
        shippingCity
        shippingState
        shippingPostalCode
        shippingCountry
        billingAddressLineOne
        billingAddressLineTwo
        billingCity
        billingState
        billingPostalCode
        billingCountry
        buyerCompany {
          firstName
          lastName
          companyName
          email
          phoneNumber
        }
        buyerCustomer {
          firstName
          lastName
          email
          phoneNumber
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

export const PRODUCT_LIST = gql`
  query($page: Int!, $orderId: String!) {
    findLineItems(page: $page, orderId: $orderId) {
      lineItems {
        id
        itemPrice
        itemQuantity
        total
        status
        variant {
          id
          name
          image
          sku
          option1Type
          option1Value
          retailPrice
          wholesalePrice
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

export const UPDATE_STATUS = gql`
  mutation($lineItemId: String!, $status: String!) {
    lineItemUpdateStatus(lineItemId: $lineItemId, status: $status) {
      lineItem {
        id
        status
      }
      errors {
        key
        message
      }
      status
    }
  }
`
