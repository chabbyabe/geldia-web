import { PAGES } from '@interface/presenters/constants';
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
import { Container, Grid, Button, Card, Typography, Box, Chip, Stack, Pagination } from '@mui/material';
import { AccountBalance, Add as AddIcon, CheckBoxOutlined as CheckBoxIcon } from '@mui/icons-material';
import React, { useMemo, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { IFormAccount } from '@domain/entities/formModels/account-form.entity';
import { IAccount } from '@domain/entities/account/account.entity';
import { IBasePagedListEntity } from '@domain/entities/base/base.paged.entity';
import { IUser } from '@domain/entities/user/user.entity';
import { ActionMenuContainer } from '@interface/ui/components/common/action-menu/action-menu.container';
import { AccountModalContainer } from '@interface/ui/components/modals/account-modal/account-modal.container';
import DeleteConfirmationModal from '@interface/ui/components/modals/delete-confirmation-modal/delete-confirmation-modal.container';
import { ICategory } from '@domain/entities/category/category.entity';
import { ICategorySimple, ITransaction, ITransactionType } from '@domain/entities/transaction/transaction.entity';
import { IFormCategory } from '@domain/entities/formModels/category-form.entity';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, getColoredChipSx, renderAccountIcon } from '@interface/presenters/helpers';
import { TRANSACTION_TYPE } from '@data/gateways/api/constants';

export interface IAccountsViewModel {
  children?: React.ReactNode
  handleSubmit: (values: IFormAccount) => void
  handleDelete: (account: IAccount) => void
  selectedAccount: IAccount | null
  accounts: IAccount[]
  users: IUser[]
  currentPage: string | null
  pagination: IBasePagedListEntity
  handlePagination: (initializeList: boolean, page: number) => Promise<void>
  handleActionMenu: (actionId: number) => void
  currentUser: IUser | null
  recentTransactions: ITransaction[]
  categoryOptions: ICategorySimple[]
  categories: ICategory[]
  selectedCategory: ICategory | null
  transactionTypes: ITransactionType[]
  handleCategorySubmit: (values: IFormCategory) => void | Promise<void>
  handleCategoryDelete: (category: ICategory) => void | Promise<void>
  handleSetCurrentCategory: (id: number) => void | Promise<void>
  clearCurrentCategory: () => void
}

