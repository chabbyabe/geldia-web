import { Navigator } from '@interface/ui/navigator';
import { ToastContainer } from 'react-toastify'
import AuthBootstrapContainer from '@interface/ui/components/common/auth-bootstrap/auth-bootstrap.container';


export const App = () => (
  <>
    <ToastContainer />
    <AuthBootstrapContainer />
    <Navigator />
  </>
)
