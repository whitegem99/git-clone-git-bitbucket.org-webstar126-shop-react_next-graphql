import gql from 'graphql-tag'

// eslint-disable-next-line import/prefer-default-export
export const GETMARKETPLACEPRODUCTS = gql`
  query($page: Int!, $videoId: String!) {
    findMarketplaceProducts(page: $page, videoId: $videoId) {
      products {
        id
        name
        images
        wholesalePrice
        retailPrice
        sku
        description
        productOptionTypes {
          optionName
          optionValues
          optionPosition
        }
        variants {
          id
          sku
          name
          image
          wholesalePrice
          option1Type
          option1Value
          option2Type
          option2Value
          option3Type
          option3Value
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

export const GET_CART_DETAILS = gql`
  query($page: Int!) {
    findCartDetails(page: $page) {
      orders {
        id
        buyerName
        sellerName
        orderNumber
        itemTotal
        taxTotal
        deliveryTotal
        discountTotal
        total
        status
        checkoutGroupType
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
        lineItems {
          id
          itemPrice
          itemQuantity
          total
          status
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
