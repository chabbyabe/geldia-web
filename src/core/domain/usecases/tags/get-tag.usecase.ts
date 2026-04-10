import { ITag } from "@domain/entities/tag/tag.entity"

export interface IGetTagDataGateway {
  getTag: (tagId?: number) => Promise<ITag>
}

export interface IGetTagDataRepository {
  setCurrentTag: (tag: ITag) => void
}

export default class GetTagUseCase {
  constructor(
    private readonly dataGateway: IGetTagDataGateway,
    private readonly dataRepository: IGetTagDataRepository
  ) {}

  async execute(tagId: number) {
    const tag = await this.dataGateway.getTag(tagId)
    this.dataRepository.setCurrentTag(tag)
  }
}
