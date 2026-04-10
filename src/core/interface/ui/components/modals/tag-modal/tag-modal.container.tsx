import React from "react"
import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import { ITag } from "@domain/entities/tag/tag.entity"
import TagModalView from "./tag-modal.view"

interface ITagModalContainer {
  showModal: boolean
  handleMainModalClose: () => void
  handleSubmit: (values: IFormTag) => void
  selectedTag: ITag | null
}

export const TagModalContainer: React.FC<ITagModalContainer> = (props) => {
  return (
    <TagModalView
      showModal={props.showModal}
      handleClose={props.handleMainModalClose}
      handleSubmit={props.handleSubmit}
      selectedTag={props.selectedTag}
    />
  )
}

export default TagModalContainer
