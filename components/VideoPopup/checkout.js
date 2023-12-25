import React, { useState, useMemo } from 'react'
import {
  faTimesCircle,
  faArrowCircleLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { Row, Col, Button, FormGroup, Input, Spinner } from 'reactstrap'
import { useMutation, useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import Cookie from 'js-cookie'
import Cookies from 'universal-cookie'
import { Formik } from 'formik'
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import {
  SIGNIN,
  SIGNUP,
  GETCARTDATA,
  REMOVEFROMCART,
  UPDATEBILLINGADDRESS,
  UPDATESHIPPINGADDRESS,
  ORDER_AUTHORIZE_PAYMENT,
  COMPLETEORDER,
  FIND_BUYER_PAYMENT_METHODS
} from '../../libs/graphql/showroom'
import { addressSchema } from '../../libs/schema/cart'

import CartSummary from './cartSummary'
import CheckoutCard from './checkoutCard'
import ApplyCredits from './applyCredits'
import AddNotes from './addNotes'

const stripePromise = loadStripe(
  'pk_test_51GzQPtIfPwvESFpykirq5Oc0YR1Os1RhImd3nSvtfd8yHS3f1iF1AahafaeuBf2ufOj6bQs0vLNpKKGkA3vs2JIr00ItOXvmc6'
)

const CheckoutForm = ({ setStep, orderIds, buyerPaymentMethod }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [isCardShow, setCardShow] = useState(false)
  const [selectedCardId, setCardId] = useState('')

  const [orderAuthPayment, { loading: orderAuthLoading }] = useMutation(
    ORDER_AUTHORIZE_PAYMENT
  )
  const [completeOrder, { loading: completeOrderLoading }] = useMutation(
    COMPLETEORDER
  )

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const {
        data: { orderComplete }
      } = await completeOrder({
        variables: {
          orderIds,
          stripePaymentMethodId: selectedCardId
        }
      })
      if (orderComplete.orders) {
        setStep(prevStep => prevStep + 1)
      } else {
        const errorIn = get(orderComplete.errors, '0.message.0', null)
        toast.error(errorIn || 'Server error')
      }
    } catch (error) {
      toast.error('Server error')
    }
  }

  const handleStripe = async e => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)
    try {
      const {
        data: {
          orderAuthorizePayment: { orders, errors }
        }
      } = await orderAuthPayment({ variables: { orderIds } })
      if (orders) {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          orders[0].stripeClientSecretId,
          {
            payment_method: {
              card: cardElement
            },
            setup_future_usage: 'off_session'
          }
        )
        if (error) {
          toast.error(error.message)
        } else if (paymentIntent.status === 'succeeded') {
          buyerPaymentMethod.refetch()
        }
      } else {
        const errorIn = get(errors, '0.message.0', null)
        toast.error(errorIn || 'Server error')
      }
    } catch (error) {
      toast.error('Server error')
    }
  }

  return (
    <>
      {isCardShow ? (
        <>
          <p className="font-md">Confirm Card Details</p>
          {buyerPaymentMethod?.data?.findBuyerPaymentMethods?.paymentMethods.map(
            itm => (
              <div className="row ml-1 mb-2" key={itm.id}>
                <div className="card credit-card col-5">
                  <div className="row">
                    <img
                      src="/assets/images/credit-card.svg"
                      alt="credit-card"
                    />
                    <p className="m-auto">{`${itm.brand
                      .charAt(0)
                      .toUpperCase()}${itm.brand.slice(1)}`}</p>
                    <p className="m-auto">*** *** *** ***{itm.last4}</p>
                  </div>
                </div>
                <div className="card credit-card col-2 ml-2">
                  <p className="m-auto">
                    {itm.expMonth}/{itm.expYear}
                  </p>
                </div>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="radio radio-before my-auto ml-3">
                  <span className="radio__input">
                    <input
                      type="radio"
                      name="card"
                      value={itm.id}
                      checked={selectedCardId === itm.id}
                      onChange={e => setCardId(e.target.value)}
                    />
                    <span className="radio__control" />
                  </span>
                </label>
              </div>
            )
          )}
          <div className="d-flex justify-content-between align-items-center mt-3 w-50">
            <Button
              size="lg"
              color="dark"
              className="btn btn-outline btn-lg"
              type="button"
              outline
              onClick={() => setCardShow(false)}
            >
              Change
            </Button>
            <Button
              size="lg"
              className="btn black-btn btn-lg"
              type="submit"
              onClick={handleSubmit}
              disabled={!stripe || orderAuthLoading || completeOrderLoading}
            >
              {!stripe || orderAuthLoading || completeOrderLoading ? (
                <Spinner
                  style={{ width: '21px', height: '21px' }}
                  color="white"
                />
              ) : (
                'Confirm'
              )}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="font-md">Enter Card Details</p>
          <form onSubmit={handleSubmit} className="w-50">
            <CardElement
              options={{
                hidePostalCode: true
              }}
            />
          </form>
          <div className="d-flex justify-content-between align-items-center mt-3 w-50">
            <Button
              size="lg"
              color="dark"
              className="btn btn-outline btn-lg"
              type="button"
              outline
              onClick={() => setStep(prevStep => prevStep - 1)}
            >
              Back
            </Button>
            <Button
              size="lg"
              className="btn black-btn btn-lg"
              type="submit"
              disabled={!stripe}
              onClick={handleStripe}
            >
              {!stripe ? (
                <Spinner
                  style={{ width: '21px', height: '21px' }}
                  color="white"
                />
              ) : (
                'Pay'
              )}
            </Button>
          </div>
        </>
      )}
    </>
  )
}

