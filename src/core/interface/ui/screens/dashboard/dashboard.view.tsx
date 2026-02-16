import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';

export interface IDashboardViewModel {
  children?: React.ReactNode
  showModal: boolean
}

const DashboardView: React.FC<IDashboardViewModel> = (props) => {
  return (
    <BaseLayoutContainer currentPage={'Dashboard'}>
 
    </BaseLayoutContainer >
  )
}

export default DashboardView