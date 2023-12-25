import React, { useMemo, useState, useEffect } from 'react'
import { Modal, ModalBody, Row, Col, Input, Label, FormGroup } from 'reactstrap'
import { useMutation, useQuery } from '@apollo/react-hooks'
import withRouter from 'next/dist/client/with-router'
import get from 'lodash/get'
import { toast } from 'react-toastify'
import ReactImageZoom from 'react-image-zoom'
import Router, { useRouter } from 'next/router'
import Link from 'next/link'

import withApollo from '../../../libs/apollo'
import {
  ORDER_ADD_PRODUCT,
  GETPRODUCTDETAILS,
  // ORDER_REMOVE_PRODUCT,
  GET_CART_DETAILS
} from '../../../libs/graphql/showroom'
import { SEARCH_PRODUCTS_BY_TAXONOMY } from '../../../libs/graphql/search'
import Loading from '../../../components/Loading'
import { getToken } from '../../../libs/util'

const ORDER = 'Add to Cart'
// const ADDED = 'Remove From Cart'
// const REMOVE = 'Remove?'
const DEFAULT_QUANTITY = 1

const ProductPopup = () => {
  const token = getToken()
  const router = useRouter()
  const { productId, taxonomyId, productSlug } = router.query
  const [productData, setProductData] = useState({})
  const [productIds, setProductIds] = useState([])
  const [selectedProductId, setSelectedProductId] = useState(productId)
  // const [orderButtonText, setOrderButtonText] = useState(ORDER)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [variantType, setVariantType] = useState([null, null, null])
  // const [isProductAddedToCart, setIsProductAddedToCart] = useState(false)
  // const [isRemoveProductFromCart, setIsRemoveProductFromCart] = useState(false)
  const [isAddCart, setAddCart] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')
  const [prevButtonDisable, setPrevButtonDisable] = useState(false)
  const [nextButtonDisable, setNextButtonDisable] = useState(false)
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY)
  let cartApiData

  ProductPopup.getInitialProps = async () => {
    return {}
  }

  const { loading, data } = useQuery(GETPRODUCTDETAILS, {
    variables: {
      productId: selectedProductId
    }
  })

  const {
    fetchMore,
    data: {
      findProductsByTaxonomy: { products, totalPages, currentPage } = {}
    } = {}
  } = useQuery(SEARCH_PRODUCTS_BY_TAXONOMY, {
    variables: {
      taxonomyId,
      page: 1
    }
  })

  if (token) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    cartApiData = useQuery(GET_CART_DETAILS, {
      variables: {
        page: 1
      }
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (productData && Object.entries(productData).length > 0) {
        let variant = ''
        cartApiData.refetch()
        const cartData = get(cartApiData.data, 'findCartDetails.orders') || []
        if (cartData.length > 0) {
          cartData.forEach(cart => {
            if (cart.lineItems && cart.lineItems.length > 0) {
              variant = cart.lineItems.find(
                cartProduct => cartProduct.product.id === productData.id
              )
            }
          })
          if (variant) {
            setSelectedVariant(variant.variant)
            setQuantity(variant.itemQuantity)
            const currentProduct = productData.variants.find(
              prodVar => prodVar.id === variant.variant.id
            )

            if (currentProduct) {
              setVariantType([
                currentProduct.option1Value
                  ? currentProduct.option1Value
                  : null,
                currentProduct.option2Value
                  ? currentProduct.option2Value
                  : null,
                currentProduct.option3Value ? currentProduct.option3Value : null
              ])
              // setIsProductAddedToCart(true)
              // setOrderButtonText(ADDED)
              setAddCart(false)
            }
          }
        }
      }
    }, [cartApiData.data])
  }

  const [addToCart] = useMutation(ORDER_ADD_PRODUCT)
  // const [removeFromCart] = useMutation(ORDER_REMOVE_PRODUCT)

  useMemo(() => {
    if (!loading) {
      setProductData(data.findProductDetail.product)
    }
  }, [loading, data])

  useMemo(() => {
    if (products) {
      const resulting = products
        .map(product => product.id)
        .filter((id, index, self) => self.indexOf(id) === index)
      setProductIds([...resulting])

      if (currentPage < totalPages) {
        setNextButtonDisable(false)
      }
    }
  }, [products])

  useEffect(() => {
    if (productData && Object.entries(productData).length > 0) {
      const index = productIds.findIndex(prodId => prodId === productData.id)
      const nextIndex = productIds.length > index ? index + 1 : index
      if (index === 0) {
        setPrevButtonDisable(true)
      }
      if (productIds.length === nextIndex) {
        setNextButtonDisable(true)
      }
    }
  }, [productData, productIds])

  const addToCartHandler = async () => {
    const values = {
      variantId: selectedVariant
        ? selectedVariant.id
        : productData.variants[0].id,
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
        // await setOrderButtonText(ADDED)
        // await setIsProductAddedToCart(true)
        await cartApiData.refetch()
        return toast.success('Item Added to cart!')
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  /* const removeProductConfirmHandler = () => {
    setIsRemoveProductFromCart(true)
  }

  // eslint-disable-next-line consistent-return
  const removeFromCartHandler = async () => {
    const values = {
      variantId: selectedVariant
        ? selectedVariant.id
        : productData.variants[0].id
    }
    try {
      const {
        data: {
          orderRemoveProduct: { order, errors }
        }
      } = await removeFromCart({ variables: values })

      if (order || !errors) {
        await cartApiData.refetch()
        await setOrderButtonText(ORDER)
        await setIsRemoveProductFromCart(false)
        await setIsProductAddedToCart(false)
        await setQuantity(DEFAULT_QUANTITY)
        return toast.success('Item Removed from cart!')
      }

      if (errors) {
        const error = get(errors, '0.message.0', null)
        return toast.error(error || 'Server error')
      }
    } catch (error) {
      return toast.error('Server error')
    }
  } */

  const updateVariantHandler = (e, index) => {
    const tmpArray = [...variantType]
    const { value } = e.target
    tmpArray[index] = value
    setVariantType(tmpArray)
    if (tmpArray[0] && !tmpArray[1] && !tmpArray[2]) {
      setSelectedVariant(
        productData.variants.find(itm => itm.option1Value === tmpArray[0])
      )
    }
    if (tmpArray[0] && tmpArray[1] && !tmpArray[2]) {
      let tmpObj
      productData.variants.map(itm => {
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
      productData.variants.map(itm => {
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
      productData.productOptionTypes.length === 1 &&
      tmpArray[0] &&
      quantity > 0
    ) {
      setAddCart(false)
    }
    if (
      productData.productOptionTypes.length === 2 &&
      tmpArray[0] &&
      tmpArray[1] &&
      quantity > 0
    ) {
      setAddCart(false)
    }
    if (
      productData.productOptionTypes.length === 3 &&
      tmpArray[0] &&
      tmpArray[1] &&
      tmpArray[2] &&
      quantity > 0
    ) {
      setAddCart(false)
    }
  }

  const updateImage = image => {
    setSelectedImage(image)
  }

  const resetStateValue = () => {
    setQuantity(DEFAULT_QUANTITY)
    setSelectedVariant(null)
    setVariantType([null, null, null])
    // setIsProductAddedToCart(false)
  }

  const previousProductHandler = () => {
    resetStateValue()
    const index = productIds.findIndex(prodId => prodId === productData.id)
    const prevIndex = productIds.length > index ? index - 1 : index
    const prevProductId = productIds[prevIndex]
    setSelectedProductId(prevProductId)
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, null, prevProductId)
    setNextButtonDisable(false)
    if (index === 0) {
      setPrevButtonDisable(true)
      setNextButtonDisable(false)
    }
  }

  const nextProductHandler = () => {
    resetStateValue()
    const index = productIds.findIndex(prodId => prodId === productData.id)
    const nextIndex = productIds.length > index ? index + 1 : index
    const nextProductId = productIds[nextIndex]
    setSelectedProductId(nextProductId)
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, null, nextProductId)
    setPrevButtonDisable(false)
    if (productIds.length - 1 === nextIndex && currentPage < totalPages) {
      fetchMore({
        query: SEARCH_PRODUCTS_BY_TAXONOMY,
        variables: {
          taxonomyId,
          page: currentPage + 1
        },
        updateQuery: (prevResults, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResults
          const resultingProducts = [
            ...prevResults.findProductsByTaxonomy.products,
            ...fetchMoreResult.findProductsByTaxonomy.products
          ]
          return {
            ...prevResults,
            findProductsByTaxonomy: {
              ...prevResults.findProductsByTaxonomy,
              products: [...resultingProducts],
              currentPage: currentPage + 1
            }
          }
        }
      })
    }

    if (productIds.length - 1 === nextIndex && currentPage === totalPages) {
      setNextButtonDisable(true)
      setPrevButtonDisable(false)
    }
    if (nextIndex <= 0 || index > 0) {
      setPrevButtonDisable(false)
    }
  }

  const checkKeyboardKey = key => {
    if (key === 'ArrowRight' && !nextButtonDisable) {
      nextProductHandler()
    } else if (key === 'ArrowLeft' && !prevButtonDisable) {
      previousProductHandler()
    }
  }

  const handleWithoutLogin = () => {
    return Router.replace('/login')
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onKeyDown={event => checkKeyboardKey(event.key)}>
      {loading ? (
        <Loading />
      ) : (
        <Modal isOpen className="round modal-lg product-popup-modal">
          <ModalBody className="p-0 m-0">
            <Row className="p-0 m-0">
              <Col sm="7" className="text-black p-0">
                <div className="image-section">
                  {productData &&
                    productData.images &&
                    productData.images.length > 0 && (
                      <ReactImageZoom
                        width={900}
                        height={1005}
                        img={
                          selectedImage === ''
                            ? productData.images[0]
                            : selectedImage
                        }
                        zoomPosition="original"
                      />
                    )}
                </div>
              </Col>
              <Col sm="5" className="production-desc">
                <div className="thumb-image-list">
                  {productData.images && productData.images.length > 1
                    ? productData.images.map(image => {
                        return (
                          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                          <img
                            key={image}
                            src={image}
                            alt="product-thumb-img"
                            onClick={() => updateImage(image)}
                          />
                        )
                      })
                    : null}
                </div>
                <div className="product-details">
                  <h2 className="title">
                    {productData.name && productData.name}
                  </h2>
                  <span>
                    $
                    {productData.variants &&
                      productData.variants.length > 0 &&
                      productData.variants[0].wholesalePrice}
                  </span>
                  <span>
                    {productData.variants &&
                      productData.variants.length > 0 &&
                      `SKU: ${productData.variants[0].sku}`}
                  </span>
                  <div className="description">
                    {productData.description && (
                      <>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label
                          id=""
                          className="variant-title"
                          htmlFor="description"
                        >
                          Description
                        </label>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: productData.description
                          }}
                        />
                      </>
                    )}
                    {productData.productOptionTypes &&
                      productData.productOptionTypes.length > 0 &&
                      productData.productOptionTypes.length > 1 &&
                      productData.productOptionTypes.map((item, index) => {
                        return (
                          <>
                            <label
                              className="variant-title"
                              htmlFor={item.optionName}
                            >
                              {item.optionName}
                            </label>
                            <FormGroup className="form-group">
                              <div className="form-check-inline">
                                {item.optionValues.map(option => {
                                  const checked = variantType[index] === option
                                  return (
                                    <Label
                                      className={`form-check-label ${
                                        checked ? 'checked' : ''
                                      }`}
                                      for={option}
                                    >
                                      <Input
                                        id={option}
                                        checked={checked}
                                        type="radio"
                                        className="form-check-input"
                                        name="type"
                                        onChange={value =>
                                          updateVariantHandler(value, index)
                                        }
                                        value={option}
                                      />
                                      {option}
                                    </Label>
                                  )
                                })}
                              </div>
                            </FormGroup>
                          </>
                        )
                      })}
                    <div className="d-flex">
                      {/* {!isRemoveProductFromCart ? ( */}
                      <button
                        type="button"
                        disabled={
                          /*! isProductAddedToCart &&
                          quantity > 0 && */
                          productData.variants &&
                          productData.variants.length > 0
                            ? false
                            : isAddCart
                        }
                        onClick={
                          // eslint-disable-next-line no-nested-ternary
                          token ? addToCartHandler : handleWithoutLogin
                        }
                        className="btn btn-red btn-rounded btn-lg ml-auto full-width"
                      >
                        {ORDER}
                      </button>
                      {/* ) : (
                      <button
                        type="button"
                        onClick={removeFromCartHandler}
                        className={`btn btn-black btn-rounded btn-lg ml-auto ${isProductAddedToCart &&
                          `full-width`}`}
                      >
                        {REMOVE}
                      </button>
                      )} */}
                    </div>
                  </div>
                  <div className="button-group">
                    <button
                      disabled={prevButtonDisable}
                      onClick={previousProductHandler}
                      type="button"
                      className="btn btn-red btn-rounded btn-lg ml-auto"
                    >
                      Previous Product
                    </button>
                    <button
                      disabled={nextButtonDisable}
                      onClick={nextProductHandler}
                      type="button"
                      className="btn btn-red btn-rounded btn-lg ml-auto"
                    >
                      Next Product
                    </button>
                  </div>
                </div>
                <Link
                  href="/[productSlug]"
                  as={`/${productSlug}`}
                  key={`product_${selectedProductId}`}
                >
                  <button type="button" className="close-modal">
                    <img src="/assets/images/close.svg" alt="close" />
                  </button>
                </Link>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      )}
    </div>
  )
}

export default withApollo(withRouter(ProductPopup))
