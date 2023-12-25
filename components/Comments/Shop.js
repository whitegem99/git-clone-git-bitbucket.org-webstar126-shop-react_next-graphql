import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import Link from 'next/link'
import { Button, Col, Row } from 'reactstrap'
import Select from 'react-select'
import { toast } from 'react-toastify'
import Router from 'next/router'

import Carousel from '../Carousel'
import { GETMARKETPLACEPRODUCTS } from '../../libs/graphql/marketPlaceBuyer'
import { ADDTOCART } from '../../libs/graphql/showroom'
import Checkout from '../VideoPopup/checkout'

const customSelectStyles = {
  container: provided => ({
    ...provided,
    width: '50%',
    marginBottom: 10,
    marginRight: 10,
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
    color: '#2A2A2A',
    fontSize: 'inehrit',
    fontWeight: 600
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

const ADD_TO_CART = 'Add to Cart'
// const ADDED = 'Remove From Cart'
// const REMOVE = 'Remove?'

const initialCart = [
  {
    product_id: '',
    variant_id: '',
    is_removed: false
  }
]

const Shop = ({
  video,
  token,
  hideShowComments,
  cartProductList,
  cartApiData,
  setPopUpShow
}) => {
  const [productPage, setProductPage] = useState(1)
  const [productsList, setProductsList] = useState([])
  const [productsApiData, setProductsApiData] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [showCheckoutSection, setShowCheckoutSection] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [variantType, setVariantType] = useState([null, null, null])
  const [isAddCart, setAddCart] = useState(true)
  const [cartData, setCartData] = useState([])
  const [checkProduct, setCheckProduct] = useState(initialCart)

  const marketplaceProductData = useQuery(GETMARKETPLACEPRODUCTS, {
    variables: {
      page: productPage,
      videoId: video?.id
    }
  })

  const [addToCart] = useMutation(ADDTOCART)
  // const [removeFromCart] = useMutation(ORDER_REMOVE_PRODUCT)

  useEffect(() => {
    setCartData(cartProductList)
  }, [cartProductList])

  useMemo(() => {
    ;(async () => {
      await setProductsList([])
      const productData =
        get(await marketplaceProductData.data, 'findMarketplaceProducts') || []
      setProductsApiData(productData)
      if (productData.products) setProductsList(productData.products)
    })()
  }, [marketplaceProductData.data])

  const selectProductHandler = async product => {
    if (token) {
      if (cartApiData) {
        await cartApiData?.refetch()
      }
    }
    await setSelectedProduct(product)
    const prodObj =
      cartData &&
      cartData.length > 0 &&
      cartData.filter(item => item.product_id === product.id)
    await setQuantity(1)
    await setCheckProduct(prodObj.length === 0 ? initialCart : prodObj)
  }

  const resetProductSelectionHandler = () => {
    setSelectedProduct(null)
    setSelectedVariant(null)
    setVariantType([null, null, null])
    setAddCart(true)
    setQuantity(null)
  }

  const handleSelectVariant = (value, index) => {
    const tmpArray = [...variantType]
    tmpArray[index] = value.value
    setVariantType(tmpArray)
    if (tmpArray[0] && !tmpArray[1] && !tmpArray[2]) {
      setSelectedVariant(
        selectedProduct.variants.find(itm => itm.option1Value === tmpArray[0])
      )
    }
    if (tmpArray[0] && tmpArray[1] && !tmpArray[2]) {
      let tmpObj
      selectedProduct.variants.map(itm => {
        if (
          itm.option1Value === tmpArray[0] &&
          itm.option2Value === tmpArray[1]
        ) {
          tmpObj = itm
        }
        return ''
      })
      setSelectedVariant(tmpObj)
    }
    if (tmpArray[0] && tmpArray[1] && tmpArray[2]) {
      let tmpObj
      selectedProduct.variants.map(itm => {
        if (
          itm.option1Value === tmpArray[0] &&
          itm.option2Value === tmpArray[1] &&
          itm.option3Value === tmpArray[3]
        ) {
          tmpObj = itm
        }
        return ''
      })
      setSelectedVariant(tmpObj)
    }
    if (
      selectedProduct.productOptionTypes.length === 1 &&
      tmpArray[0] &&
      quantity
    ) {
      setAddCart(false)
    }
    if (
      selectedProduct.productOptionTypes.length === 2 &&
      tmpArray[0] &&
      tmpArray[1] &&
      quantity
    ) {
      setAddCart(false)
    }
    if (
      selectedProduct.productOptionTypes.length === 3 &&
      tmpArray[0] &&
      tmpArray[1] &&
      tmpArray[2] &&
      quantity
    ) {
      setAddCart(false)
    }
  }

  // const handleQuantity = e => {
  //   const { value } = e.target
  //   setQuantity(e.target.value)
  //   if (
  //     selectedProduct.productOptionTypes.length === 1 &&
  //     variantType[0] &&
  //     value
  //   ) {
  //     setAddCart(false)
  //   }
  //   if (
  //     selectedProduct.productOptionTypes.length === 2 &&
  //     variantType[0] &&
  //     variantType[1] &&
  //     value
  //   ) {
  //     setAddCart(false)
  //   }
  //   if (
  //     selectedProduct.productOptionTypes.length === 3 &&
  //     variantType[0] &&
  //     variantType[1] &&
  //     variantType[2] &&
  //     value
  //   ) {
  //     setAddCart(false)
  //   }
  // }

  const resetAndClose = () => {
    resetProductSelectionHandler()
    setShowCheckoutSection(false)
    hideShowComments(null)
    setCheckProduct(initialCart)
  }

  const handleWithoutLogin = () => {
    return Router.replace('/login')
  }

  const addToCartHandler = async () => {
    const values = {
      variantId: selectedVariant
        ? selectedVariant.id
        : selectedProduct.variants[0].id,
      unit: 1
      // quantity: parseInt(quantity)
    }
    try {
      const {
        data: {
          orderAddProduct: { order, errors }
        }
      } = await addToCart({ variables: values })

      if (order) {
        await cartApiData.refetch()
        await setCheckProduct([
          {
            product_id: selectedProduct.id,
            variant_id: selectedVariant
              ? selectedVariant.id
              : selectedProduct.variants[0].id,
            is_removed: false
          }
        ])
        await setPopUpShow(true)
        await setTimeout(async () => {
          await setPopUpShow(false)
        }, 2000)
        return toast('Item Added to cart!')
      }

      const error = get(errors, '0.message.0', null)

      return toast(error || 'Server error')
    } catch (error) {
      return toast('Server error')
    }
  }

  // eslint-disable-next-line consistent-return
  // const removeFromCartHandler = async variantId => {
  //   const values = {
  //     variantId
  //   }
  //   try {
  //     const {
  //       data: {
  //         orderRemoveProduct: { order, errors }
  //       }
  //     } = await removeFromCart({ variables: values })
  //     if (order || !errors) {
  //       await cartApiData.refetch()
  //       await setCheckProduct(initialCart)
  //       await setQuantity(1)
  //       await setPopUpShow(true)
  //       await setTimeout(async () => {
  //         await setPopUpShow(false)
  //       }, 2000)
  //       return toast.success('Item Removed from cart!')
  //     }
  //     if (errors) {
  //       const error = get(errors, '0.message.0', null)
  //       return toast.error(error || 'Server error')
  //     }
  //   } catch (error) {
  //     return toast.error('Server error')
  //   }
  // }

  // const removeCartHandler = async checkProd => {
  //   if (!checkProd.is_removed) {
  //     const data = [...cartData]
  //     const index = data.findIndex(
  //       obj => obj.product_id === checkProd.product_id
  //     )
  //     data[index].is_removed = true
  //     checkProduct[0].is_removed = true
  //     await setCartData(data)
  //     await setCheckProduct(checkProduct)
  //   } else {
  //     await removeFromCartHandler(checkProd.variant_id)
  //     await cartApiData.refetch()
  //   }
  // }

  const handleScroll = async ({ currentTarget }) => {
    if (
      currentTarget.scrollTop + currentTarget.clientHeight >=
      currentTarget.scrollHeight
    ) {
      if (productPage < productsApiData.totalPages) {
        await setProductPage(prevState => prevState + 1)
        const data =
          get(marketplaceProductData.data, 'findMarketplaceProducts') || []
        setProductsApiData(data)
        if (data.products) setProductsList([setProductsList, ...data.products])
      }
    }
  }

  // const handleKeypress = e => {
  //   const characterCode = e.key
  //   if (characterCode === 'Backspace') return
  //
  //   const characterNumber = Number(characterCode)
  //   if (characterNumber >= 0 && characterNumber <= 9) {
  //     if (e.currentTarget.value && e.currentTarget.value.length) return
  //     if (characterNumber === 0) e.preventDefault()
  //   } else {
  //     e.preventDefault()
  //   }
  // }

  return (
    <div className="shop-section" onScroll={e => handleScroll(e)}>
      {console.log(checkProduct)}
      {!showCheckoutSection && (
        <>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div
            className="d-flex cursor-pointer"
            onClick={() => resetProductSelectionHandler()}
          >
            {selectedProduct && !showCheckoutSection && (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
              <img className="mr-2" src="/assets/images/next.svg" alt="arrow" />
            )}
            <h3 className="d-none">Products</h3>
          </div>
        </>
      )}
      {showCheckoutSection && (
        <Checkout
          onClose={resetAndClose}
          back={async () => {
            await setShowCheckoutSection(false)
            await hideShowComments(null)
          }}
        />
      )}
      {selectedProduct && !showCheckoutSection && (
        <div className="product-detail">
          <Carousel images={selectedProduct.images} />
          <h6 className="mt-3 font-white">{selectedProduct.name}</h6>
          {token ? (
            <p className="price font-white">
              Price: {`$${selectedProduct.variants[0].wholesalePrice}`}
            </p>
          ) : (
            <div className="message-input font-white">
              <div className="login-section font-white">
                Price:{' '}
                <Link href="/login">
                  <img alt="lock" src="/assets/images/lock.svg" />
                </Link>
              </div>
            </div>
          )}
          <p
            dangerouslySetInnerHTML={{
              __html: selectedProduct.description
            }}
            className="font-white"
          />
          {selectedProduct.productOptionTypes.length > 0 &&
            selectedProduct.productOptionTypes[0].optionValues.length > 1 && (
              <Row className="mt-3 p-0 m-0 justify-content-center font-white">
                <Col sm="12" className="p-0 d-flex">
                  {selectedProduct.productOptionTypes.length > 0 &&
                    selectedProduct.productOptionTypes.map((item, index) => (
                      <Select
                        placeholder={item.optionName}
                        options={item.optionValues.map(option => {
                          return { label: option, value: option }
                        })}
                        styles={customSelectStyles}
                        isSearchable={false}
                        onChange={value => handleSelectVariant(value, index)}
                      />
                    ))}
                </Col>
              </Row>
            )}
          <Row className="mt-3 p-0 m-0 justify-content-center">
            <Col sm="12" className="p-0">
              <Button
                onClick={() =>
                  token ? addToCartHandler() : handleWithoutLogin()
                }
                className="btn btn-red btn-rounded btn-lg ml-auto"
                disabled={
                  selectedProduct.variants.length === 1 &&
                  // eslint-disable-next-line radix
                  parseInt(quantity) > 0
                    ? false
                    : isAddCart
                }
              >
                {ADD_TO_CART}
              </Button>
            </Col>
          </Row>
        </div>
      )}
      {selectedProduct === null && !showCheckoutSection && (
        <>
          {productsApiData && productsList.length ? (
            <div className="product-list">
              {productsList.map(product => {
                return (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div
                      className="product-details"
                      key={`product_${product.id}`}
                      onClick={() => selectProductHandler(product)}
                    >
                      <img alt="product" src={product.variants[0].image} />
                      <div style={{ maxWidth: '95%' }}>
                        <p>{product.name}</p>
                        {token ? (
                          <p>WSP: {`$${product.wholesalePrice}`}</p>
                        ) : (
                          <div className="message-input">
                            <div className="login-section">
                              WSP:{' '}
                              <Link href="/login">
                                <img
                                  alt="lock"
                                  src="/assets/images/lock.svg"
                                  width="15px"
                                />
                              </Link>
                            </div>
                          </div>
                        )}
                        <p>SKU: {product.sku}</p>
                      </div>
                    </div>
                  </>
                )
              })}
            </div>
          ) : (
            <div className="no-products">
              <img alt="product-icon" src="/assets/images/product-icon.svg" />
              <p>No products to display</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Shop
