import gql from 'graphql-tag'

export const LIST = gql`
  query($page: Int!, $state: String) {
    findLineItems(page: $page, filterByState: $state) {
      lineItems {
        id
        itemTotal
        discountTotal
        deliveryTotal
        taxTotal
        total
        state
        filterOptions
        order {
          id
          number
          itemTotal
          discountTotal
          deliveryTotal
          taxTotal
          total
          customer {
            fullName
            email
          }
          products {
            id
            name
          }
        }
        variant {
          id
          productName
          sku
          images
        }
      }
      filterOptions
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

export const SHOW = gql`
  query($orderId: String!) {
    getOrderDetail(orderId: $orderId) {
      order {
        id
        number
        itemTotal
        discountTotal
        deliveryTotal
        taxTotal
        total
        customer {
          fullName
          email
          shippingAddress {
            addressOne
            addressTwo
            state
            city
            country
            zip
          }
        }
        lineItems {
          id
          itemTotal
          discountTotal
          deliveryTotal
          taxTotal
          total
          state
          filterOptions
          variant {
            id
            productName
            sku
            images
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

export const UPDATE = gql`
  mutation($state: String!, $lineItemId: String!) {
    updateStateLineItem(state: $state, lineItemId: $lineItemId) {
      lineItem {
        id
        itemTotal
        discountTotal
        deliveryTotal
        taxTotal
        total
        state
        filterOptions
        variant {
          id
          productName
          sku
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
