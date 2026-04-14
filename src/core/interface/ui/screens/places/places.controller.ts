import PlaceApiGateway from "@data/gateways/api/services/place.gateway"
import PlaceRepository from "@data/gateways/api/services/place.repository"
import { IFormPlace } from "@domain/entities/formModels/place-form.entity"
import { IPlace } from "@domain/entities/place/place.entity"
import { IPlaceSearchParams } from "@domain/entities/place/search.entity"
import CreatePlaceUseCase from "@domain/usecases/places/create-place.usecase"
import DeletePlaceUseCase from "@domain/usecases/places/delete-place.usecase"
import GetPlaceUseCase from "@domain/usecases/places/get-place.usecase"
import RetrievePlacesUseCase from "@domain/usecases/places/retrieve-places.usecase"
import UpdatePlaceUseCase from "@domain/usecases/places/update-place.usecase"
import { formatToTitleCase } from "@interface/presenters/helpers"

export default class PlacesController {
  private readonly retrievePlacesUseCase: RetrievePlacesUseCase
  private readonly createPlaceUseCase: CreatePlaceUseCase
  private readonly updatePlaceUseCase: UpdatePlaceUseCase
  private readonly deletePlaceUseCase: DeletePlaceUseCase
  private readonly getPlaceUseCase: GetPlaceUseCase
  private readonly placeRepository: PlaceRepository

  constructor() {
    this.placeRepository = new PlaceRepository()
    this.retrievePlacesUseCase = new RetrievePlacesUseCase(
      new PlaceApiGateway(),
      this.placeRepository
    )
    this.createPlaceUseCase = new CreatePlaceUseCase(
      new PlaceApiGateway(),
      this.placeRepository
    )
    this.updatePlaceUseCase = new UpdatePlaceUseCase(
      new PlaceApiGateway(),
      this.placeRepository
    )
    this.deletePlaceUseCase = new DeletePlaceUseCase(
      new PlaceApiGateway(),
      this.placeRepository
    )
    this.getPlaceUseCase = new GetPlaceUseCase(
      new PlaceApiGateway(),
      this.placeRepository
    )
  }

  async retrievePlaces(params: IPlaceSearchParams) {
    await this.retrievePlacesUseCase.execute(params)
  }

  clearCurrentPlace() {
    this.placeRepository.clearCurrentPlace()
  }

  private normalizePayload(data: IFormPlace): IFormPlace {
    return {
      ...data,
      name: formatToTitleCase(data.name)
    }
  }

  async createPlace(data: IFormPlace) {
    await this.createPlaceUseCase.execute(this.normalizePayload(data))
  }

  async updatePlace(id: number, data: IFormPlace) {
    await this.updatePlaceUseCase.execute(id, this.normalizePayload(data))
  }

  async deletePlace(item: IPlace) {
    await this.deletePlaceUseCase.execute(item.id)
  }

  async setCurrentPlace(id: number) {
    await this.getPlaceUseCase.execute(id)
  }
}
