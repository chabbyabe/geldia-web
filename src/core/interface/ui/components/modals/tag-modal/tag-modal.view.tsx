import React from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  styled
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import { ITag } from "@domain/entities/tag/tag.entity"
import { ACCOUNT_COLORS } from "@interface/presenters/constants"

interface ITagModalView {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: IFormTag) => void
  selectedTag: ITag | null
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
  name: Yup.string().required("Tag name is required"),
  color: Yup.string().nullable()
})

const formInitialValues = (selectedTag?: ITag | null): IFormTag => ({
  name: selectedTag?.name ?? "",
  color: selectedTag?.color ?? "#006CD1"
})

const TagModalView: React.FC<ITagModalView> = (props) => {
  const isCreate = !props.selectedTag

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formInitialValues(props.selectedTag),
    validationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      try {
        await props.handleSubmit(values)
        toast.success(
          isCreate
            ? "Successfully added a new tag!"
            : "Successfully edited your tag!"
        )
        resetForm()
        props.handleClose()
      } catch (error) {
        if (error instanceof FormRequestError) {
          const { data } = error;
          setErrors(data);
          if (data?.nonFieldErrors?.length) {
            toast.error(data.nonFieldErrors[0]);
          } else {
            toast.error(`Unable to ${isCreate ? "create" : "edit"} tag.`)
          }

          return;
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
      aria-labelledby={props.selectedTag ? "Edit Tag" : "Create Tag"}
      open={props.showModal}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={props.selectedTag ? "Edit Tag" : "Create Tag"}>
        {props.selectedTag ? "Edit Tag" : "Create Tag"}
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
                label="Tag Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid size={12}>
              <FormLabel>Select Color</FormLabel>
              <RadioGroup
                row
                id="color"
                name="color"
                value={formik.values.color ?? ""}
                onChange={formik.handleChange}
              >
                {ACCOUNT_COLORS.map((color) => (
                  <FormControlLabel
                    key={color}
                    value={color}
                    control={
                      <Radio
                        sx={{
                          color,
                          "&.Mui-checked": { color }
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "20%",
                          backgroundColor: color,
                          border: "1px solid #ccc"
                        }}
                      />
                    }
                  />
                ))}
              </RadioGroup>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleMainCloseModal}>Cancel</Button>
          <Button type="submit" variant="contained">
            {props.selectedTag ? "Save Changes" : "Create Tag"}
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  )
}

export default TagModalView
