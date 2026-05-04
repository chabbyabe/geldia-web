import { useCallback, useEffect, useMemo } from "react"
import { useAppSelector } from "@interface/presenters/store/hooks"
import CategoriesController from "./categories.controller"
import CategoriesView from "./categories.view"
import { IFormCategory } from "@domain/entities/formModels/category-form.entity"
import { ICategory } from "@domain/entities/category/category.entity"

export const CategoriesContainer: React.FC = () => {
  const controller = useMemo(() => new CategoriesController(), [])
  const categories = useAppSelector((state) => state.categoryState.categories)
  const selectedCategory = useAppSelector((state) => state.categoryState.currentCategory)
  const pagination = useAppSelector((state) => state.categoryState.pagination)
  const searchParams = useAppSelector((state) => state.categoryState.searchParams)
  const transactionTypes = useAppSelector((state) => state.transactionState.options.transactionTypes)

  useEffect(() => {
    controller.retrieveFormOptions()
    controller.clearCurrentCategory()
  }, [controller])

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

  const handlePagination = useCallback(async (...args: Parameters<CategoriesController["retrieveCategories"]>) => {
    await controller.retrieveCategories(...args)
  }, [controller])

  const handleActionMenu = useCallback(async (...args: Parameters<CategoriesController["setCurrentCategory"]>) => {
    await controller.setCurrentCategory(...args)
  }, [controller])

  const clearCurrentCategory = useCallback(() => {
    controller.clearCurrentCategory()
  }, [controller])

  return (
    <CategoriesView
      categories={categories}
      selectedCategory={selectedCategory}
      pagination={pagination}
      transactionTypes={transactionTypes}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      handlePagination={handlePagination}
      handleActionMenu={handleActionMenu}
      clearCurrentCategory={clearCurrentCategory}
    />
  )
}

export default CategoriesContainer
