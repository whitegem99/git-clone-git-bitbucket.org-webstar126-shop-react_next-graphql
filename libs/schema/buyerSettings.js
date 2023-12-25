import * as Yup from 'yup'

export const accountValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  // buyerType: '',
  companyName: '',
  email: '',
  website: ''
}

export const accountSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  companyName: Yup.string().required('Store name is required'),
  phoneNumber: Yup.string().required('Phone number is required')
  // buyerType: Yup.string().required('Store type is required')
})

export const passwordValues = {
  currentPassword: '',
  newPassword: ''
}

export const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6)
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6)
    .required('New password is required')
})

export const billingAddressValues = {
  billingAddressLineOne: '',
  billingAddressLineTwo: '',
  billingCity: '',
  billingState: '',
  billingPostalCode: '',
  billingCountry: ''
}

export const billingAddressSchema = Yup.object().shape({
  billingAddressLineOne: Yup.string().required(
    'Billing address line one is required'
  ),
  billingAddressLineTwo: Yup.string().required(
    'Billing address line two is required'
  ),
  billingCity: Yup.string().required('Billing city is required'),
  billingState: Yup.string().required('Billing state is required'),
  billingCountry: Yup.string().required('Billing country is required'),
  billingPostalCode: Yup.string().required('Billing postal code is required')
})

export const shippingAddressValues = {
  shippingAddressLineOne: '',
  shippingAddressLineTwo: '',
  shippingCity: '',
  shippingState: '',
  shippingPostalCode: '',
  shippingCountry: ''
}

export const shippingAddressSchema = Yup.object().shape({
  shippingAddressLineOne: Yup.string().required(
    'Shipping address line one is required'
  ),
  shippingAddressLineTwo: Yup.string().required(
    'Shipping address line two is required'
  ),
  shippingCity: Yup.string().required('Shipping city is required'),
  shippingState: Yup.string().required('Shipping state is required'),
  shippingCountry: Yup.string().required('Shipping country is required'),
  shippingPostalCode: Yup.string().required('Shipping postal code is required')
})
