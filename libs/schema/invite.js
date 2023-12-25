import * as Yup from 'yup'

// eslint-disable-next-line import/prefer-default-export
export const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email()
    .required('Email is required'),
  companyName: Yup.string().required('Company name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  password: Yup.string()
    .min(6)
    .required('Password is required'),
  passwordConfirmation: Yup.string()
    .min(6)
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Password confirmation is required'),
  website: Yup.string().required('Website is required')
})
