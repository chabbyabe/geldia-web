import AccountsView from '@interface/ui/screens/accounts/accounts.view'

export interface IAccountsContainerViewModel {
  children?: React.ReactNode
}

export const AccountsContainer: React.FC<IAccountsContainerViewModel> = (props) => {

  return <AccountsView
    children={props.children}
  />
}