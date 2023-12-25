import React from 'react'
import { Formik } from 'formik'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import get from 'lodash/get'
import Router, { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import { Spinner } from 'reactstrap'

import withApollo from '../libs/apollo'
import { VALIDATE_INVITE_CODE } from '../libs/graphql/inviteCode'
import { inviteCodeSchema, inviteCodeValues } from '../libs/schema/inviteCode'
import CustomRadioInput from '../components/CustomRadioInput'

const InviteCode = () => {
  const [validate] = useMutation(VALIDATE_INVITE_CODE)
  const router = useRouter()
  const { signin = false } = router.query

  const onSubmit = async (values, { setSubmitting }) => {
    if (values.condition === 'no') {
      return Router.replace('/verification')
    }
    const cookies = new Cookies()
    const email = cookies.get('email')

    const newValues = {
      inviteCode: values.inviteCode,
      email
    }
    try {
      const {
        data: {
          buyerValidateSignupInvite: { status, errors }
        }
      } = await validate({ variables: newValues })

      setSubmitting(false)

      if (status === 200) {
        return Router.replace({
          pathname: '/successInviteCode',
          query: { signin }
        })
      }
      const error = get(errors, '0.message.0', null)
      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  return (
    <div className="inviteCode">
      <div className="center">
        <img src="/assets/images/logo.svg" alt="logo" />
        <p className="text-center pt-5 title-inviteCode">
          Do you have a special invite code
        </p>
        <Formik
          initialValues={inviteCodeValues}
          validationSchema={inviteCodeSchema}
          onSubmit={onSubmit}
        >
          {props => (
            <form className="pt-3" onSubmit={props.handleSubmit}>
              <div className="form-group">
                <div className="name-value-radio-buttons">
                  <CustomRadioInput
                    labelStr="Yes"
                    value="yes"
                    name="condition"
                  />
                  <CustomRadioInput labelStr="No" value="no" name="condition" />
                </div>
                {props.touched.condition && props.errors.condition && (
                  <span
                    className="error-text-span"
                    style={{ display: 'inline' }}
                  >
                    {props.errors.condition}
                  </span>
                )}
              </div>
              {props.values.condition === 'yes' && (
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your code here"
                    name="inviteCode"
                    onChange={props.handleChange}
                    value={props.values.inviteCode}
                  />
                  {props.touched.inviteCode && props.errors.inviteCode && (
                    <div className="invalid-feedback d-block">
                      {props.errors.inviteCode}
                    </div>
                  )}
                </div>
              )}
              <div className="text-center pt-2">
                <button className="login-button-active" type="submit">
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
      </div>
    </div>
  )
}

export default withApollo(InviteCode)
