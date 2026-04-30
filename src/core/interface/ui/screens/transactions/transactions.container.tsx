import { useCallback, useMemo } from 'react';
import TransactionsView from '@interface/ui/screens/transactions/transactions.view'
import TransactionsController from '@interface/ui/screens/transactions/transactions.controller';
import { useAppSelector } from '@interface/presenters/store/hooks';

export interface ITransactionsContainerViewModel {
  children?: React.ReactNode
}

export const TransactionsContainer: React.FC<ITransactionsContainerViewModel> = (props) => {
  const controller = useMemo(() => new TransactionsController(), []);
  const transactionsData = useAppSelector(state => state.transactionState.transactions);
  const currentPage = useAppSelector(state => state.transactionState.nextTransactionsPage);
  const selectedTransaction = useAppSelector(state => state.transactionState.currentTransaction);
  const paginationData = useAppSelector(state => state.transactionState.pagination);
  const currentUser = useAppSelector(state => state.authState.user);

  const handleDelete = useCallback(async (transactionId: number) => {
      await controller.deleteTransaction(transactionId)
  }, [controller]);

  const handlePagination = useCallback(async (...args: Parameters<TransactionsController['retrieveTransactions']>) => {
    await controller.retrieveTransactions(...args);
  }, [controller]);

  const handleActionMenu = useCallback(async (...args: Parameters<TransactionsController['setCurrentTransaction']>) => {
    await controller.setCurrentTransaction(...args);
  }, [controller]);

  const removeCurrentTransaction = useCallback(() => {
    controller.removeCurrentTransaction();
  }, [controller]);

  return <TransactionsView
    children={props.children}
    transactions={transactionsData}
    handleDelete={handleDelete}
    currentPage={currentPage}
    pagination={paginationData}
    handlePagination={handlePagination}
    selectedTransaction={selectedTransaction}
    handleActionMenu={handleActionMenu}
    removeCurrentTransaction={removeCurrentTransaction}
    currentUser={currentUser}
  />
}
