import { useEffect } from "react"
import { useAppSelector } from "@interface/presenters/store/hooks"
import CategoriesController from "./categories.controller"
import CategoriesView from "./categories.view"
import { IFormCategory } from "@domain/entities/formModels/category-form.entity"
import { ICategory } from "@domain/entities/category/category.entity"

export const CategoriesContainer: React.FC = () => {
  const controller = new CategoriesController()
  const categories = useAppSelector((state) => state.categoryState.categories)
  const selectedCategory = useAppSelector((state) => state.categoryState.currentCategory)
  const pagination = useAppSelector((state) => state.categoryState.pagination)
  const searchParams = useAppSelector((state) => state.categoryState.searchParams)
  const transactionTypes = useAppSelector((state) => state.transactionState.options.transactionTypes)

  useEffect(() => {
    controller.retrieveFormOptions()
    controller.clearCurrentCategory()
  }, [])

  const handleSubmit = async (values: IFormCategory) => {
    if (selectedCategory) {
      await controller.updateCategory(selectedCategory.id, values)
    } else {
      await controller.createCategory(values)
    }

    await controller.retrieveCategories({
      ...searchParams,
      page: pagination.currentPageNumber
    })
  }

  const handleDelete = async (category: ICategory) => {
    await controller.deleteCategory(category)
    await controller.retrieveCategories({
      ...searchParams,
      page: pagination.currentPageNumber
    })
  }

  return (
    <CategoriesView
      categories={categories}
      selectedCategory={selectedCategory}
      pagination={pagination}
      transactionTypes={transactionTypes}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      handlePagination={controller.retrieveCategories.bind(controller)}
      handleActionMenu={controller.setCurrentCategory.bind(controller)}
      clearCurrentCategory={controller.clearCurrentCategory.bind(controller)}
    />
  )
}

export default CategoriesContainer
