export interface IDeletePlaceDataGateway {
  deletePlace: (placeId: number) => Promise<void>
}

export interface IDeletePlaceDataRepository {
  deletePlace: () => void
}

export default class DeletePlaceUseCase {
  constructor(
    private readonly dataGateway: IDeletePlaceDataGateway,
    private readonly dataRepository: IDeletePlaceDataRepository
  ) {}

  async execute(placeId: number) {
    await this.dataGateway.deletePlace(placeId)
    this.dataRepository.deletePlace()
  }
}
