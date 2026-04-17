import TransactionsView from '@interface/ui/screens/transactions/transactions.view'
import TransactionsController from '@interface/ui/screens/transactions/transactions.controller';
import { useAppSelector } from '@interface/presenters/store/hooks';

export interface ITransactionsContainerViewModel {
  children?: React.ReactNode
}

export const TransactionsContainer: React.FC<ITransactionsContainerViewModel> = (props) => {

  const controller = new TransactionsController();
  const transactionsData = useAppSelector(state => state.transactionState.transactions);
  const currentPage = useAppSelector(state => state.transactionState.nextTransactionsPage);
  const selectedTransaction = useAppSelector(state => state.transactionState.currentTransaction);
  const paginationData = useAppSelector(state => state.transactionState.pagination);
  const currentUser = useAppSelector(state => state.authState.user);

  const handleDelete = async (transactionId: number) => {
      await controller.deleteTransaction(transactionId)
  };

  return <TransactionsView
    children={props.children}
    transactions={transactionsData}
    handleDelete={handleDelete}
    currentPage={currentPage}
    pagination={paginationData}
    handlePagination={controller.retrieveTransactions.bind(controller)}
    selectedTransaction={selectedTransaction}
    handleActionMenu={controller.setCurrentTransaction.bind(controller)}
    removeCurrentTransaction={controller.removeCurrentTransaction.bind(controller)}
    currentUser={currentUser}
  />
}