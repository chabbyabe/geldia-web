import React from "react"
import { IFormPlace } from "@domain/entities/formModels/place-form.entity"
import { IPlace } from "@domain/entities/place/place.entity"
import PlaceModalView from "./place-modal.view"

interface IPlaceModalContainer {
  showModal: boolean
  handleMainModalClose: () => void
  handleSubmit: (values: IFormPlace) => void
  selectedPlace: IPlace | null
}

export const PlaceModalContainer: React.FC<IPlaceModalContainer> = (props) => {
  return (
    <PlaceModalView
      showModal={props.showModal}
      handleClose={props.handleMainModalClose}
      handleSubmit={props.handleSubmit}
      selectedPlace={props.selectedPlace}
    />
  )
}

export default PlaceModalContainer
