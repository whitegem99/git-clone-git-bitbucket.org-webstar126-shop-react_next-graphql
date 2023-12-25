import * as Yup from 'yup'

export const updateValues = {
  title: ''
}

export const updateSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  bannerUrl: Yup.string().required('Banner is required')
})

export const changeValues = {
  title: ''
}

export const changeSchema = Yup.object().shape({
  message: Yup.string().required('Comment is required')
})

export const createPullPushSchema = Yup.object().shape({
  targetUrl: Yup.string().required('Target URL is required'),
  imageUrl: Yup.string().required('Image is required')
})
