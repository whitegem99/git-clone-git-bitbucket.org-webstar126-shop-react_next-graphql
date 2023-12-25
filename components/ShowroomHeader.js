/* eslint-disable react/jsx-no-target-blank */
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback
} from 'react'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Button } from 'reactstrap'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Skeleton from 'react-loading-skeleton'
import Cookies from 'universal-cookie'
import Router, { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { slide as Menu } from 'react-burger-menu'

import { LOGOUT } from '../libs/graphql/auth'
import {
  SEARCH_BRANDS,
  SEARCH_PRODUCTS,
  SEARCH_TAXONOMIES
} from '../libs/graphql/search'

import CartSidebar from './BuyerDashboard/CartSidebar'
/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, setIsOpen) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, setIsOpen])
}

const ProductsList = ({ products }) => {
  return (
    <div className="products-container">
      {products?.map(product => (
        <a
          href={`/brands/${product.brandId}/product/${product.id}?type=product`}
          key={product.id}
          target="_blank"
        >
          <div className="product-container">
            <img src={product.images[0]} alt={product.id} />
            <div>
              <span>{product.name}</span>
              <span>${product.price.toFixed(2)}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

const BrandsList = ({
  brands,
  brandIds,
  fetchMoreBrands,
  totalBrandPages,
  currentBrandPage
}) => {
  const observer = useRef()
  const lastBrandElement = useCallback(node => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentBrandPage < totalBrandPages) {
        fetchMoreBrands({
          query: SEARCH_BRANDS,
          variables: {
            search: '',
            page: currentBrandPage + 1
          },
          updateQuery: (prevResults, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prevResults
            const resultingBrands = []
            // eslint-disable-next-line no-unused-vars
            const filteringBrands = [
              ...prevResults.searchBrands.brands,
              ...fetchMoreResult.searchBrands.brands
            ].filter(brand => {
              const i = resultingBrands.findIndex(x => x.id === brand.id)
              if (i <= -1) {
                resultingBrands.push(brand)
              }
              return null
            })
            return {
              ...prevResults,
              searchBrands: {
                ...prevResults.searchBrands,
                brands: [...resultingBrands],
                currentPage: currentBrandPage + 1
              }
            }
          }
        })
      }
    })
    if (node) observer.current.observe(node)
  }, [])
  return (
    <div className="brands-container">
      {brands
        ?.filter(brand => brandIds.includes(brand.id))
        .map((brand, index) => {
          if (brands.length === index + 1) {
            return (
              <a
                ref={lastBrandElement}
                href={`/brands/${brand.id}`}
                key={brand.id}
                target="_blank"
              >
                <div className="brand-container">
                  <img src={brand.logo} alt={brand.id} />
                  <div>
                    <span>{brand.brandName}</span>
                    <span>${brand.minimumOrderAmount.toFixed(2)}</span>
                  </div>
                </div>
              </a>
            )
          }
          return (
            <a href={`/brands/${brand.id}`} key={brand.id} target="_blank">
              <div className="brand-container">
                <img src={brand.logo} alt={brand.id} />
                <div>
                  <span>{brand.brandName}</span>
                  <span>${brand.minimumOrderAmount.toFixed(2)}</span>
                </div>
              </div>
            </a>
          )
        })}
    </div>
  )
}

const SearchBar = forwardRef(
  (
    {
      searchDropDown,
      searchHandler,
      setSearchDropDown,
      productsLoading,
      brandsLoading,
      products,
      brands,
      fetchMoreBrands,
      totalBrandPages,
      currentBrandPage
    },
    ref
  ) => {
    const [activeDropDown, setActiveDropDown] = useState(false)
    return (
      <div className="xsSearch" style={{ width: '40%', position: 'relative' }}>
        <div className="search-bar-container">
          <img src="/assets/images/search.svg" alt="search-logo" />
          <input
            type="text"
            ref={ref}
            onChange={() => searchHandler(ref.current.value)}
            onFocus={() => setSearchDropDown(true)}
            onBlur={() => {
              if (!activeDropDown) {
                setSearchDropDown(false)
              }
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                setSearchDropDown(false)
                setActiveDropDown(false)
                Router.push({
                  pathname: '/search',
                  query: {
                    query: ref.current.value
                  }
                })
              }
            }}
            className="search-bar"
            placeholder="Search for products and brands..."
          />
        </div>
        {searchDropDown && (
          <div
            className="search-dropdown"
            onMouseEnter={() => {
              setActiveDropDown(true)
              setSearchDropDown(true)
            }}
            onMouseLeave={() => {
              setActiveDropDown(false)
            }}
          >
            <div className="search-dropdown-products">
              <h4
                style={{
                  position: 'sticky',
                  top: 0,
                  display: 'inline-block',
                  width: '100%',
                  backgroundColor: 'white',
                  fontSize: 15,
                  paddingBottom: 5
                }}
              >
                Products
              </h4>
              {productsLoading && <Skeleton count={15} />}
              {!productsLoading && <ProductsList products={products} />}
            </div>
            {brands?.filter(brand =>
              products?.map(product => product.brandId).includes(brand.id)
            ).length > 0 && (
              <div className="search-dropdown-brands">
                <h4
                  style={{
                    position: 'sticky',
                    top: 0,
                    display: 'inline-block',
                    width: '100%',
                    backgroundColor: 'white',
                    fontSize: 15,
                    paddingBottom: 5
                  }}
                >
                  Brands
                </h4>
                {brandsLoading && <Skeleton count={15} />}
                {!brandsLoading && (
                  <BrandsList
                    brands={brands}
                    brandIds={products?.map(product => product.brandId)}
                    fetchMoreBrands={fetchMoreBrands}
                    totalBrandPages={totalBrandPages}
                    currentBrandPage={currentBrandPage}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

function Header({
  isPopUpShow,
  setPopUpShow,
  cartStateData = [],
  cartDetailsData,
  token
}) {
  const { query } = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [taxonomyDropDown, setTaxonomyDropDown] = useState({})
  const [searchDropDown, setSearchDropDown] = useState(false)
  const searchRef = useRef()
  const searchHandler = data => {
    setSearchQuery(data)
  }

  const { data: taxonomiesData } = useQuery(SEARCH_TAXONOMIES, {
    variables: {
      domain: 'buyer.playback.ai'
    }
  })

  const { loading: productsLoading, data: productsData } = useQuery(
    SEARCH_PRODUCTS,
    {
      variables: {
        search: searchQuery,
        page: 1
      }
    }
  )

  const {
    loading: brandsLoading,
    data: brandsData,
    fetchMore: fetchMoreBrands
  } = useQuery(SEARCH_BRANDS, {
    variables: {
      search: '',
      page: 1
    }
  })

  const [isCartOpen, setCartOpen] = useState(false)

  const [logout, { client }] = useMutation(LOGOUT)

  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, setCartOpen)

  const changeMenu = () => {
    document.body.classList.toggle('sidebar-open')
  }

  const onClick = async () => {
    await logout()
    const cookies = new Cookies()
    cookies.remove('authToken')
    await client.clearStore()
    await Router.replace('/login')
  }
  // const handleOnOpen = (event) =>{
  //   event.preventDefault();
  // }
  return (
    <>
      <div className="header" ref={wrapperRef}>
        <div className="container">
          <Navbar expand="md">
            <NavbarBrand
              href="#"
              onClick={() => changeMenu()}
              className="hamburger d-md-none d-none"
            >
              {/* <FontAwesomeIcon icon={faBars} /> */}
            </NavbarBrand>
            <NavbarBrand href="/" className="mr-0">
              <img src="/assets/images/logo.svg" alt="logo" className="logo" />
            </NavbarBrand>
            <SearchBar
              ref={searchRef}
              searchDropDown={searchDropDown}
              setSearchDropDown={setSearchDropDown}
              searchHandler={searchHandler}
              productsLoading={productsLoading}
              brandsLoading={brandsLoading}
              products={productsData?.searchProducts?.products}
              brands={brandsData?.searchBrands?.brands}
              fetchMoreBrands={fetchMoreBrands}
              totalBrandPages={brandsData?.searchBrands?.totalPages}
              currentBrandPage={brandsData?.searchBrands?.currentPage}
            />
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="" />
              </NavItem>
              <NavItem />
              <div className="button-grp">
                <a
                  name=""
                  id=""
                  className="menu xsmenu"
                  href="/#social-feed"
                  role="button"
                >
                  Watch Shows
                </a>
                <a
                  name=""
                  id=""
                  className="menu xsmenu"
                  href="/buyers/dashboard/home"
                  role="button"
                >
                  My Dashboard
                </a>
              </div>
              <NavItem>
                <div className={isPopUpShow ? 'dropdown show' : 'dropdown'}>
                  <button
                    className="cart-button p-0 text-light bg-transparent border-0"
                    type="button"
                    onClick={() => setPopUpShow(!isPopUpShow)}
                    style={{ outline: 'none' }}
                    // onMouseEnter={() => setPopUpShow(true)}
                    // onMouseLeave={() => setPopUpShow(false)}
                  >
                    <img
                      src="/assets/images/smart-cart.svg"
                      className="mr-2 cart-icon"
                      alt="cart"
                    />
                    <div className="badge badge-rounded">
                      {cartStateData ? cartStateData.length : 0}
                    </div>
                  </button>
                  <div
                    className={
                      isPopUpShow
                        ? 'dropdown-menu dropdown-menu-right show p-3'
                        : 'dropdown-menu'
                    }
                    style={{ width: '310px' }}
                  >
                    <div className="row justify-content-between">
                      <div className="col-6 pb-2">Added to Cart</div>
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                      <div
                        className="col-6 text-right"
                        onClick={() => setPopUpShow(false)}
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                    <div style={{ maxHeight: '280px', overflow: 'auto' }}>
                      {cartStateData.map(itm => (
                        <div key={itm.id}>
                          <div className="tile-container d-flex align-items-cente">
                            <div
                              className="tile-img"
                              style={{
                                backgroundImage: `url(${itm.variant.image})`
                              }}
                            />
                            <div>
                              <div className="tile-title">
                                {itm.variant.name}
                              </div>
                              <div>WSP: ${itm.variant.wholesalePrice}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <button
                        className="go-to-cart-btn"
                        type="button"
                        onClick={() => {
                          setCartOpen(true)
                          setPopUpShow(false)
                        }}
                      >
                        Go To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </NavItem>
              <NavItem>
                <Button
                  outline
                  color="link"
                  className="logout-button p-0 text-light xsmenu"
                  type="button"
                  onClick={() => onClick()}
                >
                  <img
                    src="/assets/images/logout.svg"
                    className="mr-2 logout xsmenu"
                    alt="cart"
                  />
                </Button>
              </NavItem>
            </Nav>
          </Navbar>
          <Navbar expand="md" className="productVarient">
            <Nav className="ml-auto mr-auto pt-2 productVarient no-scroll">
              {taxonomiesData?.findTaxonomies?.taxonomies?.map(taxonomy => (
                <NavItem
                  key={taxonomy.id}
                  style={{ borderBottom: '1px solid #D6D6D6' }}
                >
                  <NavLink
                    href={`/${taxonomy.taxonomyName
                      .toLowerCase()
                      .split(' ')
                      .join('-')}`}
                    onMouseEnter={() =>
                      setTaxonomyDropDown({
                        parentTaxonomy: taxonomy.taxonomyName,
                        childTaxonomies: taxonomy.childTaxonomies
                      })
                    }
                    style={
                      query.productSlug ===
                      taxonomy.taxonomyName
                        .toLowerCase()
                        .split(' ')
                        .join('-')
                        ? { color: '#1D1D1D', fontWeight: 600 }
                        : null
                    }
                  >
                    {taxonomy.taxonomyName}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Navbar>
          {taxonomyDropDown && (
            <Navbar expand="md" onMouseLeave={() => setTaxonomyDropDown(null)}>
              <Nav className="ml-auto mr-auto">
                {taxonomyDropDown.childTaxonomies?.map(taxonomy => (
                  <NavItem key={taxonomy.id}>
                    <NavLink
                      href={`/${taxonomyDropDown.parentTaxonomy
                        .toLowerCase()
                        .split(' ')
                        .join('-')}?child=${taxonomy.taxonomyName}`}
                    >
                      {taxonomy.taxonomyName}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </Navbar>
          )}
          <Menu disableOverlayClick>
            <NavItem>
              <NavLink href="/#social-feed">Watch Shows</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/buyers/dashboard/home"> My Dashboard</NavLink>
            </NavItem>
            <Navbar expand="md" className="p-0 xsCategories">
              <h4>Categories for You</h4>
              <Nav>
                {taxonomiesData?.findTaxonomies?.taxonomies?.map(taxonomy => (
                  <NavItem key={taxonomy.id}>
                    <NavLink
                      href={`/${taxonomy.taxonomyName
                        .toLowerCase()
                        .split(' ')
                        .join('-')}`}
                      onMouseEnter={() =>
                        setTaxonomyDropDown({
                          parentTaxonomy: taxonomy.taxonomyName,
                          childTaxonomies: taxonomy.childTaxonomies
                        })
                      }
                      style={
                        query.productSlug ===
                        taxonomy.taxonomyName
                          .toLowerCase()
                          .split(' ')
                          .join('-')
                          ? { color: '#1D1D1D', fontWeight: 600 }
                          : null
                      }
                    >
                      {taxonomy.taxonomyName}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </Navbar>
            {taxonomyDropDown && (
              <Navbar
                expand="md"
                onMouseLeave={() => setTaxonomyDropDown(null)}
              >
                <Nav className="ml-auto mr-auto">
                  {taxonomyDropDown.childTaxonomies?.map(taxonomy => (
                    <NavItem key={taxonomy.id}>
                      <NavLink
                        href={`/${taxonomyDropDown.parentTaxonomy
                          .toLowerCase()
                          .split(' ')
                          .join('-')}?child=${taxonomy.taxonomyName}`}
                      >
                        {taxonomy.taxonomyName}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </Navbar>
            )}
            <NavItem>
              <NavLink
                outline
                color="link"
                className="logout-button p-0"
                onClick={() => onClick()}
              >
                logout
              </NavLink>
            </NavItem>
          </Menu>
        </div>
        <CartSidebar
          isCartOpen={isCartOpen}
          setCartOpen={setCartOpen}
          cartDetailsData={cartDetailsData}
          tokenNew={token}
        />
      </div>
    </>
  )
}

export default Header
