import { PAGES } from '@interface/presenters/constants';
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';

export interface IDashboardViewModel {
  children?: React.ReactNode
}

const DashboardView: React.FC<IDashboardViewModel> = (props) => {
  return (
    <BaseLayoutContainer currentPage={PAGES.DASHBOARD.label}>
 
    </BaseLayoutContainer >
  )
}

export default DashboardView