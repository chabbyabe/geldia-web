import React from "react";
import { IFormTransaction } from "@domain/entities/formModels/transaction-form.entity";
import TransactionModalView from "./transaction-modal.view";
import { ITransaction } from "@domain/entities/transaction/transaction.entity";
import { ITransactionInitial } from "@domain/entities/transaction/initial.entity";

interface ITransactionModalContainer {
  open: boolean
  onClose: () => void
  formOptions: ITransactionInitial
  handleFormSumbit: (values: IFormTransaction) => Promise<void> | void
  selectedTransaction: ITransaction | null
}

export const TransactionModalContainer: React.FC<ITransactionModalContainer> = (props) => {
  return <TransactionModalView
    open={props.open}
    onClose={props.onClose}
    formOptions={props.formOptions}
    selectedTransaction={props.selectedTransaction}
    handleFormSumbit={props.handleFormSumbit}
  />;
};
