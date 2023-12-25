import gql from 'graphql-tag'

export const BRANDLIST = gql`
  query($page: Int!) {
    findBrands(page: $page) {
      brands {
        id
        brandName
        logo
        currency
        cssFile
        website
        createdAt
        active
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

export const SEND = gql`
  mutation(
    $brandName: String!
    $logo: String!
    $website: String!
    $currency: String!
  ) {
    brandCreate(
      brandName: $brandName
      logo: $logo
      website: $website
      currency: $currency
    ) {
      brand {
        id
        brandName
        logo
        website
        currency
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

export const UPDATE = gql`
  mutation(
    $brandId: String!
    $brandName: String!
    $logo: String!
    $website: String!
    $currency: String!
  ) {
    brandUpdate(
      brandId: $brandId
      brandName: $brandName
      logo: $logo
      website: $website
      currency: $currency
    ) {
      brand {
        id
        brandName
        logo
        website
        currency
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

export const BRANDDELETE = gql`
  mutation($brandId: String!) {
    brandDelete(brandId: $brandId) {
      errors {
        key
        message
      }
      status
    }
  }
`

export const BRAND_UPLOAD_CSS = gql`
  mutation($brandId: String!, $cssFile: String!, $clear: Boolean) {
    brandUploadCss(brandId: $brandId, cssFile: $cssFile, clear: $clear) {
      brand {
        brandName
        logo
        cssFile
        company {
          companyName
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

export const FIND_COMPANY = gql`
  query($slug: String!) {
    findCompany(id: $slug) {
      company {
        id
        companyName
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
