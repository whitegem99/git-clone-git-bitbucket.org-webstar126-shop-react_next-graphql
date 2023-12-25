/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-target-blank */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import withApollo from '../../libs/apollo'
import withAuth from '../../libs/auth'
import Header from '../../components/ShowroomHeader'
import { BUYER_HOME_DETAILS } from '../../libs/graphql/marketplace'
import Loading from '../../components/Loading'
import { GETCARTDATA, ORDER_ADD_PRODUCT } from '../../libs/graphql/showroom'
import {
  SEARCH_PRODUCTS_BY_TAXONOMY,
  SEARCH_TAXONOMIES
} from '../../libs/graphql/search'
import { getToken } from '../../libs/util'

const TaxonomySidebar = ({
  childTaxonomies,
  parentTaxonomy,
  setTaxonomyId,
  setTaxonomyName,
  setSecondTaxonomyName,
  query,
  push
}) => {
  const [activeIndex, setIndex] = useState(null)
  const [activeLevel2Index, setLevel2Index] = useState(null)
  return (
    <div className="buyer-sidebar">
      <button
        type="button"
        onClick={() => {
          push(`/${parentTaxonomy.toLowerCase()}`, undefined, { shallow: true })
          setTaxonomyId(null)
          setIndex(null)
          setTaxonomyName(parentTaxonomy)
        }}
        style={{ outline: 'none', border: 'none', background: 'none' }}
      >
        <h5>{parentTaxonomy}</h5>
      </button>
      <ul className="sidebar-menu taxonomy-sidebar">
        {childTaxonomies?.map((taxonomy, index) => (
          <li key={taxonomy.id}>
            <button
              type="button"
              className={
                activeIndex === index || query.child === taxonomy.taxonomyName
                  ? 'active-index'
                  : null
              }
              style={{ outline: 'none', border: 'none', background: 'none' }}
              onClick={() => {
                push(
                  `/${parentTaxonomy.toLowerCase()}?child=${
                    taxonomy.taxonomyName
                  }`,
                  undefined,
                  { shallow: true }
                )
                setTaxonomyId(taxonomy.id)
                setIndex(index)
                setLevel2Index(null)
                setSecondTaxonomyName(null)
                setTaxonomyName(taxonomy.taxonomyName)
              }}
            >
              {taxonomy.taxonomyName}
            </button>
            {activeIndex === index && (
              <ul className="sidebar-menu taxonomy-sidebar">
                {taxonomy.childTaxonomies?.map((taxonomy, index) => (
                  <button
                    type="button"
                    className={
                      activeLevel2Index === index ? 'active-index' : null
                    }
                    style={{
                      outline: 'none',
                      border: 'none',
                      background: 'none'
                    }}
                    onClick={() => {
                      setTaxonomyId(taxonomy.id)
                      setLevel2Index(index)
                      setSecondTaxonomyName(taxonomy.taxonomyName)
                    }}
                  >
                    {taxonomy.taxonomyName}
                  </button>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const DashboardHome = () => {
  const token = getToken()
  const { query, push } = useRouter()
  const taxonomyQuery = query.productSlug
    .split('-')
    .filter(el => el !== '-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  const [isPopUpShow, setPopUpShow] = useState(false)
  const [taxonomyId, setTaxonomyId] = useState(null)
  const [taxonomy, setTaxonomy] = useState({})
  const [taxonomyName, setTaxonomyName] = useState(
    query.child ? query.child : taxonomyQuery
  )
  const [secondTaxonomyName, setSecondTaxonomyName] = useState(null)
  const [cartStateData, setCartStateData] = useState([])
  const [sortPrice, setSortPrice] = useState('low')
  const [addToCart] = useMutation(ORDER_ADD_PRODUCT)
  // const [buyerDashboardHomeData, setBuyerDashboardHomeData] = useState([])

  const { loading } = useQuery(BUYER_HOME_DETAILS)

  let cartDetailsData

  const { data: { findTaxonomies: { taxonomies } = {} } = {} } = useQuery(
    SEARCH_TAXONOMIES,
    {
      variables: {
        domain: 'buyer.playback.ai'
      }
    }
  )

  useEffect(() => {
    if (taxonomies) {
      setTaxonomy({
        parentTaxonomy: taxonomyQuery,
        childTaxonomies:
          taxonomies.find(taxonomy => taxonomy.taxonomyName === taxonomyQuery)
            .childTaxonomies || []
      })
    }
  }, [taxonomies])

  const skip = taxonomies === undefined

  const {
    fetchMore,
    data: {
      findProductsByTaxonomy: { products, totalPages, currentPage } = {}
    } = {}
  } = useQuery(SEARCH_PRODUCTS_BY_TAXONOMY, {
    skip,
    variables: {
      taxonomyId:
        taxonomyId ||
        (query.child
          ? taxonomies
              ?.find(
                // eslint-disable-next-line no-shadow
                taxonomy => taxonomy.taxonomyName === taxonomyQuery
              )
              .childTaxonomies?.find(
                taxonomy => taxonomy.taxonomyName === query.child
              )?.id
          : taxonomies?.find(
              // eslint-disable-next-line no-shadow
              taxonomy => taxonomy.taxonomyName === taxonomyQuery
            )?.id),
      page: 1
    }
  })

  const productObserver = useRef()
  const lastProductElement = useCallback(node => {
    if (productObserver.current) productObserver.current.disconnect()
    productObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        fetchMore({
          query: SEARCH_PRODUCTS_BY_TAXONOMY,
          variables: {
            taxonomyId: taxonomies?.find(
              taxonomy => taxonomy.taxonomyName === taxonomyQuery
            )?.id,
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
    })
    if (node) productObserver.current.observe(node)
  }, [])

  if (token) {
    cartDetailsData = useQuery(GETCARTDATA, {
      variables: {
        page: 1
      }
    })

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
      // const buyerHomeData =
      //   get(data, 'findBuyerHomeDetails.buyerDashboardHome') || []
      // setBuyerDashboardHomeData(buyerHomeData)
    }, [cartDetailsData.data])
  }

  const addToCartHandler = async variantId => {
    const values = {
      variantId,
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
        await setPopUpShow(true)
        await setTimeout(async () => {
          await setPopUpShow(false)
        }, 2000)
        await cartDetailsData.refetch()
        return toast.success('Item Added to cart!')
      }

      const error = get(errors, '0.message.0', null)

      return toast.error(error || 'Server error')
    } catch (error) {
      return toast.error('Server error')
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Header
            isPopUpShow={isPopUpShow}
            setPopUpShow={setPopUpShow}
            cartStateData={cartStateData}
            cartDetailsData={cartDetailsData}
            token={token}
          />
          <div className="dashboard">
            <div className="slug-header">
              <a href="/">Home</a> -{' '}
              {taxonomyName === taxonomyQuery ? (
                <strong>{taxonomyName}</strong>
              ) : secondTaxonomyName ? (
                <>
                  {taxonomyQuery} - {taxonomyName} -{' '}
                  <strong>{secondTaxonomyName}</strong>
                </>
              ) : (
                <>
                  {taxonomyQuery} - <strong>{taxonomyName}</strong>
                </>
              )}
            </div>
            <div>
              {taxonomy?.childTaxonomies?.length > 0 && (
                <TaxonomySidebar
                  childTaxonomies={taxonomy.childTaxonomies}
                  parentTaxonomy={taxonomyQuery}
                  setTaxonomyId={setTaxonomyId}
                  setTaxonomyName={setTaxonomyName}
                  setSecondTaxonomyName={setSecondTaxonomyName}
                  query={query}
                  push={push}
                />
              )}
              <div
                className={
                  taxonomy?.childTaxonomies?.length === 0
                    ? 'right-side home full-width-products'
                    : 'right-side home'
                }
              >
                <div className="">
                  <div className="products-header">
                    <div>
                      <h5>{taxonomyName}</h5>
                    </div>
                    <div>
                      <span>Sort by: </span>
                      <select
                        onChange={e => setSortPrice(e.target.value)}
                        defaultValue="low"
                        className="sort-button"
                      >
                        <option value="low">Price, Low To High</option>
                        <option value="high">Price, High To Low</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className="row product-list"
                    style={{ height: '80vh', overflowY: 'scroll' }}
                  >
                    {products
                      ?.sort((a, b) => {
                        if (sortPrice === 'low') {
                          return a.price - b.price
                        }
                        return b.price - a.price
                      })
                      .map((product, index) => {
                        if (products.length === index + 1) {
                          return (
                            <div
                              ref={lastProductElement}
                              className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 pl-4 pr-4 mb-4"
                              key={product.id}
                            >
                              <div
                                style={{
                                  boxShadow:
                                    '0px 2px 41px -12px rgba(101,96,98,0.2)'
                                }}
                              >
                                <div
                                  className="card-img-e9"
                                  style={{
                                    backgroundImage: `url(${product.images[0]})`
                                  }}
                                  onClick={() => {
                                    push({
                                      pathname:
                                        '/[productSlug]/[taxonomyId]/[productId]',
                                      query: {
                                        productSlug: query.productSlug,
                                        taxonomyId:
                                          taxonomyId ||
                                          (query.child
                                            ? taxonomies
                                                ?.find(
                                                  // eslint-disable-next-line no-shadow
                                                  taxonomy =>
                                                    taxonomy.taxonomyName ===
                                                    taxonomyQuery
                                                )
                                                .childTaxonomies?.find(
                                                  taxonomy =>
                                                    taxonomy.taxonomyName ===
                                                    query.child
                                                )?.id
                                            : taxonomies?.find(
                                                // eslint-disable-next-line no-shadow
                                                taxonomy =>
                                                  taxonomy.taxonomyName ===
                                                  taxonomyQuery
                                              )?.id),
                                        productId: product.id
                                      }
                                    })
                                  }}
                                ></div>
                                <div
                                  className="card-body"
                                  onClick={() => {
                                    push({
                                      pathname:
                                        '/[productSlug]/[taxonomyId]/[productId]',
                                      query: {
                                        productSlug: query.productSlug,
                                        taxonomyId:
                                          taxonomyId ||
                                          (query.child
                                            ? taxonomies
                                                ?.find(
                                                  // eslint-disable-next-line no-shadow
                                                  taxonomy =>
                                                    taxonomy.taxonomyName ===
                                                    taxonomyQuery
                                                )
                                                .childTaxonomies?.find(
                                                  taxonomy =>
                                                    taxonomy.taxonomyName ===
                                                    query.child
                                                )?.id
                                            : taxonomies?.find(
                                                // eslint-disable-next-line no-shadow
                                                taxonomy =>
                                                  taxonomy.taxonomyName ===
                                                  taxonomyQuery
                                              )?.id),
                                        productId: product.id
                                      }
                                    })
                                  }}
                                >
                                  <h5 className="card-title mb-0">
                                    {product.name}
                                  </h5>
                                  <p className="mb-0">WSP : ${product.price}</p>
                                </div>
                              </div>
                              <div
                                className="pl-4 pr-4"
                                style={{
                                  marginBottom: 10
                                }}
                              >
                                <button
                                  type="button"
                                  className="button-e9"
                                  onClick={() =>
                                    addToCartHandler(product.variants[0].id)
                                  }
                                  style={{
                                    marginBottom: 10
                                  }}
                                >
                                  ADD TO CART
                                </button>
                              </div>
                            </div>
                          )
                        }
                        return (
                          <div
                            className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 pl-4 pr-4 mb-4"
                            key={product.id}
                          >
                            <div
                              style={{
                                boxShadow:
                                  '0px 2px 41px -12px rgba(101,96,98,0.2)'
                              }}
                            >
                              <div
                                className="card-img-e9"
                                style={{
                                  backgroundImage: `url(${product.images[0]})`
                                }}
                                onClick={() => {
                                  push({
                                    pathname:
                                      '/[productSlug]/[taxonomyId]/[productId]',
                                    query: {
                                      productSlug: query.productSlug,
                                      taxonomyId:
                                        taxonomyId ||
                                        (query.child
                                          ? taxonomies
                                              ?.find(
                                                // eslint-disable-next-line no-shadow
                                                taxonomy =>
                                                  taxonomy.taxonomyName ===
                                                  taxonomyQuery
                                              )
                                              .childTaxonomies?.find(
                                                taxonomy =>
                                                  taxonomy.taxonomyName ===
                                                  query.child
                                              )?.id
                                          : taxonomies?.find(
                                              // eslint-disable-next-line no-shadow
                                              taxonomy =>
                                                taxonomy.taxonomyName ===
                                                taxonomyQuery
                                            )?.id),
                                      productId: product.id
                                    }
                                  })
                                }}
                              ></div>
                              <div
                                className="card-body"
                                onClick={() => {
                                  push({
                                    pathname:
                                      '/[productSlug]/[taxonomyId]/[productId]',
                                    query: {
                                      productSlug: query.productSlug,
                                      taxonomyId:
                                        taxonomyId ||
                                        (query.child
                                          ? taxonomies
                                              ?.find(
                                                // eslint-disable-next-line no-shadow
                                                taxonomy =>
                                                  taxonomy.taxonomyName ===
                                                  taxonomyQuery
                                              )
                                              .childTaxonomies?.find(
                                                taxonomy =>
                                                  taxonomy.taxonomyName ===
                                                  query.child
                                              )?.id
                                          : taxonomies?.find(
                                              // eslint-disable-next-line no-shadow
                                              taxonomy =>
                                                taxonomy.taxonomyName ===
                                                taxonomyQuery
                                            )?.id),
                                      productId: product.id
                                    }
                                  })
                                }}
                              >
                                <h5 className="card-title mb-0">
                                  {product.name}
                                </h5>
                                <p className="mb-0">WSP : ${product.price}</p>
                              </div>
                              <div
                                className="pl-4 pr-4"
                                style={{
                                  marginBottom: 10
                                }}
                              >
                                <button
                                  type="button"
                                  className="button-e9"
                                  onClick={() =>
                                    addToCartHandler(product.variants[0].id)
                                  }
                                  style={{
                                    marginBottom: 10
                                  }}
                                >
                                  ADD TO CART
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default withApollo(withAuth(DashboardHome))
