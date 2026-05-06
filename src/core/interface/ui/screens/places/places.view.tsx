import React, { useState } from "react"
import { BaseLayoutContainer } from "@interface/ui/components/common/layouts/base-layout/base-layout.container"
import { PAGES, MUI_STRING_OPERATORS as STRING_OPERATORS } from "@interface/presenters/constants"
import { IPlace } from "@domain/entities/place/place.entity"
import { IPlaceSearchParams } from "@domain/entities/place/search.entity"
import { IFormPlace } from "@domain/entities/formModels/place-form.entity"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import CustomTableContainer from "@interface/ui/components/common/table/table.container"
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { Delete, Edit } from "@mui/icons-material"
import DeleteConfirmationModal from "@interface/ui/components/modals/delete-confirmation-modal/delete-confirmation-modal.container"
import PlaceModalContainer from "@interface/ui/components/modals/place-modal/place-modal.container"
import { IUser } from "@domain/entities/user/user.entity"

export interface IPlacesViewModel {
  places: IPlace[]
  selectedPlace: IPlace | null
  pagination: IBasePagedListEntity
  handleSubmit: (values: IFormPlace) => void
  handleDelete: (item: IPlace) => void
  handlePagination: (params: IPlaceSearchParams) => Promise<void>
  handleActionMenu: (actionId: number) => void
  clearCurrentPlace: () => void
  currentUser: IUser | null
}

const PlacesView: React.FC<IPlacesViewModel> = (props) => {
  const [openPlaceModal, setOpenPlaceModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handleCreateModal = () => {
    props.clearCurrentPlace()
    setOpenPlaceModal(true)
  }

  const handleEditPlace = async (id: number) => {
    await props.handleActionMenu(id)
    setOpenPlaceModal(true)
  }

  const handleDeletePlace = async (id: number) => {
    await props.handleActionMenu(id)
    setOpenDeleteModal(true)
  }

  const tableColumns: GridColDef<IPlace>[] = [
    {
      field: "name",
      headerName: "Place",
      minWidth: 220,
      flex: 1,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IPlace>) => (
        <Typography variant="body2">{params.row.name}</Typography>
      )
    },
    {
      field: "classification",
      headerName: "Classification",
      minWidth: 220,
      flex: 1,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IPlace>) => (
        <Typography variant="body2">{params.row.classification}</Typography>
      )
    },
    {
      field: "created_by__username",
      headerName: "Created By",
      minWidth: 170,
      flex: 0.8,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IPlace>) => {
        const isOwner = params.row.createdBy?.id === props.currentUser?.id
        return (
          params.row.createdBy &&
          <Chip label={params.row.createdBy?.username}
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
      renderCell: (params: GridRenderCellParams<IPlace>) => <Box>{params.row.createdAt}</Box>
    },
    {
      field: "updated_by__username",
      headerName: "Updated By",
      minWidth: 170,
      flex: 0.8,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<IPlace>) => {
        const isOwner = params.row.updatedBy?.id === props.currentUser?.id
        return isOwner && (
          <Chip label={params.row.updatedBy?.username}
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
      renderCell: (params: GridRenderCellParams<IPlace>) => {
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
      renderCell: (params: GridRenderCellParams<IPlace>) => {
        const isOwner = params.row.createdBy?.id === props.currentUser?.id;
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={"Edit"}>
              <IconButton
                size="small"
                onClick={async (event) => {
                  event.stopPropagation()
                  await handleEditPlace(params.row.id)
                }}
              >
                <Edit fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isOwner ? "Delete" : "You don't have permission to delete this place."}>
              <IconButton
                size="small"
                color="error"
                disabled={!isOwner}
                onClick={async (event) => {
                  event.stopPropagation()
                  await handleDeletePlace(params.row.id)
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    }
  ]

  return (
    <BaseLayoutContainer currentPage={PAGES.PLACES.label}>
      <CustomTableContainer
        tableData={props.places}
        pagination={props.pagination}
        tableColumns={tableColumns}
        handlePagination={props.handlePagination}
        buttonName={PAGES.PLACES.label}
        handleFormModal={handleCreateModal}
        disableColumnSelector={true}
        invisibleColumns={{}}
        hideFilter
      />

      <PlaceModalContainer
        showModal={openPlaceModal}
        handleMainModalClose={() => setOpenPlaceModal(false)}
        handleSubmit={props.handleSubmit}
        selectedPlace={props.selectedPlace}
      />

      <DeleteConfirmationModal
        open={openDeleteModal}
        pageTitle={PAGES.PLACES.label}
        hasConfirmation={false}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={async () => {
          if (props.selectedPlace) {
            await props.handleDelete(props.selectedPlace)
          }
        }}
      />
    </BaseLayoutContainer>
  )
}

export default PlacesView
