import * as Yup from 'yup'

export const settingsValues = {
  firstName: '',
  lastName: '',
  companyName: '',
  phoneNumber: '',
  addressLineOne: '',
  addressLineTwo: '',
  city: '',
  state: '',
  postalCode: '',
  country: ''
}

export const settingsSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  companyName: Yup.string().required('Company name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  addressLineOne: Yup.string().required('Address Line One is required'),
  addressLineTwo: Yup.string().required('Address Line Two is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string().required('Postal Code is required'),
  country: Yup.string().required('Country is required')
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
