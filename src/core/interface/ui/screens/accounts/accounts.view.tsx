import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
import React from 'react';

export interface IAccountsViewModel {
  children?: React.ReactNode
}

const AccountsView: React.FC<IAccountsViewModel> = (props) => {


  return (
    <BaseLayoutContainer currentPage={'Accounts'}> 
    </BaseLayoutContainer >
  )
}

export default AccountsView