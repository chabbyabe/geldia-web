import React, { useMemo, useState } from "react"
import { BaseLayoutContainer } from "@interface/ui/components/common/layouts/base-layout/base-layout.container"
import { PAGES, STRING_OPERATORS } from "@interface/presenters/constants"
import { ICategory, ICategoryListItem } from "@domain/entities/category/category.entity"
import { ICategorySearchParams } from "@domain/entities/category/search.entity"
import { IFormCategory } from "@domain/entities/formModels/category-form.entity"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { ITransactionType } from "@domain/entities/transaction/transaction.entity"
import CustomTableContainer from "@interface/ui/components/common/table/table.container"
import { Box, Chip, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { Edit, Delete, Wallet as WalletIcon } from "@mui/icons-material"
import DeleteConfirmationModal from "@interface/ui/components/modals/delete-confirmation-modal/delete-confirmation-modal.container"
import CategoryModalContainer from "@interface/ui/components/modals/category-modal/category-modal.container"
import IconOptions from "@interface/ui/components/common/account/account-icon.constant"
import { TRANSACTION_TYPE } from "@base/core/data/gateways/api/constants"

export interface ICategoriesViewModel {
  categories: ICategory[]
  selectedCategory: ICategory | null
  pagination: IBasePagedListEntity
  transactionTypes: ITransactionType[]
  handleSubmit: (values: IFormCategory) => void
  handleDelete: (category: ICategory) => void
  handlePagination: (params: ICategorySearchParams) => Promise<void>
  handleActionMenu: (actionId: number) => void
  clearCurrentCategory: () => void
}

const renderCategoryIcon = (icon: string | null, color: string | null) => {
  const iconFromOptions = icon ? IconOptions[icon] : undefined
  const iconToRender = iconFromOptions ?? <WalletIcon />

  return React.cloneElement(iconToRender as React.ReactElement, {
    sx: { fontSize: 22, color: color ?? "#006CD1" }
  })
}

const ChildCategoryCard: React.FC<{
  child: ICategoryListItem
  onEdit: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
}> = ({ child, onEdit, onDelete }) => {
  return (
    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2, minWidth: 220 }}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack spacing={0.75}>
          <Stack direction="row" spacing={1} alignItems="center">
            {renderCategoryIcon(child.icon, child.color)}
            <Typography variant="body2" fontWeight={600}>{child.name}</Typography>
              <Typography variant="body2" fontWeight={600}>{child.notes}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {child.transactionType && (
              <Chip
                label={child.transactionType.name}
                size="small"
                sx={{
                  backgroundColor: child.transactionType.color ?? "transparent",
                  color: child.transactionType.color ? "#fff" : "inherit"
                }}
              />
            )}
            {child.color && (
              <Chip
                label={child.color}
                size="small"
                variant="outlined"
                sx={{ borderColor: child.color }}
              />
            )}
          </Stack>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit child category">
            <IconButton size="small" onClick={() => void onEdit(child.id)}>
              <Edit fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete child category">
            <IconButton size="small" color="error" onClick={() => void onDelete(child.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  )
}

const CategoriesView: React.FC<ICategoriesViewModel> = (props) => {
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handleCreateModal = () => {
    props.clearCurrentCategory()
    setOpenCategoryModal(true)
  }

  const handleEditCategory = async (id: number) => {
    await props.handleActionMenu(id)
    setOpenCategoryModal(true)
  }

  const handleDeleteCategory = async (id: number) => {
    await props.handleActionMenu(id)
    setOpenDeleteModal(true)
  }

  const tableColumns = useMemo<GridColDef<ICategory>[]>(() => [
    {
      field: "name",
      headerName: "Main Category",
      minWidth: 180,
      flex: 1,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<ICategory>) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">{params.row.name}</Typography>
        </Stack>
      )
    },
    {
      field: "transaction_type__name",
      headerName: "Type",
      minWidth: 130,
      flex: 0.8,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<ICategory>) => {
        const transType = params.row.transactionType?.name
        if (!transType) return null
        const color = transType === TRANSACTION_TYPE.INCOME.name ? "primary" : (transType === TRANSACTION_TYPE.EXPENSES.name ? "error" : "warning")
        return (
          <Chip
            label={transType}
            size="small"
            color={color}
          />
        )
      }
    },
    {
      field: "icon",
      headerName: "Icon",
      minWidth: 140,
      flex: 0.8,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<ICategory>) => (
        <Stack direction="row" spacing={1} alignItems="center">
          {renderCategoryIcon(params.row.icon, params.row.color)}
          <Typography variant="body2">{params.row.icon ?? "Default"}</Typography>
        </Stack>
      )
    },
    {
      field: "categories",
      headerName: "Categories",
      minWidth: 320,
      flex: 1.8,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ICategory>) => (
        params.row.children?.length ? (
          <Stack spacing={1} sx={{ py: 1, width: "100%" }}>
            {params.row.children.map((child) => (
              <ChildCategoryCard
                key={child.id}
                child={child}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">No child categories</Typography>
        )
      )
    },
    {
      field: "color",
      headerName: "Color",
      minWidth: 120,
      flex: 0.7,
      sortable: true,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<ICategory>) => (
        params.row.color ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: 1,
                backgroundColor: params.row.color,
                border: "1px solid rgba(0,0,0,0.1)"
              }}
            />
            <Typography variant="body2">{params.row.color}</Typography>
          </Stack>
        ) : <Box>-</Box>
      )
    },
    {
      field: "notes",
      headerName: "Notes",
      minWidth: 220,
      flex: 1.2,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<ICategory>) => (
        <Typography variant="body2">{params.row.notes ?? "-"}</Typography>
      )
    },
    {
      field: "created_at",
      headerName: "Created",
      minWidth: 170,
      flex: 0.9,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<ICategory>) => <Box>{params.row.createdAt}</Box>
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.7,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ICategory>) => {
        const hasChildren = Boolean(params.row.children?.length)

        return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={async (event) => {
                event.stopPropagation()
                await handleEditCategory(params.row.id)
              }}
            >
              <Edit fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title={hasChildren ? "Remove child categories first" : "Delete"}>
            <span>
              <IconButton
                size="small"
                color="error"
                disabled={hasChildren}
                onClick={async (event) => {
                  event.stopPropagation()
                  await handleDeleteCategory(params.row.id)
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {hasChildren && (
            <Chip label="Locked" size="small" variant="outlined" color="warning" />
          )}
        </Stack>
      ) }
    }
  ], [props])

  return (
    <BaseLayoutContainer currentPage={PAGES.CATEGORIES.label}>
      <CustomTableContainer
        tableData={props.categories}
        pagination={props.pagination}
        tableColumns={tableColumns}
        handlePagination={props.handlePagination}
        buttonName={PAGES.CATEGORIES.label}
        handleFormModal={handleCreateModal}
        disableColumnSelector={true}
        invisibleColumns={{}}
        hideFilter
      />

      <CategoryModalContainer
        showModal={openCategoryModal}
        handleMainModalClose={() => setOpenCategoryModal(false)}
        handleSubmit={props.handleSubmit}
        selectedCategory={props.selectedCategory}
        categories={props.categories}
        transactionTypes={props.transactionTypes}
      />

      <DeleteConfirmationModal
        open={openDeleteModal}
        pageTitle={PAGES.CATEGORIES.label}
        hasConfirmation={false}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={async () => {
          if (props.selectedCategory) {
            await props.handleDelete(props.selectedCategory)
          }
        }}
      />
    </BaseLayoutContainer>
  )
}

export default CategoriesView
