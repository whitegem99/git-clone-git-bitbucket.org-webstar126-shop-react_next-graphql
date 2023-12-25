import gql from 'graphql-tag'

export const LIST = gql`
  query($page: Int!, $search: String!) {
    findContacts(page: $page, search: $search) {
      contacts {
        id
        firstName
        lastName
        email
        phone
        businessName
        businessAddress
        website
      }
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
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $businessName: String!
    $businessAddress: String!
    $website: String!
  ) {
    contactCreate(
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      businessName: $businessName
      businessAddress: $businessAddress
      website: $website
    ) {
      contact {
        id
        firstName
        lastName
        email
        phone
        businessName
        businessAddress
        website
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
    $contactId: String!
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $businessName: String!
    $businessAddress: String!
    $website: String!
  ) {
    contactUpdate(
      contactId: $contactId
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      businessName: $businessName
      businessAddress: $businessAddress
      website: $website
    ) {
      contact {
        id
        firstName
        lastName
        email
        phone
        businessName
        businessAddress
        website
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
  mutation($contactId: String!) {
    contactDelete(contactId: $contactId) {
      contact {
        id
        firstName
        lastName
        email
        phone
        businessName
        businessAddress
        website
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

export const CONTACT_UPLOAD = gql`
  mutation($inputFile: String!) {
    contactUploadCreate(inputFile: $inputFile) {
      contactUpload {
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

export const CONTACT_UPLOAD_STATUS = gql`
  query($page: Int!) {
    findContactUploads(page: $page) {
      contactUploads {
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
export const FIND_ALL_CONTACTS = gql`
  query($page: Int!) {
    findContacts(page: $page) {
      contacts {
        id
        firstName
        lastName
        email
        phone
        businessName
        businessAddress
        website
      }
      errors {
        key
        message
      }
      status
    }
  }
`
