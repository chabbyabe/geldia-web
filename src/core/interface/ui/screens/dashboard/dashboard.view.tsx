import { PAGE_NAMES } from '@interface/presenters/constants';
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';

export interface IDashboardViewModel {
  children?: React.ReactNode
}

const DashboardView: React.FC<IDashboardViewModel> = (props) => {
  return (
    <BaseLayoutContainer currentPage={PAGE_NAMES.DASHBOARD}>
 
    </BaseLayoutContainer >
  )
}

export default DashboardView