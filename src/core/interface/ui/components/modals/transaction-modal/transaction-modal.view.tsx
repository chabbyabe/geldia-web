import {
  Grid, Button, Dialog, TextField, Autocomplete, createFilterOptions, MenuItem,
  Chip, FormControlLabel, Checkbox, Stack, FormControl, InputLabel, Select, FormHelperText,
  Box,
  Typography
} from '@mui/material';
import React from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { IFormTransaction } from '@domain/entities/formModels/transaction-form.entity';
import {
  IAccountSimple,
  ICategorySimple, IPlaceSimple, IStoreSimple, ITagSimple, ITransaction
} from '@domain/entities/transaction/transaction.entity';
import { getCurrentDateTime, formatToTitleCase, formatDateTime } from '@interface/presenters/helpers';
import { TRANSACTION_TYPE } from '@data/gateways/api/constants';
import { getTransactionTypeChipSx, renderCategoryIcon } from '@interface/presenters/helpers';
import { ITransactionInitial } from '@base/core/domain/entities/transaction/initial.entity';
import { FormRequestError } from '@base/core/domain/entities/formModels/errors.entity';
import dayjs from 'dayjs';
import { IUser } from '@domain/entities/user/user.entity';
import { IAccount } from '@domain/entities/account/account.entity';

export interface ITransactionModalView {
  open: boolean
  onClose: () => void
  formOptions: ITransactionInitial
  selectedTransaction: ITransaction | null
  defaultAccount: IAccount | null
  handleFormSumbit: (values: IFormTransaction) => Promise<void> | void
  currentUser: IUser | null
}

