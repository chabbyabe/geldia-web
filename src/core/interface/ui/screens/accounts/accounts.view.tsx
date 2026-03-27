import { PAGES } from '@interface/presenters/constants';
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
import { Container, Grid, Button, Card, Typography, Box, Chip, Stack, Pagination } from '@mui/material';
import { AccountBalance, Add as AddIcon, CheckBoxOutlined as CheckBoxIcon } from '@mui/icons-material';
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { IFormAccount } from '@domain/entities/formModels/account-form.entity';
import { IAccount } from '@domain/entities/account/account.entity';
import { IBasePagedListEntity } from '@domain/entities/base/base.paged.entity';
import { IUser } from '@domain/entities/user/user.entity';
import { ActionMenuContainer } from '@interface/ui/components/common/action-menu/action-menu.container';
import { AccountModalContainer } from '@interface/ui/components/modals/account-modal/account-modal.container';
import AccountIcon from '@interface/ui/components/common/account/account-icon.container';
import DeleteConfirmationModal from '@interface/ui/components/modals/delete-confirmation-modal/delete-confirmation-modal.container';

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
}

const AccountsView: React.FC<IAccountsViewModel> = (props) => {
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handleClickOpen = () => {
    setOpenAccountModal(true);
  };

  const handleClickClose = () => {
    setOpenAccountModal(false);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    props.handlePagination(false, value);
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
          {props?.accounts.length > 0 ? (props.accounts.map((account) => (
            <Grid container gap={2} rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} key={`${account.id}`}>
              <Card sx={{ display: "flex", borderRadius: 3, boxShadow: 3, p: 2, borderTop: 3, borderColor: account.color, minWidth: 300 }}>
                <Stack direction="column" spacing={1} flex={1}>
                  {account.isDefault && account.user?.id === props.currentUser?.id && (
                    <Stack direction="row" justifyContent="space-between" spacing={1}>      
                                    
                      <Chip icon={<CheckBoxIcon />} label="Default Account" />
                      <ActionMenuContainer key={`actionmenu-${account.id}`}
                        handleDeleteModal={setOpenDeleteModal}
                        handleEditModal={setOpenAccountModal}
                        actionId={account.id}
                        handleModalAction={props.handleActionMenu} />
                    </Stack>
                  )}
                  <Stack direction="row">
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "start" }}>
                      <AccountIcon account={account} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <Box sx={{ flex: "1 0 auto" }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                            ${account.balance?.toLocaleString()}
                          </Typography>
                          {!account.isDefault && (
                            <ActionMenuContainer key={`action-menu-${account.id}`}
                              handleDeleteModal={setOpenDeleteModal}
                              handleEditModal={setOpenAccountModal}
                              actionId={account.id}
                              handleModalAction={props.handleActionMenu} />
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
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))) : (
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
          handleSubmit={props.handleSubmit} />
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