const AccountsView: React.FC<IAccountsViewModel> = (props) => {
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const navigate = useNavigate();
  const recentTransactionsByAccount = useMemo(() => {
    const map = new Map<number, ITransaction[]>()

    props.recentTransactions.forEach((transaction) => {
      const accountId = transaction.account?.id

      if (!accountId) {
        return
      }

      const existingTransactions = map.get(accountId) ?? []

      if (existingTransactions.length < 2) {
        map.set(accountId, [...existingTransactions, transaction])
      }
    })

    return map
  }, [props.recentTransactions])

  const handleClickOpen = () => {
    setOpenAccountModal(true);
  };

  const handleClickClose = () => {
    setOpenAccountModal(false);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    props.handlePagination(false, value);
  };

  const handleAccountClick = (accountId: number) => {
    navigate(PAGES.ACCOUNT_TRANSACTIONS.path.replace(':accountId', String(accountId)));
  };

  return (
    <BaseLayoutContainer currentPage={PAGES.ACCOUNTS.label}>

      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Button variant="contained" startIcon={<AddIcon />} size="large"
            onClick={handleClickOpen}>Add Account
          </Button>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={props.pagination.totalPages}
              page={props.pagination.currentPageNumber}
              onChange={handleChangePage}
              color="primary"
              size="large"
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </Stack>

        <Grid container sx={{ mt: 5 }} rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {props?.accounts.length > 0 ? (props.accounts.map((account) => {
            const recentTransactions = recentTransactionsByAccount.get(account.id) ?? []
            const accountCategories = (account.categories ?? []).slice(0, 5)
            const hiddenCategoryCount = Math.max((account.categories ?? []).length - accountCategories.length, 0)

            return (
            <Grid container gap={2} rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} key={`${account.id}`}>
              <Card
                onClick={() => handleAccountClick(account.id)}
                sx={{
                  display: "flex",
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 2,
                  borderTop: 3,
                  borderColor: account.color,
                  minWidth: 300,
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 6
                  }
                }}
              >
                <Stack direction="column" spacing={1} flex={1}>
                  {account.isDefault && account.user?.id === props.currentUser?.id && (
                    <Stack direction="row" justifyContent="space-between" spacing={1}>      
                                    
                      <Chip icon={<CheckBoxIcon />} label="Default Account" />
                      <Box onClick={(event) => event.stopPropagation()}>
                        <ActionMenuContainer key={`actionmenu-${account.id}`}
                          handleDeleteModal={setOpenDeleteModal}
                          handleEditModal={setOpenAccountModal}
                          actionId={account.id}
                          handleModalAction={props.handleActionMenu} />
                      </Box>
                    </Stack>
                  )}
                  <Stack direction="row" gap={1}>
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "start" }}>
                      {renderAccountIcon(account.icon, account.color, 40)}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <Box sx={{ flex: "1 0 auto" }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                            {formatCurrency(account.balance)}
                          </Typography>
                          {!account.isDefault && (
                            <Box onClick={(event) => event.stopPropagation()}>
                              <ActionMenuContainer key={`action-menu-${account.id}`}
                                handleDeleteModal={setOpenDeleteModal}
                                handleEditModal={setOpenAccountModal}
                                actionId={account.id}
                                handleModalAction={props.handleActionMenu} />
                            </Box>
                          )}
                        </Stack>

                        <Typography variant="h6" color="text.secondary">
                          {account.name}
                        </Typography>
                        {account.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {account.notes}
                          </Typography>
                        )}
                      </Box>

                      <Stack flexBasis="row" gap={1} flexWrap="wrap">
                        {account.countInAssets && (
                          <Chip icon={<AccountBalance />} label="Count in Assets" size="small" />
                        )}
                        {account.isShared && (
                          <AvatarGroup max={4}>
                            {account.sharedUsers?.map((user: IUser) => (
                              <Avatar key={`avatar-${user.id}-${account.id}`} alt={`${user.firstName} ${user.lastName}`} src="/static/images/avatar/1.jpg" />
                            ))}
                          </AvatarGroup>
                        )}
                      </Stack>

                      <Stack spacing={1.5}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Categories
                          </Typography>
                          <Stack direction="row" gap={1} flexWrap="wrap">
                            {accountCategories.length > 0 ? (
                              <>
                                {accountCategories.map((category) => (
                                  <Chip
                                    key={`account-category-${account.id}-${category.id}`}
                                    size="small"
                                    label={category.name}
                                    sx={getColoredChipSx(category.color)}
                                  />
                                ))}
                                {hiddenCategoryCount > 0 && (
                                  <Chip
                                    size="small"
                                    label={`+${hiddenCategoryCount} more`}
                                    variant="outlined"
                                    sx={{
                                      color: "text.secondary",
                                      borderColor: "divider",
                                      fontWeight: 600,
                                      backgroundColor: "background.paper"
                                    }}
                                  />
                                )}
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No categories assigned
                              </Typography>
                            )}
                          </Stack>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Recent Transactions
                          </Typography>
                          {recentTransactions.length > 0 ? (
                            <Stack spacing={1}>
                              {recentTransactions.map((recentTransaction) => (
                                <Stack
                                  key={`recent-transaction-${account.id}-${recentTransaction.id}`}
                                  spacing={0.5}
                                  sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    backgroundColor: "action.hover"
                                  }}
                                >
                                  <Stack direction="row" justifyContent="space-between" gap={2} flexWrap="wrap">
                                    <Typography variant="subtitle2" fontWeight="bold">
                                      {recentTransaction.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight="bold"
                                      color={recentTransaction.transactionType?.color ?? "primary"}
                                    >
                                      {
                                        formatCurrency(recentTransaction.transactionType && recentTransaction.transactionType.name === TRANSACTION_TYPE.INCOME.name ?
                                          recentTransaction.netAmount : recentTransaction.amount)
                                      }

                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
                                    {recentTransaction.category && (
                                      <Chip
                                        size="small"
                                        label={recentTransaction.category.name}
                                        sx={getColoredChipSx(recentTransaction.category.color)}
                                      />
                                    )}
                                    <Typography variant="caption" color="text.secondary">
                                      {recentTransaction.transactionAt}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No recent transactions found for this account
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          )})) : (
            <Grid display="flex" justifyContent="center" bgcolor="background.paper" width="100%" minHeight="60vh" alignItems="center" borderRadius={2}>
              <Typography variant="body2" color="text.secondary">
                No accounts found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>

      <React.Fragment>
        <AccountModalContainer
          selectedAccount={props.selectedAccount}
          handleMainModalClose={handleClickClose}
          showModal={openAccountModal}
          users={props.users}
          handleSubmit={props.handleSubmit}
          categoryOptions={props.categoryOptions}
          categories={props.categories}
          selectedCategory={props.selectedCategory}
          transactionTypes={props.transactionTypes}
          handleCategorySubmit={props.handleCategorySubmit}
          handleCategoryDelete={props.handleCategoryDelete}
          handleSetCurrentCategory={props.handleSetCurrentCategory}
          clearCurrentCategory={props.clearCurrentCategory}
        />
      </React.Fragment>

      <DeleteConfirmationModal
        open={openDeleteModal}
        pageTitle={PAGES.ACCOUNTS.label}
        hasConfirmation={true}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={async () => {
          if (props.selectedAccount !== undefined) {
            await props.handleDelete(props.selectedAccount!);
          }
        }}
      />
    </BaseLayoutContainer >
  )
}

export default AccountsView
