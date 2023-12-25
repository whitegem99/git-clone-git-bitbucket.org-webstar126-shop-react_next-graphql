import * as Yup from 'yup'

export const registerValues = {
  firstName: '',
  lastName: '',
  email: '',
  website: '',
  einNumber: '',
  resellerCertificate: '',
  companyName: '',
  phoneNumber: '',
  password: '',
  passwordConfirmation: ''
}

export const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required'),
  website: Yup.string().required('website is required'),
  einNumber: Yup.string()
    .matches(/^[0-9]+$/, 'EIN number must be only digits')
    .min(9, 'EIN number must be exactly 9 digits')
    .max(9, 'EIN number must be exactly 9 digits')
    .required('EIN number is required'),
  resellerCertificate: Yup.string().required(
    'Reseller certificate is required'
  ),
  companyName: Yup.string().required('Company name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  passwordConfirmation: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Password confirmation is required')
})

export const loginValues = {
  email: '',
  password: ''
}

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6)
    .required('Password is required')
})

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required')
})

export const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  passwordConfirmation: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
    .required('Password confirmation is required')
})
