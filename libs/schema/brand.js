import * as Yup from 'yup'

export const sendValues = {
  brandName: '',
  website: '',
  logo: ''
}

export const sendSchema = Yup.object().shape({
  brandName: Yup.string().required('Name is required'),
  website: Yup.string().required('Website is required'),
  logo: Yup.string().required('logo is required')
})

export const cssUploadSchema = Yup.object().shape({
  cssFile: Yup.string().required('Css file is required')
})
