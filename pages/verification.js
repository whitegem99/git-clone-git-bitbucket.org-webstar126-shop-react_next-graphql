import React, { useEffect } from 'react'
import Link from 'next/link'
import Cookies from 'universal-cookie'

import withAuth from '../libs/auth'
import withApollo from '../libs/apollo'
import { generateVerificationLink } from '../libs/util'

const Verification = () => {
  useEffect(() => {
    const cookies = new Cookies()

    // eslint-disable-next-line no-console
    console.log(
      generateVerificationLink(cookies.get('companyId'), window.location.host)
    )

    cookies.remove('companyId')
    cookies.remove('authToken')
  }, [])

  return (
    <div className="under-verification-container">
      <div className="center">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex flex-column align-items-center">
            <img
              className="img-logo"
              src="/assets/images/logo.svg"
              alt="logo"
            />
            <img
              className="img-check"
              src="/assets/images/check-blue-bg.png"
              alt="check"
            />
          </div>

          <p className="text-heading text-center">
            Congratulations! Your application has been submitted successfully.
          </p>

          <p className="text-subheading text-center mb-5">
            Our team will review your application and approve it if the details
            are correct. They will also reach out to you for any queries.
          </p>

          <Link href="/login">
            <a className="close-link-button mb-4">Close</a>
          </Link>

          <p className="text-center link">
            <Link href="/">
              <a>Return to home page</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default withApollo(withAuth(Verification))
