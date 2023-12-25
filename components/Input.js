import React, { useEffect, useRef } from 'react'
import { useField } from '@unform/core'
import { Input as UiInput } from 'reactstrap'

const Input = ({ name, ...rest }) => {
  const input = useRef(null)
  const { fieldName, defaultValue = '', registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: input.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  return (
    <>
      <UiInput innerRef={input} defaultValue={defaultValue} {...rest} />
      {error && <span className="error">{error}</span>}
    </>
  )
}

export default Input
