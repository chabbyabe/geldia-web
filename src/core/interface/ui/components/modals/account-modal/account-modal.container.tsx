import React from 'react'
import { IAccount } from '@domain/entities/account/account.entity';
import AccountModalView from './account-modal.view';
import { IUser } from '@domain/entities/user/user.entity';
import { IFormAccount } from '@domain/entities/formModels/account-form.entity';
import { ICategory } from '@domain/entities/category/category.entity';
import { ICategorySimple, ITransactionType } from '@domain/entities/transaction/transaction.entity';
import { IFormCategory } from '@domain/entities/formModels/category-form.entity';

export interface IAccountModalContainer {
  children?: React.ReactNode
  selectedAccount: IAccount | null
  users: IUser[]
  handleSubmit: (values: IFormAccount) => void
  handleMainModalClose: () => void
  showModal: boolean,
  categoryOptions: ICategorySimple[]
  categories: ICategory[]
  selectedCategory: ICategory | null
  transactionTypes: ITransactionType[]
  handleCategorySubmit: (values: IFormCategory) => void | Promise<void>
  handleCategoryDelete: (category: ICategory) => void | Promise<void>
  handleSetCurrentCategory: (id: number) => void | Promise<void>
  clearCurrentCategory: () => void
}

export const AccountModalContainer: React.FC<IAccountModalContainer> = (props) => {

  return <AccountModalView
    children={props.children}
    handleClose={props.handleMainModalClose}
    handleSubmit={props.handleSubmit}
    users={props.users}
    showModal={props.showModal}
    selectedAccount={props.selectedAccount}
    categoryOptions={props.categoryOptions}
    categories={props.categories}
    selectedCategory={props.selectedCategory}
    transactionTypes={props.transactionTypes}
    handleCategorySubmit={props.handleCategorySubmit}
    handleCategoryDelete={props.handleCategoryDelete}
    handleSetCurrentCategory={props.handleSetCurrentCategory}
    clearCurrentCategory={props.clearCurrentCategory}
  />
}
