import React from "react"
import { IFormCompany } from "@domain/entities/formModels/company-form.entity"
import { ICompany } from "@domain/entities/company/company.entity"
import CompanyModalView from "./company-modal.view"

interface ICompanyModalContainer {
  showModal: boolean
  handleMainModalClose: () => void
  handleSubmit: (values: IFormCompany) => void
  selectedCompany: ICompany | null
}

export const CompanyModalContainer: React.FC<ICompanyModalContainer> = (props) => {
  return (
    <CompanyModalView
      showModal={props.showModal}
      handleClose={props.handleMainModalClose}
      handleSubmit={props.handleSubmit}
      selectedCompany={props.selectedCompany}
    />
  )
}

export default CompanyModalContainer
