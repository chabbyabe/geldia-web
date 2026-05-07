import { useEffect, useMemo } from 'react';
import AccountsView from '@interface/ui/screens/accounts/accounts.view'
import AccountsController from '@interface/ui/screens/accounts/accounts.controller';
import { IFormAccount } from '@domain/entities/formModels/account-form.entity';
import { useAppSelector } from '@interface/presenters/store/hooks';
import { IAccount } from '@domain/entities/account/account.entity';
import TransactionModalController from '@interface/ui/components/modals/transaction-modal/transaction-modal.controller';
import { IFormCategory } from '@domain/entities/formModels/category-form.entity';
import { ICategory } from '@domain/entities/category/category.entity';
import DashboardController from '@interface/ui/screens/dashboard/dashboard.controller';
import { ICategorySimple } from '@domain/entities/transaction/transaction.entity';
import CategoriesController from '@interface/ui/screens/categories/categories.controller';

export interface IAccountsContainerViewModel {
  children?: React.ReactNode
}

export const AccountsContainer: React.FC<IAccountsContainerViewModel> = (props) => {

  const controller = new AccountsController();
  const categoriesController = new CategoriesController()
  const transactionModalController = new TransactionModalController()
  const dashboardController = new DashboardController()

  const accounts = useAppSelector(state => state.accountState.accounts);
  const users = useAppSelector(state => state.userState.users);
  const currentPage = useAppSelector(state => state.accountState.nextAccountsPage);
  const selectedAccount = useAppSelector(state => state.accountState.currentAccount);
  const paginationData = useAppSelector(state => state.accountState.pagination);
  const currentUser = useAppSelector(state => state.authState.user);
  const transactionTypes = useAppSelector(state => state.transactionState.options.transactionTypes);
  const categories = useAppSelector(state => state.categoryState.userCategories);
  const selectedCategory = useAppSelector(state => state.categoryState.currentCategory);

  const categoryOptions: ICategorySimple[] = useMemo(
    () => (categories?? []).flatMap((category) => {
      const baseCategory: ICategorySimple = {
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        transactionType: category.transactionType,
        parentCategory: category.parentCategory
      }

      const childCategories: ICategorySimple[] = (category.children ?? []).map((child) => ({
        id: child.id,
        name: child.name,
        color: child.color,
        icon: child.icon,
        transactionType: child.transactionType,
        parentCategory: child.parentCategory
      }))

      return [baseCategory, ...childCategories]
    }),
    [categories]
  )

  useEffect(() => {
    controller.retrieveAccount(true, 1);
    controller.retrieveAllUsers();
    controller.removeCurrentAccount();

    transactionModalController.retrieveFormOptions()
    dashboardController.retrieveRecentTransactions()
    categoriesController.clearCurrentCategory()
    categoriesController.retrieveUserCategories()
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

  const refreshCategories = async () => {
    await categoriesController.retrieveUserCategories()
    await transactionModalController.retrieveFormOptions()
  }

  const handleCategorySubmit = async (values: IFormCategory) => {
    if (selectedCategory) {
      await categoriesController.updateCategory(selectedCategory.id, values)
    } else {
      await categoriesController.createCategory(values)
    }
    await refreshCategories()
  }

  const handleCategoryDelete = async (category: ICategory) => {
    await categoriesController.deleteCategory(category)
    await refreshCategories()
    categoriesController.clearCurrentCategory()
  }

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
    currentUser={currentUser}
    categoryOptions={categoryOptions}
    categories={categories}
    selectedCategory={selectedCategory}
    transactionTypes={transactionTypes}
    handleCategorySubmit={handleCategorySubmit}
    handleCategoryDelete={handleCategoryDelete}
    handleSetCurrentCategory={categoriesController.setCurrentCategory.bind(categoriesController)}
    clearCurrentCategory={categoriesController.clearCurrentCategory.bind(categoriesController)}
  />
}
