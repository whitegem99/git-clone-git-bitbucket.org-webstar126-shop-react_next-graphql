import React from 'react'
import Select from 'react-select'

const MySelect = ({
  id,
  label,
  name,
  options,
  value,
  isMulti,
  error,
  touched,
  onChange,
  onBlur
}) => {
  const handleChange = val => {
    onChange(name, val)
  }

  const handleBlur = () => {
    onBlur(name, true)
  }

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <Select
        id={id}
        name={name}
        options={options}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        isMulti={!!isMulti}
      />
      {!!error && touched && <div className="help-block">{error}</div>}
    </div>
  )
}
export default MySelect
