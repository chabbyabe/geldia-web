import { IPagedPlaceEntity } from "@domain/entities/place/paged.place.entity"
import { IPlaceSearchParams } from "@domain/entities/place/search.entity"

export interface IRetrievePlacesDataGateway {
  retrievePlaces: (params: IPlaceSearchParams) => Promise<IPagedPlaceEntity>
}

export interface IRetrievePlacesDataRepository {
  initializePlaces: (places: IPagedPlaceEntity, params: IPlaceSearchParams) => void
}

export default class RetrievePlacesUseCase {
  constructor(
    private readonly dataGateway: IRetrievePlacesDataGateway,
    private readonly dataRepository: IRetrievePlacesDataRepository
  ) {}

  async execute(params: IPlaceSearchParams) {
    const places = await this.dataGateway.retrievePlaces(params)
    this.dataRepository.initializePlaces(places, params)
  }
}
