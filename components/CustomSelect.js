import React from 'react'
import Select from 'react-select'

import SelectCustomStyles from '../styles/SelectCustomStyles'

const MySelect = ({
  id,
  name,
  label,
  options,
  value,
  isMulti,
  error,
  touched,
  onChange,
  onBlur
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <Select
        styles={SelectCustomStyles}
        id={id}
        name={name}
        options={options}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        isMulti={!!isMulti}
      />
      {!!error && touched && <div className="help-block">{error}</div>}
    </div>
  )
}
export default MySelect
