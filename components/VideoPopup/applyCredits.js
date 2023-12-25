import React, { useEffect, useState } from 'react'
import { Button, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { useMutation } from '@apollo/react-hooks'
import get from 'lodash/get'
import { toast } from 'react-toastify'

import { ORDER_APPLY_CREDIT } from '../../libs/graphql/showroom'

const ApplyCredits = props => {
  const {
    // checkoutCartOrders,
    cartData,
    selectedBrand
  } = props

  const [brandsArray, setBrandsArray] = useState([])

  const [orderApplyCredit] = useMutation(ORDER_APPLY_CREDIT)

  useEffect(() => {
    // const tmp = checkoutCartOrders.map(order => {
    //   return {
    //     id: order.id,
    //     brandName: order.sellerName,
    //     credit: ''
    //   }
    // })
    const tmp = [
      {
        id: selectedBrand.id,
        brandName: selectedBrand.sellerName,
        credit: ''
      }
    ]
    setBrandsArray(tmp)
  }, [])

  const handleChange = (e, key) => {
    const tmp = [...brandsArray]
    tmp[key].credit = e.target.value
    setBrandsArray(tmp)
  }

  const handleApply = async (e, key) => {
    e.preventDefault()
    try {
      const {
        data: {
          orderApplyCredits: { order, errors }
        }
      } = await orderApplyCredit({
        variables: {
          orderId: brandsArray[key].id,
          creditsApplied: parseInt(brandsArray[key].credit, 10)
        }
      })

      if (order) {
        await cartData.refetch()
        return toast('Credit Applied')
      }

      const error = get(errors, '0.message.0', null)
      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  return (
    <form>
      {brandsArray &&
        brandsArray.map((itm, key) => (
          <Row key={itm.brandName}>
            <Col md={9}>
              <FormGroup className="form-group">
                <Label for="exampleEmail">{itm.brandName}</Label>
                <Input
                  type="number"
                  name="credit"
                  placeholder="Credit"
                  value={itm.credit}
                  onChange={e => handleChange(e, key)}
                />
              </FormGroup>
            </Col>
            <Col md={3} className="align-self-center">
              <Button className="apply-btn" onClick={e => handleApply(e, key)}>
                Apply
              </Button>
            </Col>
          </Row>
        ))}
    </form>
  )
}

export default ApplyCredits
