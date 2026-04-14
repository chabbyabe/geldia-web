import { IPlace } from "@domain/entities/place/place.entity"

export interface IGetPlaceDataGateway {
  getPlace: (placeId?: number) => Promise<IPlace>
}

export interface IGetPlaceDataRepository {
  setCurrentPlace: (place: IPlace) => void
}

export default class GetPlaceUseCase {
  constructor(
    private readonly dataGateway: IGetPlaceDataGateway,
    private readonly dataRepository: IGetPlaceDataRepository
  ) {}

  async execute(placeId: number) {
    const place = await this.dataGateway.getPlace(placeId)
    this.dataRepository.setCurrentPlace(place)
  }
}
