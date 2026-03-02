import { toast } from 'react-toastify'
import NavbarController from '@interface/ui/components/common/navbar/navbar.controller'
import { NavbarView } from '@interface/ui/components/common/navbar/navbar.view'
import { useAppSelector } from '@base/core/interface/presenters/store/hooks'

export interface INavbarContainerViewModel {
  onToggleSidebar: () => void
  sidebarOpen: boolean
  currentPage: string
}

export const NavbarContainer: React.FC<INavbarContainerViewModel> = (props) => {
  const controller = new NavbarController()
  const user = useAppSelector(state => state.authState.user ?? undefined);
  const handleLogout = async () => {
    controller.logout()
    toast.success('Successfully Logout!')
  };

  return <NavbarView
    onToggleSidebar={props.onToggleSidebar}
    sidebarOpen={props.sidebarOpen}
    currentPage={props.currentPage}
    handleLogout={handleLogout}
    user={user}
  />

}