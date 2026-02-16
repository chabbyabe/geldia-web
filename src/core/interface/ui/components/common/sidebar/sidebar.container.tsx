import { useNavigate } from 'react-router-dom';
import { SidebarView } from '@interface/ui/components/common/sidebar/sidebar.view'

export interface ISidebarContainerViewModel {
  onToggleSidebar: () => void
  sidebarOpen: boolean
  currentPage: string
}

export const SidebarContainer: React.FC<ISidebarContainerViewModel> = (props) => {
  const navigate = useNavigate();

  return <SidebarView
    onToggleSidebar={props.onToggleSidebar}
    sidebarOpen={props.sidebarOpen}
    currentPage={props.currentPage}
    navigateTo={navigate}
  />
}