const Checkout = props => {
  const { onClose, back } = props

  const token = Cookie.get('authToken')
  // const buyerId = Cookie.get('authUserId')
  const [cartStateData, setCartStateData] = useState([])
  const [step, setStep] = useState(token ? 2 : 1)
  const [showSignIn, setShowSignIn] = useState(true)
  const [formFields, setFormFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address1: '',
    address2: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    contactPreference: ''
  })
  const [sameAsBillingAddress, setSameAsBillingAddress] = useState(false)
  const [cardType, setCardType] = useState('n')
  const [selectedCardId, setCardId] = useState('')

  const refreshFields = () => {
    setFormFields({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address1: '',
      address2: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      contactPreference: ''
    })
  }

  const handleInputChange = e => {
    const { value, name } = e.target
    setFormFields({
      ...formFields,
      [name]: value
    })
  }

  const cartData = useQuery(GETCARTDATA, {
    variables: {
      page: 1
    }
  })

  const buyerPaymentMethod = useQuery(FIND_BUYER_PAYMENT_METHODS)

  useMemo(() => {
    const data = get(cartData.data, 'findCartDetails.orders') || []
    setCartStateData(data)
  }, [cartData.data])

  const underMinimumOrders = cartStateData.filter(
    x => x.checkoutGroupType === 'under_minimum'
  )
  const checkoutCartOrders = cartStateData.filter(
    x => x.checkoutGroupType === 'ready_for_checkout'
  )

  const [signIn] = useMutation(SIGNIN)
  const [signUp] = useMutation(SIGNUP)
  const [updateBillingAddress] = useMutation(UPDATEBILLINGADDRESS)
  const [updateShippingAddress] = useMutation(UPDATESHIPPINGADDRESS)
  const [orderAuthPayment, { loading: orderAuthLoading }] = useMutation(
    ORDER_AUTHORIZE_PAYMENT
  )
  const [completeOrder, { loading: completeOrderLoading }] = useMutation(
    COMPLETEORDER
  )

  const signInHandler = async e => {
    e.preventDefault()

    const values = {
      email: formFields.email,
      password: formFields.password
    }
    try {
      const {
        data: {
          companyLogin: { company, errors }
        }
      } = await signIn({ variables: values })

      if (company) {
        const cookies = new Cookies()
        cookies.set('authUserId', company.id)
        cookies.set('authToken', company.authToken)
        cookies.set('playback_showroom_token', company.authToken)
        refreshFields()
        setStep(prevStep => prevStep + 1)
        return 1
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  const signUpHandler = async e => {
    e.preventDefault()
    const values = {
      firstName: formFields.firstName,
      lastName: formFields.firstName,
      email: formFields.email,
      password: formFields.password,
      passwordConfirmation: formFields.password,
      companyName: formFields.firstName,
      phoneNumber: formFields.phone
    }
    try {
      const {
        data: {
          companySignup: { company, errors }
        }
      } = await signUp({ variables: values })

      if (company) {
        const cookies = new Cookies()
        cookies.set('authToken', company.authToken)
        cookies.set('playback_showroom_token', company.authToken)
        refreshFields()
        setStep(prevStep => prevStep + 1)
        return 1
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  const billingAddressHandler = async (values, { setSubmitting }) => {
    const value = {
      orderIds: cartStateData.map(itm => itm.id),
      billingAddressLineOne: values.address1,
      billingAddressLineTwo: values.address2,
      billingCity: values.city,
      billingState: values.state,
      billingPostalCode: values.zipCode,
      billingCountry: values.country
    }
    try {
      const {
        data: {
          orderUpdateBillingAddress: { orders, errors }
        }
      } = await updateBillingAddress({ variables: value })

      setSubmitting(false)

      if (orders) {
        refreshFields()
        setStep(prevStep => prevStep + 1)
        return 1
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  const shippingAddressHandler = async (values, { setSubmitting }) => {
    const value = {
      orderIds: cartStateData.map(itm => itm.id),
      shippingAddressLineOne: values.address1,
      shippingAddressLineTwo: values.address2,
      shippingCity: values.city,
      shippingState: values.state,
      shippingPostalCode: values.zipCode,
      shippingCountry: values.country
    }
    try {
      const {
        data: {
          orderUpdateShippingAddress: { orders, errors }
        }
      } = await updateShippingAddress({ variables: value })
      setSubmitting(false)
      if (orders) {
        refreshFields()
        setStep(prevStep => prevStep + 1)
        return 1
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  const [removeFromCart] = useMutation(REMOVEFROMCART)

  const removeFromCartHandler = async id => {
    const values = {
      lineItemId: id
    }
    try {
      const {
        data: {
          orderRemoveLineItem: { orders, errors }
        }
      } = await removeFromCart({ variables: values })

      if (orders) {
        await cartData.refetch()
        return toast.success('Item Removed from cart!')
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  const handleSameBillingAddressCheck = (e, prop) => {
    if (e.target.checked) {
      prop.setValues({
        address1: cartStateData[0].billingAddressLineOne,
        address2: cartStateData[0].billingAddressLineTwo,
        country: cartStateData[0].billingCountry,
        state: cartStateData[0].billingState,
        city: cartStateData[0].billingCity,
        zipCode: cartStateData[0].billingPostalCode
      })
    } else {
      prop.setValues({
        address1: cartStateData[0].shippingAddressLineOne,
        address2: cartStateData[0].shippingAddressLineTwo,
        country: cartStateData[0].shippingCountry,
        state: cartStateData[0].shippingState,
        city: cartStateData[0].shippingCity,
        zipCode: cartStateData[0].shippingPostalCode
      })
    }
  }

  const handleSubmitPayment = async event => {
    event.preventDefault()

    try {
      const {
        data: {
          orderAuthorizePayment: { orders, errors }
        }
      } = await orderAuthPayment({
        variables: {
          orderIds: cartStateData.map(itm => itm.id),
          stripePaymentMethodId: selectedCardId
        }
      })

      if (orders) {
        const {
          data: { orderComplete }
        } = await completeOrder({
          variables: {
            orderIds: cartStateData.map(itm => itm.id),
            stripePaymentMethodId: selectedCardId
          }
        })
        if (orderComplete.orders) {
          setStep(prevStep => prevStep + 1)
        } else {
          const errorIn = get(orderComplete.errors, '0.message.0', null)
          toast.error(errorIn || 'Server error')
        }
      } else {
        const error = get(errors, '0.message.0', null)
        toast.error(error || 'Server error')
      }
    } catch (error) {
      toast.error('Server error')
    }
  }

  return (
    <div className="checkout">
      {/* eslint-disable-next-line no-nested-ternary */}
      {step === 8 ? (
        <>
          <div className="product-section pb-2 d-flex justify-content-between">
            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
            <h4 />
            <div>
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="cart-icon icon-button"
                onClick={() => onClose()}
              />
            </div>
          </div>
          <div
            className="product-section text-center"
            style={{ padding: '150px' }}
          >
            <img
              src="/assets/images/rocket.svg"
              className="img-fluid"
              alt="cart"
              width={100}
              height={120}
            />
            <h4 className="pb-2">Your order has been successfully placed.</h4>
            <p>Please check the status on your dashboard</p>
            <div className="d-block">
              <Button
                onClick={() => back()}
                className="btn btn-outline d-inline-block mr-2 btn-lg"
                outline
              >
                Visit Dashboard
              </Button>
              <Button
                onClick={() => back()}
                className="btn black-btn d-inline-block btn-lg"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </>
      ) : cartStateData.length > 0 ? (
        <>
          <div className="product-section pb-2 d-flex justify-content-between">
            <h4>Confirm And Pay Amount</h4>
            <div>
              <FontAwesomeIcon
                icon={faArrowCircleLeft}
                className="cart-icon icon-button mr-3"
                onClick={() => back()}
              />
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="cart-icon icon-button"
                onClick={() => onClose()}
              />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-xs-12 col-md-12">
              <div className="wrapper-progressBar">
                <ul className="progressBar">
                  <li
                    className={step <= 7 ? 'active' : ''}
                    style={{
                      width:
                        cartStateData[0]?.buyerCompany?.credits > 0
                          ? '14%'
                          : '16%'
                    }}
                  >
                    Login
                  </li>
                  <li
                    className={step >= 2 ? 'active' : ''}
                    style={{
                      width:
                        cartStateData[0]?.buyerCompany?.credits > 0
                          ? '14%'
                          : '16%'
                    }}
                  >
                    Cart
                  </li>
                  <li
                    className={step >= 3 ? 'active' : ''}
                    style={{
                      width:
                        cartStateData[0]?.buyerCompany?.credits > 0
                          ? '14%'
                          : '16%'
                    }}
                  >
                    Billing Address
                  </li>
                  <li
                    className={step >= 4 ? 'active' : ''}
                    style={{
                      width:
                        cartStateData[0]?.buyerCompany?.credits > 0
                          ? '14%'
                          : '16%'
                    }}
                  >
                    Shipping Address
                  </li>
                  {cartStateData[0]?.buyerCompany?.credits > 0 ? (
                    <>
                      <li
                        className={step >= 5 ? 'active' : ''}
                        style={{
                          width:
                            cartStateData[0]?.buyerCompany?.credits > 0
                              ? '14%'
                              : '16%'
                        }}
                      >
                        Apply Credits
                      </li>
                      <li
                        className={step >= 6 ? 'active' : ''}
                        style={{
                          width:
                            cartStateData[0]?.buyerCompany?.credits > 0
                              ? '14%'
                              : '16%'
                        }}
                      >
                        Add Notes
                      </li>
                      <li
                        className={step >= 7 ? 'active' : ''}
                        style={{
                          width:
                            cartStateData[0]?.buyerCompany?.credits > 0
                              ? '14%'
                              : '16%'
                        }}
                      >
                        Payment
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        className={step >= 5 ? 'active' : ''}
                        style={{
                          width:
                            cartStateData[0]?.buyerCompany?.credits > 0
                              ? '14%'
                              : '16%'
                        }}
                      >
                        Add Notes
                      </li>
                      <li
                        className={step >= 6 ? 'active' : ''}
                        style={{
                          width:
                            cartStateData[0]?.buyerCompany?.credits > 0
                              ? '14%'
                              : '16%'
                        }}
                      >
                        Payment
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {step === 1 && (
            <>
              <Row>
                <Col md="8">
                  <form
                    /* className="pq-form" */ onSubmit={
                      showSignIn ? signInHandler : signUpHandler
                    }
                  >
                    <p className="font-md">
                      {showSignIn ? 'Login to Continue' : 'Sign up to Continue'}
                    </p>

                    {showSignIn ? (
                      <>
                        <FormGroup className="form-group mt-3">
                          <Input
                            required
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={e => handleInputChange(e)}
                            value={formFields.email}
                          />
                        </FormGroup>
                        <FormGroup className="form-group mt-3">
                          <Input
                            required
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={e => handleInputChange(e)}
                            value={formFields.password}
                          />
                        </FormGroup>
                        <div className="d-flex justify-content-between align-items-center">
                          <Button
                            size="lg"
                            className="btn black-btn btn-lg"
                            type="submit"
                          >
                            Login
                          </Button>
                          <div className="font-14">
                            Dont have an account?{' '}
                            <span
                              onClick={() => setShowSignIn(false)}
                              onKeyDown={() => setShowSignIn(false)}
                              className="signup-link"
                              role="button"
                              tabIndex={0}
                            >
                              {' '}
                              Sign up{' '}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <FormGroup className="form-group mt-3">
                          <Input
                            required
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={e => handleInputChange(e)}
                            value={formFields.email}
                          />
                        </FormGroup>
                        <FormGroup className="form-group mt-3">
                          <Input
                            required
                            type="text"
                            name="password"
                            placeholder="Password"
                            onChange={e => handleInputChange(e)}
                            value={formFields.password}
                          />
                        </FormGroup>
                        <FormGroup className="form-group mt-3">
                          <Input
                            required
                            type="text"
                            name="firstName"
                            placeholder="Name"
                            onChange={e => handleInputChange(e)}
                            value={formFields.firstName}
                          />
                        </FormGroup>
                        <FormGroup className="form-group mt-3">
                          <Input
                            required
                            type="phone"
                            name="phone"
                            placeholder="Phone"
                            onChange={e => handleInputChange(e)}
                            value={formFields.phone}
                          />
                        </FormGroup>
                        <div className="d-flex justify-content-between align-items-center">
                          <Button
                            size="lg"
                            color="dark"
                            className="btn btn-outline btn-lg"
                            type="submit"
                            outline
                            onClick={() => setShowSignIn(true)}
                          >
                            Back
                          </Button>
                          <Button
                            size="lg"
                            className="btn black-btn btn-lg"
                            type="submit"
                          >
                            Sign up
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </Col>
              </Row>
            </>
          )}
          {step === 2 && (
            <>
              <Row>
                <Col md="8">
                  <p className="font-md">Ready For Checkout</p>
                  {cartStateData.length > 0 && checkoutCartOrders.length ? (
                    <>
                      <div
                        className="cards-container"
                        style={{
                          height: underMinimumOrders.length ? '250px' : '450px'
                        }}
                      >
                        {checkoutCartOrders.map(
                          order =>
                            order.lineItems.length > 0 && (
                              <CheckoutCard
                                key={order.id}
                                heading={order.sellerName}
                                subHeading="Check out this brand"
                                data={order.lineItems}
                                removeFromCartHandler={removeFromCartHandler}
                              />
                            )
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <img
                        src="/assets/images/graphic_cart_icon.png"
                        className="img-fluid"
                        alt="cart"
                        width={50}
                        height={50}
                      />
                      <p className="">
                        You have no ready for checkout item yet
                      </p>
                    </div>
                  )}
                  {cartStateData.length > 0 && underMinimumOrders.length ? (
                    <>
                      <hr />
                      <p className="font-md">Minimum Order Volume</p>
                      <div className="cards-container">
                        {underMinimumOrders.map(order => (
                          <CheckoutCard
                            key={order.id}
                            data={order.lineItems}
                            heading={order.sellerName}
                            subHeading={`$${order.minimumOrderAmount -
                              order.itemTotal} Under Minimum`}
                            removeFromCartHandler={removeFromCartHandler}
                            isMinimum
                            redirect={() => back()}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </Col>
                <Col md={4}>
                  <CartSummary data={checkoutCartOrders} />
                </Col>
              </Row>
              <Row>
                <Col md="8">
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      size="lg"
                      color="dark"
                      className="btn btn-outline btn-lg"
                      type="submit"
                      outline
                      onClick={() => back()}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="btn black-btn btn-lg"
                      type="submit"
                      onClick={() => setStep(prevStep => prevStep + 1)}
                      disabled={checkoutCartOrders.length === 0}
                    >
                      Confirm
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          )}
          {step === 3 && (
            <Row>
              <Col md={8}>
                <Formik
                  initialValues={{
                    address1: cartStateData[0].billingAddressLineOne,
                    address2: cartStateData[0].billingAddressLineTwo,
                    country: cartStateData[0].billingCountry,
                    state: cartStateData[0].billingState,
                    city: cartStateData[0].billingCity,
                    zipCode: cartStateData[0].billingPostalCode
                  }}
                  validationSchema={addressSchema}
                  onSubmit={billingAddressHandler}
                >
                  {prop => (
                    <form onSubmit={prop.handleSubmit}>
                      <p className="font-md">Billing Address</p>
                      <FormGroup className="form-group mt-3">
                        <Input
                          type="text"
                          name="address1"
                          placeholder="Address Line 1"
                          onChange={prop.handleChange}
                          value={prop.values.address1}
                        />
                        {prop.touched.address1 && prop.errors.address1 && (
                          <span className="invalid-feedback d-block">
                            {prop.errors.address1}
                          </span>
                        )}
                      </FormGroup>
                      <FormGroup className="form-group">
                        <Input
                          type="text"
                          name="address2"
                          placeholder="Address Line 2"
                          onChange={prop.handleChange}
                          value={prop.values.address2}
                        />
                        {prop.touched.address2 && prop.errors.address2 && (
                          <span className="invalid-feedback d-block">
                            {prop.errors.address2}
                          </span>
                        )}
                      </FormGroup>
                      <Row>
                        <Col md={6}>
                          <FormGroup className="form-group">
                            <Input
                              type="name"
                              name="city"
                              placeholder="City"
                              onChange={prop.handleChange}
                              value={prop.values.city}
                            />
                            {prop.touched.city && prop.errors.city && (
                              <span className="invalid-feedback d-block">
                                {prop.errors.city}
                              </span>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="form-group">
                            <Input
                              type="text"
                              name="state"
                              placeholder="State"
                              onChange={prop.handleChange}
                              value={prop.values.state}
                            />
                            {prop.touched.state && prop.errors.state && (
                              <span className="invalid-feedback d-block">
                                {prop.errors.state}
                              </span>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup className="form-group">
                            <Input
                              type="name"
                              name="zipCode"
                              placeholder="Zip Code"
                              onChange={prop.handleChange}
                              value={prop.values.zipCode}
                            />
                            {prop.touched.zipCode && prop.errors.zipCode && (
                              <span className="invalid-feedback d-block">
                                {prop.errors.zipCode}
                              </span>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="form-group">
                            <Input
                              type="text"
                              name="country"
                              placeholder="Country"
                              onChange={prop.handleChange}
                              value={prop.values.country}
                            />
                            {prop.touched.country && prop.errors.country && (
                              <span className="invalid-feedback d-block">
                                {prop.errors.country}
                              </span>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button
                          size="lg"
                          color="dark"
                          className="btn btn-outline btn-lg"
                          outline
                          onClick={() => setStep(prevStep => prevStep - 1)}
                        >
                          Back
                        </Button>
                        <Button
                          size="lg"
                          className="btn black-btn btn-lg"
                          type="submit"
                        >
                          {prop.isSubmitting ? (
                            <Spinner
                              style={{ width: '21px', height: '21px' }}
                              color="white"
                            />
                          ) : (
                            'Confirm'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </Formik>
              </Col>
              <Col md={4}>
                <CartSummary data={checkoutCartOrders} />
              </Col>
            </Row>
          )}
          {step === 4 && (
            <Row>
              <Col lg={8}>
                <Formik
                  initialValues={{
                    address1: cartStateData[0].shippingAddressLineOne,
                    address2: cartStateData[0].shippingAddressLineTwo,
                    country: cartStateData[0].shippingCountry,
                    state: cartStateData[0].shippingState,
                    city: cartStateData[0].shippingCity,
                    zipCode: cartStateData[0].shippingPostalCode
                  }}
                  validationSchema={addressSchema}
                  onSubmit={shippingAddressHandler}
                >
                  {prop => (
                    <form onSubmit={prop.handleSubmit}>
                      <p className="font-md">Shipping Address</p>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input h-auto"
                          id="sameAsBillingAddress"
                          onChange={e => {
                            setSameAsBillingAddress(e.target.checked)
                            handleSameBillingAddressCheck(e, prop)
                          }}
                          checked={sameAsBillingAddress}
                        />
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label
                          className="form-check-label"
                          htmlFor="sameAsBillingAddress"
                        >
                          Same as Billing Address
                        </label>
                      </div>
                      <FormGroup className="form-group mt-3">
                        <Input
                          type="text"
                          name="address1"
                          placeholder="Address Line 1"
                          onChange={prop.handleChange}
                          value={
                            sameAsBillingAddress
                              ? cartStateData[0].billingAddressLineOne
                              : prop.values.address1
                          }
                        />
                        {prop.touched.address1 && prop.errors.address1 && (
                          <span className="invalid-feedback d-block">
                            {prop.errors.address1}
                          </span>
                        )}
                      </FormGroup>
                      <FormGroup className="form-group">
                        <Input
                          type="text"
                          name="address2"
                          placeholder="Address Line 2"
                          onChange={prop.handleChange}
                          value={
                            sameAsBillingAddress
                              ? cartStateData[0].billingAddressLineTwo
                              : prop.values.address2
                          }
                        />
                        {prop.touched.address2 && prop.errors.address2 && (
                          <span className="invalid-feedback d-block">
                            {prop.errors.address2}
                          </span>
                        )}
                      </FormGroup>
                      <Row>
                        <Col md={6}>
                          <FormGroup className="form-group">
                            <Input
                              type="name"
                              name="city"
                              placeholder="City"
                              onChange={prop.handleChange}
                              value={
                                sameAsBillingAddress
                                  ? cartStateData[0].billingCity
                                  : prop.values.city
                              }
                            />
                            {prop.touched.city && prop.errors.city && (
                              <span className="invalid-feedback d-block">
                                {prop.errors.city}
                              </span>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="form-group">
                            <Input
                              type="text"
                              name="state"
                              placeholder="State"
                              onChange={prop.handleChange}
                              value={
                                sameAsBillingAddress
                                  ? cartStateData[0].billingState
                                  : prop.values.state
                              }
                            />
                            {prop.touched.state && prop.errors.state && (
                              <span className="invalid-feedback d-block">
                                {prop.errors.state}
                              </span>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup className="form-group">
                            <Input
                              type="name"
                              name="zipCode"
                              placeholder="Zip Code"
                              onChange={prop.handleChange}
                              value={
                                sameAsBillingAddress
                                  ? cartStateData[0].billingPostalCode
                                  : prop.values.zipCode
                              }
                            />
                            {prop.touched.zipCode && prop.errors.zipCode && (
                              <span className="invalid-feedback d-block">
                                {prop.errors.zipCode}
                              </span>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="form-group">
                            <Input
                              type="text"
                              name="country"
                              placeholder="Country"
                              onChange={prop.handleChange}
                              value={
                                sameAsBillingAddress
                                  ? cartStateData[0].billingCountry
                                  : prop.values.country
                              }
                            />
                            {prop.touched.country && prop.errors.country && (
                              <span className="invalid-feedback d-block">
                                {prop.errors.country}
                              </span>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button
                          size="lg"
                          color="dark"
                          className="btn btn-outline btn-lg"
                          outline
                          onClick={() => setStep(prevStep => prevStep - 1)}
                        >
                          Back
                        </Button>
                        <Button
                          size="lg"
                          className="btn black-btn btn-lg"
                          type="submit"
                        >
                          {prop.isSubmitting ? (
                            <Spinner
                              style={{ width: '21px', height: '21px' }}
                              color="white"
                            />
                          ) : (
                            'Confirm'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </Formik>
              </Col>
              <Col md={4}>
                <CartSummary data={checkoutCartOrders} />
              </Col>
            </Row>
          )}
          {cartStateData[0]?.buyerCompany?.credits > 0 ? (
            <>
              {step === 5 && (
                <Row>
                  <Col lg={8}>
                    <p className="font-md font-weight-bold mb-1">
                      Would you like to apply your credits?
                    </p>
                    <p className="font-md">
                      You have ${cartStateData[0]?.buyerCompany?.credits} in
                      credits available now
                    </p>
                    <ApplyCredits
                      cartData={cartData}
                      checkoutCartOrders={checkoutCartOrders}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button
                        size="lg"
                        color="dark"
                        className="btn btn-outline btn-lg"
                        outline
                        onClick={() => setStep(prevStep => prevStep - 1)}
                      >
                        Back
                      </Button>
                      <Button
                        size="lg"
                        className="btn black-btn btn-lg"
                        type="button"
                        onClick={() => setStep(prevStep => prevStep + 1)}
                      >
                        Confirm
                      </Button>
                    </div>
                  </Col>
                  <Col md={4}>
                    <CartSummary data={checkoutCartOrders} />
                  </Col>
                </Row>
              )}
              {step === 6 && (
                <Row>
                  <Col lg={8}>
                    <p className="font-md font-weight-bold mb-1">Add Notes</p>
                    <AddNotes cartStateData={cartStateData} setStep={setStep} />
                  </Col>
                  <Col md={4}>
                    <CartSummary data={checkoutCartOrders} />
                  </Col>
                </Row>
              )}
              {step === 7 && (
                <div className="card payment-card">
                  <h5>Payment Details</h5>
                  {buyerPaymentMethod?.data?.findBuyerPaymentMethods
                    ?.paymentMethods && (
                    <div
                      className="row ml-1 mt-3"
                      onChange={e => setCardType(e.target.value)}
                    >
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="radio radio-before">
                        <span className="radio__input">
                          <input
                            type="radio"
                            name="radio"
                            value="e"
                            checked={cardType === 'e'}
                          />
                          <span className="radio__control" />
                        </span>
                        <span className="radio__label">Existing Card</span>
                      </label>
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="radio radio-before ml-3">
                        <span className="radio__input">
                          <input
                            type="radio"
                            name="radio"
                            value="n"
                            checked={cardType === 'n'}
                          />
                          <span className="radio__control" />
                        </span>
                        <span className="radio__label">New Card</span>
                      </label>
                    </div>
                  )}
                  {cardType === 'e' ? (
                    <>
                      {buyerPaymentMethod?.data?.findBuyerPaymentMethods?.paymentMethods.map(
                        itm => (
                          <div className="row ml-1 mb-2" key={itm.id}>
                            <div className="card credit-card col-5">
                              <div className="row">
                                <img
                                  src="/assets/images/credit-card.svg"
                                  alt="credit-card"
                                />
                                <p className="m-auto">{`${itm.brand
                                  .charAt(0)
                                  .toUpperCase()}${itm.brand.slice(1)}`}</p>
                                <p className="m-auto">
                                  *** *** *** ***{itm.last4}
                                </p>
                              </div>
                            </div>
                            <div className="card credit-card col-2 ml-2">
                              <p className="m-auto">
                                {itm.expMonth}/{itm.expYear}
                              </p>
                            </div>
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label className="radio radio-before my-auto ml-3">
                              <span className="radio__input">
                                <input
                                  type="radio"
                                  name="card"
                                  value={itm.id}
                                  checked={selectedCardId === itm.id}
                                  onChange={e => setCardId(e.target.value)}
                                />
                                <span className="radio__control" />
                              </span>
                            </label>
                          </div>
                        )
                      )}
                      <div className="d-flex mt-3">
                        <Button
                          size="lg"
                          color="dark"
                          className="btn btn-outline btn-lg mr-3"
                          outline
                          onClick={() => setStep(prevStep => prevStep - 1)}
                        >
                          Back
                        </Button>
                        <Button
                          size="lg"
                          className="btn black-btn btn-lg my-auto mx-auto"
                          type="button"
                          disabled={orderAuthLoading || completeOrderLoading}
                          onClick={handleSubmitPayment}
                        >
                          Pay
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Elements stripe={stripePromise}>
                        <div className="">
                          <CheckoutForm
                            setStep={setStep}
                            orderIds={cartStateData.map(itm => itm.id)}
                            buyerPaymentMethod={buyerPaymentMethod}
                          />
                        </div>
                      </Elements>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {step === 5 && (
                <Row>
                  <Col lg={8}>
                    <p className="font-md font-weight-bold mb-1">Add Notes</p>
                    <AddNotes cartStateData={cartStateData} setStep={setStep} />
                  </Col>
                  <Col md={4}>
                    <CartSummary data={checkoutCartOrders} />
                  </Col>
                </Row>
              )}
              {step === 6 && (
                <div className="card payment-card">
                  <h5>Payment Details</h5>
                  {buyerPaymentMethod?.data?.findBuyerPaymentMethods
                    ?.paymentMethods && (
                    <div
                      className="row ml-1 mt-3"
                      onChange={e => setCardType(e.target.value)}
                    >
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="radio radio-before">
                        <span className="radio__input">
                          <input
                            type="radio"
                            name="radio"
                            value="e"
                            checked={cardType === 'e'}
                          />
                          <span className="radio__control" />
                        </span>
                        <span className="radio__label">Existing Card</span>
                      </label>
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="radio radio-before ml-3">
                        <span className="radio__input">
                          <input
                            type="radio"
                            name="radio"
                            value="n"
                            checked={cardType === 'n'}
                          />
                          <span className="radio__control" />
                        </span>
                        <span className="radio__label">New Card</span>
                      </label>
                    </div>
                  )}
                  {cardType === 'e' ? (
                    <>
                      {buyerPaymentMethod?.data?.findBuyerPaymentMethods?.paymentMethods.map(
                        itm => (
                          <div className="row ml-1 mb-2" key={itm.id}>
                            <div className="card credit-card col-5">
                              <div className="row">
                                <img
                                  src="/assets/images/credit-card.svg"
                                  alt="credit-card"
                                />
                                <p className="m-auto">{`${itm.brand
                                  .charAt(0)
                                  .toUpperCase()}${itm.brand.slice(1)}`}</p>
                                <p className="m-auto">
                                  *** *** *** ***{itm.last4}
                                </p>
                              </div>
                            </div>
                            <div className="card credit-card col-2 ml-2">
                              <p className="m-auto">
                                {itm.expMonth}/{itm.expYear}
                              </p>
                            </div>
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label className="radio radio-before my-auto ml-3">
                              <span className="radio__input">
                                <input
                                  type="radio"
                                  name="card"
                                  value={itm.id}
                                  checked={selectedCardId === itm.id}
                                  onChange={e => setCardId(e.target.value)}
                                />
                                <span className="radio__control" />
                              </span>
                            </label>
                          </div>
                        )
                      )}
                      <div className="d-flex mt-3">
                        <Button
                          size="lg"
                          color="dark"
                          className="btn btn-outline btn-lg mr-3"
                          outline
                          onClick={() => setStep(prevStep => prevStep - 1)}
                        >
                          Back
                        </Button>
                        <Button
                          size="lg"
                          className="btn black-btn btn-lg my-auto mx-auto"
                          type="button"
                          disabled={orderAuthLoading || completeOrderLoading}
                          onClick={handleSubmitPayment}
                        >
                          Pay
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Elements stripe={stripePromise}>
                        <div className="">
                          <CheckoutForm
                            setStep={setStep}
                            orderIds={cartStateData.map(itm => itm.id)}
                            buyerPaymentMethod={buyerPaymentMethod}
                          />
                        </div>
                      </Elements>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="product-section pb-2 d-flex justify-content-between">
            <h4>Cart</h4>
            <div>
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="cart-icon icon-button"
                onClick={() => onClose()}
              />
            </div>
          </div>
          <div
            className="product-section text-center"
            style={{ padding: '180px' }}
          >
            <img
              src="/assets/images/graphic_cart_icon.png"
              className="img-fluid"
              alt="cart"
              width={100}
              height={120}
            />
            <h4 className="pb-2">You have not added any items yet</h4>
            <Button
              onClick={() => back()}
              className="addTocart-btn w-50 m-auto"
            >
              Continue Shopping
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default Checkout
