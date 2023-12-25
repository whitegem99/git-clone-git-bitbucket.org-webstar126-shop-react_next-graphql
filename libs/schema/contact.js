import * as Yup from 'yup'

export const createValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  businessName: '',
  businessAddress: '',
  website: ''
}

export const createSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string()
    .typeError('Must be an email')
    .required('Email is required'),
  phone: Yup.string()
    .typeError('Price must be a number')
    .required('Price is required'),
  businessName: Yup.string().required('Business Name is required'),
  businessAddress: Yup.string().required('Business Name is required'),
  website: Yup.string().required('Website is required')
  // images: Yup.array()
  //   .min(1, 'Image is required')
  //   .of(Yup.string())
  //   .required('Image is required')
})

export const createVariantOptionValue = {
  optionType: '',
  optionValue: ''
}

export const createVariantValue = {
  sku: '',
  price: '',
  barcode: '',
  stockCount: '',
  images: [],
  variantOptionsAttributes: []
}

export const updateSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  sku: Yup.string().required('Sku is required'),
  price: Yup.number().required('Price is required'),
  description: Yup.string().required('Description is required'),
  defaultDiscountPercentage: Yup.number()
    .min(0)
    .max(100)
    .typeError('Percentage must be a number')
    .required('Default discount is required'),
  flashsaleDiscountPercentage: Yup.number()
    .min(0)
    .max(100)
    .typeError('Percentage must be a number')
    .required('Flash sale discount is required')
})

export const updateVariantSchema = Yup.object().shape({
  sku: Yup.string().required('Sku is required'),
  price: Yup.number().required('Price is required'),
  barcode: Yup.string().required('Barcode is required'),
  stockCount: Yup.string().required('Stock count is required'),
  images: Yup.array()
    .min(1, 'Image is required')
    .of(Yup.string())
    .required('Stock count is required'),
  variantOptionsAttributes: Yup.array().of(
    Yup.object().shape({
      optionType: Yup.string().required('Option is required'),
      optionValue: Yup.string().required('Option value is required')
    })
  )
})

export const bulkUploadSchema = Yup.object().shape({
  inputFile: Yup.array()
    .min(1, 'Contact CSV File is required')
    .of(Yup.string())
    .required('Contact CSV File is required')
})
