import gql from 'graphql-tag'

// eslint-disable-next-line import/prefer-default-export
export const VALIDATE_INVITE_CODE = gql`
  mutation($inviteCode: String!, $email: String!) {
    buyerValidateSignupInvite(inviteCode: $inviteCode, email: $email) {
      inviteCode {
        body
        expiredAt
      }
      errors {
        key
        message
      }
      status
    }
  }
`
