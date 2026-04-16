import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AccountsController from '@interface/ui/screens/accounts/accounts.controller';
import TransactionsController from '@interface/ui/screens/transactions/transactions.controller';
import TransactionsView from '@interface/ui/screens/transactions/transactions.view';
import { useAppSelector } from '@interface/presenters/store/hooks';
import { ITransactionSearchParams } from '@domain/entities/transaction/search.entity';
import { GridFilterModel } from '@mui/x-data-grid';
import { PAGES } from '@interface/presenters/constants';

export const AccountTransactionsContainer: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const parsedAccountId = Number(accountId);

  const accountsController = new AccountsController();
  const transactionsController = new TransactionsController();

  const transactionsData = useAppSelector(state => state.transactionState.transactions);
  const currentPage = useAppSelector(state => state.transactionState.nextTransactionsPage);
  const selectedTransaction = useAppSelector(state => state.transactionState.currentTransaction);
  const paginationData = useAppSelector(state => state.transactionState.pagination);
  const selectedAccount = useAppSelector(state => state.accountState.currentAccount);
  const currentUser = useAppSelector(state => state.authState.user);

  useEffect(() => {
    if (!Number.isFinite(parsedAccountId)) {
      navigate(PAGES.ACCOUNTS.path);
      return;
    }

    accountsController.setCurrentAccount(parsedAccountId);
    transactionsController.removeCurrentTransaction();
  }, [parsedAccountId, navigate]);

  const getAccountFilterModel = (filterModel?: string) => {
    let parsedFilterModel: GridFilterModel = { items: [] };

    if (filterModel) {
      try {
        parsedFilterModel = JSON.parse(filterModel) as GridFilterModel;
      } catch (error) {
        parsedFilterModel = { items: [] };
      }
    }

    const items = (parsedFilterModel.items ?? []).filter((item) => item.field !== 'account__id');

    return JSON.stringify({
      ...parsedFilterModel,
      items: [
        ...items,
        {
          field: 'account__id',
          operator: '=',
          value: parsedAccountId
        }
      ]
    });
  };

  const handlePagination = async (params: ITransactionSearchParams) => {
    await transactionsController.retrieveTransactions({
      ...params,
      page: params.page ?? 1,
      filterModel: getAccountFilterModel(params.filterModel)
    });
  };

  const handleDelete = async (transactionId: number) => {
    await transactionsController.deleteTransaction(transactionId);
  };

  const handleBack = () => {
    navigate(PAGES.ACCOUNTS.path);
  };

  const currentPageLabel = selectedAccount?.name
    ? `Account: ${selectedAccount.name}`
    : 'Account: Transactions';

  return (
    <TransactionsView
      transactions={transactionsData}
      handleDelete={handleDelete}
      currentPage={currentPage}
      pagination={paginationData}
      handlePagination={handlePagination}
      selectedTransaction={selectedTransaction}
      handleActionMenu={transactionsController.setCurrentTransaction.bind(transactionsController)}
      removeCurrentTransaction={transactionsController.removeCurrentTransaction.bind(transactionsController)}
      currentPageLabel={currentPageLabel}
      sidebarCurrentPageLabel={PAGES.ACCOUNTS.label}
      buttonName={PAGES.TRANSACTIONS.label}
      hideAddButton={true}
      onBack={handleBack}
      backButtonLabel="Back to Accounts"
      defaultAccount={selectedAccount}
      currentUser={currentUser}
    />
  );
};
