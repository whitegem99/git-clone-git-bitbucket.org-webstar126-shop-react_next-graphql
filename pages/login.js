import React, { useState } from 'react'
import { Formik } from 'formik'
import { useMutation } from '@apollo/react-hooks'
import { Spinner } from 'reactstrap'
import { toast } from 'react-toastify'
import get from 'lodash/get'
import Router from 'next/router'
import Link from 'next/link'
import Cookies from 'universal-cookie'

import withApollo from '../libs/apollo'
import { LOGIN } from '../libs/graphql/auth'
import { loginSchema } from '../libs/schema/auth'
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm'

const Login = () => {
  const [login] = useMutation(LOGIN)
  const [showForgotPasswordForm, setForgotPasswordForm] = useState(false)
  const toggleForgotPasswordForm = () =>
    setForgotPasswordForm(!showForgotPasswordForm)

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const {
        data: {
          buyerLogin: { buyer, errors }
        }
      } = await login({ variables: values })

      setSubmitting(false)

      if (buyer) {
        const cookies = new Cookies()
        cookies.set('authToken', buyer.authToken)
        cookies.set('email', buyer.email)

        if (buyer.verifiedAt === null || buyer.verifiedAt === '') {
          return Router.replace('/inviteCode?signin=true')
        }

        cookies.set('authUserId', buyer.id)

        return Router.replace('/')
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  return (
    <div className="login">
      <div className="center">
        <img src="/assets/images/logo.svg" alt="logo" />
        <p className="text-center pt-5 title-login">Log in to continue</p>
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={loginSchema}
          onSubmit={onSubmit}
        >
          {props => (
            <form className="pt-3" onSubmit={props.handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  onChange={props.handleChange}
                  value={props.values.email}
                />
                {props.touched.email && props.errors.email && (
                  <div className="invalid-feedback d-block">
                    {props.errors.email}
                  </div>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={props.handleChange}
                  value={props.values.password}
                />
                {props.touched.password && props.errors.password && (
                  <div className="invalid-feedback d-block">
                    {props.errors.password}
                  </div>
                )}
              </div>
              <div className="text-center pt-2">
                <button
                  className={
                    props.isSubmitting ? 'login-button-active' : 'login-button'
                  }
                  type="submit"
                >
                  {props.isSubmitting ? (
                    <Spinner
                      style={{ width: '21px', height: '21px' }}
                      color="white"
                    />
                  ) : (
                    'Login'
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
          Forgot your password?{' '}
          <button
            type="button"
            className="reset-pw-button"
            onClick={() => toggleForgotPasswordForm()}
          >
            Reset here
          </button>
        </p>
        {/* <p className="text-center pt-2 auth__nav-link">
          <Link href="/">
            <a>Return to home page</a>
          </Link>
        </p> */}
      </div>
      <ForgotPasswordForm
        showForgotPasswordForm={showForgotPasswordForm}
        toggleForgotPasswordForm={toggleForgotPasswordForm}
      />
    </div>
  )
}

export default withApollo(Login)
