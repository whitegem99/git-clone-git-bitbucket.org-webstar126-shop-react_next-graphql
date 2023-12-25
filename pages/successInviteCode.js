import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import withAuth from '../libs/auth'
import withApollo from '../libs/apollo'

const SuccessInviteCode = () => {
  const router = useRouter()
  const { signin } = router.query

  return (
    <div className="success-invite-code-container">
      <div className="center">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex flex-column align-items-center">
            <img
              className="img-check"
              src="/assets/images/check-black.svg"
              alt="check"
            />
          </div>

          <p className="text-heading text-center">
            Congratulations! Your account has been approved.
          </p>

          <>
            {!signin || signin === 'false' ? (
              <>
                <p className="text-subheading text-center">
                  Please login to continue
                </p>

                <Link href="/login">
                  <a className="close-link-button mb-3 mt-3">Login</a>
                </Link>

                <p className="text-center link">
                  <Link href="/">
                    <a>Go to home page</a>
                  </Link>
                </p>
              </>
            ) : (
              <Link href="/">
                <a className="close-link-button mt-3">Go to home page</a>
              </Link>
            )}
          </>
        </div>
      </div>
    </div>
  )
}

export default withApollo(withAuth(SuccessInviteCode))
