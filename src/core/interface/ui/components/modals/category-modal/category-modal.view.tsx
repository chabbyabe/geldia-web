import React, { useEffect, useMemo } from "react"
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  TextField,
  Stack,
  styled
} from "@mui/material"
import { Close as CloseIcon, Wallet as WalletIcon } from "@mui/icons-material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { ICategory } from "@domain/entities/category/category.entity"
import { IFormCategory } from "@domain/entities/formModels/category-form.entity"
import { ITransactionType } from "@domain/entities/transaction/transaction.entity"
import { ACCOUNT_COLORS } from "@interface/presenters/constants"
import IconOptions from "@interface/ui/components/common/account/account-icon.constant"

interface ICategoryModalView {
  showModal: boolean
  handleClose: () => void
  handleSubmit: (values: IFormCategory) => void
  selectedCategory: ICategory | null
  categories: ICategory[]
  transactionTypes: ITransactionType[]
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
  name: Yup.string().required("Category name is required"),
  transactionType: Yup.number().nullable().required("Transaction type is required"),
  notes: Yup.string().nullable(),
  color: Yup.string().nullable(),
  icon: Yup.string().nullable(),
  parentCategory: Yup.number().nullable()
})

const formInitialValues = (selectedCategory?: ICategory | null): IFormCategory => ({
  name: selectedCategory?.name ?? "",
  notes: selectedCategory?.notes ?? "",
  color: selectedCategory?.color ?? "#E5484D",
  icon: selectedCategory?.icon ?? "Payments",
  transactionType: selectedCategory?.transactionType?.id ?? null,
  parentCategory: selectedCategory?.parentCategory?.id ?? null
})

const renderCategoryIcon = (icon: string | null, color: string | null) => {
  const iconFromOptions = icon ? IconOptions[icon] : undefined
  const iconToRender = iconFromOptions ?? <WalletIcon />

  return React.cloneElement(iconToRender as React.ReactElement, {
    sx: { fontSize: 24, color: color ?? "#006CD1" }
  })
}

const CategoryModalView: React.FC<ICategoryModalView> = (props) => {
  const isCreate = !props.selectedCategory
  const hasChildren = Boolean(props.selectedCategory?.children?.length)
  const hasExistingParent = Boolean(props.selectedCategory?.parentCategory?.id)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: formInitialValues(props.selectedCategory),
    validationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      try {
        const payload = { ...values,
          transactionTypeId: values.transactionType,
          parentCategoryId: values.parentCategory
         }
        await props.handleSubmit(payload)
        toast.success(
          isCreate
            ? "Successfully added a new category!"
            : "Successfully edited your category!"
        )
        resetForm()
        props.handleClose()
      } catch (error) {
        if (error instanceof FormRequestError) {
          setErrors(error.data)
          toast.error(`Unable to ${isCreate ? "create" : "edit"} category.`)
          return
        }
        throw error
      }
    }
  })

  const selectedParentCategory = useMemo(
    () => props.categories.find((category) => category.id === formik.values.parentCategory) ?? null,
    [props.categories, formik.values.parentCategory]
  )

  const availableParentCategories = useMemo(
    () => props.categories.filter((category) => category.id !== props.selectedCategory?.id),
    [props.categories, props.selectedCategory?.id]
  )

  const isTransactionTypeLocked = Boolean(selectedParentCategory)

  useEffect(() => {
    if (selectedParentCategory?.transactionType?.id) {
      formik.setFieldValue("transactionType", selectedParentCategory.transactionType.id)
    }
  }, [selectedParentCategory?.id, selectedParentCategory?.transactionType?.id])

  const handleMainCloseModal = () => {
    props.handleClose()
    formik.resetForm()
  }

  return (
    <BootstrapDialog
      onClose={handleMainCloseModal}
      aria-labelledby={props.selectedCategory ? "Edit Category" : "Create Category"}
      open={props.showModal}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id={props.selectedCategory ? "Edit Category" : "Create Category"}>
        {props.selectedCategory ? "Edit Category" : "Create Category"}
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
            <Grid size={6}>
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label="Category Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                select
                fullWidth
                required
                id="transactionType"
                name="transactionType"
                label="Transaction Type"
                value={formik.values.transactionType ?? ""}
                disabled={isTransactionTypeLocked}
                onChange={(event) => {
                  const value = event.target.value
                  formik.setFieldValue("transactionType", value === "" ? null : Number(value))
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.transactionType && Boolean(formik.errors.transactionType)}
                helperText={
                  selectedParentCategory?.transactionType?.name
                    ? `Child categories use the parent's transaction type: ${selectedParentCategory.transactionType.name}`
                    : formik.touched.transactionType && formik.errors.transactionType
                }
              >
                {props.transactionTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={6}>
              <TextField
                select
                fullWidth
                id="parentCategory"
                name="parentCategory"
                label="Parent Category"
                value={formik.values.parentCategory ?? ""}
                disabled={hasChildren || hasExistingParent}
                onChange={(event) => {
                  const value = event.target.value
                  formik.setFieldValue("parentCategory", value === "" ? null : Number(value))
                }}
                helperText={
                  hasChildren
                    ? "Parent category cannot be changed while this category has children."
                    : hasExistingParent
                      ? "Parent category cannot be edited once this category already has a parent."
                      : undefined
                }
              >
                <MenuItem value="">None</MenuItem>
                {availableParentCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={6}>
              <TextField
                select
                fullWidth
                id="icon"
                name="icon"
                label="Icon"
                value={formik.values.icon ?? ""}
                onChange={formik.handleChange}
              >
                {Object.keys(IconOptions).map((iconName) => (
                  <MenuItem key={iconName} value={iconName}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {renderCategoryIcon(iconName, formik.values.color)}
                      <span>{iconName}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="notes"
                label="Notes"
                value={formik.values.notes ?? ""}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid size={12}>
              <FormLabel>Select Color</FormLabel>
              <RadioGroup
                row
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
            {props.selectedCategory ? "Save Changes" : "Create Category"}
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  )
}

export default CategoryModalView
