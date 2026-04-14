import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IPagedStoreEntity } from "@domain/entities/store/paged.store.entity"
import { IStoreSearchParams } from "@domain/entities/store/search.entity"
import { IStore } from "@domain/entities/store/store.entity"

interface IStoreState {
  stores: IStore[]
  currentStore: IStore | null
  pagination: IBasePagedListEntity
  searchParams: IStoreSearchParams
}

const initialState: IStoreState = {
  stores: [],
  currentStore: null,
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

export const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    initializeStores(
      state,
      action: PayloadAction<{
        stores: IPagedStoreEntity
        searchParams: IStoreSearchParams
      }>
    ) {
      state.stores = [...action.payload.stores.results]
      state.pagination = (({ results, ...rest }) => rest)(action.payload.stores)
      state.searchParams = {
        page: action.payload.stores.currentPageNumber,
        search: action.payload.searchParams.search ?? "",
        ordering: action.payload.searchParams.ordering ?? "",
        filterModel: action.payload.searchParams.filterModel ?? ""
      }
    },
    setCurrentStore(state, action: PayloadAction<IStore>) {
      state.currentStore = action.payload
    },
    clearCurrentStore(state) {
      state.currentStore = null
    },
    addNewStore(state, action: PayloadAction<IStore>) {
      state.stores = [action.payload, ...state.stores]
      state.currentStore = action.payload
    },
    updateStore(state, action: PayloadAction<IStore>) {
      const updatedStore = action.payload
      state.stores = state.stores.map((item) => item.id === updatedStore.id ? updatedStore : item)
      state.currentStore = updatedStore
    },
    deleteStore(state) {
      const storeId = state.currentStore?.id
      state.stores = state.stores.filter((item) => item.id !== storeId)
      state.currentStore = null
    }
  }
})

export const {
  initializeStores,
  setCurrentStore,
  clearCurrentStore,
  addNewStore,
  updateStore,
  deleteStore
} = storeSlice.actions

export default storeSlice.reducer
