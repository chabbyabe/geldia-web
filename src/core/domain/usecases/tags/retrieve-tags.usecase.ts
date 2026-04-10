import { IPagedTagEntity } from "@domain/entities/tag/paged.tag.entity"
import { ITagSearchParams } from "@domain/entities/tag/search.entity"

export interface IRetrieveTagsDataGateway {
  retrieveTags: (params: ITagSearchParams) => Promise<IPagedTagEntity>
}

export interface IRetrieveTagsDataRepository {
  initializeTags: (tags: IPagedTagEntity, params: ITagSearchParams) => void
}

export default class RetrieveTagsUseCase {
  constructor(
    private readonly dataGateway: IRetrieveTagsDataGateway,
    private readonly dataRepository: IRetrieveTagsDataRepository
  ) {}

  async execute(params: ITagSearchParams) {
    const tags = await this.dataGateway.retrieveTags(params)
    this.dataRepository.initializeTags(tags, params)
  }
}
