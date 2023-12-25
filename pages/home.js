import React, { useEffect, useMemo, useState } from 'react'
import { Input, Collapse } from 'reactstrap'
import get from 'lodash/get'
import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import { useRouter } from 'next/router'

import Comments from '../components/Comments/Comments'
import Shop from '../components/Comments/Shop'
import {
  FIND_MARKETPLACE_BRANDS,
  FIND_VIDEO_BY_STATUS
} from '../libs/graphql/buyerDashboard'
import { getToken } from '../libs/util'
import withApollo from '../libs/apollo'
import { GET_CART_DETAILS } from '../libs/graphql/showroom'

const SCROLL_POS = 500

const TopBanner = () => {
  return (
    <div className="banner">
      <div className="left">
        <h1>Discover Products Live</h1>
        <h2>From your favorite brands</h2>
        <form className="d-none" action="/register" method="post" hidden>
          <input
            placeholder="Enter your email address.."
            type="email"
            name="email"
          />
          <button type="submit" className="btn btn-rounded black">
            SignUp
          </button>
        </form>
      </div>
      <div className="right">
        <video
          src="https://playback-wholesale.s3.amazonaws.com/banner_videos/home.mov"
          autoPlay
          loop
          preload="auto"
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}

const BrandsList = () => {
  return (
    <>
      <ul className="d-flex justify-content-between serviceBlock">
        <li>
          <img alt="indie-brands" src="assets/images/indie-brands.svg" />
          <div className="ServiceList">
            <h3>Watch Live Shows</h3>
            <p>Interactive live shows hosted by brands</p>
          </div>
        </li>
        <li>
          <img alt="deal-events" src="assets/images/deal-events.svg" />
          <div className="ServiceList">
            <h3>Discover New Products</h3>
            <p>Learn about new collections and ask questions</p>
          </div>
        </li>
        <li>
          <img alt="commission" src="assets/images/commission.svg" />
          <div className="ServiceList">
            <h3>Shop Without Risk</h3>
            <p>We offer free returns and Net 60 terms</p>
          </div>
        </li>
      </ul>
      <hr />
    </>
  )
}

const LeftSidebar = props => {
  const {
    setSearch,
    marketPlaceBrandsList = [],
    onClickBrand,
    loadMoreBrand,
    brandsPage,
    totalBrandsPages
  } = props
  return (
    <div className="left-sidebar" id="bar-fixed">
      <aside>
        <Input
          className="search-input"
          placeholder="Search Brands..."
          onChange={e => setSearch(e.target.value)}
        />
        <ul>
          {marketPlaceBrandsList && marketPlaceBrandsList.length > 0 ? (
            marketPlaceBrandsList.map(brand => {
              return (
                <li key={brand.id}>
                  <button
                    type="button"
                    onClick={() => onClickBrand(brand)}
                    tabIndex={0}
                  >
                    <span className="avatar-box">
                      <img src={brand.logo} alt="brand-logo" />
                    </span>
                    <strong>{brand.brandName}</strong>
                  </button>
                </li>
              )
            })
          ) : (
            <div className="no-data-container">No data found!</div>
          )}
          {brandsPage < totalBrandsPages && (
            // eslint-disable-next-line jsx-a11y/no-redundant-roles
            <button
              type="button"
              className="load-more"
              role="button"
              onClick={loadMoreBrand}
            >
              Load more
            </button>
          )}
        </ul>
      </aside>
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

const Home = ({ setPopUpShow }) => {
  const { DOMAIN } = process.env
  const token = getToken()
  const router = useRouter()
  const [visible, setVisible] = useState(true)
  const [showComments, setShowComments] = useState(null)
  const [marketPlaceBrandsList, setMarketPlaceBrandsList] = useState([])
  const [marketplaceVideosList, setMarketplaceVideosList] = useState([])
  const [search, setSearch] = useState('')
  const [videoPage, setVideoPage] = useState(1)
  const [brandsPage, setBrandsPage] = useState(1)
  const [videoRef, setVideoRef] = useState(null)
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const [cartProductList, setCartProductList] = useState(initialCart)
  const [activeTab, setActiveTab] = useState('ps')

  const marketplaceBrandsData = useQuery(FIND_MARKETPLACE_BRANDS, {
    variables: {
      search,
      page: brandsPage,
      domain: DOMAIN
    }
  })

  const marketplaceVideosData = useQuery(FIND_VIDEO_BY_STATUS, {
    variables: {
      filterByStatus:
        // eslint-disable-next-line no-nested-ternary
        activeTab === 'ps'
          ? 'recorded'
          : activeTab === 'us'
          ? 'upcoming'
          : 'live',
      page: videoPage
    }
  })

  let cartApiData
  if (token) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    cartApiData = useQuery(GET_CART_DETAILS, {
      variables: {
        page: 1
      }
    })

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

  useMemo(async () => {
    addClass()
    const marketplaceBrands =
      get(await marketplaceBrandsData.data, 'findMarketplaceBrands.brands') ||
      []
    await setMarketPlaceBrandsList(marketplaceBrands)
    // const findVideosByMarketplace =
    //   (await get(marketplaceVideosData.data, 'findVideos.videos')) || []
    const findVideosByMarketplace =
      get(marketplaceVideosData.data, 'findVideos.videos') || []
    await setMarketplaceVideosList(videos => [
      ...videos,
      ...findVideosByMarketplace
    ])
    // await setMarketplaceVideosList(findVideosByMarketplace)
  }, [marketplaceBrandsData.data, marketplaceVideosData.data])

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

  const onClickBrand = brand => {
    router.push(`/brands/${brand.id}`, undefined, {
      shallow: true
    })
  }

  const hideShowComments = videoId => {
    setShowComments(videoId)
  }

  const totalVideoPages = useMemo(() => {
    return get(marketplaceVideosData.data, 'findVideos.totalPages') || videoPage
  }, [marketplaceVideosData.data])

  const totalBrandsPages = useMemo(() => {
    return (
      get(marketplaceBrandsData.data, 'findMarketplaceBrands.totalPages') ||
      brandsPage
    )
  }, [marketplaceBrandsData.data])

  const handleVideosPagination = async ({ currentTarget }) => {
    if (
      currentTarget.scrollTop + currentTarget.clientHeight >=
      currentTarget.scrollHeight
    ) {
      if (videoPage < totalVideoPages) {
        await setVideoPage(prevState => prevState + 1)
      }
    }
  }

  const handleBrandsPagination = async () => {
    if (brandsPage < totalBrandsPages) {
      await setBrandsPage(prevState => prevState + 1)
      const brands =
        get(marketplaceBrandsData.data, 'findMarketplaceBrands.brands') || []
      setMarketPlaceBrandsList([...marketPlaceBrandsList, ...brands])
    }
  }

  const updateVideoHandler = videoId => {
    videoRef.pause()
    setSelectedVideoId(videoId)
    videoRef.play()
  }
  const [isComments, setComments] = useState(false)
  const toggleComments = () => setComments(!isComments)

  const [isShop, setShop] = useState(false)
  const toggleShop = () => setShop(!isShop)
  return (
    <div className="homepage">
      <TopBanner />
      <BrandsList />
      <div className={`container${!visible ? ' fixed' : ''}`} id="social-feed">
        <LeftSidebar
          setSearch={setSearch}
          marketPlaceBrandsList={marketPlaceBrandsList}
          onClickBrand={onClickBrand}
          loadMoreBrand={handleBrandsPagination}
          brandsPage={brandsPage}
          totalBrandsPages={totalBrandsPages}
        />
        <div
          className={`product-section-home${!visible ? ' fixed' : ''}`}
          style={{ height: '100vh', overflowY: 'scroll', overflowX: 'hidden' }}
          onScroll={e => handleVideosPagination(e)}
        >
          <ul className="nav videoTimeTab">
            <li className="nav-item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <a
                className={`nav-link ${activeTab === 'ps' ? 'active' : ''}`}
                onClick={() => setActiveTab('ps')}
              >
                PAST SHOWS
              </a>
            </li>
            <li className="nav-item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <a
                className={`nav-link ${activeTab === 'us' ? 'active' : ''}`}
                onClick={() => setActiveTab('us')}
              >
                UPCOMING SHOWS
              </a>
            </li>
            <li className="nav-item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <a
                className={`nav-link ${activeTab === 'ls' ? 'active' : ''}`}
                onClick={() => setActiveTab('ls')}
              >
                LIVE NOW
              </a>
            </li>
          </ul>
          {/* eslint-disable-next-line no-nested-ternary */}
          {marketplaceVideosList && marketplaceVideosList.length > 0 ? (
            marketplaceVideosList.map(video => {
              return (
                <>
                  <div className="row align-items-center">
                    <div className="title pt-3 ml-3">
                      <span className="brand-name">
                        <h3 className="pl-0 m-0">{video.title}</h3>
                      </span>
                    </div>
                  </div>
                  <div className="product-container hidden-xs">
                    {showComments !== video.id && (
                      <div className="col-4 comments" key={video.id}>
                        <div className="title pt-3 ml-3 mt-2">
                          <span className="videoStatusDate">
                            <h4>Starts at:</h4>
                            <strong className="date-animation">
                              <p className="date">
                                {moment(
                                  // eslint-disable-next-line no-nested-ternary
                                  activeTab === 'us'
                                    ? video.scheduledTime
                                    : video.startTime
                                    ? video.startTime
                                    : video.createdAt
                                ).format('ll')}
                                <span>
                                  {' '}
                                  {moment(video.createdAt).format('LT')}
                                </span>
                              </p>
                            </strong>
                          </span>
                        </div>
                        <Comments
                          videoId={video.id}
                          brandId={video.brands && video?.brands[0]?.id}
                          companyId={
                            video?.brands &&
                            video?.brands[0]?.company &&
                            video?.brands[0]?.company?.id
                          }
                          token={token}
                        />
                      </div>
                    )}
                    <div className="col-4 video-section">
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
                      <div
                        role="button"
                        className="video-img"
                        style={{
                          backgroundImage: `url(${selectedVideoId !==
                            video.id && video.bannerUrl})`
                        }}
                        onClick={() => updateVideoHandler(video.id)}
                      >
                        <div
                          className="card-overlay"
                          style={{
                            opacity: selectedVideoId === video.id ? 0 : 1
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
                        <video
                          key={video.id}
                          ref={ref => setVideoRef(ref)}
                          className="videoContainer"
                          controls
                          muted
                          autoPlay
                          style={{
                            display: selectedVideoId !== video.id && 'none'
                          }}
                        >
                          <source
                            src={
                              video.livestreamUrl
                                ? video.livestreamUrl
                                : video.promoVideoUrl
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
                    </div>
                    <div
                      className={`${
                        showComments !== video.id ? 'col-4' : 'col-8'
                      } shop`}
                    >
                      <div className="videoRightWrap">
                        <div className="boxWrap">
                          <div className="d-flex brandWrap">
                            <span className="brand-title">
                              <div className="selected-brand-name d-flex justify-content-between align-items-center">
                                <h4>{video?.brands[0]?.brandName}</h4>
                                {/* <a href="#">View all products</a> */}
                              </div>
                            </span>
                          </div>
                        </div>
                        <Shop
                          setPopUpShow={setPopUpShow}
                          video={video}
                          token={token}
                          hideShowComments={hideShowComments}
                          cartProductList={cartProductList}
                          cartApiData={cartApiData}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="product-container productMobile">
                    <div className="video-section">
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
                      <div
                        role="button"
                        className="video-img"
                        style={{
                          backgroundImage: `url(${selectedVideoId !==
                            video.id && video.bannerUrl})`
                        }}
                        onClick={() => updateVideoHandler(video.id)}
                      >
                        <div
                          className="card-overlay"
                          style={{
                            opacity: selectedVideoId === video.id ? 0 : 1
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
                        <video
                          key={video.id}
                          ref={ref => setVideoRef(ref)}
                          className="videoContainer"
                          controls
                          muted
                          autoPlay
                          style={{
                            display: selectedVideoId !== video.id && 'none'
                          }}
                        >
                          <source src={video.livestreamUrl} type="video/mp4" />
                          <track
                            src=""
                            kind="captions"
                            srcLang="en"
                            label="en_captions"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                    {showComments !== video.id && (
                      <>
                        <button onClick={toggleComments} type="button">
                          Comments
                          <i>
                            {!isComments ? (
                              <img
                                className="float-right"
                                src="/assets/images/down.svg"
                                alt="downarrow"
                              />
                            ) : (
                              <img
                                className="float-right"
                                src="/assets/images/up.svg"
                                alt="uparrow"
                              />
                            )}
                          </i>
                        </button>
                        <Collapse isOpen={isComments}>
                          <div className="comments" key={video.id}>
                            <Comments
                              videoId={video.id}
                              brandId={video.brand && video.brand.id}
                              companyId={
                                video.brand &&
                                video.brand.company &&
                                video.brand.company.id
                              }
                              token={token}
                            />
                          </div>
                        </Collapse>
                      </>
                    )}
                    <div
                      className={`${
                        showComments !== video.id ? 'test1' : 'test2'
                      } shop`}
                    >
                      <button onClick={toggleShop} type="button">
                        Shop
                        <i>
                          {!isShop ? (
                            <img
                              className="float-right"
                              src="/assets/images/down.svg"
                              alt="downarrow"
                            />
                          ) : (
                            <img
                              className="float-right"
                              src="/assets/images/up.svg"
                              alt="uparrow"
                            />
                          )}
                        </i>
                      </button>
                      <Collapse isOpen={isShop}>
                        <Shop
                          setPopUpShow={setPopUpShow}
                          video={video}
                          token={token}
                          hideShowComments={hideShowComments}
                          cartProductList={cartProductList}
                          cartApiData={cartApiData}
                        />
                      </Collapse>
                    </div>
                  </div>

                  <hr />
                </>
              )
            })
          ) : (
            <div className="no-data-container">No videos found!</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withApollo(Home)
