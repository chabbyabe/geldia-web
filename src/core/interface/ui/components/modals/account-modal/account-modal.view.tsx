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

export interface IAccountModalView {
  children?: React.ReactNode
    handleOpen? : (event: MouseEvent<HTMLElement>) => void
    handleClose? : () => void
    handleEdit? : () => void
    open? : boolean | false
    anchorEl? : HTMLElement | null,
    formik: any,
    users: IUser[],
    colors: string[],
    iconOptions: Record<string, React.ReactNode>,
    selectedAccount: IAccount | undefined
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


const AccountModalView: React.FC<IAccountModalView> = (props) => {

  return (
    <>
    <BootstrapDialog
        onClose={props.handleClose}
        aria-labelledby= {props.selectedAccount ? "Edit Account" : "Create Account"}
        open={props.showModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id={props.selectedAccount ? "Edit Account" : "Create Account"}>
          {props.selectedAccount ? "Edit Account" : "Create Account"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={props.handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
            <form onSubmit={props.formik.handleSubmit}>

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
              value={props.formik.values.name}
              onChange={props.formik.handleChange}
              onBlur={props.formik.handleBlur}
              error={props.formik.touched.name && Boolean(props.formik.errors.name)}
              helperText={props.formik.touched.name && props.formik.errors.name}
            />
          </Grid>
          {/* Balance */}
          <Grid size={4}>
            <TextField
              fullWidth
              name="balance"
              label="Balance"
              type="number"
              value={props.formik.values.balance}
              onChange={props.formik.handleChange}
              onBlur={props.formik.handleBlur}
              error={props.formik.touched.balance && Boolean(props.formik.errors.balance)}
              helperText={props.formik.touched.balance && props.formik.errors.balance}
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
              value={props.formik.values.notes}
              onChange={props.formik.handleChange}
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
                    defaultValue={props.formik.values.icon}
                    onChange={props.formik.handleChange}
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
              defaultValue= {props.formik.values.color}
            >
              {props.colors.map((color) => (
                <FormControlLabel
                  key={color}
                  value={color}
                  name="color"
                  onChange={props.formik.handleChange}
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
                  checked={props.formik.values.countInAssets}
                  onChange={props.formik.handleChange}
                />
              }
              label="Count in Assets"
            />

            <FormControlLabel
              control={
                <Switch
                  name="isDefault"
                  checked={props.formik.values.isDefault}
                  onChange={props.formik.handleChange}
                />
              }
              label="Default Account"
            />

            <FormControlLabel
              control={
                <Switch
                  name="isShared"
                  checked={props.formik.values.isShared}
                  onChange={props.formik.handleChange}
                />
              }
              label="Shared Account"
            />
          </Grid>

          {/* Shared Users Multi Select */}
          {props.formik.values.isShared && (
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel id="sharedUsers-label">Shared Users</InputLabel>
                <Select
                  labelId="sharedUsers-label"
                  id="sharedUserIds"
                  multiple
                  name="sharedUserIds"
                  value={props.formik.values.sharedUserIds}
                  onChange={(event) =>
                    props.formik.setFieldValue(
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
                        checked={props.formik.values.sharedUserIds.includes(user.id)}
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
              {props.selectedAccount ? 'Edit Account' : 'Create Account' }
            </Button>
          </Grid>
        </DialogActions>
        </form>

      </BootstrapDialog>
    </>
  );
};

export default AccountModalView;

    