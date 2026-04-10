import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import { ITag } from "@domain/entities/tag/tag.entity"

export interface ICreateTagDataGateway {
  createTag: (tag: IFormTag) => Promise<ITag>
}

export interface ICreateTagRepository {
  setTag: (tag: ITag) => void
}

export default class CreateTagUseCase {
  constructor(
    private readonly dataGateway: ICreateTagDataGateway,
    private readonly dataRepository: ICreateTagRepository
  ) {}

  async execute(tagData: IFormTag) {
    const newTag = await this.dataGateway.createTag(tagData)
    this.dataRepository.setTag(newTag)
  }
}
