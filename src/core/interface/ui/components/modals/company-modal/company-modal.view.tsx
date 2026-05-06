import React from "react"
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
import { IFormCompany } from "@domain/entities/formModels/company-form.entity"
import { ICompany } from "@domain/entities/company/company.entity"
import { formatDateTime } from "@base/core/interface/presenters/helpers"

interface ICompanyModalView {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: IFormCompany) => void
  selectedCompany: ICompany | null
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
  name: Yup.string().trim().required("Company name is required"),
  joinedAt: Yup.string().nullable(),
  resignedAt: Yup.string()
    .nullable()
    .test(
      "resigned-after-joined",
      "Resigned date must be the same as or after joined date",
      (value, context) => {
        const joinedAt = context.parent.joinedAt
        if (!value || !joinedAt) {
          return true
        }

        return value >= joinedAt
      }
    )
})

const formInitialValues = (selectedCompany?: ICompany | null): IFormCompany => ({
  name: selectedCompany?.name ?? "",
  isCurrent: selectedCompany?.isCurrent ?? false,
  joinedAt: formatDateTime(selectedCompany?.joinedAt || '', false, true) ?? null,
  resignedAt: formatDateTime(selectedCompany?.resignedAt || '', false, true) ?? null
})

const CompanyModalView: React.FC<ICompanyModalView> = (props) => {
  const isCreate = !props.selectedCompany

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formInitialValues(props.selectedCompany),
    validationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      try {
        await props.handleSubmit({
          ...values,
          name: values.name.trim(),
          joinedAt: values.joinedAt || null,
          resignedAt: values.isCurrent ? null : values.resignedAt || null
        })
        toast.success(
          isCreate
            ? "Successfully added a new company!"
            : "Successfully edited your company!"
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
            toast.error(`Unable to ${isCreate ? "create" : "edit"} company.`)
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
      aria-labelledby={props.selectedCompany ? "Edit Company" : "Create Company"}
      open={props.showModal}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={props.selectedCompany ? "Edit Company" : "Create Company"}>
        {props.selectedCompany ? "Edit Company" : "Create Company"}
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
                label="Company Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="isCurrent"
                    name="isCurrent"
                    checked={formik.values.isCurrent}
                    onChange={(event) => {
                      const checked = event.target.checked
                      formik.setFieldValue("isCurrent", checked)
                      if (checked) {
                        formik.setFieldValue("resignedAt", null)
                      }
                    }}
                  />
                }
                label="Current company"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="joinedAt"
                name="joinedAt"
                label="Joined date"
                type="date"
                value={formik.values.joinedAt ?? ""}
                onChange={(event) => {
                  formik.setFieldValue("joinedAt", event.target.value || null)
                }}
                onBlur={formik.handleBlur}
                slotProps={{ inputLabel: { shrink: true } }}
                error={formik.touched.joinedAt && Boolean(formik.errors.joinedAt)}
                helperText={formik.touched.joinedAt && formik.errors.joinedAt}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="resignedAt"
                name="resignedAt"
                label="Resigned date"
                type="date"
                value={formik.values.resignedAt ?? ""}
                onChange={(event) => {
                  formik.setFieldValue("resignedAt", event.target.value || null)
                }}
                onBlur={formik.handleBlur}
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={formik.values.isCurrent}
                error={formik.touched.resignedAt && Boolean(formik.errors.resignedAt)}
                helperText={
                  formik.values.isCurrent
                    ? "Cleared automatically for current companies"
                    : formik.touched.resignedAt && formik.errors.resignedAt
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleMainCloseModal}>Cancel</Button>
          <Button type="submit" variant="contained">
            {props.selectedCompany ? "Save Changes" : "Create Company"}
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  )
}

export default CompanyModalView
