import gql from 'graphql-tag'

export const REGISTER = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $website: String!
    $einNumber: String!
    $resellerCertificate: String!
    $companyName: String!
    $phoneNumber: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    buyerSignup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      website: $website
      einNumber: $einNumber
      resellerCertificate: $resellerCertificate
      companyName: $companyName
      phoneNumber: $phoneNumber
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      buyer {
        id
        authToken
        verifiedAt
        email
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    buyerLogin(email: $email, password: $password) {
      buyer {
        id
        authToken
        verifiedAt
        email
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const LOGOUT = gql`
  mutation {
    buyerLogout {
      errors {
        key
        message
      }
      status
    }
  }
`

export const FORGOT_PASSWORD = gql`
  mutation($email: String!) {
    buyerForgotPassword(email: $email) {
      buyer {
        id
        email
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const RESET_PASSWORD = gql`
  mutation(
    $resetPasswordToken: String!
    $newPassword: String!
    $passwordConfirmation: String!
  ) {
    buyerResetPassword(
      resetPasswordToken: $resetPasswordToken
      newPassword: $newPassword
      passwordConfirmation: $passwordConfirmation
    ) {
      buyer {
        id
        email
      }
      errors {
        key
        message
      }
      status
    }
  }
`
export const VERIFY = gql`
  mutation($companyId: String!) {
    companyBuyerVerify(companyId: $companyId) {
      company {
        verifiedAt
      }
      errors {
        key
        message
      }
      status
    }
  }
`
