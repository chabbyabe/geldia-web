import React from "react"
import { ICategory } from "@domain/entities/category/category.entity"
import { IFormCategory } from "@domain/entities/formModels/category-form.entity"
import { ITransactionType } from "@domain/entities/transaction/transaction.entity"
import CategoryModalView from "./category-modal.view"

interface ICategoryModalContainer {
  showModal: boolean
  handleMainModalClose: () => void
  handleSubmit: (values: IFormCategory) => void
  selectedCategory: ICategory | null
  categories: ICategory[]
  transactionTypes: ITransactionType[]
}

export const CategoryModalContainer: React.FC<ICategoryModalContainer> = (props) => {
  return (
    <CategoryModalView
      showModal={props.showModal}
      handleClose={props.handleMainModalClose}
      handleSubmit={props.handleSubmit}
      selectedCategory={props.selectedCategory}
      categories={props.categories}
      transactionTypes={props.transactionTypes}
    />
  )
}

export default CategoryModalContainer
