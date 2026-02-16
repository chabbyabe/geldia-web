import { Grid, Button, Box, Dialog, IconButton,
  Chip, styled, TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Radio,
  FormLabel,
  Divider,
  OutlinedInput,

} from '@mui/material';
import { Close as CloseIcon} from '@mui/icons-material'; 
import React from 'react';
import type { MouseEvent } from "react";
import RadioGroup from '@mui/material/RadioGroup';
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

export interface IAccountModalView {
  children?: React.ReactNode
  handleClose: () => void
  handleSubmit: (values: IFormAccount) => void
  users: IUser[],
  colors: string[],
  iconOptions: Record<string, React.ReactNode>,
  selectedAccount: IAccount | null
  showModal: boolean
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
  };
};

const AccountModalView: React.FC<IAccountModalView> = (props) => {

  const handleMainCloseModal = () => {
    props.handleClose();
    formik.resetForm();
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
  
  return (
    <>
      <BootstrapDialog
        onClose={handleMainCloseModal}
        aria-labelledby={props.selectedAccount ? "Edit Account" : "Create Account"}
        open={props.showModal}
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
            <Grid container spacing={2}>
              {/* Account Name */}
              <Grid size={8}>
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
              {/* Balance */}
              <Grid size={4}>
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

              {/* Notes */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="notes"
                  label="Notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                />
              </Grid>


              {/* Icon Picker */}
              <Grid size={12}>
                <FormLabel>Select Icon</FormLabel>
                <RadioGroup row name="icon" defaultValue="Savings" >
                  {Object.entries(props.iconOptions).map(([name, IconComponent]) => (
                    <FormControlLabel
                      key={name}
                      value={name}
                      name="icon"
                      defaultValue={formik.values.icon ?? "Savings"}
                      onChange={formik.handleChange}
                      control={
                        <Radio
                          sx={{
                            "&.Mui-checked": {
                              color: "primary.main"
                            }
                          }}
                        />
                      }
                      label={IconComponent}
                    />
                  ))}
                </RadioGroup>
              </Grid>

              {/* Color Picker */}
              <Grid size={12}>
                <FormLabel>Select Color</FormLabel>
                <RadioGroup
                  row
                  name="color"
                  defaultValue={formik.values.color}
                >
                  {props.colors.map((color) => (
                    <FormControlLabel
                      key={color}
                      value={color}
                      name="color"
                      onChange={formik.handleChange}
                      control={
                        <Radio
                          sx={{
                            color: color,
                            "&.Mui-checked": {
                              color: color
                            }
                          }}
                        />
                      }
                      label={
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "20%",
                            backgroundColor: color,
                            border: `1px solid #ccc`
                          }}
                        />
                      }
                    />
                  ))}
                </RadioGroup>

                <Divider sx={{ mt: 2 }} />
              </Grid>

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

      </BootstrapDialog>
    </>
  );
};

export default AccountModalView;

