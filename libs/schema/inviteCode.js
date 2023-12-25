import * as Yup from 'yup'

export const inviteCodeValues = {
  condition: 'yes',
  inviteCode: ''
}

export const inviteCodeSchema = Yup.object().shape({
  condition: Yup.string().required('Please select yes or no'),
  inviteCode: Yup.string().when('condition', {
    is: 'yes',
    then: Yup.string().required('Invite code is required')
  })
})
