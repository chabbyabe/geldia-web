import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AccountsController from '@interface/ui/screens/accounts/accounts.controller';
import TransactionsController from '@interface/ui/screens/transactions/transactions.controller';
import TransactionsView from '@interface/ui/screens/transactions/transactions.view';
import { useAppSelector } from '@interface/presenters/store/hooks';
import { ITransactionSearchParams } from '@domain/entities/transaction/search.entity';
import { GridFilterModel } from '@mui/x-data-grid';
import { PAGES } from '@interface/presenters/constants';
import TransactionImportModal from '@interface/ui/components/modals/transaction-import-modal/transaction-import-modal';

export const AccountTransactionsContainer: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const parsedAccountId = Number(accountId);

  const accountsController = useMemo(() => new AccountsController(), []);
  const transactionsController = useMemo(() => new TransactionsController(), []);

  const transactionsData = useAppSelector(state => state.transactionState.transactions);
  const currentPage = useAppSelector(state => state.transactionState.nextTransactionsPage);
  const selectedTransaction = useAppSelector(state => state.transactionState.currentTransaction);
  const paginationData = useAppSelector(state => state.transactionState.pagination);
  const selectedAccount = useAppSelector(state => state.accountState.currentAccount);
  const currentUser = useAppSelector(state => state.authState.user);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(parsedAccountId)) {
      navigate(PAGES.ACCOUNTS.path);
      return;
    }

    accountsController.setCurrentAccount(parsedAccountId);
    transactionsController.removeCurrentTransaction();
  }, [accountsController, parsedAccountId, navigate, transactionsController]);

  const getTransactionFilters = useCallback((filterModel?: string) => {
    let parsedFilterModel: GridFilterModel = { items: [] };

    if (filterModel) {
      try {
        parsedFilterModel = JSON.parse(filterModel) as GridFilterModel;
      } catch (error) {
        parsedFilterModel = { items: [] };
      }
    }

    const items = (parsedFilterModel.items ?? []).filter((item) => item.field !== 'account__id');
    debugger;
    return JSON.stringify({
      ...parsedFilterModel,
      items: [
        ...items,
      ]
    });
  }, [parsedAccountId]);

  const handlePagination = useCallback(async (params: ITransactionSearchParams) => {
    await transactionsController.retrieveTransactions({
      ...params,
      page: params.page ?? 1,
      accountId: parsedAccountId,
      filterModel: getTransactionFilters(params.filterModel)
    });
  }, [getTransactionFilters, transactionsController]);

  const handleDelete = useCallback(async (transactionId: number) => {
    await transactionsController.deleteTransaction(transactionId);
  }, [transactionsController]);

  const handleBack = useCallback(() => {
    navigate(PAGES.ACCOUNTS.path);
  }, [navigate]);

  const handleImported = useCallback(async () => {
    setReloadKey((currentValue) => currentValue + 1);
  }, []);

  const handleActionMenu = useCallback(async (...args: Parameters<TransactionsController['setCurrentTransaction']>) => {
    await transactionsController.setCurrentTransaction(...args);
  }, [transactionsController]);

  const removeCurrentTransaction = useCallback(() => {
    transactionsController.removeCurrentTransaction();
  }, [transactionsController]);

  const currentPageLabel = selectedAccount?.name
    ? `Account: ${selectedAccount.name}`
    : 'Account: Transactions';

  return (
    <TransactionsView
      reloadKey={reloadKey}
      transactions={transactionsData}
      handleDelete={handleDelete}
      currentPage={currentPage}
      pagination={paginationData}
      handlePagination={handlePagination}
      selectedTransaction={selectedTransaction}
      handleActionMenu={handleActionMenu}
      removeCurrentTransaction={removeCurrentTransaction}
      currentPageLabel={currentPageLabel}
      sidebarCurrentPageLabel={PAGES.ACCOUNTS.label}
      buttonName={PAGES.TRANSACTIONS.label}
      hideAddButton={true}
      onBack={handleBack}
      backButtonLabel="Back to Accounts"
      defaultAccount={selectedAccount}
      currentUser={currentUser}
    >
      <TransactionImportModal
        account={selectedAccount}
        onImported={handleImported}
      />
    </TransactionsView>
  );
};
