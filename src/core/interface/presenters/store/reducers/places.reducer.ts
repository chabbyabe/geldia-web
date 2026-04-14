import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IPagedPlaceEntity } from "@domain/entities/place/paged.place.entity"
import { IPlaceSearchParams } from "@domain/entities/place/search.entity"
import { IPlace } from "@domain/entities/place/place.entity"

interface IPlaceState {
  places: IPlace[]
  currentPlace: IPlace | null
  pagination: IBasePagedListEntity
  searchParams: IPlaceSearchParams
}

const initialState: IPlaceState = {
  places: [],
  currentPlace: null,
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

export const placeSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    initializePlaces(
      state,
      action: PayloadAction<{
        places: IPagedPlaceEntity
        searchParams: IPlaceSearchParams
      }>
    ) {
      state.places = [...action.payload.places.results]
      state.pagination = (({ results, ...rest }) => rest)(action.payload.places)
      state.searchParams = {
        page: action.payload.places.currentPageNumber,
        search: action.payload.searchParams.search ?? "",
        ordering: action.payload.searchParams.ordering ?? "",
        filterModel: action.payload.searchParams.filterModel ?? ""
      }
    },
    setCurrentPlace(state, action: PayloadAction<IPlace>) {
      state.currentPlace = action.payload
    },
    clearCurrentPlace(state) {
      state.currentPlace = null
    },
    addNewPlace(state, action: PayloadAction<IPlace>) {
      state.places = [action.payload, ...state.places]
      state.currentPlace = action.payload
    },
    updatePlace(state, action: PayloadAction<IPlace>) {
      const updatedPlace = action.payload
      state.places = state.places.map((item) => item.id === updatedPlace.id ? updatedPlace : item)
      state.currentPlace = updatedPlace
    },
    deletePlace(state) {
      const placeId = state.currentPlace?.id
      state.places = state.places.filter((item) => item.id !== placeId)
      state.currentPlace = null
    }
  }
})

export const {
  initializePlaces,
  setCurrentPlace,
  clearCurrentPlace,
  addNewPlace,
  updatePlace,
  deletePlace
} = placeSlice.actions

export default placeSlice.reducer
