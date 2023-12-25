import React, { useMemo, useEffect, useState } from 'react'
import { Modal, ModalBody, Row, Col, Button } from 'reactstrap'
import { useQuery, useMutation } from '@apollo/react-hooks'
import get from 'lodash/get'
import {
  faPlayCircle,
  faChevronRight,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import Select from 'react-select'
import { toast } from 'react-toastify'

import withApollo from '../../libs/apollo'
import { GETVIDEOSDATA, ADDTOCART } from '../../libs/graphql/showroom'
import Carousel from '../Carousel'
import {
  GETMARKETPLACEPRODUCTS,
  GET_CART_DETAILS
} from '../../libs/graphql/marketPlaceBuyer'
import CommentInVideoPopup from '../BuyerDashboard/CommentInVideoPopup'

import Checkout from './checkout'

// const customSelectStyles = {
//   container: provided => ({
//     ...provided,
//     width: '90%',
//     marginBottom: 10,
//     fontSize: 14,
//     minWidth: 100
//   }),
//   clearIndicator: base => ({
//     ...base,
//     padding: '5px 8px',
//     cursor: 'pointer'
//   }),
//   menuPortal: base => ({ ...base, zIndex: 9999 }),
//   option: base => ({
//     ...base,
//     '&:focus': {
//       outline: 'none'
//     }
//   }),
//
//   singleValue: base => ({
//     ...base
//     // textTransform: "lowercase",
//     // "&::first-letter": {
//     //     textTransform: "capitalize"
//     // }
//   }),
//
//   control: base => ({
//     ...base,
//     height: 'auto',
//     minHeight: 40,
//     lineHeight: 1,
//     boxShadow: 'none',
//     border: '1px solid rgba(0,0,0,.2)',
//     '&:hover': {
//       borderWidth: 1
//     },
//     '&:focus': {
//       outline: 'none'
//     }
//   }),
//
//   indicatorSeparator: base => ({
//     ...base,
//     backgroundColor: 'rgba(0,0,0,.2)'
//   }),
//   dropdownIndicator: base => ({
//     ...base,
//     padding: '5px 8px',
//     color: 'rgba(0,0,0,.2)',
//     '&:hover': {
//       color: '#EDEDED'
//     }
//   }),
//
//   valueContainer: base => ({
//     ...base,
//     padding: '0 15px',
//     flexWrap: 'nowrap'
//   }),
//
//   placeholder: base => ({
//     ...base,
//     color: '#BDBDBD',
//     fontSize: 'inehrit',
//     fontWeight: 300
//   }),
//   colors: {
//     primary: 'red'
//   },
//   menu: base => ({
//     ...base,
//     maxHeight: 150
//   }),
//   menuList: base => ({
//     ...base,
//     maxHeight: 100,
//     zIndex: 999
//   })
// }

const VideoPopup = props => {
  const { open, close, video } = props
  const [productsData, setProductsData] = useState(null)
  const [cartDetails, setCartDetails] = useState(null)
  const [videosData, setVideosData] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [videoRef, setVideoRef] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [variantType, setVariantType] = useState([null, null, null])
  const [isAddCart, setAddCart] = useState(true)
  const [showCheckoutSection, setShowCheckoutSection] = useState(false)
  const [quantity, setQuantity] = useState(null)
  const [videoPage, setVideoPage] = useState(1)
  const [videosArray, setVideosArray] = useState([])
  const [productPage, setProductpage] = useState(1)
  const [productArray, setProductArray] = useState([])

  const apiData = useQuery(GETMARKETPLACEPRODUCTS, {
    variables: {
      page: productPage,
      videoId: video.id
    }
  })

  const getCartDetails = useQuery(GET_CART_DETAILS, {
    variables: {
      page: 1
    }
  })

  const allVideosData = useQuery(GETVIDEOSDATA, {
    variables: {
      domain: process.env.DOMAIN,
      page: videoPage,
      search: '',
      brandId: video.brand ? video.brand.id : ''
    }
  })

  useMemo(() => {
    const data = get(apiData.data, 'findMarketplaceProducts') || []
    const videoData = get(allVideosData.data, 'findMarketplaceVideos') || []
    const cart = get(getCartDetails.data, 'findCartDetails.orders') || []
    setProductsData(data)
    setVideosData(videoData)
    setCartDetails(cart)
    if (data.products) setProductArray(data.products)
    if (videoData.videos) setVideosArray(videoData.videos)
  }, [apiData.data, allVideosData.data, getCartDetails.data])

  useEffect(() => {
    if (cartDetails && cartDetails.length > 0) {
      let count = 0
      cartDetails.map(itm => {
        count += itm.lineItems.length
        return count
      })
      setCartCount(count)
    } else {
      setCartCount(0)
    }
  }, [cartDetails])

  useEffect(() => {
    setVideoUrl(video.livestreamUrl)
  }, [video])

  const updateVideoHandler = videoVal => {
    videoRef.pause()
    setVideoUrl(videoVal.livestreamUrl)
    videoRef.play()
  }

  const selectProductHandler = product => {
    setSelectedProduct(product)
  }

  const resetProductSelectionHandler = () => {
    setSelectedProduct(null)
    setSelectedVariant(null)
    setVariantType([null, null, null])
    setAddCart(true)
    setQuantity(null)
  }

  const [addTocart] = useMutation(ADDTOCART)

  const addToCartHandler = async () => {
    const values = {
      variantId: selectedVariant
        ? selectedVariant.id
        : selectedProduct.variants[0].id,
      // quantity: parseInt(quantity)
      unit: 1
    }
    try {
      const {
        data: {
          orderAddProduct: { order, errors }
        }
      } = await addTocart({ variables: values })

      if (order) {
        await getCartDetails.refetch()
        return toast('Item Added to cart!')
      }

      const error = get(errors, '0.message.0', null)

      return toast(error || 'Server error')
    } catch (error) {
      return toast('Server error')
    }
  }

  const PopupTile = params => {
    const { videoData, product, isVideo } = params
    return (
      <>
        <div
          role="button"
          tabIndex={0}
          onClick={() =>
            isVideo
              ? updateVideoHandler(videoData)
              : selectProductHandler(product)
          }
          onKeyDown={() =>
            isVideo
              ? updateVideoHandler(videoData)
              : selectProductHandler(product)
          }
          className="tile-container d-flex align-items-center"
        >
          <div
            className="tile-img"
            style={{
              backgroundImage: `url(${
                isVideo ? videoData.bannerUrl : product.variants[0].image
              })`
            }}
          />
          <div>
            {!isVideo && (
              <div className="tile-price">
                ${product.variants[0].wholesalePrice}
              </div>
            )}
            <div className="tile-title">
              {isVideo ? videoData.title : product.name}
            </div>
          </div>
          <FontAwesomeIcon
            icon={isVideo ? faPlayCircle : faChevronRight}
            className="next-icon"
          />
        </div>
      </>
    )
  }

  const resetAndClose = () => {
    resetProductSelectionHandler()
    setShowCheckoutSection(false)
    close()
  }

  // const handleSelectVariant = (value, index) => {
  //   const tmpArray = [...variantType]
  //   tmpArray[index] = value.value
  //   setVariantType(tmpArray)
  //   if (tmpArray[0] && !tmpArray[1] && !tmpArray[2]) {
  //     setSelectedVariant(
  //       selectedProduct.variants.find(itm => itm.option1Value === tmpArray[0])
  //     )
  //   }
  //   if (tmpArray[0] && tmpArray[1] && !tmpArray[2]) {
  //     let tmpObj
  //     selectedProduct.variants.map(itm => {
  //       if (
  //         itm.option1Value === tmpArray[0] &&
  //         itm.option2Value === tmpArray[1]
  //       ) {
  //         tmpObj = itm
  //       }
  //       return ''
  //     })
  //     setSelectedVariant(tmpObj)
  //   }
  //   if (tmpArray[0] && tmpArray[1] && tmpArray[2]) {
  //     let tmpObj
  //     selectedProduct.variants.map(itm => {
  //       if (
  //         itm.option1Value === tmpArray[0] &&
  //         itm.option2Value === tmpArray[1] &&
  //         itm.option3Value === tmpArray[3]
  //       ) {
  //         tmpObj = itm
  //       }
  //       return ''
  //     })
  //     setSelectedVariant(tmpObj)
  //   }
  //   if (
  //     selectedProduct.productOptionTypes.length === 1 &&
  //     tmpArray[0] &&
  //     quantity
  //   ) {
  //     setAddCart(false)
  //   }
  //   if (
  //     selectedProduct.productOptionTypes.length === 2 &&
  //     tmpArray[0] &&
  //     tmpArray[1] &&
  //     quantity
  //   ) {
  //     setAddCart(false)
  //   }
  //   if (
  //     selectedProduct.productOptionTypes.length === 3 &&
  //     tmpArray[0] &&
  //     tmpArray[1] &&
  //     tmpArray[2] &&
  //     quantity
  //   ) {
  //     setAddCart(false)
  //   }
  // }
  //
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

  const handleScroll = async ({ currentTarget }, type) => {
    if (
      currentTarget.scrollTop + currentTarget.clientHeight >=
      currentTarget.scrollHeight
    ) {
      if (type === 'product') {
        if (productPage < productsData.totalPages) {
          await setProductpage(prevState => prevState + 1)
          const data = get(apiData.data, 'findMarketplaceProducts') || []
          setProductsData(data)
          if (data.products)
            setProductArray([...productArray, ...data.products])
        }
      }
      if (type === 'video') {
        if (videoPage < videosData.totalPages) {
          await setVideoPage(prevState => prevState + 1)
          const videoData =
            get(allVideosData.data, 'findMarketplaceVideos') || []
          setVideosData(videoData)
          if (videoData.videos)
            setVideosArray([...videosArray, ...videoData.videos])
        }
      }
    }
  }

  return (
    <>
      {console.log(isAddCart, variantType, quantity)}
      <Modal
        isOpen={open}
        toggle={() => {
          resetAndClose()
        }}
        className="round modal-lg video-popup-modal"
      >
        <ModalBody className="p-0 m-0">
          <Row className="p-0 m-0">
            {!showCheckoutSection && (
              <Col sm="4" className="p-0 comment-video-popup">
                <CommentInVideoPopup
                  videoId={video.id}
                  brandId={video.brand.id}
                  companyId={video.brand.company.id}
                />
              </Col>
            )}
            <Col sm="4" className="text-black p-0">
              <div className="video-section">
                <video
                  key={videoUrl}
                  ref={ref => setVideoRef(ref)}
                  className="videoContainer"
                  autoPlay
                  controls
                >
                  <source src={videoUrl} type="video/mp4" />
                  <track
                    src=""
                    kind="captions"
                    srcLang="en"
                    label="en_captions"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </Col>
            <Col
              sm={showCheckoutSection ? 8 : 4}
              className="text-black py-4 px-4"
            >
              {showCheckoutSection && (
                <Checkout
                  onClose={resetAndClose}
                  back={async () => {
                    await setShowCheckoutSection(false)
                    await getCartDetails.refetch()
                  }}
                />
              )}
              {selectedProduct && !showCheckoutSection && (
                <>
                  <div className="product-section pb-3 d-flex justify-content-between">
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                    <h4
                      onClick={() => resetProductSelectionHandler()}
                      className="cursor-pointer"
                    >
                      <img
                        src="/assets/images/next.svg"
                        className="left-arrow"
                        alt="arrow"
                      />
                      <span className="ml-1">Shop</span>
                    </h4>
                    <div className="cursor-pointer">
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                      <img
                        src="/assets/images/smart-cart.svg"
                        alt="cart"
                        onClick={() => setShowCheckoutSection(true)}
                      />
                      <span
                        className="badge badge-pill badge-dark position-absolute badge-md"
                        style={{ top: '20px', right: '38%' }}
                      >
                        {cartCount}
                      </span>
                    </div>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div
                      style={{ fontSize: '20px' }}
                      onClick={() => resetAndClose()}
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  <div
                    className={
                      selectedProduct.images.length === 1
                        ? 'product-card no-indicator'
                        : 'product-card'
                    }
                  >
                    <Carousel images={selectedProduct.images} />
                  </div>
                  <h6>${selectedProduct.variants[0].wholesalePrice}</h6>
                  <h6>{selectedProduct.name}</h6>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: selectedProduct.description
                    }}
                  />
                  {/* <Row className="p-0 m-0 justify-content-center"> */}
                  {/*  {selectedProduct.productOptionTypes.length > 0 && */}
                  {/*    selectedProduct.productOptionTypes[0].optionValues */}
                  {/*      .length > 1 && ( */}
                  {/*      <Col sm="6" className="p-0"> */}
                  {/*        {selectedProduct.productOptionTypes.length > 0 && */}
                  {/*          selectedProduct.productOptionTypes.map( */}
                  {/*            (item, index) => ( */}
                  {/*              <Select */}
                  {/*                placeholder={item.optionName} */}
                  {/*                options={item.optionValues.map(option => { */}
                  {/*                  return { label: option, value: option } */}
                  {/*                })} */}
                  {/*                styles={customSelectStyles} */}
                  {/*                isSearchable={false} */}
                  {/*                onChange={value => */}
                  {/*                  handleSelectVariant(value, index) */}
                  {/*                } */}
                  {/*              /> */}
                  {/*            ) */}
                  {/*          )} */}
                  {/*      </Col> */}
                  {/*    )} */}
                  {/*  <Col sm="6" className="p-0"> */}
                  {/*    <Input */}
                  {/*      type="number" */}
                  {/*      placeholder="quantity" */}
                  {/*      value={quantity} */}
                  {/*      onChange={e => handleQuantity(e)} */}
                  {/*    /> */}
                  {/*  </Col> */}
                  {/* </Row> */}
                  <div className="mt-2">
                    <Button
                      onClick={addToCartHandler}
                      className="addTocart-btn w-50 m-auto"
                      // disabled={
                      //   selectedProduct.variants.length === 1 && quantity
                      //     ? false
                      //     : isAddCart
                      // }
                    >
                      Add to Cart
                    </Button>
                  </div>
                </>
              )}
              {selectedProduct === null && !showCheckoutSection && (
                <>
                  <div className="">
                    <div className="product-section pb-3 d-flex justify-content-between">
                      <h4>Shop</h4>
                      <div className="cursor-pointer">
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                        <img
                          src="/assets/images/smart-cart.svg"
                          alt="cart"
                          onClick={() => setShowCheckoutSection(true)}
                        />
                        <span
                          className={
                            !showCheckoutSection
                              ? 'badge badge-pill badge-dark position-absolute badge-md'
                              : ''
                          }
                          style={{ top: '20px', right: '38%' }}
                        >
                          {cartCount}
                        </span>
                      </div>
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                      <div
                        style={{ fontSize: '20px' }}
                        onClick={() => resetAndClose()}
                      >
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                    <div
                      className="catalogue"
                      onScroll={e => handleScroll(e, 'product')}
                    >
                      {productsData && productArray.length ? (
                        productArray.map(product => {
                          return (
                            <PopupTile
                              key={`product_${product.id}`}
                              product={product}
                              isVideo={false}
                            />
                          )
                        })
                      ) : (
                        <h5 className="no-products">No Products...</h5>
                      )}
                    </div>
                  </div>
                  {/* <div className="pt-4">
                    <div className="product-section pb-3 d-flex justify-content-between">
                      <h4>Watch More</h4>
                    </div>
                    <div
                      className="catalogue"
                      onScroll={e => handleScroll(e, 'video')}
                    >
                      {!!videosData && videosArray.length ? (
                        videosArray.map(videoItem => {
                          return (
                            <PopupTile
                              key={`video_${videoItem.id}`}
                              videoData={videoItem}
                              isVideo
                            />
                          )
                        })
                      ) : (
                        <h5>No More Videos...</h5>
                      )}
                    </div>
                  </div> */}
                </>
              )}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}

export default withApollo(VideoPopup)
