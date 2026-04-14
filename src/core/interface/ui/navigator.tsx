import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { useAppSelector } from '@interface/presenters/store/hooks'
import { PAGES } from '@interface/presenters/constants'
import { DashboardContainer } from '@screens/dashboard/dashboard.container'
import { LoginContainer } from '@screens/login/login.container'
import { SignupContainer } from '@screens/signup/signup.container'
import { AccountsContainer } from '@screens/accounts/accounts.container'
import { TransactionsContainer } from '@screens/transactions/transactions.container'
import { ReportsContainer } from '@screens/reports/reports.container'
import { LogsContainer } from '@screens/logs/logs.container'
import { LandingContainer } from '@screens/landing/landing.container'
import { CategoriesContainer } from '@screens/categories/categories.container'
import { TagsContainer } from '@screens/tags/tags.container'
import { StoresContainer } from '@screens/stores/stores.container'
import { PlacesContainer } from '@screens/places/places.container'

export const Navigator = () => {
  const currentUser = useAppSelector(state => state.authState.user);

  const PrivateRoute: React.FC<{ element: any }> = (props) => {
    return props.element;
  }

  const AlreadyLoggedInRoute: React.FC<{ element: any, needAdmin?: boolean }> = (props) => {
    const userInfo = currentUser;
    return Boolean(userInfo) ? props.element : <Navigate to='/' /> ;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PrivateRoute element={<LandingContainer />} />} />
        <Route path={PAGES.LOGIN.path} element={<PrivateRoute element={<LoginContainer />} />} />
        <Route path={PAGES.DASHBOARD.path} element={<AlreadyLoggedInRoute element={<DashboardContainer />} />} />
        <Route path={PAGES.SIGNUP.path} element={<PrivateRoute element={<SignupContainer />} />} />
        <Route path={PAGES.TRANSACTIONS.path} element={<AlreadyLoggedInRoute element={<TransactionsContainer />} />} />
        <Route path={PAGES.ACCOUNTS.path} element={<AlreadyLoggedInRoute element={<AccountsContainer />} />} />
        <Route path={PAGES.REPORTS.path} element={<AlreadyLoggedInRoute element={<ReportsContainer />} />} />
        <Route path={PAGES.LOGS.path} element={<AlreadyLoggedInRoute element={<LogsContainer />} />} />
        <Route path={PAGES.CATEGORIES.path} element={<AlreadyLoggedInRoute element={<CategoriesContainer />} />} />
        <Route path={PAGES.TAGS.path} element={<AlreadyLoggedInRoute element={<TagsContainer />} />} />
        <Route path={PAGES.STORES.path} element={<AlreadyLoggedInRoute element={<StoresContainer />} />} />
        <Route path={PAGES.PLACES.path} element={<AlreadyLoggedInRoute element={<PlacesContainer />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
