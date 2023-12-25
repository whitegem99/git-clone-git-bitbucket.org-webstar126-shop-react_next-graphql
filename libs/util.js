/* eslint-disable import/prefer-default-export */
import get from 'lodash/get'
import Cookies from 'universal-cookie'

export const getToken = ctx => {
  let cookies
  const cookie = get(ctx, 'req.headers.cookie', null)

  if (cookie) {
    cookies = new Cookies(cookie)
  } else {
    cookies = new Cookies()
  }

  return cookies.get('authToken')
}

export const generateVerificationLink = (companyId, hostname) => {
  let verificationLink = `${process.env.APP_URL}buyers/${companyId}/verify`

  if (process.env.NODE_ENV !== 'production') {
    verificationLink = `${hostname}/buyers/${companyId}/verify`
  }

  return verificationLink
}
