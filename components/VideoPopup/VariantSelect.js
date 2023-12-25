import React from 'react'
import Select from 'react-select'

const customSelectStyles = {
  container: provided => ({
    ...provided,
    width: '90%',
    marginBottom: 10,
    fontSize: 14,
    minWidth: 100
  }),
  clearIndicator: base => ({
    ...base,
    padding: '5px 8px',
    cursor: 'pointer'
  }),
  menuPortal: base => ({ ...base, zIndex: 9999 }),
  option: base => ({
    ...base,
    '&:focus': {
      outline: 'none'
    }
  }),

  singleValue: base => ({
    ...base
    // textTransform: "lowercase",
    // "&::first-letter": {
    //     textTransform: "capitalize"
    // }
  }),

  control: base => ({
    ...base,
    height: 'auto',
    minHeight: 40,
    lineHeight: 1,
    boxShadow: 'none',
    border: '1px solid rgba(0,0,0,.2)',
    '&:hover': {
      borderWidth: 1
    },
    '&:focus': {
      outline: 'none'
    }
  }),

  indicatorSeparator: base => ({
    ...base,
    backgroundColor: 'rgba(0,0,0,.2)'
  }),
  dropdownIndicator: base => ({
    ...base,
    padding: '5px 8px',
    color: 'rgba(0,0,0,.2)',
    '&:hover': {
      color: '#EDEDED'
    }
  }),

  valueContainer: base => ({
    ...base,
    padding: '0 15px',
    flexWrap: 'nowrap'
  }),

  placeholder: base => ({
    ...base,
    color: '#BDBDBD',
    fontSize: 'inehrit',
    fontWeight: 300
  }),
  colors: {
    primary: 'red'
  },
  menu: base => ({
    ...base,
    maxHeight: 150
  }),
  menuList: base => ({
    ...base,
    maxHeight: 100,
    zIndex: 999
  })
}

const MySelect = ({
  id,
  name,
  options,
  value,
  isMulti,
  onChange,
  onBlur,
  placeholder
}) => {
  return (
    <Select
      placeholder={placeholder}
      styles={customSelectStyles}
      id={id}
      name={name}
      options={options}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      isMulti={!!isMulti}
    />
  )
}
export default MySelect
