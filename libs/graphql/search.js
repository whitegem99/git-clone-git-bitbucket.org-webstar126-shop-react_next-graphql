/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'

export const SEARCH_PRODUCTS = gql`
  query($search: String!, $page: Int!) {
    searchProducts(search: $search, page: $page) {
      products {
        id
        name
        images
        brandId
        price
        productOptionTypes {
          optionName
          optionValues
          optionPosition
        }
        variants {
          id
          sku
          wholesalePrice
          image
          option1Type
          option1Value
          option2Type
          option2Value
          option3Type
          option3Value
        }
      }
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

export const SEARCH_BRANDS = gql`
  query($search: String!, $page: Int!) {
    searchBrands(search: $search, page: $page) {
      brands {
        id
        brandName
        logo
        minimumOrderAmount
      }
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
export const SEARCH_TAXONOMIES = gql`
  query($domain: String!) {
    findTaxonomies(domain: $domain) {
      taxonomies {
        id
        taxonomyName
        level
        childTaxonomies {
          id
          taxonomyName
          level
          childTaxonomies {
            id
            taxonomyName
            level
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
export const SEARCH_PRODUCTS_BY_TAXONOMY = gql`
  query($taxonomyId: String!, $page: Int!) {
    findProductsByTaxonomy(taxonomyId: $taxonomyId, page: $page) {
      products {
        id
        name
        brandId
        price
        images
        variants {
          id
          sku
          wholesalePrice
          image
          option1Type
          option1Value
          option2Type
          option2Value
          option3Type
          option3Value
        }
      }
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
