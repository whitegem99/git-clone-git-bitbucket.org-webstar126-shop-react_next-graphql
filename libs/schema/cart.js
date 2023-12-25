import * as Yup from 'yup'

// eslint-disable-next-line import/prefer-default-export
export const addressSchema = Yup.object().shape({
  address1: Yup.string().required('Address 1 is required'),
  address2: Yup.string().required('Address 2 is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  zipCode: Yup.string().required('ZipCode is required')
})

export const addNotesSchema = Yup.object().shape({
  buyerSignatureName: Yup.string().required('Buyer Name is required')
})
