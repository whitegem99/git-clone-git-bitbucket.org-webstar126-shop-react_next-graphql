import React from 'react'
import Link from 'next/link'

import withApollo from '../../libs/apollo'

const ResetPasswordSuccess = () => {
  return (
    <div className="under-verification-container mt-n5">
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
            Your password has been reset successfully!
          </p>

          <p className="text-center link">
            <Link href="/login">
              <a>Log in to continue</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default withApollo(ResetPasswordSuccess)
