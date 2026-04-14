import { IPagedStoreEntity } from "@domain/entities/store/paged.store.entity"
import { IStoreSearchParams } from "@domain/entities/store/search.entity"
import { IStore } from "@domain/entities/store/store.entity"
import { store } from "@interface/presenters/store/store"
import {
  addNewStore,
  clearCurrentStore,
  deleteStore,
  initializeStores,
  setCurrentStore,
  updateStore
} from "@interface/presenters/store/reducers/stores.reducer"

export default class StoreRepository {
  initializeStores(stores: IPagedStoreEntity, params: IStoreSearchParams) {
    store.dispatch(initializeStores({ stores, searchParams: params }))
  }

  setCurrentStore(item: IStore) {
    store.dispatch(setCurrentStore(item))
  }

  clearCurrentStore() {
    store.dispatch(clearCurrentStore())
  }

  setStore(item: IStore) {
    store.dispatch(addNewStore(item))
  }

  updateStore(item: IStore) {
    store.dispatch(updateStore(item))
  }

  deleteStore() {
    store.dispatch(deleteStore())
  }
}
