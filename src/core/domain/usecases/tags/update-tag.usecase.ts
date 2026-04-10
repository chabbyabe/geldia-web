import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import { ITag } from "@domain/entities/tag/tag.entity"

export interface IUpdateTagDataGateway {
  updateTag: (id: number, tag: IFormTag) => Promise<ITag>
}

export interface IUpdateTagRepository {
  updateTag: (tag: ITag) => void
  setCurrentTag: (tag: ITag) => void
}

export default class UpdateTagUseCase {
  constructor(
    private readonly dataGateway: IUpdateTagDataGateway,
    private readonly dataRepository: IUpdateTagRepository
  ) {}

  async execute(id: number, tagData: IFormTag) {
    const updatedTag = await this.dataGateway.updateTag(id, tagData)
    this.dataRepository.updateTag(updatedTag)
    this.dataRepository.setCurrentTag(updatedTag)
  }
}
