import React from 'react'

interface LayoutProps {
    children: React.ReactNode,
    params: any
}

const Layout = ({ children, params }: LayoutProps)=> {
  return (
    <div className=''>{children}</div>
  )
}

export default Layout