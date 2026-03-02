import React from 'react'
import { IAccount } from '@domain/entities/account/account.entity';
import AccountModalView from './account-modal.view';
import { IUser } from '@domain/entities/user/user.entity';
import { IFormAccount } from '@domain/entities/formModels/account-form.entity';
import IconOptions from '@interface/ui/components/common/account/account-icon.constant';
import { ACCOUNT_COLORS } from '@interface/presenters/constants';

export interface IAccountModalContainer {
  children?: React.ReactNode
  selectedAccount: IAccount | null
  users: IUser[]
  handleSubmit: (values: IFormAccount) => void
  handleMainModalClose: () => void
  showModal: boolean,
}

export const AccountModalContainer: React.FC<IAccountModalContainer> = (props) => {

  return <AccountModalView
    children={props.children}
    handleClose={props.handleMainModalClose}
    handleSubmit={props.handleSubmit}
    users={props.users}
    colors={ACCOUNT_COLORS}
    iconOptions={IconOptions}
    showModal={props.showModal}
    selectedAccount={props.selectedAccount}
  />
}