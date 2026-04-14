import React from "react"
import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import { IStore } from "@domain/entities/store/store.entity"
import StoreModalView from "./store-modal.view"

interface IStoreModalContainer {
  showModal: boolean
  handleMainModalClose: () => void
  handleSubmit: (values: IFormStore) => void
  selectedStore: IStore | null
}

export const StoreModalContainer: React.FC<IStoreModalContainer> = (props) => {
  return (
    <StoreModalView
      showModal={props.showModal}
      handleClose={props.handleMainModalClose}
      handleSubmit={props.handleSubmit}
      selectedStore={props.selectedStore}
    />
  )
}

export default StoreModalContainer
