import TransactionsView from '@interface/ui/screens/transactions/transactions.view'

export interface ITransactionsContainerViewModel {
  children?: React.ReactNode
}

export const TransactionsContainer: React.FC<ITransactionsContainerViewModel> = (props) => {

  return <TransactionsView
    children={props.children}
  />
}