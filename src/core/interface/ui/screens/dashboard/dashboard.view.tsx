import { PAGES } from '@interface/presenters/constants';
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
import { ISummary } from '@domain/entities/dashboard/summary-overview.entity';
import { Grid } from '@mui/material';
import { SummaryCardContainer } from '@interface/ui/components/dashboard/summary-card/summary-card.container';

export interface IDashboardViewModel {
  children?: React.ReactNode
  summaryOverview: ISummary[]
}

const DashboardView: React.FC<IDashboardViewModel> = (props) => {
  return (
    <BaseLayoutContainer currentPage={PAGES.DASHBOARD.label}>
      <Grid container spacing={3}>
        <SummaryCardContainer data={props.summaryOverview} />
      </Grid>
    </BaseLayoutContainer >
  )
}

export default DashboardView