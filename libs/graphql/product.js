import gql from 'graphql-tag'

export const LIST = gql`
  query($page: Int!, $brandId: String!, $search: String!) {
    findProducts(page: $page, brandId: $brandId, search: $search) {
      products {
        id
        name
        sku
        price
        productPageUrl
        images
        brand {
          id
          brandName
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

export const SEARCH = gql`
  query($keyword: String!) {
    searchProduct(keyword: $keyword, page: 1) {
      products {
        id
        name
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const CREATE = gql`
  mutation(
    $brandId: String!
    $sku: String!
    $name: String!
    $price: Float!
    $productPageUrl: String!
    $images: [String!]!
  ) {
    productCreate(
      brandId: $brandId
      sku: $sku
      name: $name
      price: $price
      productPageUrl: $productPageUrl
      images: $images
    ) {
      product {
        id
        sku
        name
        price
        productPageUrl
        images
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
  mutation(
    $productId: String!
    $brandId: String!
    $sku: String!
    $name: String!
    $price: Float!
    $productPageUrl: String!
    $images: [String!]!
  ) {
    productUpdate(
      productId: $productId
      brandId: $brandId
      sku: $sku
      name: $name
      price: $price
      productPageUrl: $productPageUrl
      images: $images
    ) {
      product {
        id
        sku
        name
        price
        productPageUrl
        images
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const UPDATE_VARIANT = gql`
  mutation(
    $variantId: String!
    $sku: String!
    $price: Float!
    $barcode: String!
    $stockCount: Int!
    $images: [String!]!
    $variantOptionsAttributes: [VariantOptionsAttributes!]!
  ) {
    videoUpdateVariant(
      variantId: $variantId
      sku: $sku
      price: $price
      barcode: $barcode
      stockCount: $stockCount
      images: $images
      variantOptionsAttributes: $variantOptionsAttributes
    ) {
      variant {
        id
        price
        sku
        barcode
        stockCount
        images
        variantOptions {
          id
          optionType
          optionValue
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

export const DELETE = gql`
  mutation($productId: String!) {
    productDelete(productId: $productId) {
      product {
        id
        name
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const ADD = gql`
  mutation($videoId: String!, $productId: String!, $attach: Boolean!) {
    videoAddRemoveProduct(
      videoId: $videoId
      productId: $productId
      attach: $attach
    ) {
      product {
        id
        name
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const PRODUCT_UPLOAD = gql`
  mutation($inputFile: String!) {
    productUploadCreate(inputFile: $inputFile) {
      productUpload {
        inputFile
        outputFile
        successRows
        errorRows
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

export const PRODUCT_UPLOAD_STATUS = gql`
  query($page: Int!) {
    findProductUploads(page: $page) {
      productUploads {
        id
        inputFile
        outputFile
        successRows
        errorRows
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
