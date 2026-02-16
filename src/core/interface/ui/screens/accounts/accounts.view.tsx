import { PAGES } from '@interface/presenters/constants';
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
export interface IAccountsViewModel {
  children?: React.ReactNode
}

const AccountsView: React.FC<IAccountsViewModel> = (props) => {
  return (
    <BaseLayoutContainer currentPage={PAGES.ACCOUNTS.label}> 

    </BaseLayoutContainer >
  )
}

export default AccountsView