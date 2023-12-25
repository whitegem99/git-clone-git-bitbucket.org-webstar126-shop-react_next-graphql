import gql from 'graphql-tag'

export const SETTINGS = gql`
  query {
    companySetting {
      company {
        id
        firstName
        lastName
        companyName
        phoneNumber
        addressLineOne
        addressLineTwo
        city
        state
        postalCode
        country
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const PROFILE = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $companyName: String!
    $phoneNumber: String!
    $addressLineOne: String!
    $addressLineTwo: String!
    $city: String!
    $state: String!
    $postalCode: String!
    $country: String!
  ) {
    companyUpdateProfile(
      firstName: $firstName
      lastName: $lastName
      companyName: $companyName
      phoneNumber: $phoneNumber
      addressLineOne: $addressLineOne
      addressLineTwo: $addressLineTwo
      city: $city
      state: $state
      postalCode: $postalCode
      country: $country
    ) {
      company {
        firstName
        lastName
        companyName
        phoneNumber
        addressLineOne
        addressLineTwo
        city
        state
        postalCode
        country
      }
      errors {
        key
        message
      }
      status
    }
  }
`

export const PASSWORD = gql`
  mutation($currentPassword: String!, $newPassword: String!) {
    companyUpdatePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      company {
        firstName
        lastName
        companyName
        phoneNumber
        addressLineOne
        addressLineTwo
        city
        state
        postalCode
        country
      }
      errors {
        key
        message
      }
      status
    }
  }
`
