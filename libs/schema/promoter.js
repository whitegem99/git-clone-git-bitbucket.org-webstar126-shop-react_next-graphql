import * as Yup from 'yup'

export const sendValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  employeeCode: '',
  password: '',
  passwordConfirmation: ''
}

export const sendSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email()
    .required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  password: Yup.string()
    .min(6)
    .required('Password is required'),
  passwordConfirmation: Yup.string()
    .min(6)
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Password confirmation is required')
})

export const sendInviteValues = {
  promoterId: '',
  brandIds: []
}

export const sendInviteSchema = Yup.object().shape({
  promoterId: Yup.string().required('Promoter is required'),
  brandIds: Yup.array()
    .of(Yup.string().min(1))
    .nullable()
    .required('Brand is required')
})
