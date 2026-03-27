import {
  Grid, Button, Dialog, TextField, Autocomplete, createFilterOptions, MenuItem,
  Chip, FormControlLabel, Checkbox, Stack, FormControl, InputLabel, Select, FormHelperText
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
import { ITransactionInitial } from '@base/core/domain/entities/transaction/initial.entity';
import { FormRequestError } from '@base/core/domain/entities/formModels/errors.entity';
import dayjs from 'dayjs';

export interface ITransactionModalView {
  open: boolean
  onClose: () => void
  formOptions: ITransactionInitial
  selectedTransaction: ITransaction | null
  handleFormSumbit: (values: IFormTransaction) => Promise<void> | void
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
  })

const getInitialValues = (transaction: ITransaction | null): IFormTransaction => ({
  name: transaction?.name ?? "",
  user: transaction?.user?.id ?? null,
  store: transaction?.store?.name ?? null,
  place: transaction?.place?.name ?? null,
  account: transaction?.account?.id ?? null,
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
  const filterCategory = createFilterOptions<ICategorySimple>();
  const [useToday, setUseToday] = React.useState<boolean>(true);
  const isCreate = !props.selectedTransaction;

  const formik = useFormik<IFormTransaction>({
    initialValues: getInitialValues(props.selectedTransaction ?? null),
    validationSchema: !props.selectedTransaction && validationSchema(props.formOptions.accounts),
    onSubmit: async (values) => {
      const isCreate = !props.selectedTransaction;
      try {
        if (isCreate && useToday) {
          values.transactionAt = formatDateTime(getCurrentDateTime(), true, true);
        }
        if (values.debitMonthYear) {
          values.debitMonthYear = dayjs(values.debitMonthYear).format("YYYY-MM-DD");
        }

        if (values.transactionType === TRANSACTION_TYPE.TRANSFER.id) {
          values.netAmount = null;
          values.grossAmount = null;
          values.debitMonthYear = null;
        } else if (values.transactionType === TRANSACTION_TYPE.INCOME.id) {
          values.amount = null;
          values.pairTransaction = null;
        } else {
          // Expenses
          values.netAmount = null;
          values.grossAmount = null;
          values.debitMonthYear = null;
          values.pairTransaction = null;
        }
        await props.handleFormSumbit(values);

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

  React.useEffect(() => {
    formik.resetForm({ values: getInitialValues(props.selectedTransaction) });
    if (isCreate) {
      setUseToday(true);
      formik.setFieldValue("transactionAt", getCurrentDateTime());
    } else {
      setUseToday(false);
    } 
  }, [props.selectedTransaction, props.onClose]);

  return (
    <>
      <Dialog open={props.open} onClose={() => {}} fullWidth maxWidth="md">
        <DialogTitle>
          {isCreate ? "Create " : "Edit"}{"Transaction"}
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
                          sx={{ mr: 1 , backgroundColor: t.color , color: t.name === TRANSACTION_TYPE.TRANSFER.name ? "black" : "white" }}
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
                      disabled={!isCreate}
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
                      disabled={!isCreate}
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
                {/* Category Field */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Autocomplete
                    options={props.formOptions.categories}
                    value={
                      props.formOptions.categories.find(category => category.name === formik.values.category) || formik.values.category || null
                    }
                    onChange={(event, newValue) => {
                      if (!newValue) return;
                      if (typeof newValue === "string") {
                        formik.setFieldValue("category", null);
                      } else if (newValue.inputValue) {
                        formik.setFieldValue("category", newValue.inputValue);
                      } else {
                        formik.setFieldValue("category", newValue.name ?? null);
                      }
                    }}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") return option;
                      if (option.inputValue) return option.inputValue;
                      return option.name;
                    }}
                    filterOptions={(options: ICategorySimple[], params) => {
                      const filtered = filterCategory(options, params);
                      const { inputValue } = params;

                      const isExisting = options.some(
                        (option) => inputValue === option.name
                      );
                      if (inputValue !== "" && !isExisting) {
                        filtered.push({
                          id: -1,
                          inputValue,
                          name: `Add "${inputValue}"`,
                          parentCategory: null,
                          transactionType: null,
                          icon: null,
                          color: null
                        });
                      }

                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
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
                      if (!newValue) return;
                      if (typeof newValue === "string") {
                        formik.setFieldValue("store", null);
                      } else if (newValue.inputValue) {
                        formik.setFieldValue("store", newValue.inputValue);
                      } else {
                        formik.setFieldValue("store", newValue.name ?? null);
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
                    clearOnBlur
                    handleHomeEndKeys
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Store"
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
                      if (!newValue) return;
                      if (typeof newValue === "string") {
                        formik.setFieldValue("place", null);
                      } else if (newValue.inputValue) {
                        formik.setFieldValue("place", newValue.inputValue);
                      } else {
                        formik.setFieldValue("place", newValue.name ?? null);
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
                    clearOnBlur
                    handleHomeEndKeys
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Place"
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

