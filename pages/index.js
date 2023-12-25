import React, { useMemo, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'

import withApollo from '../libs/apollo'
import withAuth from '../libs/auth'
import Header from '../components/Header'
import { getToken } from '../libs/util'
import { GETCARTDATA } from '../libs/graphql/showroom'
import ShowroomHeader from '../components/ShowroomHeader'

import BuyerHome from './home'

const HomePage = () => {
  const token = getToken()
  const [isPopUpShow, setPopUpShow] = useState(false)
  const [cartStateData, setCartStateData] = useState([])
  const [isCartOpen, setCartOpen] = useState(false)
  let cartDetailsData
  if (token) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    cartDetailsData = useQuery(GETCARTDATA, {
      variables: {
        page: 1
      }
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMemo(() => {
      const cartData = get(cartDetailsData.data, 'findCartDetails.orders') || []
      const cartItems = []
      if (cartData.length) {
        cartData.map(
          itm =>
            itm.lineItems.length &&
            itm.lineItems.map(item => cartItems.push(item))
        )
      }
      setCartStateData(cartItems)
    }, [cartDetailsData.data])
  }

  return (
    <div className="app-outer">
      {token ? (
        <ShowroomHeader
          isPopUpShow={isPopUpShow}
          setPopUpShow={setPopUpShow}
          cartStateData={cartStateData}
          cartDetailsData={cartDetailsData}
        />
      ) : (
        <Header isCartOpen={isCartOpen} setCartOpen={setCartOpen} />
      )}
      <div className="main">
        <BuyerHome setPopUpShow={setPopUpShow} />
      </div>
    </div>
  )
}

export default withApollo(withAuth(HomePage))
