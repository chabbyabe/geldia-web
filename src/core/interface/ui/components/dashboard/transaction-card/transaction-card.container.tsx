import React from "react";
import { ITransaction } from "@domain/entities/transaction/transaction.entity";
import TransactionCardView from "./transaction-card.view";

interface ITransactionCardContainer {
  transactions: ITransaction[];
}

export const TransactionCardContainer: React.FC<ITransactionCardContainer> = (props) => {
  return <TransactionCardView
    transactions={props.transactions ?? []}
  />;
};