import React, { useState } from 'react'
import { Spinner } from 'reactstrap'
import { Formik } from 'formik'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import Link from 'next/link'

import withApollo from '../../libs/apollo'
import { resetPasswordSchema } from '../../libs/schema/auth'
import { RESET_PASSWORD } from '../../libs/graphql/auth'
import ResetPasswordSuccess from '../../components/Auth/ResetPasswordSuccess'

const ResetPassword = () => {
  const router = useRouter()
  const { token } = router.query
  const [reset] = useMutation(RESET_PASSWORD)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const {
        data: {
          buyerResetPassword: { buyer, errors }
        }
      } = await reset({ variables: values })

      setSubmitting(false)

      if (buyer) {
        setSuccess(true)
      }

      if (errors) {
        const error = get(errors, '0.message.0', null)
        return toast.error(error || 'Server error')
      }

      return buyer
    } catch (error) {
      return toast.error('Server error')
    }
  }

  return (
    <>
      {success ? (
        <ResetPasswordSuccess />
      ) : (
        <div className="reset-password">
          <div className="center">
            <img src="/assets/images/logo.svg" alt="logo" />
            <p className="text-center pt-5 title-reset-pw">Reset Password</p>
            <Formik
              initialValues={{
                resetPasswordToken: token,
                newPassword: '',
                passwordConfirmation: ''
              }}
              validationSchema={resetPasswordSchema}
              onSubmit={onSubmit}
            >
              {props => (
                <form className="pt-3" onSubmit={props.handleSubmit}>
                  <div className="form-group">
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control"
                      placeholder="New password"
                      onChange={props.handleChange}
                      value={props.values.newPassword}
                    />
                    {props.touched.newPassword && props.errors.newPassword && (
                      <span className="invalid-feedback d-block">
                        {props.errors.newPassword}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="passwordConfirmation"
                      className="form-control"
                      placeholder="Confirm password"
                      onChange={props.handleChange}
                      value={props.values.passwordConfirmation}
                    />
                    {props.touched.passwordConfirmation &&
                      props.errors.passwordConfirmation && (
                        <span className="invalid-feedback d-block">
                          {props.errors.passwordConfirmation}
                        </span>
                      )}
                  </div>
                  <div className="text-center pt-2">
                    <button
                      className={
                        props.isSubmitting
                          ? 'submit-button-active'
                          : 'submit-button'
                      }
                      type="submit"
                    >
                      {props.isSubmitting ? (
                        <Spinner
                          style={{ width: '21px', height: '21px' }}
                          color="white"
                        />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
            <p className="text-center pt-4 auth__nav-link">
              Don&apos;t have an account?{' '}
              <Link href="/register">
                <a>Sign up here</a>
              </Link>
            </p>
            <p className="text-center pt-2 auth__nav-link">
              Already have an account?{' '}
              <Link href="/login">
                <a>Login here</a>
              </Link>
            </p>
            <p className="text-center pt-2 auth__nav-link">
              <Link href="/">
                <a>Return to home page</a>
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default withApollo(ResetPassword)
