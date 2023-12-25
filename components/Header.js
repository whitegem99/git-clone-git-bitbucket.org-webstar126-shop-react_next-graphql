import React from 'react'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Router from 'next/router'

function Header() {
  const changeMenu = () => {
    document.body.classList.toggle('sidebar-open')
  }

  const handleWithoutLogin = () => {
    return Router.replace('/login')
  }

  return (
    <div className="header">
      <div className="container">
        <Navbar expand="md">
          <NavbarBrand
            href="#"
            onClick={changeMenu}
            className="hamburger d-md-none"
          >
            <FontAwesomeIcon icon={faBars} />
          </NavbarBrand>
          <NavbarBrand href="/" className="mr-0">
            <img src="/assets/images/logo.svg" alt="logo" className="logo" />
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/#social-feed">Social Feed</NavLink>
            </NavItem>
            <NavItem>
              <div className="dropdown">
                <button
                  className="cart-button p-0 text-light bg-transparent border-0"
                  type="button"
                  onClick={() => handleWithoutLogin()}
                  style={{ outline: 'none' }}
                >
                  <img
                    src="/assets/images/smart-cart.svg"
                    className="mr-2 cart-icon"
                    alt="cart"
                  />
                  <div className="badge badge-rounded">{0}</div>
                </button>
              </div>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    </div>
  )
}

export default Header
