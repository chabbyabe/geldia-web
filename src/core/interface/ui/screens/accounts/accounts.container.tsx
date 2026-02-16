import { useEffect } from 'react';
import AccountsView from '@interface/ui/screens/accounts/accounts.view'
import AccountsController from '@interface/ui/screens/accounts/accounts.controller';
import { IFormAccount } from '@domain/entities/formModels/account-form.entity';
import { useAppSelector } from '@interface/presenters/store/hooks';
import { IAccount } from '@domain/entities/account/account.entity';

export interface IAccountsContainerViewModel {
  children?: React.ReactNode
}

export const AccountsContainer: React.FC<IAccountsContainerViewModel> = (props) => {

  const controller = new AccountsController();
  const accounts = useAppSelector(state => state.accountState.accounts);
  const users = useAppSelector(state => state.userState.users);
  const currentPage = useAppSelector(state => state.accountState.nextAccountsPage);
  const selectedAccount = useAppSelector(state => state.accountState.currentAccount);
  const paginationData = useAppSelector(state => state.accountState.pagination);

  useEffect(() => {
    controller.retrieveAccount(true, 1);
    controller.retrieveAllUsers();
    controller.removeCurrentAccount();
  }, []);

  const handleDelete = async (account: IAccount) => {
    await controller.deleteAccount(account)
  };

  const handleSubmit = async (values: IFormAccount) => {
    if (selectedAccount) {
      await controller.updateAccount(selectedAccount!.id, values)
    } else {
      await controller.createAccount(values);
    }
  };

  return <AccountsView
    children={props.children}
    accounts={accounts}
    users={users}
    handleSubmit={handleSubmit}
    handleDelete={handleDelete}
    currentPage={currentPage}
    pagination={paginationData}
    handlePagination={controller.retrieveAccount.bind(controller)}
    selectedAccount={selectedAccount}
    handleActionMenu={controller.setCurrentAccount.bind(controller)}
  />
}