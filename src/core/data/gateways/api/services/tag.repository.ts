import { ITag } from "@domain/entities/tag/tag.entity"
import { IPagedTagEntity } from "@domain/entities/tag/paged.tag.entity"
import { ITagSearchParams } from "@domain/entities/tag/search.entity"
import { store } from "@interface/presenters/store/store"
import {
  addNewTag,
  clearCurrentTag,
  deleteTag,
  initializeTags,
  setCurrentTag,
  updateTag
} from "@interface/presenters/store/reducers/tags.reducer"

export default class TagRepository {
  initializeTags(tags: IPagedTagEntity, params: ITagSearchParams) {
    store.dispatch(initializeTags({ tags, searchParams: params }))
  }

  setCurrentTag(tag: ITag) {
    store.dispatch(setCurrentTag(tag))
  }

  clearCurrentTag() {
    store.dispatch(clearCurrentTag())
  }

  setTag(tag: ITag) {
    store.dispatch(addNewTag(tag))
  }

  updateTag(tag: ITag) {
    store.dispatch(updateTag(tag))
  }

  deleteTag() {
    store.dispatch(deleteTag())
  }
}
