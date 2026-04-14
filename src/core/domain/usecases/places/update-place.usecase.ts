import { IFormPlace } from "@domain/entities/formModels/place-form.entity"
import { IPlace } from "@domain/entities/place/place.entity"

export interface IUpdatePlaceDataGateway {
  updatePlace: (id: number, place: IFormPlace) => Promise<IPlace>
}

export interface IUpdatePlaceRepository {
  updatePlace: (place: IPlace) => void
  setCurrentPlace: (place: IPlace) => void
}

export default class UpdatePlaceUseCase {
  constructor(
    private readonly dataGateway: IUpdatePlaceDataGateway,
    private readonly dataRepository: IUpdatePlaceRepository
  ) {}

  async execute(id: number, placeData: IFormPlace) {
    const updatedPlace = await this.dataGateway.updatePlace(id, placeData)
    this.dataRepository.updatePlace(updatedPlace)
    this.dataRepository.setCurrentPlace(updatedPlace)
  }
}
