import gql from 'graphql-tag'

export const PROMOTER_LIST = gql`
  query($page: Int!) {
    findPromoters(page: $page) {
      promoters {
        id
        firstName
        lastName
        phoneNumber
        email
        employeeCode
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

export const CREATE = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $passwordConfirmation: String!
    $phoneNumber: String!
    $employeeCode: String!
  ) {
    promoterCreate(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
      phoneNumber: $phoneNumber
      employeeCode: $employeeCode
    ) {
      promoter {
        id
        firstName
        lastName
        phoneNumber
        email
        employeeCode
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
    $promoterId: String!
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $passwordConfirmation: String!
    $phoneNumber: String!
    $employeeCode: String!
  ) {
    promoterUpdate(
      promoterId: $promoterId
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
      phoneNumber: $phoneNumber
      employeeCode: $employeeCode
    ) {
      promoter {
        id
        firstName
        lastName
        phoneNumber
        email
        employeeCode
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const PROMOTER_DELETE = gql`
  mutation($promoterId: String!) {
    promoterDelete(promoterId: $promoterId) {
      promoter {
        id
        firstName
        lastName
        phoneNumber
        email
        employeeCode
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const INVITE_BRAND_LIST = gql`
  query($page: Int!) {
    findBrands(page: $page) {
      brands {
        id
        logo
        brandName
        promoterEnabled
        company {
          id
          companyName
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

export const PROMOTER_BRAND_LIST = gql`
  query($page: Int!, $promoterId: String!) {
    findBrands(page: $page, promoterId: $promoterId) {
      brands {
        id
        logo
        brandName
        promoterEnabled
        company {
          id
          companyName
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

export const PROMOTER_ADD_REMOVE_BRAND = gql`
  mutation($promoterId: String!, $brandId: String!, $status: Boolean!) {
    promoterAddBrand(promoterId: $promoterId, brandId: $brandId, add: $status) {
      promoter {
        id
        firstName
        lastName
        phoneNumber
        email
        employeeCode
        brands {
          id
          brandName
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

export const INVITE = gql`
  mutation($promoterId: String!, $brandIds: [String!]!) {
    promoterInvite(promoterId: $promoterId, brandIds: $brandIds) {
      promoter {
        id
        firstName
        lastName
        phoneNumber
        email
        employeeCode
        brands {
          id
          brandName
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
