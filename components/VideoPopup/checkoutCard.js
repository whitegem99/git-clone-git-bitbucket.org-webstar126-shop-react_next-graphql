import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import get from 'lodash/get'
import { useMutation } from '@apollo/react-hooks'
import { Col, Row, Table } from 'reactstrap'

import { UPDATECART, ORDER_ADD_PRODUCT_BULK } from '../../libs/graphql/showroom'

import CartTopSummary from './cartTopSummary'

const CartVariantsGrid = ({ option }) => {
  const [inputVal, setInputVal] = useState(option?.itemUnit)

  const [orderUpdate] = useMutation(UPDATECART)

  useEffect(() => {
    setInputVal(option?.itemUnit)
  }, [option?.itemUnit])

  const addToCartHandler = async () => {
    const values = {
      lineItemId: option.itemId,
      unit: parseInt(inputVal, 10)
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
    <tr>
      <td>{option.options}</td>
      <td>
        <input
          type="number"
          className="units mb-0"
          value={inputVal}
          onKeyDown={handleKeypress}
          onChange={e => setInputVal(e.target.value)}
          onBlur={() => addToCartHandler()}
        />
      </td>
      <td>{option.itemQuantity}</td>
      <td>${option.itemPrice}</td>
      <td>${option.itemTotal}</td>
    </tr>
  )
}

const PopupTile = params => {
  const { product, removeFromCartHandler, minimumOrderAmount } = params

  return (
    <>
      <div className="tile-container align-items-center  justify-content-between">
        <div className="d-flex">
          <div
            className="tile-img"
            style={{
              backgroundImage: `url(${product.productImage})`
            }}
          />
          <div>
            <div>{product.productName}</div>
            <div>Min. order: {minimumOrderAmount}</div>
            <div>Qty/Unit: 1 unit is {product.oneUnitToQuantity} Qty</div>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              className="btn-checkout"
              onClick={() => removeFromCartHandler(product.id)}
            >
              Remove
            </button>
          </div>
        </div>
        <div>
          <Row>
            <Col sm="12">
              <Table className="table" bordered>
                <thead>
                  <tr>
                    <th>Options</th>
                    <th>Units</th>
                    <th>Qty</th>
                    <th>WSP</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {!!product.cartVariantsGrid &&
                    product.cartVariantsGrid.length >= 1 &&
                    product.cartVariantsGrid.map((option, index) => (
                      <CartVariantsGrid
                        key={`option_${index + 1}`}
                        option={option}
                      />
                    ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

const CheckoutCard = props => {
  const {
    orderDetails,
    heading,
    subHeading,
    isMinimum,
    removeFromCartHandler,
    redirect,
    setStep,
    setBrand,
    minimumOrderAmount
  } = props

  const { id: orderId, cartProductsGrid } = orderDetails
  const [open, setOpen] = useState(true)
  const [unitArray, setUnitArray] = useState([])
  const [variantIdArray, setVariantIdArray] = useState([])

  const [addProductBulk] = useMutation(ORDER_ADD_PRODUCT_BULK)

  const togglePanel = () => {
    setOpen(!open)
  }

  useEffect(() => {
    const tmpArrayId = []
    const tmpArrayUnit = []
    orderDetails.cartProductsGrid.map(itm => {
      itm.cartVariantsGrid.map(product => {
        tmpArrayId.push(product.itemId)
        tmpArrayUnit.push(product.itemUnit)
        return true
      })
      return true
    })
    setUnitArray(tmpArrayUnit)
    setVariantIdArray(tmpArrayId)
  }, [orderDetails])

  const orderAddProductBulk = async () => {
    try {
      const {
        data: {
          orderAddProductBulk: { order, errors }
        }
      } = await addProductBulk({
        variables: {
          orderId,
          units: unitArray,
          variantIds: variantIdArray
        }
      })
      if (order) {
        setBrand(orderDetails)
        setStep(prevStep => prevStep + 1)
        return true
      }
      const error = get(errors, '0.message.0', null)
      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }
  return (
    <div className="checkout-card">
      <div
        className={`${
          isMinimum ? `card-header-pink` : `card-header`
        } d-flex justify-content-between align-items-center`}
      >
        <div className="top-left font-14 font-weight-bold">{heading}</div>
        <div className="rightContent">
          <div className="top-right d-flex align-items-center">
            <div className="font-14 cursor-pointer">
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <span onClick={togglePanel}>
                {open ? 'Minimize' : 'Maximize'}
              </span>
            </div>
            <div className="font-sm sub-heading">
              {/* eslint-disable-next-line react/button-has-type */}
              <button
                className={`${!isMinimum ? `btn-checkout` : `btn`}`}
                onClick={() => (isMinimum ? redirect() : orderAddProductBulk())}
              >
                {subHeading}
              </button>
            </div>
          </div>
        </div>
      </div>
      <CartTopSummary order={orderDetails} />
      {open ? (
        <div className="card-content">
          {!!cartProductsGrid &&
            cartProductsGrid.length >= 1 &&
            cartProductsGrid.map((product, index) => (
              <PopupTile
                key={`item_${index + 1}`}
                product={product}
                removeFromCartHandler={removeFromCartHandler}
                orderData={orderDetails}
                minimumOrderAmount={minimumOrderAmount}
              />
            ))}
        </div>
      ) : null}
    </div>
  )
}

export default CheckoutCard
