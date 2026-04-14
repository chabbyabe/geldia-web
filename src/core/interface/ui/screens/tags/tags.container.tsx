import { useEffect, useMemo } from "react"
import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import { ITag } from "@domain/entities/tag/tag.entity"
import { useAppSelector } from "@interface/presenters/store/hooks"
import TagsController from "./tags.controller"
import TagsView from "./tags.view"

export const TagsContainer: React.FC = () => {
  const controller = useMemo(() => new TagsController(), [])
  const tags = useAppSelector((state) => state.tagState.tags)
  const selectedTag = useAppSelector((state) => state.tagState.currentTag)
  const pagination = useAppSelector((state) => state.tagState.pagination)
  const searchParams = useAppSelector((state) => state.tagState.searchParams)
  const currentUser = useAppSelector(state => state.authState.user);

  useEffect(() => {
    controller.clearCurrentTag()
  }, [controller])

  const handleSubmit = async (values: IFormTag) => {
    if (selectedTag) {
      await controller.updateTag(selectedTag.id, values)
    } else {
      await controller.createTag(values)
    }

    await controller.retrieveTags({
      ...searchParams,
      page: pagination.currentPageNumber
    })
  }

  const handleDelete = async (tag: ITag) => {
    await controller.deleteTag(tag)
    await controller.retrieveTags({
      ...searchParams,
      page: pagination.currentPageNumber
    })
  }

  return (
    <TagsView
      tags={tags}
      selectedTag={selectedTag}
      pagination={pagination}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      handlePagination={controller.retrieveTags.bind(controller)}
      handleActionMenu={controller.setCurrentTag.bind(controller)}
      clearCurrentTag={controller.clearCurrentTag.bind(controller)}
      currentUser={currentUser}
    />
  )
}

export default TagsContainer
