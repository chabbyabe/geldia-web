import React, { useState } from "react"
import { BaseLayoutContainer } from "@interface/ui/components/common/layouts/base-layout/base-layout.container"
import { PAGES, STRING_OPERATORS } from "@interface/presenters/constants"
import { ITag } from "@domain/entities/tag/tag.entity"
import { ITagSearchParams } from "@domain/entities/tag/search.entity"
import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import CustomTableContainer from "@interface/ui/components/common/table/table.container"
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { Delete, Edit } from "@mui/icons-material"
import DeleteConfirmationModal from "@interface/ui/components/modals/delete-confirmation-modal/delete-confirmation-modal.container"
import TagModalContainer from "@interface/ui/components/modals/tag-modal/tag-modal.container"

export interface ITagsViewModel {
  tags: ITag[]
  selectedTag: ITag | null
  pagination: IBasePagedListEntity
  handleSubmit: (values: IFormTag) => void
  handleDelete: (tag: ITag) => void
  handlePagination: (params: ITagSearchParams) => Promise<void>
  handleActionMenu: (actionId: number) => void
  clearCurrentTag: () => void
}

const TagsView: React.FC<ITagsViewModel> = (props) => {
  const [openTagModal, setOpenTagModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handleCreateModal = () => {
    props.clearCurrentTag()
    setOpenTagModal(true)
  }

  const handleEditTag = async (id: number) => {
    await props.handleActionMenu(id)
    setOpenTagModal(true)
  }

  const handleDeleteTag = async (id: number) => {
    await props.handleActionMenu(id)
    setOpenDeleteModal(true)
  }

  const tableColumns: GridColDef<ITag>[] = [
    {
      field: "name",
      headerName: "Tag",
      minWidth: 180,
      flex: 1,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<ITag>) => (
        <Typography variant="body2">{params.row.name}</Typography>
      )
    },
    {
      field: "color",
      headerName: "Color",
      minWidth: 180,
      flex: 1,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<ITag>) => (
        params.row.color ? (
          <Chip
            label={params.row.color}
            size="small"
            sx={{
              backgroundColor: params.row.color,
              color: "#fff"
            }}
          />
        ) : <Box>-</Box>
      )
    },
    {
      field: "created_at",
      headerName: "Created",
      minWidth: 170,
      flex: 0.8,
      filterOperators: STRING_OPERATORS,
      renderCell: (params: GridRenderCellParams<ITag>) => <Box>{params.row.createdAt}</Box>
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.7,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ITag>) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={async (event) => {
                event.stopPropagation()
                await handleEditTag(params.row.id)
              }}
            >
              <Edit fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={async (event) => {
                event.stopPropagation()
                await handleDeleteTag(params.row.id)
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ]

  return (
    <BaseLayoutContainer currentPage={PAGES.TAGS.label}>
      <CustomTableContainer
        tableData={props.tags}
        pagination={props.pagination}
        tableColumns={tableColumns}
        handlePagination={props.handlePagination}
        buttonName={PAGES.TAGS.label}
        handleFormModal={handleCreateModal}
        disableColumnSelector={true}
        invisibleColumns={{}}
        hideFilter
      />

      <TagModalContainer
        showModal={openTagModal}
        handleMainModalClose={() => setOpenTagModal(false)}
        handleSubmit={props.handleSubmit}
        selectedTag={props.selectedTag}
      />

      <DeleteConfirmationModal
        open={openDeleteModal}
        pageTitle={PAGES.TAGS.label}
        hasConfirmation={false}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={async () => {
          if (props.selectedTag) {
            await props.handleDelete(props.selectedTag)
          }
        }}
      />
    </BaseLayoutContainer>
  )
}

export default TagsView
