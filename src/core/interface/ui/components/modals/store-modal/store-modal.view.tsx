import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  styled
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import { IStore } from "@domain/entities/store/store.entity"

interface IStoreModalView {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: IFormStore) => void
  selectedStore: IStore | null
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}))

const validationSchema = Yup.object({
  name: Yup.string().required("Store name is required")
})

const formInitialValues = (selectedStore?: IStore | null): IFormStore => ({
  name: selectedStore?.name ?? "",
  classification: selectedStore?.classification ?? null
})

const StoreModalView: React.FC<IStoreModalView> = (props) => {
  const isCreate = !props.selectedStore

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formInitialValues(props.selectedStore),
    validationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      try {
        await props.handleSubmit(values)
        toast.success(
          isCreate
            ? "Successfully added a new store!"
            : "Successfully edited your store!"
        )
        resetForm()
        props.handleClose()
      } catch (error) {
        if (error instanceof FormRequestError) {
          const { data } = error
          setErrors(data)
          if (data?.nonFieldErrors?.length) {
            toast.error(data.nonFieldErrors[0])
          } else {
            toast.error(`Unable to ${isCreate ? "create" : "edit"} store.`)
          }
          return
        }

        throw error
      }
    }
  })

  const handleMainCloseModal = () => {
    props.handleClose()
    formik.resetForm()
  }

  return (
    <BootstrapDialog
      onClose={handleMainCloseModal}
      aria-labelledby={props.selectedStore ? "Edit Store" : "Create Store"}
      open={props.showModal}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={props.selectedStore ? "Edit Store" : "Create Store"}>
        {props.selectedStore ? "Edit Store" : "Create Store"}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleMainCloseModal}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500]
        })}
      >
        <CloseIcon />
      </IconButton>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label="Store Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                required
                id="classification"
                name="classification"
                label="Store Classification"
                value={formik.values.classification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.classification && Boolean(formik.errors.classification)}
                helperText={formik.touched.classification && formik.errors.classification}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleMainCloseModal}>Cancel</Button>
          <Button type="submit" variant="contained">
            {props.selectedStore ? "Save Changes" : "Create Store"}
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  )
}

export default StoreModalView
