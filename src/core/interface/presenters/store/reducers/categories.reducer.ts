import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { ICategory } from "@domain/entities/category/category.entity"
import { IPagedCategoryEntity } from "@domain/entities/category/paged.category.entity"
import { ICategorySearchParams } from "@domain/entities/category/search.entity"

interface ICategoryState {
  categories: ICategory[]
  currentCategory: ICategory | null
  pagination: IBasePagedListEntity
  searchParams: ICategorySearchParams
}

const initialState: ICategoryState = {
  categories: [],
  currentCategory: null,
  pagination: {
    count: 0,
    totalPages: 1,
    currentPageNumber: 1,
    next: null,
    previous: null
  },
  searchParams: {
    page: 1,
    search: "",
    ordering: "",
    filterModel: ""
  }
}

const upsertCategory = (categories: ICategory[], category: ICategory): ICategory[] => {
  if (category.parentCategory?.id) {
    return categories.map((parent) => {
      if (parent.id !== category.parentCategory?.id) {
        return {
          ...parent,
          children: parent.children.map((child) =>
            child.id === category.id
              ? {
                id: category.id,
                name: category.name,
                color: category.color,
                icon: category.icon,
                notes: category.notes,
                transactionType: category.transactionType,
                parentCategory: category.parentCategory
              }
              : child
          )
        }
      }

      const existingChild = parent.children.find((child) => child.id === category.id)
      const nextChild = {
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        notes: category.notes,
        transactionType: category.transactionType,
        parentCategory: category.parentCategory
      }

      return {
        ...parent,
        children: existingChild
          ? parent.children.map((child) => child.id === category.id ? nextChild : child)
          : [...parent.children, nextChild]
      }
    })
  }

  const childlessCategories = categories.map((parent) => ({
    ...parent,
    children: parent.children.filter((child) => child.id !== category.id)
  }))
  const existingParent = childlessCategories.find((item) => item.id === category.id)

  if (existingParent) {
    return childlessCategories.map((item) => item.id === category.id ? { ...category, children: item.children } : item)
  }

  return [{ ...category, children: category.children ?? [] }, ...childlessCategories]
}

const removeCategory = (categories: ICategory[], categoryId: number | null | undefined): ICategory[] => {
  if (!categoryId) return categories

  return categories
    .filter((category) => category.id !== categoryId)
    .map((category) => ({
      ...category,
      children: category.children.filter((child) => child.id !== categoryId)
    }))
}

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    initializeCategories(
      state,
      action: PayloadAction<{
        categories: IPagedCategoryEntity
        searchParams: ICategorySearchParams
      }>
    ) {
      state.categories = [...action.payload.categories.results]
      state.pagination = (({ results, ...rest }) => rest)(action.payload.categories)
      state.searchParams = {
        page: action.payload.categories.currentPageNumber,
        search: action.payload.searchParams.search ?? "",
        ordering: action.payload.searchParams.ordering ?? "",
        filterModel: action.payload.searchParams.filterModel ?? ""
      }
    },
    setCurrentCategory(state, action: PayloadAction<ICategory>) {
      state.currentCategory = action.payload
    },
    clearCurrentCategory(state) {
      state.currentCategory = null
    },
    addNewCategory(state, action: PayloadAction<ICategory>) {
      state.categories = upsertCategory(state.categories, action.payload)
      state.currentCategory = action.payload
    },
    updateCategory(state, action: PayloadAction<ICategory>) {
      const updatedCategory = action.payload
      state.categories = upsertCategory(state.categories, updatedCategory)
      state.currentCategory = updatedCategory
    },
    deleteCategory(state) {
      const categoryId = state.currentCategory?.id
      state.categories = removeCategory(state.categories, categoryId)
      state.currentCategory = null
    }
  }
})

export const {
  initializeCategories,
  setCurrentCategory,
  clearCurrentCategory,
  addNewCategory,
  updateCategory,
  deleteCategory
} = categorySlice.actions

export default categorySlice.reducer
