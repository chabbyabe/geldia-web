import { PAGE_NAMES } from '@interface/presenters/constants';
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
import React from 'react';

export interface IAccountsViewModel {
  children?: React.ReactNode
}

const AccountsView: React.FC<IAccountsViewModel> = (props) => {
  return (
    <BaseLayoutContainer currentPage={PAGE_NAMES.ACCOUNTS}> 
    </BaseLayoutContainer >
  )
}

export default AccountsView