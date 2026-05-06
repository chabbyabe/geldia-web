import { useEffect, useMemo } from 'react'
import { useAppSelector } from '@interface/presenters/store/hooks'
import SettingsController from './settings.controller'
import SettingsView from './settings.view'
import { IFormPasswordReset, IFormPersonalInformation } from '@domain/entities/formModels/settings-form.entity'
import { IFormCompany } from '@domain/entities/formModels/company-form.entity'
import { ICompany } from '@domain/entities/company/company.entity'

export const SettingsContainer: React.FC = () => {
  const controller = useMemo(() => new SettingsController(), [])
  const currentUser = useAppSelector((state) => state.authState.user)
  const companies = useAppSelector((state) => state.companiesState.companies)
  const selectedCompany = useAppSelector((state) => state.companiesState.currentCompany)

  useEffect(() => {
    controller.clearCurrentCompany()
    controller.retrieveCompanies({
      page: 1,
      search: "",
      ordering: "name",
      filterModel: ""
    })
  }, [controller])

  const handlePersonalInformationSubmit = async (values: IFormPersonalInformation) => {
    await controller.updatePersonalInformation(values)
  }

  const handlePasswordSubmit = async (values: IFormPasswordReset) => {
    await controller.changePassword(values)
  }

  const handleRequestEmailVerification = async () => {
    await controller.requestEmailVerification()
  }

  const handleRefreshCurrentUser = async () => {
    await controller.refreshCurrentUser()
  }

  const handleCompanySubmit = async (values: IFormCompany) => {
    if (selectedCompany) {
      await controller.updateCompany(selectedCompany.id, values)
      return
    }

    await controller.createCompany(values)
  }

  const handleDeleteCompany = async (company: ICompany) => {
    await controller.deleteCompany(company)
  }

  const handleCompanyAction = async (companyId: number) => {
    await controller.setCurrentCompany(companyId)
  }

  const clearCurrentCompany = () => {
    controller.clearCurrentCompany()
  }

  return (
    <SettingsView
      currentUser={currentUser}
      companies={companies}
      selectedCompany={selectedCompany}
      handlePersonalInformationSubmit={handlePersonalInformationSubmit}
      handlePasswordSubmit={handlePasswordSubmit}
      handleRequestEmailVerification={handleRequestEmailVerification}
      handleRefreshCurrentUser={handleRefreshCurrentUser}
      handleCompanySubmit={handleCompanySubmit}
      handleDeleteCompany={handleDeleteCompany}
      handleCompanyAction={handleCompanyAction}
      clearCurrentCompany={clearCurrentCompany}
    />
  )
}

export default SettingsContainer
