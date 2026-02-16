import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { SidebarView } from '@interface/ui/components/common/sidebar/sidebar.view'

export interface ISidebarContainerViewModel {
  onToggleSidebar: () => void
  sidebarOpen: boolean
  currentPage: string
}

export const SidebarContainer: React.FC<ISidebarContainerViewModel> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  return <SidebarView
    onToggleSidebar={props.onToggleSidebar}
    sidebarOpen={props.sidebarOpen}
    currentPage={props.currentPage}
    navigateTo={navigate}
    isLoading={isLoading}
  />
}