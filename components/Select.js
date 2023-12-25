import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useField } from '@unform/core'
import ReactResponsiveSelect from 'react-responsive-select'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Select = ({ name, ...rest }) => {
  const select = useRef(null)
  const [selected, setSelected] = useState('')
  const { fieldName, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: select.current,
      path: 'state.singleSelectSelectedOption.value',
      getValue: ref => {
        if (!ref.state.singleSelectSelectedOption.value) {
          return ''
        }

        return ref.state.singleSelectSelectedOption.value
      }
    })
  }, [fieldName, registerField, rest.multiselect])

  const onChange = useCallback(value => {
    if (selected !== value.value) setSelected(value.value)
  }, [])

  return (
    <>
      <ReactResponsiveSelect
        ref={select}
        name={name}
        selectedValue={selected}
        onChange={onChange}
        caretIcon={<FontAwesomeIcon icon={faAngleDown} key="one" />}
        {...rest}
      />
      {error && <span className="error">{error}</span>}
    </>
  )
}

export default Select
