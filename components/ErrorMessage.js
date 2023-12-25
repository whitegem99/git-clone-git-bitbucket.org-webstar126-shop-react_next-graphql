import { ErrorMessage } from 'formik'

const ErrorComponent = ({ name }) => (
  <ErrorMessage name={name}>
    {error => <span className="error">{error}</span>}
  </ErrorMessage>
)

export default ErrorComponent
