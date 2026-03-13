import { PAGES } from '@interface/presenters/constants';
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
import { ISummary } from '@domain/entities/dashboard/summary-overview.entity';
import { ITransaction } from '@domain/entities/transaction/transaction.entity';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { SummaryCardContainer } from '@interface/ui/components/dashboard/summary-card/summary-card.container';
import { TransactionCardContainer } from '@interface/ui/components/dashboard/transaction-card/transaction-card.container';
import { TransactionModalContainer } from '@interface/ui/components/modals/transaction-modal/transaction-modal.container';
import { useState } from 'react';
import { CategoryOverviewContainer } from '@interface/ui/components/dashboard/category-overview/category-overview.container';

export interface IDashboardViewModel {
  children?: React.ReactNode
  summaryOverview: ISummary[]
  recentTransactions: ITransaction[]  
}

const DashboardView: React.FC<IDashboardViewModel> = (props) => {
  const [openTransactionModal, setOpenTransactionModal] = useState(false);

  return (
    <BaseLayoutContainer currentPage={PAGES.DASHBOARD.label}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <SummaryCardContainer data={props.summaryOverview} />
        </Grid>
        <Grid container mt={3} flexGrow={1} spacing={4}>
          <Grid flex={3} sx={{ sm: 12, md: 9, minWidth: 350, maxWidth: 1400, width: "100%", minHeight: "800px" }}>
             <CategoryOverviewContainer />
          </Grid>
          <Grid flex={2} sx={{ sm: 12, maxWidth: 400, minWidth: 350 }} flexWrap="wrap">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Recent Transactions
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenTransactionModal(true)}>
                Transaction
              </Button>
            </Stack>
            <TransactionCardContainer transactions={props.recentTransactions} />
          </Grid>
        </Grid>
      </Container>
      <>
        <TransactionModalContainer
          open={openTransactionModal}
          onClose={() => setOpenTransactionModal(false)}
          selectedTransaction={null}
        />
      </>
    </BaseLayoutContainer >
  )
}

export default DashboardView