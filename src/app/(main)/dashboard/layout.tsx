import React from 'react'

interface LayoutProps {
    children: React.ReactNode,
    params: any
}

const DashboardLayout = ({ children, params }: LayoutProps)=> {
  return (
    <div className='flex overflow-hidden h-screen'>{children}</div>
  )
}

export default DashboardLayout