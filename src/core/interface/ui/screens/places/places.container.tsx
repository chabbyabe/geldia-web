import { useEffect, useMemo } from "react"
import { IFormPlace } from "@domain/entities/formModels/place-form.entity"
import { IPlace } from "@domain/entities/place/place.entity"
import { useAppSelector } from "@interface/presenters/store/hooks"
import PlacesController from "./places.controller"
import PlacesView from "./places.view"

export const PlacesContainer: React.FC = () => {
  const controller = useMemo(() => new PlacesController(), [])
  const places = useAppSelector((state) => state.placesState.places)
  const selectedPlace = useAppSelector((state) => state.placesState.currentPlace)
  const pagination = useAppSelector((state) => state.placesState.pagination)
  const searchParams = useAppSelector((state) => state.placesState.searchParams)
  const currentUser = useAppSelector(state => state.authState.user);

  useEffect(() => {
    controller.clearCurrentPlace()
  }, [controller])

  const handleSubmit = async (values: IFormPlace) => {
    if (selectedPlace) {
      await controller.updatePlace(selectedPlace.id, values)
    } else {
      await controller.createPlace(values)
    }

    await controller.retrievePlaces({
      ...searchParams,
      page: pagination.currentPageNumber
    })
  }

  const handleDelete = async (item: IPlace) => {
    await controller.deletePlace(item)
    await controller.retrievePlaces({
      ...searchParams,
      page: pagination.currentPageNumber
    })
  }

  return (
    <PlacesView
      places={places}
      selectedPlace={selectedPlace}
      pagination={pagination}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      handlePagination={controller.retrievePlaces.bind(controller)}
      handleActionMenu={controller.setCurrentPlace.bind(controller)}
      clearCurrentPlace={controller.clearCurrentPlace.bind(controller)}
      currentUser={currentUser}
    />
  )
}

export default PlacesContainer
