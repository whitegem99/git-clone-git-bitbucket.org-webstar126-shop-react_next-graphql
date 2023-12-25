import React from 'react'

const CartSummary = props => {
  const { data, selectedBrand } = props
  let totalPrice = 0
  // data.forEach(order => {
  // eslint-disable-next-line no-unused-expressions
  selectedBrand?.lineItems?.forEach(item => {
    totalPrice += item.total
  })
  // })

  // const brandsPriceArray = data.map(order => {
  //   return {
  //     brandName: order.sellerName,
  //     price: order.itemTotal,
  //     credit: order.creditsApplied
  //   }
  // })

  const brandsPriceArray = [
    {
      brandName: selectedBrand?.sellerName,
      price: selectedBrand?.itemTotal,
      credit: selectedBrand?.creditsApplied
    }
  ]

  return (
    <div className="cart-summary">
      <div className="card-header">
        <div className="font-14">Order Summary</div>
      </div>
      <div className="card-content">
        {brandsPriceArray.length &&
          brandsPriceArray.map(item => (
            <div
              key={item.brandName}
              className="font-14 border-bottom d-flex justify-content-between py-2"
            >
              <span>{item.brandName}</span>
              <span className="bold">${item.price}</span>
            </div>
          ))}
        {brandsPriceArray.length &&
          brandsPriceArray.map(item => (
            <div
              key={item.brandName}
              className="font-14 border-bottom d-flex justify-content-between py-2"
            >
              <span>
                Applied Credit <br /> ({item.brandName})
              </span>
              <span className="bold">${item.credit}</span>
            </div>
          ))}
        <div className="font-14 border-bottom d-flex justify-content-between py-2">
          <span>Subtotal:</span>
          <span className="bold">${totalPrice}</span>
        </div>

        <div className="font-14 border-bottom d-flex justify-content-between py-2">
          <span>Estimated Shipping:</span>
          <span className="bold">
            {data.deliveryTotal ? data.deliveryTotal : 'TBD'}
          </span>
        </div>

        <div className="font-14 d-flex justify-content-between py-2">
          <span>Total Bill:</span>
          <span className="bold">${totalPrice}</span>
        </div>
      </div>
    </div>
  )
}

export default CartSummary
