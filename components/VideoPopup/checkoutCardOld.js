import React, { useState } from 'react'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import get from 'lodash/get'
import { useMutation } from '@apollo/react-hooks'

import { UPDATECART } from '../../libs/graphql/showroom'

const PopupTile = params => {
  const { product, removeFromCartHandler } = params
  const [inputVal, setInputVal] = useState(product?.itemQuantity)

  const [orderUpdate] = useMutation(UPDATECART)

  const addToCartHandler = async () => {
    const values = {
      lineItemId: product.id,
      quantity: parseInt(inputVal, 10)
    }
    const {
      data: {
        orderUpdateLineItem: { errors }
      }
    } = await orderUpdate({ variables: values })

    if (errors) {
      const error = get(errors, '0.message.0', null)
      return toast(error)
    }
    return true
  }

  const handleKeypress = e => {
    const characterCode = e.key
    if (characterCode === 'Backspace') return

    const characterNumber = Number(characterCode)
    if (characterNumber >= 0 && characterNumber <= 9) {
      if (e.currentTarget.value && e.currentTarget.value.length) return
      if (characterNumber === 0) e.preventDefault()
    } else {
      e.preventDefault()
    }
  }

  return (
    <>
      <div className="tile-container d-flex align-items-center  justify-content-between">
        <div className="d-flex">
          <div
            className="tile-img"
            style={{
              backgroundImage: `url(${product.variant.image})`
            }}
          />
          <div>
            <div>$ {product.itemPrice}</div>
            <div>{product.variant.name}</div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="font-sm qty-text">
            Qty
            <input
              type="number"
              value={inputVal}
              onKeyDown={handleKeypress}
              onChange={e => setInputVal(e.target.value)}
              onBlur={() => addToCartHandler()}
            />
          </div>
          <FontAwesomeIcon
            icon={faTimes}
            className="next-icon"
            onClick={() => removeFromCartHandler(product.id)}
          />
        </div>
      </div>
    </>
  )
}

const CheckoutCardOld = props => {
  const {
    data,
    heading,
    subHeading,
    isMinimum,
    removeFromCartHandler,
    redirect
  } = props
  return (
    <div className="checkout-card">
      <div
        className={`${
          isMinimum ? `card-header-pink` : `card-header`
        } d-flex justify-content-between`}
      >
        <div className="font-14">{heading}</div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div
          className="font-sm sub-heading"
          onClick={() => (isMinimum ? redirect() : console.log(''))}
        >
          {subHeading}
        </div>
      </div>
      <div className="card-content">
        {!!data &&
          data.length >= 1 &&
          data.map((item, index) => (
            <PopupTile
              key={`item_${index + 1}`}
              product={item}
              removeFromCartHandler={removeFromCartHandler}
            />
          ))}
      </div>
    </div>
  )
}

export default CheckoutCardOld
