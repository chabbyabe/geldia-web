import React, { useEffect } from "react";
import { IFormTransaction } from "@domain/entities/formModels/transaction-form.entity";
import TransactionModalView from "./transaction-modal.view";
import { ITransaction } from "@domain/entities/transaction/transaction.entity";
import { useAppSelector } from "@interface/presenters/store/hooks";
import TransactionModalController from "./transaction-modal.controller";
import TransactionsController from "@interface/ui/screens/transactions/transactions.controller";

interface ITransactionModalContainer {
  open: boolean
  onClose: () => void
  selectedTransaction: ITransaction | null
}

export const TransactionModalContainer: React.FC<ITransactionModalContainer> = (props) => {
  const formOptions = useAppSelector(state => state.transactionState.options);
  const currentUser = useAppSelector(state => state.authState.user);
  const selectedTransaction = useAppSelector(state => state.transactionState.currentTransaction);
  const transactionController = new TransactionsController();
  const modalController = new TransactionModalController();

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
      await transactionController.updateTransaction(selectedTransaction!.id, values)
    }else{
      await transactionController.createTransaction(payload);
    }     
    await modalController.retrieveFormOptions();
  };

  useEffect(() => {
    modalController.retrieveFormOptions();
  }, []);
  
  return <TransactionModalView
    open={props.open}
    onClose={props.onClose}
    formOptions={formOptions}
    selectedTransaction={props.selectedTransaction}
    handleFormSumbit={handleFormSubmit}
  />;
};
