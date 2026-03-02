import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { useAppSelector } from '@interface/presenters/store/hooks'
import { DashboardContainer } from '@screens/dashboard/dashboard.container'
import { LoginContainer } from '@screens/login/login.container'
import { SignupContainer } from '@screens/signup/signup.container'

export const Navigator = () => {
  const currentUser = useAppSelector(state => state.authState.user);

  const PrivateRoute: React.FC<{ element: any }> = (props) => {
    return props.element;
  }

  const AlreadyLoggedInRoute: React.FC<{ element: any }> = (props) => {
    const userInfo = currentUser;
    return Boolean(userInfo) ? props.element : <Navigate to='/' /> ;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PrivateRoute element={<LoginContainer />} />} />
        <Route path='/dashboard' element={<AlreadyLoggedInRoute element={<DashboardContainer />} />} />
        <Route path='/signup' element={<PrivateRoute element={<SignupContainer />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}