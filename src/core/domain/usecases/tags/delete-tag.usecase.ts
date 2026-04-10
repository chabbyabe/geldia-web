export interface IDeleteTagDataGateway {
  deleteTag: (tagId: number) => Promise<void>
}

export interface IDeleteTagDataRepository {
  deleteTag: () => void
}

export default class DeleteTagUseCase {
  constructor(
    private readonly dataGateway: IDeleteTagDataGateway,
    private readonly dataRepository: IDeleteTagDataRepository
  ) {}

  async execute(tagId: number) {
    await this.dataGateway.deleteTag(tagId)
    this.dataRepository.deleteTag()
  }
}
