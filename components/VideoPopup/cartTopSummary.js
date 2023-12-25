import React from 'react'

const CartTopSummary = props => {
  const { order } = props
  const {
    itemTotal,
    creditsApplied,
    deliveryTotal,
    discountTotal,
    total
  } = order

  return (
    <div className="top-cart-summary">
      <div className="card-content d-flex justify-content-between">
        <span>Item Total : ${itemTotal}</span>
        <span>Shipping Total : ${deliveryTotal}</span>
        <span>Applied Credit : ${creditsApplied}</span>
        <span>Discount Total : ${discountTotal}</span>
        <span className="bold">Net Total: ${total}</span>
      </div>
    </div>
  )
}

export default CartTopSummary
