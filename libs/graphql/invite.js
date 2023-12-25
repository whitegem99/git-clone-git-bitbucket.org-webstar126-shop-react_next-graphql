import gql from 'graphql-tag'

// eslint-disable-next-line import/prefer-default-export
export const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    companyLogin(email: $email, password: $password) {
      company {
        id
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

export const REGISTER = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $companyName: String!
    $email: String!
    $password: String!
    $phoneNumber: String!
    $passwordConfirmation: String!
    $website: String!
    $referrerSellerId: String!
  ) {
    companyBuyerSignup(
      firstName: $firstName
      lastName: $lastName
      companyName: $companyName
      phoneNumber: $phoneNumber
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
      website: $website
      referrerSellerId: $referrerSellerId
    ) {
      company {
        id
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
