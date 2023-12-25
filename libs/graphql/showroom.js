import gql from 'graphql-tag'

export const GETSHOWROOMDATA = gql`
  query($handle: String!) {
    findMarketplaces(handle: $handle) {
      marketplaces {
        id
        handle
        mainBanner
        valueProps {
          text
          img
        }
        featuredBrands {
          id
          logo
        }
        featuredVideos {
          id
          title
          livestreamUrl
          bannerUrl
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

export const GETALLBRANDSDATA = gql`
  query($domain: String!, $page: Int!, $search: String!) {
    findMarketplaceBrands(page: $page, search: $search, domain: $domain) {
      brands {
        id
        brandName
        logo
        minimumOrderAmount
        bannerUrl
        description
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const GETVIDEOSDATA = gql`
  query($page: Int!, $brandId: String!) {
    findVideos(page: $page, brandId: $brandId) {
      videos {
        id
        title
        totalViews
        bannerUrl
        livestreamUrl
        brands {
          id
          brandName
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

export const GETPRODUCTS = gql`
  query($page: Int!, $videoId: String!) {
    findProducts(page: $page, videoId: $videoId) {
      products {
        id
        name
        images
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
      errors {
        key
        message
      }
      status
    }
  }
`

export const GETBRANDPRODUCTS = gql`
  query($page: Int!, $brandId: String!, $categoryId: String) {
    findMarketplaceProducts(
      brandId: $brandId
      categoryId: $categoryId
      page: $page
    ) {
      products {
        id
        name
        description
        images
        productOptionTypes {
          optionName
          optionValues
          optionPosition
        }
        variants {
          id
          name
          image
          wholesalePrice
          sku
          option1Type
          option1Value
          option2Type
          option2Value
          option3Type
          option3Value
          retailPrice
          wholesalePrice
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

export const GETPRODUCTDETAILS = gql`
  query($productId: String!) {
    findProductDetail(productId: $productId) {
      product {
        id
        name
        description
        images
        productOptionTypes {
          optionName
          optionValues
          optionPosition
        }
        variants {
          id
          name
          image
          wholesalePrice
          sku
          option1Type
          option1Value
          option2Type
          option2Value
          option3Type
          option3Value
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

export const ADDTOCART = gql`
  mutation($variantId: String!, $unit: Int!) {
    orderAddProduct(variantId: $variantId, unit: $unit) {
      order {
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
          variant {
            id
            name
            image
            sku
            option1Type
            option1Value
            option2Type
            option2Value
            option3Type
            option3Value
            retailPrice
            wholesalePrice
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

export const REMOVEFROMCART = gql`
  mutation($productId: String!) {
    orderRemoveProduct(productId: $productId) {
      orders {
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
export const UPDATECART = gql`
  mutation($lineItemId: String!, $unit: Int!) {
    orderUpdateLineItem(lineItemId: $lineItemId, unit: $unit) {
      order {
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
        paymentStatus
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
          variant {
            id
            name
            image
            sku
            option1Type
            option1Value
            option2Type
            option2Value
            option3Type
            option3Value
            retailPrice
            wholesalePrice
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

export const GETCARTDATA = gql`
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
        minimumOrderAmount
        creditsApplied
        company {
          credits
        }
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
            option2Type
            option2Value
            option3Type
            option3Value
            retailPrice
            wholesalePrice
          }
        }
        cartProductsGrid {
          id
          productName
          productImage
          oneUnitToQuantity
          cartVariantsGrid {
            id
            options
            itemId
            itemUnit
            itemQuantity
            itemPrice
            itemTotal
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

export const ORDER_ADD_PRODUCT_BULK = gql`
  mutation($orderId: String!, $units: [Int!]!, $variantIds: [String!]!) {
    orderAddProductBulk(
      orderId: $orderId
      units: $units
      variantIds: $variantIds
    ) {
      order {
        lineItems {
          itemQuantity
          variant {
            name
            option1Type
            option1Value
            option2Type
            option2Value
            option3Type
            option3Value
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

export const UPDATEBILLINGADDRESS = gql`
  mutation(
    $orderIds: [String!]!
    $billingAddressLineOne: String!
    $billingAddressLineTwo: String!
    $billingCity: String!
    $billingState: String!
    $billingPostalCode: String!
    $billingCountry: String!
  ) {
    orderUpdateBillingAddress(
      orderIds: $orderIds
      billingAddressLineOne: $billingAddressLineOne
      billingAddressLineTwo: $billingAddressLineTwo
      billingCity: $billingCity
      billingState: $billingState
      billingPostalCode: $billingPostalCode
      billingCountry: $billingCountry
    ) {
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
          variant {
            id
            name
            image
            sku
            option1Type
            option1Value
            option2Type
            option2Value
            option3Type
            option3Value
            retailPrice
            wholesalePrice
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

export const UPDATESHIPPINGADDRESS = gql`
  mutation(
    $orderIds: [String!]!
    $shippingAddressLineOne: String!
    $shippingAddressLineTwo: String!
    $shippingCity: String!
    $shippingState: String!
    $shippingPostalCode: String!
    $shippingCountry: String!
  ) {
    orderUpdateShippingAddress(
      orderIds: $orderIds
      shippingAddressLineOne: $shippingAddressLineOne
      shippingAddressLineTwo: $shippingAddressLineTwo
      shippingCity: $shippingCity
      shippingState: $shippingState
      shippingPostalCode: $shippingPostalCode
      shippingCountry: $shippingCountry
    ) {
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
          variant {
            id
            name
            image
            sku
            option1Type
            option1Value
            option2Type
            option2Value
            option3Type
            option3Value
            retailPrice
            wholesalePrice
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

export const COMPLETEORDER = gql`
  mutation($orderIds: [String!]!, $stripePaymentMethodId: String!) {
    orderComplete(
      orderIds: $orderIds
      stripePaymentMethodId: $stripePaymentMethodId
    ) {
      orders {
        id
        status
        stripePaymentIntendId
        stripeClientSecretId
        buyer {
          stripeCardId
          stripeCustomerId
          stripeCardBrand
          stripeCardExpMonth
          stripeCardExpYear
          stripeCardLast4
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

export const SIGNUP = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $companyName: String!
    $phoneNumber: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    companySignup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      companyName: $companyName
      phoneNumber: $phoneNumber
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      company {
        firstName
        lastName
        companyName
        email
        phoneNumber
        authToken
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const SIGNIN = gql`
  mutation($email: String!, $password: String!) {
    companyLogin(email: $email, password: $password) {
      company {
        firstName
        lastName
        companyName
        email
        phoneNumber
        authToken
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const ORDER_ADD_PRODUCT = gql`
  mutation($variantId: String!, $unit: Int!) {
    orderAddProduct(variantId: $variantId, unit: $unit) {
      order {
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
          variant {
            id
            name
            image
            sku
            option1Type
            option1Value
            option2Type
            option2Value
            option3Type
            option3Value
            retailPrice
            wholesalePrice
          }
          product {
            id
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

export const ORDER_REMOVE_PRODUCT = gql`
  mutation($variantId: String!) {
    orderRemoveProduct(variantId: $variantId) {
      order {
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
          variant {
            id
            name
            image
            sku
            option1Type
            option1Value
            option2Type
            option2Value
            option3Type
            option3Value
            retailPrice
            wholesalePrice
          }
          product {
            id
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
          product {
            id
          }
          variant {
            id
            name
            image
            sku
            option1Type
            option1Value
            option2Type
            option2Value
            option3Type
            option3Value
            retailPrice
            wholesalePrice
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

export const ORDER_AUTHORIZE_PAYMENT = gql`
  mutation($orderIds: [String!]!) {
    orderAuthorizePayment(orderIds: $orderIds) {
      orders {
        id
        stripePaymentIntendId
        stripeClientSecretId
        buyer {
          stripeCardId
          stripeCustomerId
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

export const ORDER_APPLY_CREDIT = gql`
  mutation($orderId: String!, $creditsApplied: Int!) {
    orderApplyCredits(orderId: $orderId, creditsApplied: $creditsApplied) {
      order {
        id
        orderNumber
        itemTotal
        taxTotal
        deliveryTotal
        discountTotal
        creditsApplied
        total
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const ORDER_ADD_BUYER_NOTE = gql`
  mutation(
    $orderIds: [String!]!
    $buyerNotes: String!
    $buyerSignatureName: String!
    $preferredShipDateFrom: String
    $preferredShipDateTo: String
  ) {
    orderAddAdditionalDetails(
      orderIds: $orderIds
      buyerNotes: $buyerNotes
      buyerSignatureName: $buyerSignatureName
      preferredShipDateFrom: $preferredShipDateFrom
      preferredShipDateTo: $preferredShipDateTo
    ) {
      orders {
        id
        buyerSignatureName
        orderNotes {
          id
          body
          senderCompanyName
          senderFullName
          senderType
          createdAt
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

export const FIND_BUYER_PAYMENT_METHODS = gql`
  query {
    findBuyerPaymentMethods {
      paymentMethods {
        id
        brand
        expMonth
        expYear
        last4
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const GET_LINESHEETS_BY_BRANDS = gql`
  query($page: Int!, $brandId: String!) {
    findLinesheetsByBrand(brandId: $brandId, page: $page) {
      linesheets {
        id
        linesheetName
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const GET_PRODUCTS_BY_LINESHEETS = gql`
  query($linesheetId: String!, $page: Int!) {
    findProductsByLinesheet(linesheetId: $linesheetId, page: $page) {
      products {
        id
        name
        variants {
          id
          sku
          name
          image
          wholesalePrice
          retailPrice
          option1Type
          option1Value
          option2Type
          option2Value
          option3Type
          option3Value
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

export const GET_CATEGORY_BY_BRAND = gql`
  query($page: Int!, $brandId: String!) {
    findCategoriesByBrand(page: $page, brandId: $brandId) {
      categories {
        id
        categoryName
        slug
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const ORDER_UPDATE_PAYMENT_METHOD = gql`
  mutation($orderId: String!, $stripePaymentMethodId: String!) {
    orderUpdatePaymentMethod(
      orderId: $orderId
      stripePaymentMethodId: $stripePaymentMethodId
    ) {
      order {
        id
        paymentStatus
      }
      errors {
        key
        message
      }
      status
    }
  }
`
