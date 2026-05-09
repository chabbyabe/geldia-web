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
import { AccountTransactionsContainer } from '@screens/account-transactions/account-transactions.container'
import { TransactionsContainer } from '@screens/transactions/transactions.container'
import { ReportsContainer } from '@screens/reports/reports.container'
import { LogsContainer } from '@screens/logs/logs.container'
import { LogsAccountsContainer } from '@screens/logs-accounts/logs-accounts.container'
import { LandingContainer } from '@screens/landing/landing.container'
import { CategoriesContainer } from '@screens/categories/categories.container'
import { TagsContainer } from '@screens/tags/tags.container'
import { StoresContainer } from '@screens/stores/stores.container'
import { PlacesContainer } from '@screens/places/places.container'
import { SettingsContainer } from '@screens/settings/settings.container'

export const Navigator = () => {
  const currentUser = useAppSelector(state => state.authState.user);
  const initialized = useAppSelector(state => state.authState.initialized);

  const PrivateRoute: React.FC<{ element: any }> = (props) => {
    if (!initialized) {
      return null
    }

    return Boolean(currentUser) ? <Navigate to={PAGES.DASHBOARD.path} /> : props.element;
  }

  const AlreadyLoggedInRoute: React.FC<{ element: any, needAdmin?: boolean }> = (props) => {
    const userInfo = currentUser;
    if (!initialized) {
      return null
    }

    return Boolean(userInfo) ? props.element : <Navigate to={PAGES.LOGIN.path} /> ;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PrivateRoute element={<LandingContainer />} />} />
        <Route path={PAGES.LOGIN.path} element={<PrivateRoute element={<LoginContainer />} />} />
        <Route path={PAGES.DASHBOARD.path} element={<AlreadyLoggedInRoute element={<DashboardContainer />} />} />
        <Route path={PAGES.SIGNUP.path} element={<PrivateRoute element={<SignupContainer />} />} />
        <Route path={PAGES.TRANSACTIONS.path} element={<AlreadyLoggedInRoute element={<TransactionsContainer />} />} />
        <Route path={PAGES.ACCOUNT_TRANSACTIONS.path} element={<AlreadyLoggedInRoute element={<AccountTransactionsContainer />} />} />
        <Route path={PAGES.ACCOUNTS.path} element={<AlreadyLoggedInRoute element={<AccountsContainer />} />} />
        <Route path={PAGES.REPORTS.path} element={<AlreadyLoggedInRoute element={<ReportsContainer />} />} />
        <Route path={PAGES.LOGS.path} element={<Navigate to={PAGES.LOGS_TRANSACTIONS.path} replace />} />
        <Route path={PAGES.LOGS_TRANSACTIONS.path} element={<AlreadyLoggedInRoute element={<LogsContainer />} />} />
        <Route path={PAGES.LOGS_ACCOUNTS.path} element={<AlreadyLoggedInRoute element={<LogsAccountsContainer />} />} />
        <Route path={PAGES.CATEGORIES.path} element={<AlreadyLoggedInRoute element={<CategoriesContainer />} />} />
        <Route path={PAGES.TAGS.path} element={<AlreadyLoggedInRoute element={<TagsContainer />} />} />
        <Route path={PAGES.STORES.path} element={<AlreadyLoggedInRoute element={<StoresContainer />} />} />
        <Route path={PAGES.PLACES.path} element={<AlreadyLoggedInRoute element={<PlacesContainer />} />} />
        <Route path={PAGES.SETTINGS.path} element={<AlreadyLoggedInRoute element={<SettingsContainer />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
