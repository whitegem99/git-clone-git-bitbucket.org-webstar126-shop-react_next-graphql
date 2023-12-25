import { useMutation } from '@apollo/react-hooks'
import get from 'lodash/get'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Spinner,
  Row,
  Col,
  FormGroup,
  Label
} from 'reactstrap'
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import withApollo from '../../libs/apollo'
import { FORGOT_PASSWORD } from '../../libs/graphql/auth'
import { forgotPasswordSchema } from '../../libs/schema/auth'

const ForgotPasswordForm = ({
  showForgotPasswordForm,
  toggleForgotPasswordForm
}) => {
  const [companyForgotPassword] = useMutation(FORGOT_PASSWORD)

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const {
        data: {
          buyerForgotPassword: { buyer, errors }
        }
      } = await companyForgotPassword({ variables: values })

      setSubmitting(false)

      if (buyer) {
        toggleForgotPasswordForm()
        return toast.success(
          'We have sent an email to reset your password. Please check your email and follow the instructions.'
        )
      }
      const error = get(errors, '0.promoter.0', null)
      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  return (
    <Modal
      isOpen={showForgotPasswordForm}
      toggle={toggleForgotPasswordForm}
      className="round"
    >
      <ModalHeader className="forgot-pw-primary-background-header">
        Forgot Password
        <button
          type="button"
          className="no-opacity button-link d-flex ml-auto"
          onClick={toggleForgotPasswordForm}
        >
          <i className="fpq-close" />
        </button>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md="12">
            <Formik
              initialValues={{
                email: ''
              }}
              validationSchema={forgotPasswordSchema}
              onSubmit={onSubmit}
            >
              {props => (
                <form className="pq-form" onSubmit={props.handleSubmit}>
                  <div>
                    <FormGroup className="form-group">
                      <Label>Email</Label>
                      <Input
                        type="text"
                        name="email"
                        onChange={props.handleChange}
                        value={props.values.email}
                      />
                      {props.touched.email && props.errors.email && (
                        <span className="invalid-feedback d-block">
                          {props.errors.email}
                        </span>
                      )}
                    </FormGroup>
                  </div>
                  <div className="mt-5">
                    <button
                      type="submit"
                      className="btn btn-red btn-rounded btn-lg ml-auto mr-auto"
                    >
                      {props.isSubmitting ? (
                        <Spinner
                          style={{ width: '21px', height: '21px' }}
                          color="white"
                        />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default withApollo(ForgotPasswordForm)
