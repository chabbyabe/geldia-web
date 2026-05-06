import { toast } from 'react-toastify'
import NavbarController from '@interface/ui/components/common/navbar/navbar.controller'
import { NavbarView } from '@interface/ui/components/common/navbar/navbar.view'
import { useAppSelector } from '@interface/presenters/store/hooks'
import { useNavigate } from 'react-router-dom'
import { PAGES } from '@interface/presenters/constants'

export interface INavbarContainerViewModel {
  onToggleSidebar: () => void
  sidebarOpen: boolean
  currentPage: string
}

export const NavbarContainer: React.FC<INavbarContainerViewModel> = (props) => {
  const controller = new NavbarController()
  const navigate = useNavigate()
  
  const user = useAppSelector(state => state.authState.user ?? undefined)

  const handleLogout = async () => {
    try {
      await controller.logout()
      toast.success('Successfully logged out!')
    } catch (error) {
      toast.error('Logged out locally, but we could not complete the server logout request.')
    } finally {
      navigate(PAGES.LOGIN.path)
    }
  }

  return <NavbarView
    onToggleSidebar={props.onToggleSidebar}
    sidebarOpen={props.sidebarOpen}
    currentPage={props.currentPage}
    handleLogout={handleLogout}
    user={user}
  />

}
