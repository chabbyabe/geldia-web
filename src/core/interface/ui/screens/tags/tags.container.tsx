import { useCallback, useEffect, useMemo } from "react"
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

  const handlePagination = useCallback(async (...args: Parameters<TagsController["retrieveTags"]>) => {
    await controller.retrieveTags(...args)
  }, [controller])

  const handleActionMenu = useCallback(async (...args: Parameters<TagsController["setCurrentTag"]>) => {
    await controller.setCurrentTag(...args)
  }, [controller])

  const clearCurrentTag = useCallback(() => {
    controller.clearCurrentTag()
  }, [controller])

  return (
    <TagsView
      tags={tags}
      selectedTag={selectedTag}
      pagination={pagination}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      handlePagination={handlePagination}
      handleActionMenu={handleActionMenu}
      clearCurrentTag={clearCurrentTag}
      currentUser={currentUser}
    />
  )
}

export default TagsContainer
