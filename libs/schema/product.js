import * as Yup from 'yup'

export const createValues = {
  sku: '',
  name: '',
  price: '',
  productPageUrl: '',
  images: []
}

export const createSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  sku: Yup.string().required('Sku is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .required('Price is required'),
  productPageUrl: Yup.string().required('Product page url is required'),
  images: Yup.array()
    .min(1, 'Image is required')
    .of(Yup.string())
    .required('Image is required')
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
    .min(1, 'Product CSV File is required')
    .of(Yup.string())
    .required('Product CSV File is required')
})
