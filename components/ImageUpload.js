import React, { useRef, useState, useEffect } from 'react'
import { useField } from '@unform/core'

import Uploader from './Review/Uploader'

const Input = ({ name }) => {
  const uploader = useRef(null)
  const [defaultValue, setDefault] = useState('')
  const { fieldName, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: uploader.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  return (
    <>
      <input ref={uploader} type="hidden" defaultValue={defaultValue} />
      <div className="pq-file_uploader">
        <Uploader name={name} setFieldValue={setDefault} />
      </div>
      {error && <span className="error">{error}</span>}
    </>
  )
}

export default Input
