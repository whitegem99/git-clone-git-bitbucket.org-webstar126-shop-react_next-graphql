import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import { Container, Row, Col } from 'reactstrap'
import moment from 'moment'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useFormik, Formik, Form, Field } from 'formik';

import withApollo from '../../libs/apollo'
import withAuth from '../../libs/auth'
import Header from '../../components/Header'
import { getToken } from '../../libs/util'
import { GETCARTDATA, GET_CART_DETAILS } from '../../libs/graphql/showroom'
import { FIND, FIND_VIDEO_PRODUCTS, CREATE_COMMENT, FIND_COMMENTS } from '../../libs/graphql/video'
import ShowroomHeader from '../../components/ShowroomHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons'
import Slider from "react-slick"
import Cookies from 'universal-cookie'

const validate = values => {
  const errors = {};
  if (!values.body) {
    errors.body = 'Required';
  }

  if (!values.brandId) {
    errors.brandId = 'Required';
  }
  return errors;
};
const NewCommentForm = ({brands}) => {
  // Pass the useFormik() hook initial form values and a submit function that will
  const [commentCreate] = useMutation(CREATE_COMMENT)
  const cookies = new Cookies()
  let initialValues ={
    videoId: useRouter().query.id,
    buyerId: cookies.get('authUserId'),
    body: '',
    brandId: '',
  }
  if (brands.length && brands.length == 1){
    initialValues.brandId = brands[0]['id']
  }
  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: async(values) => {
      const brind_b = brands.find(rr=>rr.id == values.brandId)
      let variables = Object.assign({}, values)
      variables.companyId = brind_b.company.id      
      // console.log(variables)
      // CREATE_COMMENT
      await commentCreate({ variables })
      alert(JSON.stringify(values, null, 2));
    },
  });
  const brands_count = useMemo(() => {
    return brands.length
  }, [brands])

  return (
    <form onSubmit={formik.handleSubmit}>   
      {
        brands_count>1 ? (          
          <div className="comment-box-k mb-1">
            <select              
              name="brandId"
              onChange={formik.handleChange}
              value={formik.values.brand}
            >                        
              <option value=''>Select Brand</option>
              {brands.map((brand, index) => (
                <option value={brand.id} key={index}>{brand.brandName}</option>
              ))}
            </select>
            {formik.errors.brandId ? <div  className="invalid-feedback d-block">{formik.errors.brandId}</div> : ''}
          </div>        
        ): ''
      }
        
        <div className="comment-box-k">
              <input
                type="text"
                value={formik.values.body}
                name="body"
                placeholder="Ask Questions..."
                autoComplete={false}
                onChange={formik.handleChange}
              />
              <button className="btn btn-white btn-sm">
                <i className="fpq-send" />
              </button>
          </div>
          {formik.errors.body ? <div  className="invalid-feedback d-block">{formik.errors.body}</div> : ''} 
    </form>
  );
};
const CommentsList = ({brands}) => {
  const variables = {
    videoId: useRouter().query.id,
    page: 1
  }
  const { data } = useQuery(FIND_COMMENTS, {variables})
  // console.log(data, 'comments')
  let comments = [
    {id: 1, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 2, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 3, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 4, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 5, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 6, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 7, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 8, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 8, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 9, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 11, body: "dkdkdkkdk2", senderName: "senderName"},
    {id: 12, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 13, body: "dkdkdkkdk2", senderName: "senderName"},
    {id: 14, body: "dkdkdkkdk", senderName: "senderName"},
    {id: 136, body: "dkdkdkkdk5", senderName: "senderName"},
    {id: 15, body: "dkdkdkkdk12", senderName: "senderName"},
  ]
  comments = []
  return (
    <>
    { comments.length ? (
      comments.map((comment, index)=>(
        <div key={index}>
          <strong>{comment.senderName}</strong>
          <p className="text-light mb-2">{comment.body}</p>
        </div>
      ))
    ):(
      <div className="comment-list no-scroll mt-5">
          <div className="no-comments">
            <img alt="comments-icon" src="/assets/images/comments-icon.svg" />
            <p className="mt-2">No comments to display</p>
          </div>
        </div>
    )      
    }
    </>
  );
};
// Products list
const ProductsList = ({brands}) => {
  const _products = [
    {price: 1, name: "dkdkdkkdk", images: []},
    {price: 2, name: "dkdkdkkdk", images: []},
    {price: 3, name: "dkdkdkkdk", images: []},
    {price: 4, name: "dkdkdkkdk", images: []},
    {price: 5, name: "dkdkdkkdk", images: []},
    {price: 6, name: "dkdkdkkdk", images: []},
    {price: 7, name: "dkdkdkkdk", images: []},
    {price: 8, name: "dkdkdkkdk", images: []},
    {price: 8, name: "dkdkdkkdk", images: []},
    {price: 9, name: "dkdkdkkdk", images: []},
    {price: 11, name: "dkdkdkkdk2", images: []},
    {price: 12, name: "dkdkdkkdk",  images: []},
    {price: 13, name: "dkdkdkkdk2", images: []},
    {price: 14, name: "dkdkdkkdk",  images: []},
    {price: 136,name: "dkdkdkkdk5", images: []},
    {price: 15, name: "dkdkdkkdk12", images:[]},
  ]
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState(_products)

  let variables = {
    videoId: useRouter().query.id,
    page
  }
  // const [getFindVideoProduct, { loading, data }] = useLazyQuery(FIND_VIDEO_PRODUCTS, {variables});
  const product_da = useQuery(FIND_VIDEO_PRODUCTS, {variables})  

   useMemo(async () => {
    // console.log(product_da, 'products', page, "page")
    const ppp = get(await product_da.data, 'findProducts.products') || []
    if (page ==1)
      setProducts(ppp) 
    else
      setProducts([...products, ...ppp])   
  }, [product_da.data])

  const totalPages = useMemo(() => {
    return (
      get(product_da.data, 'findProducts.totalPages') || page
    )
  }, [product_da.data])

  const handlePagination = async () => {
    if (page < totalPages) {
      setPage(prevState => prevState + 1)      
    }
  }
  
  const onScrolling = (e) => {
    if ((e.target.scrollTop + e.target.clientHeight) == e.target.scrollHeight){
      if (!product_da.loading){
        // console.log("scrolling bottom")
        // infinit_loading pagenation
        handlePagination()
      }
    }
  } 
  return (
    <div className="brand-h-50" onScroll={onScrolling}>
      <div>
        { products.length ? (
          products.map((product, index) => (
            <div key={index}> 
              <div className="brand-details d-flex">
                <img
                  src={product.images[0] || "/images/product-icon.png"}
                  alt="Product"
                  width={50}
                  height={50}
                  className="mr-2"
                />
                <div>
                  <p>${product.price}</p>
                  <p className="text-light">{product.name}</p>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="comment-list no-scroll mt-5">
              <div className="no-comments text-center">
                <img alt="comments-icon" src="/assets/images/product-icon.svg" />
                <p className="mt-2">No Product to display</p>
              </div>
            </div>
          )
        }
          {!products.length && !product_da.loading ? <p className="text-center">No data</p> : ''}
          {product_da.loading ? <p className="text-center">Loading</p> : ''}
      </div>
    </div>
  );
};

const SCROLL_POS = 500

const TopBanner = ({
  setPopUpShow,
  cartApiData,
  cartProductList,
  hideShowComments,
  info
}) => {
  const router = useRouter()
  const { id } = router.query
  const token = getToken()
  
  const [isMute, setMute] = useState(true)
  const [isShareOpen, setShare] = useState(false)
  const [comment, setComment] = useState('')
  
  const { data } = useQuery(FIND, {
    
    variables: {
      videoId: id
    }
  })

  const video = info?.video
  let brands = info?.video.brands || []
 
  
  const handlePlayPause = () => {
    setMute(!isMute)
  }

  return (
    <div className="video-details-container">
      <div className="video-banner-wrapper">
        <Container className="video-banner-container">
          <Row>
            <Col md="4" className="comment-section">
              <div className="p-3 d-flex flex-column justify-content-between h-100">
                <div>
                  <h3>{video?.title}</h3>               
                  <span className="videoStatusDate mt-3">
                    <h4 className="text-nowrap mr-2">Starts at:</h4>
                    <strong className="date-animation">
                      <p className="date text-nowrap">
                        {moment(
                          video?.createdAt
                        ).format('LL')}
                        <span>
                          {' '}
                          {moment(
                            video?.createdAt
                          ).format('LT')}
                        </span>
                      </p>
                    </strong>
                  </span>
                </div>

                <div className="comments-containter mt-3 flex-1 position-relative">  
                  <div className="comments-list">
                    <CommentsList />
                  </div>                        
                  <div className = "comment-new position-absolute w-100 bg-white pt-2">
                    <NewCommentForm brands={brands}/>                    
                  </div>
                </div>
              </div>
            </Col>
            <Col md="4" className="video-section">
              <div role="button" className="video-img">
                <div
                  className="card-overlay"
                  style={{
                    opacity: 0
                  }}
                >
                  <div
                    className="play-icon"
                    role="button"
                    tabIndex={0}
                    style={{ outline: 'none' }}
                  >
                    {' '}
                    <img src="/images/play.png" alt="" />
                  </div>
                </div>
                <video className="videoContainer" controls muted autoPlay>
                  <source
                    src={
                      video?.livestreamUrl ||
                      video?.promoVideoUrl
                    }
                    type="video/mp4"
                  />
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
            <Col md="4" className="brand-section">
              <div className="p-3 h-100 d-flex flex-column">
                <div>
                  <h3>Brands</h3>
                  <div className="brands brand-h-50" style={{height: brands.length*60 + 'px'}}>
                    {
                      brands.length ? (
                        brands.map((brand, index) => (
                          <Link
                            // eslint-disable-next-line react/no-array-index-key
                            key={`brand-${index}`}
                            href={`/brands/${brand.id}`}
                            target="_blank"
                          >
                            
                            <div className="brand-details d-flex">
                              <img
                                src={brand.logo || "/images/Subtraction.png"}
                                alt="Logo"
                                width={50}
                                height={50}
                                className="mr-2"
                              />
                              <div>
                                <p>View All Products</p>
                                <p className="text-light">{brand.brandName}</p>
                              </div>
                            </div>
                          </Link>
                        ))
                      ): (
                        <div className="comment-list no-scroll mt-5">
                          <div className="no-comments text-center">
                            <img alt="comments-icon" src="/assets/images/product-icon.svg" />
                            <p className="mt-2">No Brand to display</p>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
                <div className="flex-1 d-flex flex-column">
                  <h3 className="mt-4">Products</h3>
                  <ProductsList />                
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

const initialCart = [
  {
    product_id: '',
    variant_id: '',
    is_removed: false
  }
]

const Videos = () => {
  const token = getToken()

  const [isPopUpShow, setPopUpShow] = useState(false)
  const [cartStateData, setCartStateData] = useState([])
  const [isCartOpen, setCartOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [showComments, setShowComments] = useState(null)
  const [cartProductList, setCartProductList] = useState(initialCart)
  const [brandsList, setbrandsList] = useState([])

  let cartDetailsData
  let cartApiData

  if (token) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    cartDetailsData = useQuery(GETCARTDATA, {
      variables: {
        page: 1
      }
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    cartApiData = useQuery(GET_CART_DETAILS, {
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMemo(() => {
      const data = get(cartApiData.data, 'findCartDetails.orders') || []
      const cartItems = []
      if (data.length) {
        data.map(
          itm =>
            itm.lineItems.length &&
            itm.lineItems.map(item => cartItems.push(item))
        )
        let addedProducts = []
        data.forEach(cart => {
          if (cart.lineItems && cart.lineItems.length > 0) {
            cart.lineItems.forEach(item => {
              addedProducts = addedProducts.filter(
                cartProduct => cartProduct.product_id !== item.product.id
              )
              addedProducts.push({
                product_id: item.product.id,
                variant_id: item.variant.id,
                is_removed: false
              })
            })
          }
        })
        if (addedProducts.length > 0) {
          setCartProductList(addedProducts)
        }
      }
    }, [cartApiData.data])
  }

  const addClass = () => {
    if (typeof window !== 'undefined') {
      document.body.classList.add('no-scroll')
    }
  }

  const handleScroll = () => {
    const currentScrollPos = window.scrollY
    const isVisible = SCROLL_POS > currentScrollPos
    setVisible(isVisible)
  }

  // Adds an event listener when the component is mount.
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const hideShowComments = videoId => {
    setShowComments(videoId)
  }
  // getDetail
  const router = useRouter()
  const videoId =  router.query.id
  const { data } = useQuery(FIND, {    
    variables: {
      videoId
    }
  })
  const info = data?.findVideoDetails
  const brands = info?.video?.brands || []
  // setbrandsList([])

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: Math.min(brands.length, 3),
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(brands.length, 2),
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

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
        <div className="homepage">
          <div className="container">
            <TopBanner
              setPopUpShow={setPopUpShow}
              hideShowComments={hideShowComments}
              cartProductList={cartProductList}
              cartApiData={cartApiData}
              info={info}
            />
          </div>
          <div className="container">
            <div className="w-100 container-footer mt-2">
              {
                brands.length ? (
                  <>
                  <h3 className="mt-3 px-n-2">Brands</h3>
                  <Slider {...settings}>              
                  {brands.map((brand, index) => (  
                      <div className="px-2" key={index}>
                        <div className="brand-card-k bg-white text-center p-2">
                          <div className="brand-img">
                            <img
                              src={brand.logo || "/images/Subtraction.png"}
                              alt="Logo"                            
                              className="m-auto"
                            /> 
                          </div>
                          
                          <div>
                            <p className="text-light">{brand.brandName}</p>
                            <p>View All Products</p>
                          </div>
                        </div>
                      </div>                    
                      ))}
                  </Slider>
                  </>
              
                ):''
              }             
            </div>            
          </div>
        </div>
      </div>
    </div>
  )
}
export default withApollo(withAuth(Videos))
