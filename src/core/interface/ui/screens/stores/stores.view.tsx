import React, { useState } from "react"
import { BaseLayoutContainer } from "@interface/ui/components/common/layouts/base-layout/base-layout.container"
import { PAGES, STRING_OPERATORS } from "@interface/presenters/constants"
import { IStore } from "@domain/entities/store/store.entity"
import { IStoreSearchParams } from "@domain/entities/store/search.entity"
import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import CustomTableContainer from "@interface/ui/components/common/table/table.container"
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { Delete, Edit } from "@mui/icons-material"
import DeleteConfirmationModal from "@interface/ui/components/modals/delete-confirmation-modal/delete-confirmation-modal.container"
import StoreModalContainer from "@interface/ui/components/modals/store-modal/store-modal.container"
import { IUser } from "@domain/entities/user/user.entity"

export interface IStoresViewModel {
  stores: IStore[]
  selectedStore: IStore | null
  pagination: IBasePagedListEntity
  handleSubmit: (values: IFormStore) => void
  handleDelete: (item: IStore) => void
  handlePagination: (params: IStoreSearchParams) => Promise<void>
  handleActionMenu: (actionId: number) => void
  clearCurrentStore: () => void
  currentUser: IUser | null
}

const StoresView: React.FC<IStoresViewModel> = (props) => {
  const [openStoreModal, setOpenStoreModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handleCreateModal = () => {
    props.clearCurrentStore()
    setOpenStoreModal(true)
  }

  const handleEditStore = async (id: number) => {
    await props.handleActionMenu(id)
    setOpenStoreModal(true)
  }

  const handleDeleteStore = async (id: number) => {
    await props.handleActionMenu(id)
    setOpenDeleteModal(true)
  }

  const tableColumns: GridColDef<IStore>[] = [
    {
      field: "name",
      headerName: "Store",
      minWidth: 220,
      flex: 1,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IStore>) => (
        <Typography variant="body2">{params.row.name}</Typography>
      )
    },
    {
      field: "classification",
      headerName: "Classification",
      minWidth: 220,
      flex: 1,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IStore>) => (
        <Typography variant="body2">{params.row.classification}</Typography>
      )
    },
    {
      field: "created_by__username",
      headerName: "Created By",
      minWidth: 170,
      flex: 0.8,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IStore>) => {
        const isOwner = params.row.createdBy?.id === props.currentUser?.id
        return (
          <Chip label={params.row.createdBy?.username ?? "System Generated"}
            size="small"
            color={isOwner ? "primary" : "default"}></Chip>

        )
      }
    },
    {
      field: "created_at",
      headerName: "Created",
      minWidth: 170,
      flex: 0.8,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IStore>) => <Box>{params.row.createdAt}</Box>
    },
    {
      field: "updated_by__username",
      headerName: "Updated By",
      minWidth: 170,
      flex: 0.8,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IStore>) => {
        const isOwner = params.row.updatedBy?.id === props.currentUser?.id
        return isOwner && (
          <Chip label={params.row.updatedBy?.username ?? "System Generated"}
            size="small"
            color={isOwner ? "primary" : "default"}></Chip>

        )
      }
    },
    {
      field: "updated_at",
      headerName: "Updated By",
      minWidth: 170,
      flex: 0.8,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IStore>) => {
        const isOwner = params.row.updatedBy?.id === props.currentUser?.id
        return isOwner && <Box>{params.row.updatedAt}</Box>
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.7,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<IStore>) => {
        const isOwner = params.row.createdBy?.id === props.currentUser?.id;
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Edit">
              <span>
                <IconButton
                  size="small"
                  onClick={async (event) => {
                    event.stopPropagation()
                    await handleEditStore(params.row.id)
                  }}
                >
                  <Edit fontSize="small" color="primary" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={isOwner ? "Delete" : "You are not allowed to delete this store."}>
              <span>
                <IconButton
                  size="small"
                  color="error"
                  disabled={!isOwner}
                  onClick={async (event) => {
                    event.stopPropagation()
                    await handleDeleteStore(params.row.id)
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )
      }
    }
  ]

  return (
    <BaseLayoutContainer currentPage={PAGES.STORES.label}>
      <CustomTableContainer
        tableData={props.stores}
        pagination={props.pagination}
        tableColumns={tableColumns}
        handlePagination={props.handlePagination}
        buttonName={PAGES.STORES.label}
        handleFormModal={handleCreateModal}
        disableColumnSelector={true}
        invisibleColumns={{}}
        hideFilter
      />

      <StoreModalContainer
        showModal={openStoreModal}
        handleMainModalClose={() => setOpenStoreModal(false)}
        handleSubmit={props.handleSubmit}
        selectedStore={props.selectedStore}
      />

      <DeleteConfirmationModal
        open={openDeleteModal}
        pageTitle={PAGES.STORES.label}
        hasConfirmation={false}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={async () => {
          if (props.selectedStore) {
            await props.handleDelete(props.selectedStore)
          }
        }}
      />
    </BaseLayoutContainer>
  )
}

export default StoresView
