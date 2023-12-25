import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Tooltip } from 'reactstrap'

const SidebarItem = props => {
  const router = useRouter()
  const { name, icon, url, id } = props
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const toggle = () => setTooltipOpen(!tooltipOpen)

  const getClassName = path => {
    if (router.pathname.includes(path)) return 'active'

    return ''
  }

  return (
    <li id={`Tooltip-${id}`}>
      <Link href={url}>
        <a className={getClassName(url)}>
          <i className={icon} />
        </a>
      </Link>
      <Tooltip
        placement="right"
        isOpen={tooltipOpen}
        target={`Tooltip-${id}`}
        toggle={toggle}
      >
        {name}
      </Tooltip>
    </li>
  )
}

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <SidebarItem
          name="Brands"
          id="brands"
          icon="fpq-campaign"
          url="/brands"
        />
        <SidebarItem
          name="Products"
          id="products"
          icon="fpq-package"
          url="/products"
        />
        <SidebarItem
          name="Promoters"
          id="promoters"
          icon="fpq-community"
          url="/promoters"
        />
        <SidebarItem
          name="Videos"
          id="videos"
          icon="fpq-video-camera"
          url="/videos"
        />
        <SidebarItem
          name="Contacts"
          id="contact"
          icon="fpq-contact"
          url="/contacts"
        />
        <SidebarItem
          name="Reports"
          id="reports"
          icon="fpq-graph"
          url="/reports"
        />
        <SidebarItem
          name="Messages"
          id="message"
          icon="fpq-conversation"
          url="/message"
        />
        <SidebarItem
          name="Settings"
          id="settings"
          icon="fpq-settings"
          url="/settings"
        />
      </ul>
    </div>
  )
}

export default Sidebar
