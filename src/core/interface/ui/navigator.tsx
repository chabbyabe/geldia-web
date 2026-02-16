import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { useAppSelector } from '@interface/presenters/store/hooks'
import { PAGE_URLS } from '@interface/presenters/constants'
import { DashboardContainer } from '@screens/dashboard/dashboard.container'
import { LoginContainer } from '@screens/login/login.container'
import { SignupContainer } from '@screens/signup/signup.container'
import { AccountsContainer } from '@screens/accounts/accounts.container'

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
        <Route path={PAGE_URLS.DASHBOARD} element={<AlreadyLoggedInRoute element={<DashboardContainer />} />} />
        <Route path={PAGE_URLS.ACCOUNTS} element={<AlreadyLoggedInRoute element={<AccountsContainer />} />} />
        <Route path={PAGE_URLS.SIGNUP} element={<PrivateRoute element={<SignupContainer />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}