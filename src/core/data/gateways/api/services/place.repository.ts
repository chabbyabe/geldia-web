import { IPagedPlaceEntity } from "@domain/entities/place/paged.place.entity"
import { IPlaceSearchParams } from "@domain/entities/place/search.entity"
import { IPlace } from "@domain/entities/place/place.entity"
import { store } from "@interface/presenters/store/store"
import {
  addNewPlace,
  clearCurrentPlace,
  deletePlace,
  initializePlaces,
  setCurrentPlace,
  updatePlace
} from "@interface/presenters/store/reducers/places.reducer"

export default class PlaceRepository {
  initializePlaces(places: IPagedPlaceEntity, params: IPlaceSearchParams) {
    store.dispatch(initializePlaces({ places, searchParams: params }))
  }

  setCurrentPlace(item: IPlace) {
    store.dispatch(setCurrentPlace(item))
  }

  clearCurrentPlace() {
    store.dispatch(clearCurrentPlace())
  }

  setPlace(item: IPlace) {
    store.dispatch(addNewPlace(item))
  }

  updatePlace(item: IPlace) {
    store.dispatch(updatePlace(item))
  }

  deletePlace() {
    store.dispatch(deletePlace())
  }
}
