import {
  Grid, Button, Box, Dialog, IconButton,
  Chip, styled, TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormLabel,
  Divider,
  OutlinedInput,
  Autocomplete,
  Paper,
  Stack,
  Tooltip,
  Typography,

} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Edit, Delete } from '@mui/icons-material';
import React, { useMemo, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { IUser } from '@domain/entities/user/user.entity';
import { IAccount } from '@domain/entities/account/account.entity';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { FormRequestError } from '@domain/entities/formModels/errors.entity';
import { IFormAccount } from '@domain/entities/formModels/account-form.entity';
import { ICategory } from '@domain/entities/category/category.entity';
import { IFormCategory } from '@domain/entities/formModels/category-form.entity';
import { ICategorySimple, ITransactionType } from '@domain/entities/transaction/transaction.entity';
import CategoryModalContainer from '@interface/ui/components/modals/category-modal/category-modal.container';
import DeleteConfirmationModal from '@interface/ui/components/modals/delete-confirmation-modal/delete-confirmation-modal.container';
import { getTransactionTypeChipSx, renderCategoryIcon } from '@interface/presenters/helpers';
import { ICON_TYPE } from '@base/core/interface/presenters/constants';
import { IconComponentContainer } from '@interface/ui/components/common/icon-component/icon-component.container';
import { ColorComponentContainer } from '@interface/ui/components/common/color-component/color-component.container';

export interface IAccountModalView {
  children?: React.ReactNode
  handleClose: () => void
  handleSubmit: (values: IFormAccount) => void
  users: IUser[],
  selectedAccount: IAccount | null
  showModal: boolean
  categoryOptions: ICategorySimple[]
  categories: ICategory[]
  selectedCategory: ICategory | null
  transactionTypes: ITransactionType[]
  handleCategorySubmit: (values: IFormCategory) => void | Promise<void>
  handleCategoryDelete: (category: ICategory) => void | Promise<void>
  handleSetCurrentCategory: (id: number) => void | Promise<void>
  clearCurrentCategory: () => void
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const validationSchema = Yup.object({
  name: Yup.string().required("Account name is required"),
  color: Yup.string().required("Color is required"),
  balance: Yup.number()
    .min(0, "Balance cannot be negative")
    .required("Balance is required"),
  notes: Yup.string(),
});

const formInitialValues = (
  selectedAccount?: IFormAccount | null
): IFormAccount => {
  return {
    name: selectedAccount?.name ?? "",
    icon: selectedAccount?.icon ?? "Savings",
    color: selectedAccount?.color ?? "#006CD1",
    balance: selectedAccount?.balance ?? 0,
    countInAssets: selectedAccount?.countInAssets ?? false,
    isDefault: selectedAccount?.isDefault ?? false,
    isShared: selectedAccount?.isShared ?? false,
    notes: selectedAccount?.notes ?? "",
    user: selectedAccount?.user ?? null,
    sharedUsers: selectedAccount?.sharedUsers ?? [],
    sharedUserIds:
      selectedAccount?.sharedUsers?.map((user) => user.id) ?? [] as number[],
    categories: selectedAccount?.categories ?? [],
    categoryIds:
      selectedAccount?.categories?.map((category) => category.id) ?? [] as number[],
  };
};

const AccountModalView: React.FC<IAccountModalView> = (props) => {
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false)

  const handleMainCloseModal = () => {
    props.handleClose();
    formik.resetForm();
    setOpenCategoryModal(false)
    setOpenDeleteCategoryModal(false)
  };

  const isCreate = !props.selectedAccount;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formInitialValues(props.selectedAccount),
    validationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      const action = isCreate ? 'create' : 'edit';

      try {
        await props.handleSubmit(values);

        toast.success(
          isCreate
            ? 'Successfully added a new account!'
            : 'Successfully edited your account!'
        );

        resetForm();
        props.handleClose();
      } catch (error) {
        if (error instanceof FormRequestError) {
          const { data } = error;
          setErrors(data);
          if (data?.nonFieldErrors?.length) {
            toast.error(data.nonFieldErrors[0]);
          } else {
            toast.error(`Unable to ${action} account.`);
          }

          return;
        }
        // Preserve original stack trace
        console.error(error);
        throw error;
      }
    },
  });

  const selectedCategoryOptions = useMemo(() => {
    const ids = new Set(formik.values.categoryIds ?? [])
    return props.categoryOptions.filter((option) => ids.has(option.id))
  }, [formik.values.categoryIds, props.categoryOptions])

  const handleCreateCategory = () => {
    props.clearCurrentCategory()
    setOpenCategoryModal(true)
  }

  const handleEditCategory = async (id: number) => {
    await props.handleSetCurrentCategory(id)
    setOpenCategoryModal(true)
  }

  const handleDeleteCategory = async (id: number) => {
    await props.handleSetCurrentCategory(id)
    setOpenDeleteCategoryModal(true)
  }

  return (
    <>
      <BootstrapDialog
        onClose={handleMainCloseModal}
        aria-labelledby={props.selectedAccount ? "Edit Account" : "Create Account"}
        open={props.showModal}
        maxWidth="xl"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id={props.selectedAccount ? "Edit Account" : "Create Account"}>
          {props.selectedAccount ? "Edit Account" : "Create Account"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleMainCloseModal}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container direction="row" spacing={2}>

              <Stack direction="column" rowGap={2}>
                <Grid container flexDirection={"row"} spacing={2}>
                  <Grid size={8}>
                    {/* Account Name */}
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Account Name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>
                  <Grid size={4}>

                    {/* Balance */}
                    <TextField
                      fullWidth
                      name="balance"
                      label="Balance"
                      type="number"
                      value={formik.values.balance}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.balance && Boolean(formik.errors.balance)}
                      helperText={formik.touched.balance && formik.errors.balance}
                    />
                  </Grid>
                </Grid>
                {/* Notes */}
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="notes"
                  label="Notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                />


                <Box>
                  <FormLabel>Select Icon</FormLabel>
                  <Grid container spacing={1.25} sx={{ mt: 1 }}>
                      <IconComponentContainer formik={formik} iconType={ICON_TYPE.Account} />
                  </Grid>
                </Box>

                <Box>
                  <FormLabel>Select Color</FormLabel>
                  <Grid container spacing={1.25} sx={{ mt: 1 }}>
                  <ColorComponentContainer formik={formik} />
                  </Grid>
                </Box>

                <Divider sx={{ mt: 2 }} />

                {/* Switches */}
                <Grid size={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="countInAssets"
                        checked={formik.values.countInAssets}
                        onChange={formik.handleChange}
                      />
                    }
                    label="Count in Assets"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        name="isDefault"
                        checked={formik.values.isDefault}
                        onChange={formik.handleChange}
                      />
                    }
                    label="Default Account"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        name="isShared"
                        checked={formik.values.isShared}
                        onChange={formik.handleChange}
                      />
                    }
                    label="Shared Account"
                  />
                </Grid>

                {/* Shared Users Multi Select */}
                {formik.values.isShared && (
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <InputLabel id="sharedUsers-label">Shared Users</InputLabel>
                      <Select
                        labelId="sharedUsers-label"
                        id="sharedUserIds"
                        multiple
                        name="sharedUserIds"
                        value={formik.values.sharedUserIds}
                        onChange={(event) =>
                          formik.setFieldValue(
                            "sharedUserIds",
                            event.target.value as number[]
                          )
                        }
                        input={<OutlinedInput label="Shared Users" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {(selected as number[]).map((id) => {
                              const user = props.users.find((u) => u.id === id);
                              return (
                                <Chip
                                  key={id}
                                  label={`${user?.firstName} ${user?.lastName} (${user?.username})`}
                                />
                              );
                            })}
                          </Box>
                        )}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        {props.users.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            <Checkbox
                              checked={formik.values.sharedUserIds?.includes(user.id)}
                            />
                            <ListItemText primary={`${user?.firstName} ${user?.lastName} (${user?.username})`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Stack>

              <Stack direction="column" rowGap={2}>
                <Grid container direction="column" gap={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Typography variant="subtitle1" fontWeight={700}>Categories</Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={() => {
                          formik.setFieldValue("categoryIds", props.categoryOptions.map((category) => category.id))
                          formik.setFieldValue("categories", props.categoryOptions)
                        }}
                        variant="outlined"
                        size="small"
                      >
                        Select all
                      </Button>
                      <Button
                        onClick={handleCreateCategory}
                        startIcon={<AddIcon />}
                        variant="outlined"
                        size="small"
                      >
                        New Category
                      </Button>
                    </Stack>
                  </Stack>

                  <Autocomplete
                    disableCloseOnSelect
                    multiple
                    sx={{ width: "100%", minWidth: 500, maxWidth: 500 }}
                    options={props.categoryOptions}
                    value={selectedCategoryOptions}
                    onChange={(_, nextValue) => {
                      const ids = nextValue.map((item) => item.id)
                      formik.setFieldValue("categoryIds", ids)
                      formik.setFieldValue("categories", nextValue)
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    groupBy={(option) => option.parentCategory?.name ?? "Parent Categories"}
                    getOptionLabel={(option) => option.name}
                    renderOption={(optionProps, option) => (
                      <Box component="li" {...optionProps} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {renderCategoryIcon(option.icon, option.color)}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {option.transactionType?.name ?? "No transaction type"}
                          </Typography>
                        </Box>
                        {option.transactionType?.name && (
                          <Chip
                            label={option.transactionType.name}
                            size="small"
                            sx={getTransactionTypeChipSx(option.transactionType.color)}
                          />
                        )}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Attach categories to this account"
                        placeholder="Search categories..."
                      />
                    )}
                  />

                  {selectedCategoryOptions.length ? (
                    <Stack spacing={1} sx={{ mt: 0.5, maxHeight: "30vh", overflowY: "auto" }}>
                      <Button
                        variant="text"
                        size="small"
                        sx={{ alignSelf: "flex-start" }}
                        onClick={() => {
                          formik.setFieldValue("categoryIds", [])
                          formik.setFieldValue("categories", [])
                        }}
                      >
                        Clear selected categories
                      </Button>
                      {selectedCategoryOptions.map((category) => (
                        <Paper
                          key={category.id}
                          variant="outlined"
                          sx={{ p: 1.25, borderRadius: 2 }}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                {renderCategoryIcon(category.icon, category.color)}
                                <Typography variant="body2" fontWeight={700} noWrap>{category.name}</Typography>
                                {category.transactionType?.name && (
                                  <Chip
                                    label={category.transactionType.name}
                                    size="small"
                                    sx={getTransactionTypeChipSx(category.transactionType.color)}
                                  />
                                )}
                              </Stack>
                              {category.parentCategory?.name && (
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  Parent: {category.parentCategory.name}
                                </Typography>
                              )}
                            </Stack>

                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Tooltip title="Edit category">
                                <IconButton size="small" onClick={() => void handleEditCategory(category.id)}>
                                  <Edit fontSize="small" color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete category">
                                <IconButton size="small" color="error" onClick={() => void handleDeleteCategory(category.id)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove from account">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    const nextIds = (formik.values.categoryIds ?? []).filter((id) => id !== category.id)
                                    formik.setFieldValue("categoryIds", nextIds)
                                    formik.setFieldValue(
                                      "categories",
                                      (formik.values.categories ?? []).filter((item) => item.id !== category.id)
                                    )
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      No categories attached yet.
                    </Typography>
                  )}
                </Grid>
              </Stack>


            </Grid>
          </DialogContent>
          <DialogActions>

            <Grid size={12}>
              <Button type="submit" fullWidth variant="contained">
                {props.selectedAccount ? 'Edit Account' : 'Create Account'}
              </Button>
            </Grid>
          </DialogActions>
        </form>

        <CategoryModalContainer
          showModal={openCategoryModal}
          handleMainModalClose={() => setOpenCategoryModal(false)}
          handleSubmit={props.handleCategorySubmit}
          selectedCategory={props.selectedCategory}
          categories={props.categories}
          transactionTypes={props.transactionTypes}
        />

        <DeleteConfirmationModal
          open={openDeleteCategoryModal}
          pageTitle="Categories"
          hasConfirmation={true}
          onClose={() => setOpenDeleteCategoryModal(false)}
          onConfirm={async () => {
            const deleting = props.selectedCategory
            if (!deleting) return

            await props.handleCategoryDelete(deleting)

            const nextIds = (formik.values.categoryIds ?? []).filter((id) => id !== deleting.id)
            formik.setFieldValue("categoryIds", nextIds)
            formik.setFieldValue(
              "categories",
              (formik.values.categories ?? []).filter((item) => item.id !== deleting.id)
            )
            setOpenDeleteCategoryModal(false)
          }}
        />
      </BootstrapDialog>
    </>
  );
};

export default AccountModalView;
