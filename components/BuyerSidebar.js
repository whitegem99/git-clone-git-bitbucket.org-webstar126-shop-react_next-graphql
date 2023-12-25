import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SidebarItem = props => {
  const router = useRouter()
  const { name, url, id } = props

  const getClassName = path => {
    if (router.pathname.includes(path)) return 'active'

    return ''
  }

  return (
    <li id={`Tooltip-${id}`}>
      <Link href={url}>
        <a className={getClassName(url)}>
          <span>{name}</span>
        </a>
      </Link>
    </li>
  )
}

const BuyerSidebar = () => {
  return (
    <div className="buyer-sidebar">
      <ul className="sidebar-menu">
        <SidebarItem name="Home" id="home" url="/buyers/dashboard/home" />
        <SidebarItem name="Brands" id="brands" url="/buyers/dashboard/brands" />
        <SidebarItem name="Orders" id="orders" url="/buyers/dashboard/orders" />
        <SidebarItem
          name="Messages"
          id="messages"
          url="/buyers/dashboard/messages"
        />
        <SidebarItem
          name="Invoice"
          id="invoice"
          url="/buyers/dashboard/invoice"
        />
        <SidebarItem
          name="Settings"
          id="settings"
          url="/buyers/dashboard/settings"
        />
      </ul>
    </div>
  )
}

export default BuyerSidebar