const validationSchema = (accounts: IAccountSimple[]) =>
  Yup.object({
    account: Yup.number().required("Account is required"),
    transactionType: Yup.number().required("Transaction type is required"),
    name: Yup.string().required("Transaction name is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .when(["transactionType", "account"], {
        is: (transactionType: number) => transactionType !== TRANSACTION_TYPE.INCOME.id,
        then: (schema) =>
          schema
            .positive("Amount must be greater than 0")
            .required("Amount is required")
            .test(
              "not-greater-than-balance",
              "Amount cannot exceed account balance",
              function (value) {
                const { account } = this.parent;
                if (!account) return true;

                const selectedAccount = accounts!.find(
                  (a: any) => a.id === account
                );
                if (!selectedAccount || value == null) return true;
                return value <= (selectedAccount.balance || 0);
              }
            ),
        otherwise: (schema) => schema.notRequired(),
      }),
    grossAmount: Yup.number().nullable().when("transactionType", {
      is: (transactionType: number) => transactionType === TRANSACTION_TYPE.INCOME.id,
      then: (schema) =>
        schema
          .typeError("Gross amount must be a number")
          .test(
            "greater-than-income",
            "Gross amount must be greater than income",
            function (value) {
              const { income } = this.parent;
              if (value == null || income == null) return true;
              return value > income;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    netAmount: Yup.number().when("transactionType", {
      is: (transactionType: number) => transactionType === TRANSACTION_TYPE.INCOME.id,
      then: (schema) =>
        schema
          .typeError("Income must be a number")
          .positive("Income must be greater than 0")
          .required("Income is required")
          .test(
            "less-than-gross",
            "Income must be less than gross amount",
            function (value) {
              const { grossAmount } = this.parent;
              if (value == null || grossAmount == null) return true;
              return value < grossAmount;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    pairTransaction: Yup.number().when("transactionType", {
      is: (transactionType: number) => transactionType === TRANSACTION_TYPE.TRANSFER.id,
      then: (schema) =>
        schema
          .required("Paired account is required")
          .test(
            "not-same-account",
            "Paired account cannot be the same as main account",
            function (value) {
              const { account } = this.parent;
              return account !== value;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    debitMonthYear: Yup.string().when("grossAmount", {
      is: (grossAmount: number | null) =>
        grossAmount !== null && grossAmount !== null,
      then: (schema) =>
        schema.required("Month and year is required when gross amount is provided"),
      otherwise: (schema) => schema.notRequired(),
    }),
    transactionAt: Yup.string().required("Date is required"),
    category: Yup.string()
      .trim()
      .required("Category is required"),
  })

const getInitialValues = (transaction: ITransaction | null, defaultAccount: IAccount | null, currentUser: IUser | null): IFormTransaction => ({
  name: transaction?.name ?? "",
  user: currentUser?.id ?? transaction?.user?.id ?? null,
  store: transaction?.store?.name ?? null,
  place: transaction?.place?.name ?? null,
  account: transaction?.account?.id ?? defaultAccount?.id ?? null,
  category: transaction?.category?.name ?? null,
  transactionType: transaction?.transactionType?.id ?? null,
  amount: transaction?.amount ?? 0,
  notes: transaction?.notes ?? "",
  netAmount: transaction?.netAmount ?? null,
  grossAmount: transaction?.grossAmount ?? null,
  debitMonthYear: dayjs(transaction?.debitMonthYear).format("YYYY-MM") ?? "",
  externalTransactionId: transaction?.externalTransactionId ?? null,
  pairTransaction: transaction?.pairTransaction?.id ?? null,
  isRecurring: transaction?.isRecurring ?? false,
  isRefunded: transaction?.isRefunded ?? false,
  refundedAt: transaction?.refundedAt ?? null,
  transactionAt:
    (transaction?.transactionAt &&
      formatDateTime(transaction?.transactionAt, true, true)) ?? null,
  tags: transaction?.tags?.map((t: ITagSimple) => t.name) ?? null,
});

const TransactionModalView: React.FC<ITransactionModalView> = (props) => {
  const filterStore = createFilterOptions<IStoreSimple>();
  const filterPlace = createFilterOptions<IPlaceSimple>();
  const [useToday, setUseToday] = React.useState<boolean>(true);
  const isCreate = !props.selectedTransaction;
  const [dynamicCategories, setDynamicCategories] = React.useState<ICategorySimple[]>([]);

  const normalizeAutocompleteValue = React.useCallback(
    (newValue: string | IStoreSimple | IPlaceSimple | null | undefined) => {
      if (typeof newValue === "string") {
        const normalizedValue = newValue.trim();
        return normalizedValue || null;
      }

      if (newValue?.inputValue) {
        const normalizedValue = newValue.inputValue.trim();
        return normalizedValue || null;
      }

      const normalizedValue = newValue?.name?.trim();
      return normalizedValue || null;
    },
    []
  );

  const formik = useFormik<IFormTransaction>({
    initialValues: getInitialValues(props.selectedTransaction ?? null, props.defaultAccount, props.currentUser),
    validationSchema: validationSchema(props.formOptions.accounts),
    onSubmit: async (values) => {
      const isCreate = !props.selectedTransaction;
      const sanitizedValues: IFormTransaction = {
        ...values,
        category: values.category?.trim() ?? null,
        store: values.store?.trim() || null,
        place: values.place?.trim() || null,
      };

      try {
        if (isCreate && useToday) {
          sanitizedValues.transactionAt = formatDateTime(getCurrentDateTime(), true, true);
        }
        if (sanitizedValues.debitMonthYear) {
          sanitizedValues.debitMonthYear = dayjs(sanitizedValues.debitMonthYear).format("YYYY-MM-DD");
        }

        if (sanitizedValues.transactionType === TRANSACTION_TYPE.TRANSFER.id) {
          sanitizedValues.netAmount = null;
          sanitizedValues.grossAmount = null;
          sanitizedValues.debitMonthYear = null;
        } else if (sanitizedValues.transactionType === TRANSACTION_TYPE.INCOME.id) {
          sanitizedValues.amount = null;
          sanitizedValues.pairTransaction = null;
        } else {
          // Expenses
          sanitizedValues.netAmount = null;
          sanitizedValues.grossAmount = null;
          sanitizedValues.debitMonthYear = null;
          sanitizedValues.pairTransaction = null;
        }
        await props.handleFormSumbit(sanitizedValues);

        toast.success(
          isCreate
            ? 'Successfully added a new transaction!'
            : 'Successfully edited your transaction!'
        );

        formik.resetForm();
        props.onClose();
      } catch (error: any) {
        if (error instanceof FormRequestError) {
          formik.setErrors(error.data);
          if ('nonFieldErrors' in error.data) {
            toast.error(error.data['nonFieldErrors']);
          } else {
            toast.error(
              'Unable to ' + (isCreate ? 'create' : 'edit') + ' transaction.'
            );
          }
        } else {
          throw new Error(
            'Uncaught exception while ' + (isCreate ? 'creating' : 'editing') + ' transaction'
          );
        }
      }
    },
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setUseToday(checked);
    if (checked) {
      // Get current datetime in "YYYY-MM-DDTHH:MM" format for datetime-local input
      formik.setFieldValue("transactionAt", getCurrentDateTime());
    } else {
      formik.setFieldValue("transactionAt", formik.values.transactionAt ?? null);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseToday(false);
    formik.setFieldValue("transactionAt", event.target.value);
  };

  const handleCloseModal = () => {
    props.onClose();
    formik.resetForm();
  };

  const selectedAccount = React.useMemo(
    () => props.formOptions.accounts.find((account) => account.id === formik.values.account) ?? null,
    [props.formOptions.accounts, formik.values.account]
  );

  const availableCategories = React.useMemo(() => {
    const baseCategories = selectedAccount?.categories ?? [];

    let filteredCategories = baseCategories;

    if (formik.values.transactionType) {
      filteredCategories = baseCategories.filter((category) => {
        if (formik.values.transactionType === TRANSACTION_TYPE.TRANSFER.id) {
          return true;
        }

        return (
          !category.transactionType?.id ||
          category.transactionType.id === formik.values.transactionType
        );
      });
    }

    const mergedCategories = [...filteredCategories, ...dynamicCategories];

    return mergedCategories.filter(
      (cat, index, self) =>
        index ===
        self.findIndex(
          (c) => c.name.toLowerCase() === cat.name.toLowerCase()
        )
    );
  }, [
    selectedAccount,
    formik.values.transactionType,
    dynamicCategories
  ]);

  React.useEffect(() => {
    formik.resetForm({ values: getInitialValues(props.selectedTransaction, props.defaultAccount, props.currentUser) });
    if (isCreate) {
      setUseToday(true);
      formik.setFieldValue("transactionAt", getCurrentDateTime());
    } else {
      setUseToday(false);
    }
  }, [props.selectedTransaction, props.defaultAccount, props.onClose]);

  React.useEffect(() => {
    if (!selectedAccount && formik.values.category) {
      formik.setFieldValue("category", null);
    }
  }, [selectedAccount, formik.values.category]);

  return (
    <>
      <Dialog open={props.open} onClose={() => { }} fullWidth maxWidth="md">
        <DialogTitle>
          {isCreate ? "Create " : "Edit"} {"Transaction"}
        </DialogTitle>
        <DialogContent dividers>
          <form id="transaction-form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} mt={1}>

              {/* Transaction Type */}
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl disabled={!isCreate} fullWidth
                  error={!!(formik.touched.transactionType && formik.errors.transactionType)}>
                  <InputLabel id="transactionType-label">
                    Transaction Type
                  </InputLabel>

                  <Select
                    labelId="transactionType-label"
                    id="transactionType-select"
                    value={formik.values.transactionType ?? ""}
                    label="Transaction Type"
                    onChange={(e) =>
                      formik.setFieldValue("transactionType", Number(e.target.value))
                    }
                  >
                    {props.formOptions.transactionTypes.map((t) => (
                      <MenuItem key={t.id + t.name} value={t.id}>
                        <Chip
                          size="medium"
                          label={t.name}
                          sx={{ ...getTransactionTypeChipSx(t.color), mr: 1 }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.transactionType &&
                    formik.errors.transactionType && (
                      <FormHelperText color="error">
                        {formik.errors.transactionType}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>

              {/* Account */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl
                  fullWidth
                  disabled={!isCreate}
                  error={
                    formik.touched.account &&
                    Boolean(formik.errors.account)
                  }
                >
                  <InputLabel id="account-label">Account</InputLabel>

                  <Select
                    labelId="account-label"
                    id="account"
                    name="account"
                    value={formik.values.account ?? ""}
                    label="Account"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {props.formOptions.accounts.map((a) => (
                      <MenuItem
                        key={a.id + a.name}
                        value={a.id}
                        sx={{ px: 2 }}
                      >
                        {a.name} ({a.balance})
                        {a.isDefault && (a.userId === props.currentUser?.id) && (
                          <Chip
                            size="medium"
                            color={(a.color as any) || "primary"}
                            label="Default"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </MenuItem>
                    ))}
                  </Select>

                  {formik.touched.account &&
                    formik.errors.account && (
                      <FormHelperText color="error">
                        {formik.errors.account}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>

              {/* Paired Account (for transfers) */}
              {formik.values.transactionType ===
                TRANSACTION_TYPE.TRANSFER.id && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl
                      fullWidth
                      disabled={!isCreate}
                      error={
                        formik.touched.pairTransaction &&
                        Boolean(formik.errors.pairTransaction)
                      }
                    >
                      <InputLabel id="paired-account-label">
                        Paired Account
                      </InputLabel>

                      <Select
                        disabled={!isCreate}
                        labelId="paired-account-label"
                        id="pairTransaction"
                        name="pairTransaction"
                        value={formik.values.pairTransaction ?? ""}
                        label="Paired Account"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {props.formOptions.accounts.map((a) => (
                          <MenuItem
                            key={"pairedAccount" + a.id + a.name}
                            value={a.id}
                            sx={{ px: 2 }}
                          >
                            {a.name} ({a.balance})
                            {a.isDefault && (
                              <Chip
                                size="medium"
                                color={(a.color as any) || "primary"}
                                label="Default"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </MenuItem>
                        ))}
                      </Select>

                      {formik.touched.pairTransaction &&
                        formik.errors.pairTransaction && (
                          <FormHelperText color="error">
                            {formik.errors.pairTransaction}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                )}

              {/* Name */}
              <Grid size={{ xs: 12, md: formik.values.transactionType === TRANSACTION_TYPE.INCOME.id ? 5 : 8 }}>
                <TextField
                  fullWidth
                  label="Transaction Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>

              {formik.values.transactionType === TRANSACTION_TYPE.INCOME.id ? (
                <>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Gross Amount"
                      name="grossAmount"
                      value={formik.values.grossAmount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.grossAmount &&
                        Boolean(formik.errors.grossAmount)
                      }
                      helperText={
                        formik.touched.grossAmount &&
                        formik.errors.grossAmount
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      disabled={!isCreate}
                      fullWidth
                      type="number"
                      label="Net Amount"
                      name="netAmount"
                      value={formik.values.netAmount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.netAmount &&
                        Boolean(formik.errors.netAmount)
                      }
                      helperText={
                        formik.touched.netAmount &&
                        formik.errors.netAmount
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      type="month"
                      label="Month & Year"
                      slotProps={{ inputLabel: { shrink: true } }}
                      name="debitMonthYear"
                      value={formik.values.debitMonthYear}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.debitMonthYear && Boolean(formik.errors.debitMonthYear)}
                      helperText={formik.touched.debitMonthYear && formik.errors.debitMonthYear}
                    />
                  </Grid>
                </>
              ) : (
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    disabled={!isCreate}
                    fullWidth
                    type="number"
                    label="Amount"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                  />
                </Grid>
              )}
              <Grid container size={{ xs: 12 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Autocomplete
                    disableCloseOnSelect
                    freeSolo
                    options={availableCategories}
                    value={
                      availableCategories.find(
                        (c) => c.name === formik.values.category
                      ) ||
                      formik.values.category ||
                      null
                    }
                    onChange={(_, nextValue) => {
                      const normalizedValue = normalizeAutocompleteValue(nextValue);

                      const shouldRegisterDynamicCategory = normalizedValue && !availableCategories.some(
                        (category) => category.name.toLowerCase() === normalizedValue.toLowerCase()
                      );

                      if (shouldRegisterDynamicCategory) {
                        const newCategory: ICategorySimple = {
                          id: Date.now(),
                          name: normalizedValue,
                          icon: null,
                          color: null,
                          parentCategory: null,
                          transactionType:
                            props.formOptions.transactionTypes.find(
                              (t) => t.id === formik.values.transactionType
                            ) || null,
                        };

                        setDynamicCategories((prev) => [...prev, newCategory]);
                      }
                      formik.setFieldValue("category", normalizedValue);
                    }}
                    onInputChange={(_, newInputValue, reason) => {
                      if (reason === "input") {
                        formik.setFieldValue("category", newInputValue || null);
                      }
                      if (reason === "clear") {
                        formik.setFieldValue("category", null);
                      }
                    }}
                    isOptionEqualToValue={(option, value) => {
                      if (typeof value === "string") {
                        return option.name === value;
                      }

                      return option.id === value.id;
                    }}
                    groupBy={(option) =>
                      option.parentCategory?.name ?? "No parent category"
                    }
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }

                      return option.name;
                    }}
                    renderOption={(optionProps, option) => (
                      <Box
                        component="li"
                        {...optionProps}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1
                        }}
                      >
                        {renderCategoryIcon(option.icon, option.color)}

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap>  {option.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>  {option.transactionType?.name ?? "No transaction type"}</Typography>
                        </Box>

                        {option.transactionType?.name && (
                          <Chip
                            label={option.transactionType.name
                              .substring(0, 1)
                              .toUpperCase()}
                            size="small"
                            sx={getTransactionTypeChipSx(
                              option.transactionType.color
                            )}
                          />
                        )}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        placeholder="Search or create category..."
                        onBlur={() => formik.setFieldTouched("category", true)}
                        error={formik.touched.category && Boolean(formik.errors.category)}
                        helperText={formik.touched.category && formik.errors.category}
                      />
                    )}
                  />
                </Grid>

                {/* Store Field */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Autocomplete
                    options={props.formOptions.stores}
                    value={
                      props.formOptions.stores.find(store => store.name === formik.values.store) || formik.values.store || null
                    }
                    onChange={(event, newValue) => {
                      formik.setFieldValue("store", normalizeAutocompleteValue(newValue));
                    }}
                    onInputChange={(_, newInputValue, reason) => {
                      if (reason === "input") {
                        formik.setFieldValue("store", newInputValue || null);
                      }
                      if (reason === "clear") {
                        formik.setFieldValue("store", null);
                      }
                    }}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") return option;
                      if (option.inputValue) return option.inputValue;
                      return option.name;
                    }}
                    filterOptions={(options: IStoreSimple[], params) => {
                      const filtered = filterStore(options, params);
                      const { inputValue } = params;

                      const isExisting = options.some(
                        (option) => inputValue === option.name
                      );
                      if (inputValue !== "" && !isExisting) {
                        filtered.push({
                          id: -1,
                          inputValue,
                          name: `Add "${inputValue}"`,
                        });
                      }

                      return filtered;
                    }}
                    selectOnFocus
                    handleHomeEndKeys
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Store"
                        onBlur={() => formik.setFieldTouched("store", true)}
                        error={formik.touched.store && Boolean(formik.errors.store)}
                        helperText={formik.touched.store && formik.errors.store}
                      />
                    )}
                  />
                </Grid>

                {/* Place Field */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Autocomplete
                    options={props.formOptions.places}
                    value={
                      props.formOptions.places.find(place => place.name === formik.values.place) || formik.values.place || null
                    }
                    onChange={(event, newValue) => {
                      formik.setFieldValue("place", normalizeAutocompleteValue(newValue));
                    }}
                    onInputChange={(_, newInputValue, reason) => {
                      if (reason === "input") {
                        formik.setFieldValue("place", newInputValue || null);
                      }
                      if (reason === "clear") {
                        formik.setFieldValue("place", null);
                      }
                    }}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") return option;
                      if (option.inputValue) return option.inputValue;
                      return option.name;
                    }}
                    filterOptions={(options: IPlaceSimple[], params) => {
                      const filtered = filterPlace(options, params);
                      const { inputValue } = params;

                      const isExisting = options.some(
                        (option) => inputValue === option.name
                      );
                      if (inputValue !== "" && !isExisting) {
                        filtered.push({
                          id: -1,
                          inputValue,
                          name: `Add "${inputValue}"`,
                        });
                      }
                      return filtered;
                    }}
                    selectOnFocus
                    handleHomeEndKeys
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Place"
                        onBlur={() => formik.setFieldTouched("place", true)}
                        error={formik.touched.place && Boolean(formik.errors.place)}
                        helperText={formik.touched.place && formik.errors.place}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container size={{ xs: 12, md: 12 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notes"
                    name="notes"
                    value={formik.values.notes ?? ""}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={(props.formOptions.tags || []).map(tag =>
                      formatToTitleCase(tag.name)
                    )}
                    value={formik.values.tags || []}
                    onChange={(event, newValue) => {
                      const normalized = newValue
                        .map(v => formatToTitleCase(v))
                        .filter(v => v !== "");
                      const unique = Array.from(
                        new Map(
                          normalized.map(name => [
                            name.toLowerCase(),
                            name
                          ])
                        ).values()
                      );

                      formik.setFieldValue("tags", unique);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Select or type tags"
                        sx={{
                          "& .MuiInputBase-root": {
                            minHeight: 100,
                            alignItems: "flex-start",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Stack direction="column" flex={1} spacing={2}>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <FormControlLabel
                      name="chkUseToday"
                      control={<Checkbox checked={useToday} onChange={handleCheckboxChange} />}
                      label="Use today's date"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <TextField
                      label="Transaction Date & Time"
                      type="datetime-local"
                      fullWidth
                      name="transactionAt"
                      value={formik.values.transactionAt}
                      onChange={handleDateChange}
                      slotProps={{ inputLabel: { shrink: true } }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.transactionAt && Boolean(formik.errors.transactionAt)}
                      helperText={formik.touched.transactionAt && formik.errors.transactionAt}
                    />
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button type="submit" form="transaction-form" variant="contained">
            {isCreate ? "Create" : "Edit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionModalView;
