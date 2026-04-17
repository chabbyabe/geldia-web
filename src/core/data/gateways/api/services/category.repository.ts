import { ICategory } from "@domain/entities/category/category.entity"
import { IPagedCategoryEntity } from "@domain/entities/category/paged.category.entity"
import { ICategorySearchParams } from "@domain/entities/category/search.entity"
import { store } from "@interface/presenters/store/store"
import {
  addNewCategory,
  clearCurrentCategory,
  deleteCategory,
  initializeCategories,
  setCurrentCategory,
  updateCategory,
  retrieveUserCategories,
} from "@interface/presenters/store/reducers/categories.reducer"

export default class CategoryRepository {
  initializeCategories(categories: IPagedCategoryEntity, params: ICategorySearchParams) {
    store.dispatch(initializeCategories({ categories, searchParams: params }))
  }

  setCurrentCategory(category: ICategory) {
    store.dispatch(setCurrentCategory(category))
  }

  clearCurrentCategory() {
    store.dispatch(clearCurrentCategory())
  }

  setCategory(category: ICategory) {
    store.dispatch(addNewCategory(category))
  }

  updateCategory(category: ICategory) {
    store.dispatch(updateCategory(category))
  }

  deleteCategory() {
    store.dispatch(deleteCategory())
  }

  setUserCategories(categories: ICategory[]) {
    store.dispatch(retrieveUserCategories(categories))
  }

}
