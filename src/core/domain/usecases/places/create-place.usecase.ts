import { IFormPlace } from "@domain/entities/formModels/place-form.entity"
import { IPlace } from "@domain/entities/place/place.entity"

export interface ICreatePlaceDataGateway {
  createPlace: (place: IFormPlace) => Promise<IPlace>
}

export interface ICreatePlaceRepository {
  setPlace: (place: IPlace) => void
}

export default class CreatePlaceUseCase {
  constructor(
    private readonly dataGateway: ICreatePlaceDataGateway,
    private readonly dataRepository: ICreatePlaceRepository
  ) {}

  async execute(placeData: IFormPlace) {
    const newPlace = await this.dataGateway.createPlace(placeData)
    this.dataRepository.setPlace(newPlace)
  }
}
