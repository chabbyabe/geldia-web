import React, { useState } from 'react'
import BaseLayoutView from "@interface/ui/components/common/layouts/base-layout/base-layout.view"


export interface IBaseLayoutContainerViewModel {
  children?: React.ReactNode
  currentPage: string
  sidebarCurrentPage?: string
}

export const BaseLayoutContainer: React.FC<IBaseLayoutContainerViewModel> = (props) => {
  const [open, setOpen] = useState(true)
  const toggleSidebar = () => {
    setOpen(!open);
  };
  return <BaseLayoutView
    children={props.children}
    onToggleSidebar={toggleSidebar}
    sidebarOpen={open}
    currentPage={props.currentPage}
    sidebarCurrentPage={props.sidebarCurrentPage ?? props.currentPage}
  />
}
