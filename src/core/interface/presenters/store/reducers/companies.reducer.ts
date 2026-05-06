import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IPagedCompanyEntity } from "@domain/entities/company/paged.company.entity"
import { ICompanySearchParams } from "@domain/entities/company/search.entity"
import { ICompany } from "@domain/entities/company/company.entity"

interface ICompanyState {
  companies: ICompany[]
  currentCompany: ICompany | null
  pagination: IBasePagedListEntity
  searchParams: ICompanySearchParams
}

const initialState: ICompanyState = {
  companies: [],
  currentCompany: null,
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

export const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    initializeCompanies(
      state,
      action: PayloadAction<{
        companies: IPagedCompanyEntity
        searchParams: ICompanySearchParams
      }>
    ) {
      state.companies = [...action.payload.companies.results]
      state.pagination = (({ results, ...rest }) => rest)(action.payload.companies)
      state.searchParams = {
        page: action.payload.companies.currentPageNumber,
        search: action.payload.searchParams.search ?? "",
        ordering: action.payload.searchParams.ordering ?? "",
        filterModel: action.payload.searchParams.filterModel ?? ""
      }
    },
    setCurrentCompany(state, action: PayloadAction<ICompany>) {
      state.currentCompany = action.payload
    },
    clearCurrentCompany(state) {
      state.currentCompany = null
    },
    addNewCompany(state, action: PayloadAction<ICompany>) {
      state.companies = [action.payload, ...state.companies]
      state.currentCompany = action.payload
    },
    updateCompany(state, action: PayloadAction<ICompany>) {
      const updatedCompany = action.payload
      state.companies = state.companies.map((item) => item.id === updatedCompany.id ? updatedCompany : item)
      state.currentCompany = updatedCompany
    },
    deleteCompany(state) {
      const companyId = state.currentCompany?.id
      state.companies = state.companies.filter((item) => item.id !== companyId)
      state.currentCompany = null
    }
  }
})

export const {
  initializeCompanies,
  setCurrentCompany,
  clearCurrentCompany,
  addNewCompany,
  updateCompany,
  deleteCompany
} = companySlice.actions

export default companySlice.reducer
