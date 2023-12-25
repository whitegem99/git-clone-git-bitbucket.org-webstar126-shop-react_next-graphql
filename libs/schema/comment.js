import * as Yup from 'yup'

export const createValues = {
  body: '',
  brandId: ''
}

export const createSchema = Yup.object().shape({
  body: Yup.string().required('body is required'),
  brandId: Yup.string().required('brandId Name is required')
})
