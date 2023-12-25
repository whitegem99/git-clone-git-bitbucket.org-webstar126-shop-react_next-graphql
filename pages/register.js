import React from 'react'
import { Spinner } from 'reactstrap'
import { Formik } from 'formik'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import get from 'lodash/get'
import Router from 'next/router'
import Cookies from 'universal-cookie'
import Link from 'next/link'
import { Widget } from '@uploadcare/react-widget'

import withApollo from '../libs/apollo'
import { registerSchema, registerValues } from '../libs/schema/auth'
import { REGISTER } from '../libs/graphql/auth'

const Register = () => {
  const [register] = useMutation(REGISTER)

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const {
        data: {
          buyerSignup: { buyer, errors }
        }
      } = await register({ variables: values })

      setSubmitting(false)

      if (buyer) {
        const cookies = new Cookies()
        cookies.set('companyId', buyer.id)
        cookies.set('authToken', buyer.authToken)
        cookies.set('email', buyer.email)

        if (buyer.verifiedAt === null || buyer.verifiedAt === '') {
          return Router.replace('/inviteCode')
        }

        return Router.replace('/')
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  const fileInputOnChange = (setFieldValue, upload, name) => {
    setFieldValue(name, upload.originalUrl)
  }

  const fileInputOnRemove = (setFieldValue, upload, name) => {
    if (upload === null) {
      setFieldValue(name, '')
    }
  }

  const checkResellerCertFileType = allowedFileTypes => {
    const types = allowedFileTypes.split(' ')
    // eslint-disable-next-line func-names
    return function(fileInfo) {
      if (fileInfo.name === null) {
        return
      }

      const extension = fileInfo.name.split('.').pop()

      if (extension && !types.includes(extension)) {
        throw new Error('fileType')
      }
    }
  }

  const resellerCertFileTypeValidators = [
    checkResellerCertFileType('jpg jpeg png pdf')
  ]

  const resellerCertWidgetConfig = {
    errors: {
      fileType: 'File type restrictions.'
    },
    dialog: {
      tabs: {
        preview: {
          error: {
            fileType: {
              title: '',
              text:
                'Only an image (.jpg, .jpeg, .png) or a PDF file is allowed.',
              back: 'Back'
            }
          }
        }
      }
    },
    buttons: {
      choose: {
        files: {
          one: `
            <img 
              alt="reseller-certificate"
              src="assets/images/pin.svg"
              class=uploadcare--widget__button-pin-image
            />
            <span class=uploadcare--widget__button-span>Reseller certificate</span>
          `
        }
      },
      cancel: '<span class=uploadcare--widget__button-span>Cancel</span>',
      remove: '<span class=uploadcare--widget__button-span>Remove</span>'
    }
  }

  return (
    <div className="signup">
      <div className="center">
        <div className="text-center">
          <img src="/assets/images/logo.svg" alt="logo" />
        </div>
        <p className="text-center pt-5 title-sign-up">Sign Up</p>
        <p className="text-center pt-3 signUp">
          Enter your basic details below
        </p>
        <Formik
          initialValues={registerValues}
          validationSchema={registerSchema}
          onSubmit={onSubmit}
        >
          {props => (
            <form onSubmit={props.handleSubmit}>
              <div className="form-row">
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    name="firstName"
                    onChange={props.handleChange}
                    value={props.values.firstName}
                  />
                  {props.touched.firstName && props.errors.firstName && (
                    <span className="invalid-feedback d-block">
                      {props.errors.firstName}
                    </span>
                  )}
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    name="lastName"
                    onChange={props.handleChange}
                    value={props.values.lastName}
                  />
                  {props.touched.lastName && props.errors.lastName && (
                    <span className="invalid-feedback d-block">
                      {props.errors.lastName}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="col-lg-6">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    onChange={props.handleChange}
                    value={props.values.email}
                  />
                  {props.touched.email && props.errors.email && (
                    <span className="invalid-feedback d-block">
                      {props.errors.email}
                    </span>
                  )}
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Website or FB page or Instagram page"
                    name="website"
                    onChange={props.handleChange}
                    value={props.values.website}
                  />
                  {props.touched.website && props.errors.website && (
                    <span className="invalid-feedback d-block">
                      {props.errors.website}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="EIN number"
                    name="einNumber"
                    onChange={props.handleChange}
                    value={props.values.einNumber}
                  />
                  {props.touched.einNumber && props.errors.einNumber && (
                    <span className="invalid-feedback d-block">
                      {props.errors.einNumber}
                    </span>
                  )}
                </div>
                <div className="col-lg-6">
                  <div className="uploader-reseller-certificate-container">
                    <Widget
                      tabs="file"
                      name="resellerCertificate"
                      id="resellerCertificate"
                      clearable="true"
                      previewStep="true"
                      validators={resellerCertFileTypeValidators}
                      localeTranslations={resellerCertWidgetConfig}
                      onChange={upload =>
                        fileInputOnChange(
                          props.setFieldValue,
                          upload,
                          'resellerCertificate'
                        )
                      }
                      onFileSelect={upload =>
                        fileInputOnRemove(
                          props.setFieldValue,
                          upload,
                          'resellerCertificate'
                        )
                      }
                      publicKey={process.env.UPLOADCARE_KEY}
                    />
                    {props.touched.resellerCertificate &&
                      props.errors.resellerCertificate && (
                        <span className="invalid-feedback d-block">
                          {props.errors.resellerCertificate}
                        </span>
                      )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Store name"
                    name="companyName"
                    onChange={props.handleChange}
                    value={props.values.companyName}
                  />
                  {props.touched.companyName && props.errors.companyName && (
                    <span className="invalid-feedback d-block">
                      {props.errors.companyName}
                    </span>
                  )}
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                    name="phoneNumber"
                    onChange={props.handleChange}
                    value={props.values.phoneNumber}
                  />
                  {props.touched.phoneNumber && props.errors.phoneNumber && (
                    <span className="invalid-feedback d-block">
                      {props.errors.phoneNumber}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="col-lg-6">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    onChange={props.handleChange}
                    value={props.values.password}
                  />
                  {props.touched.password && props.errors.password && (
                    <span className="invalid-feedback d-block">
                      {props.errors.password}
                    </span>
                  )}
                </div>
                <div className="col-lg-6">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    name="passwordConfirmation"
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
              </div>
              <div className="form-check text-center registerCheckWrap">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheck1"
                />
                <span />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="form-check-label signUp" htmlFor="gridCheck1">
                  I agree to the <a>Terms service</a> & <a>Privacy Policy</a>
                </label>
              </div>
              <div className="text-center w-100">
                <button
                  className={
                    props.isSubmitting
                      ? 'signup-button-active'
                      : 'signup-button'
                  }
                  type="submit"
                >
                  {props.isSubmitting ? (
                    <Spinner
                      style={{ width: '21px', height: '21px' }}
                      color="white"
                    />
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
            </form>
          )}
        </Formik>
        <p className="text-center pt-3 auth__nav-link">
          Already have an account?{' '}
          <Link href="/login">
            <a>Login here</a>
          </Link>
        </p>
        <p className="text-center pt-3 auth__nav-link">
          <Link href="/">
            <a>Return to home page</a>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default withApollo(Register)
