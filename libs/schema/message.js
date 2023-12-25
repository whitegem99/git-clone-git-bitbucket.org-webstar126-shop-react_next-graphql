import * as Yup from 'yup'

export const sendValues = {
  body: ''
}

export const sendSchema = Yup.object().shape({
  body: Yup.string().required('Message is required')
})

export const sendFileValues = {
  attachmentUrl: ''
}

export const sendFileSchema = Yup.object().shape({
  attachmentUrl: Yup.string().required('Attachment is required')
})
