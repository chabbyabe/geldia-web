import { useCallback, useEffect, useMemo } from "react"
import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import { IStore } from "@domain/entities/store/store.entity"
import { useAppSelector } from "@interface/presenters/store/hooks"
import StoresController from "./stores.controller"
import StoresView from "./stores.view"

export const StoresContainer: React.FC = () => {
  const controller = useMemo(() => new StoresController(), [])
  const stores = useAppSelector((state) => state.storesState.stores)
  const selectedStore = useAppSelector((state) => state.storesState.currentStore)
  const pagination = useAppSelector((state) => state.storesState.pagination)
  const searchParams = useAppSelector((state) => state.storesState.searchParams)
  const currentUser = useAppSelector(state => state.authState.user);

  useEffect(() => {
    controller.clearCurrentStore()
  }, [controller])

  const handleSubmit = async (values: IFormStore) => {
    if (selectedStore) {
      await controller.updateStore(selectedStore.id, values)
    } else {
      await controller.createStore(values)
    }

    await controller.retrieveStores({
      ...searchParams,
      page: pagination.currentPageNumber
    })
  }

  const handleDelete = async (item: IStore) => {
    await controller.deleteStore(item)
    await controller.retrieveStores({
      ...searchParams,
      page: pagination.currentPageNumber
    })
  }

  const handlePagination = useCallback(async (...args: Parameters<StoresController["retrieveStores"]>) => {
    await controller.retrieveStores(...args)
  }, [controller])

  const handleActionMenu = useCallback(async (...args: Parameters<StoresController["setCurrentStore"]>) => {
    await controller.setCurrentStore(...args)
  }, [controller])

  const clearCurrentStore = useCallback(() => {
    controller.clearCurrentStore()
  }, [controller])

  return (
    <StoresView
      stores={stores}
      selectedStore={selectedStore}
      pagination={pagination}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      handlePagination={handlePagination}
      handleActionMenu={handleActionMenu}
      clearCurrentStore={clearCurrentStore}
      currentUser={currentUser}  
    />
  )
}

export default StoresContainer
