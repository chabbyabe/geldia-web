import TagApiGateway from "@data/gateways/api/services/tag.gateway"
import TagRepository from "@data/gateways/api/services/tag.repository"
import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import { ITag } from "@domain/entities/tag/tag.entity"
import { ITagSearchParams } from "@domain/entities/tag/search.entity"
import CreateTagUseCase from "@domain/usecases/tags/create-tag.usecase"
import DeleteTagUseCase from "@domain/usecases/tags/delete-tag.usecase"
import GetTagUseCase from "@domain/usecases/tags/get-tag.usecase"
import RetrieveTagsUseCase from "@domain/usecases/tags/retrieve-tags.usecase"
import UpdateTagUseCase from "@domain/usecases/tags/update-tag.usecase"
import { formatToTitleCase } from "@interface/presenters/helpers"

export default class TagsController {
  private readonly retrieveTagsUseCase: RetrieveTagsUseCase
  private readonly createTagUseCase: CreateTagUseCase
  private readonly updateTagUseCase: UpdateTagUseCase
  private readonly deleteTagUseCase: DeleteTagUseCase
  private readonly getTagUseCase: GetTagUseCase
  private readonly tagRepository: TagRepository

  constructor() {
    this.tagRepository = new TagRepository()
    this.retrieveTagsUseCase = new RetrieveTagsUseCase(
      new TagApiGateway(),
      this.tagRepository
    )
    this.createTagUseCase = new CreateTagUseCase(
      new TagApiGateway(),
      this.tagRepository
    )
    this.updateTagUseCase = new UpdateTagUseCase(
      new TagApiGateway(),
      this.tagRepository
    )
    this.deleteTagUseCase = new DeleteTagUseCase(
      new TagApiGateway(),
      this.tagRepository
    )
    this.getTagUseCase = new GetTagUseCase(
      new TagApiGateway(),
      this.tagRepository
    )
  }

  async retrieveTags(params: ITagSearchParams) {
    await this.retrieveTagsUseCase.execute(params)
  }

  clearCurrentTag() {
    this.tagRepository.clearCurrentTag()
  }

  private normalizePayload(data: IFormTag): IFormTag {
    return {
      ...data,
      name: formatToTitleCase(data.name)
    }
  }

  async createTag(data: IFormTag) {
    await this.createTagUseCase.execute(this.normalizePayload(data))
  }

  async updateTag(id: number, data: IFormTag) {
    await this.updateTagUseCase.execute(id, this.normalizePayload(data))
  }

  async deleteTag(tag: ITag) {
    await this.deleteTagUseCase.execute(tag.id)
  }

  async setCurrentTag(id: number) {
    await this.getTagUseCase.execute(id)
  }
}
