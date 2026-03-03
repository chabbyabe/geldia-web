import { useEffect, useState } from 'react';
import TransactionsView from '@interface/ui/screens/transactions/transactions.view'
import TransactionsController from '@interface/ui/screens/transactions/transactions.controller';
import { useAppSelector } from '@interface/presenters/store/hooks';
import { IFormTransaction } from '@domain/entities/formModels/transaction-form.entity';

export interface ITransactionsContainerViewModel {
  children?: React.ReactNode
}

export const TransactionsContainer: React.FC<ITransactionsContainerViewModel> = (props) => {

  const controller = new TransactionsController();
  const transactionsData = useAppSelector(state => state.transactionState.transactions);
  const currentPage = useAppSelector(state => state.transactionState.nextTransactionsPage);
  const selectedTransaction = useAppSelector(state => state.transactionState.currentTransaction);
  const paginationData = useAppSelector(state => state.transactionState.pagination);
  const formOptions = useAppSelector(state => state.transactionState.options);
  const currentUser = useAppSelector(state => state.authState.user);

  useEffect(() => {
    controller.retrieveFormOptions();
  }, []);
  
  const handleDelete = async (transactionId: number) => {
      await controller.deleteTransaction(transactionId)
  };

  const handleFormSubmit = async (values: IFormTransaction) => {
    const payload = {
      ...values,
      userId: currentUser?.id,
      accountId: values.account,
      transactionTypeId: values.transactionType,
      categoryName: values.category,
      storeName: values.store,
      placeName:  values.place,
      tagsNames: values.tags ?? [],
    }
    delete payload.category;
    delete payload.store;
    delete payload.place;

    if (selectedTransaction) {
      await controller.updateTransaction(selectedTransaction!.id, values)
    }else{
      await controller.createTransaction(payload);
    }     
  };

  return <TransactionsView
    children={props.children}
    transactions={transactionsData}
    handleFormSubmit={handleFormSubmit}
    handleDelete={handleDelete}
    currentPage={currentPage}
    pagination={paginationData}
    handlePagination={controller.retrieveTransactions.bind(controller)}
    selectedTransaction={selectedTransaction}
    handleActionMenu={controller.setCurrentTransaction.bind(controller)}
    formOptions={formOptions}
    removeCurrentTransaction={controller.removeCurrentTransaction.bind(controller)}
  />
}