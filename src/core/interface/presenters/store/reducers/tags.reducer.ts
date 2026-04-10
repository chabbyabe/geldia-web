import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IPagedTagEntity } from "@domain/entities/tag/paged.tag.entity"
import { ITagSearchParams } from "@domain/entities/tag/search.entity"
import { ITag } from "@domain/entities/tag/tag.entity"

interface ITagState {
  tags: ITag[]
  currentTag: ITag | null
  pagination: IBasePagedListEntity
  searchParams: ITagSearchParams
}

const initialState: ITagState = {
  tags: [],
  currentTag: null,
  pagination: {
    count: 0,
    totalPages: 1,
    currentPageNumber: 1,
    next: null,
    previous: null
  },
  searchParams: {
    page: 1,
    search: "",
    ordering: "",
    filterModel: ""
  }
}

export const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    initializeTags(
      state,
      action: PayloadAction<{
        tags: IPagedTagEntity
        searchParams: ITagSearchParams
      }>
    ) {
      state.tags = [...action.payload.tags.results]
      state.pagination = (({ results, ...rest }) => rest)(action.payload.tags)
      state.searchParams = {
        page: action.payload.tags.currentPageNumber,
        search: action.payload.searchParams.search ?? "",
        ordering: action.payload.searchParams.ordering ?? "",
        filterModel: action.payload.searchParams.filterModel ?? ""
      }
    },
    setCurrentTag(state, action: PayloadAction<ITag>) {
      state.currentTag = action.payload
    },
    clearCurrentTag(state) {
      state.currentTag = null
    },
    addNewTag(state, action: PayloadAction<ITag>) {
      state.tags = [action.payload, ...state.tags]
      state.currentTag = action.payload
    },
    updateTag(state, action: PayloadAction<ITag>) {
      const updatedTag = action.payload
      state.tags = state.tags.map((tag) => tag.id === updatedTag.id ? updatedTag : tag)
      state.currentTag = updatedTag
    },
    deleteTag(state) {
      const tagId = state.currentTag?.id
      state.tags = state.tags.filter((tag) => tag.id !== tagId)
      state.currentTag = null
    }
  }
})

export const {
  initializeTags,
  setCurrentTag,
  clearCurrentTag,
  addNewTag,
  updateTag,
  deleteTag
} = tagSlice.actions

export default tagSlice.reducer
