import React, { useEffect } from "react";
import { IFormTransaction } from "@domain/entities/formModels/transaction-form.entity";
import TransactionModalView from "./transaction-modal.view";
import { ITransaction } from "@domain/entities/transaction/transaction.entity";
import { useAppSelector } from "@interface/presenters/store/hooks";
import TransactionModalController from "./transaction-modal.controller";
import TransactionsController from "@interface/ui/screens/transactions/transactions.controller";
import { IAccount } from "@domain/entities/account/account.entity";
import { formatToTitleCase } from "@base/core/interface/presenters/helpers";

interface ITransactionModalContainer {
  open: boolean
  onClose: () => void
  selectedTransaction: ITransaction | null
  defaultAccount?: IAccount | null
}

export const TransactionModalContainer: React.FC<ITransactionModalContainer> = (props) => {
  const formOptions = useAppSelector(state => state.transactionState.options);
  const currentUser = useAppSelector(state => state.authState.user);
  const selectedTransaction = useAppSelector(state => state.transactionState.currentTransaction);
  const transactionController = new TransactionsController();
  const modalController = new TransactionModalController();

  const normalizeName = (value: string | null | undefined) => {
    const normalizedValue = formatToTitleCase(value ?? "");
    return normalizedValue || null;
  };

  const serializeTransactionPayload = (values: IFormTransaction) => {
    const category = normalizeName(values.category);
    const store = normalizeName(values.store);
    const place = normalizeName(values.place);
    const payload = {
      ...values,
      category,
      store,
      place,
      userId: currentUser?.id,
      accountId: values.account,
      transactionTypeId: values.transactionType,
      categoryName: category,
      storeName: store,
      placeName: place,
      tagsNames: values.tags ?? [],
    };
    return payload;
  };

  const handleFormSubmit = async (values: IFormTransaction) => {
    const payload = serializeTransactionPayload(values);

    if (selectedTransaction) {
      await transactionController.updateTransaction(selectedTransaction.id, payload as IFormTransaction)
    } else {
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
    defaultAccount={props.defaultAccount ?? null}
    handleFormSumbit={handleFormSubmit}
    currentUser={currentUser}
  />;
};
