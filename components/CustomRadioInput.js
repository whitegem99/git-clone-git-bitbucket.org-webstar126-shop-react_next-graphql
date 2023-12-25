import { Field } from 'formik'

const CustomRadioInput = ({ value, labelStr, name }) => {
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="radio-input-container">
        {labelStr}
        <Field type="radio" name={name} value={value} />
        <span className="checkmark" />
      </label>
    </>
  )
}

export default CustomRadioInput
