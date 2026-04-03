import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
import {
  Container, Button, Chip, Stack, Box, Accordion, AccordionSummary,
  AccordionDetails, Typography, Divider, Grid
} from '@mui/material';
import { IBasePagedListEntity } from '@domain/entities/base/base.paged.entity';
import DeleteConfirmationModal from '@interface/ui/components/modals/delete-confirmation-modal/delete-confirmation-modal.container';
import { GridColDef, GridRenderCellParams, GridValueSetter, getGridStringOperators, getGridNumericOperators } from '@mui/x-data-grid';
import { Circle, Delete, Edit, ExpandMore } from '@mui/icons-material';
import { TransactionModalContainer } from '@interface/ui/components/modals/transaction-modal/transaction-modal.container';
import { ITransactionSearchParams } from '@domain/entities/transaction/search.entity';
import CustomTableContainer from '@interface/ui/components/common/table/table.container';
import { formatDateTime } from '@interface/presenters/helpers';
import { TRANSACTION_TYPE } from '@data/gateways/api/constants';
import { PAGES } from '@interface/presenters/constants';
import { ITransaction } from '@domain/entities/transaction/transaction.entity';
import { useEffect, useState } from 'react';

export interface ITransactionsViewModel {
  children?: React.ReactNode
  handleDelete: (transactionId: number) => void
  selectedTransaction: ITransaction | null
  transactions: ITransaction[]
  currentPage: string | null
  pagination: IBasePagedListEntity
  handlePagination: (params: ITransactionSearchParams) => Promise<void>
  handleActionMenu: (actionId: number) => void
  removeCurrentTransaction: () => void
}

const stringOperators = getGridStringOperators().filter((op) =>
  [
    "contains",
    "startsWith",
    "endsWith",
    "=",
    "isEmpty",
    "isNotEmpty"
  ].includes(op.value)
);

const numberOperators = getGridNumericOperators().filter((op) =>
  [">", ">=", "<", "<=", "=", "isEmpty", "isNotEmpty"].includes(op.value)
);

const tableColumns = (
  props: ITransactionsViewModel,
  openEditModal: (value: boolean) => void,
  openDeleteModal: (value: boolean) => void
): GridColDef<ITransaction>[] => [
    {
      field: 'transaction_at', headerName: 'Date', maxWidth: 150, flex: 1, filterOperators: stringOperators,
      headerAlign: "center", align: "center", minWidth: 100,
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        if (!params.row.transactionAt) return "";
        const frmTime = formatDateTime(params.row.transactionAt, true, false);
        const frmDate = formatDateTime(params.row.transactionAt, false, true);
        return (
          <Stack direction="column">
            <Typography variant="body2">{`${frmDate}`}</Typography>
            <Typography color="text.secondary" variant="body2" >{`${frmTime}`}</Typography>
          </Stack>
        );
      }
    },
    {
      field: 'transaction_type__name', headerName: 'Type', headerAlign: "center", maxWidth: 150, minWidth: 100, flex: 1, filterOperators: stringOperators,
      valueSetter: ((params) => {
        return {
          ...params.row,
          transactionAt: params.value ? new Date(params.value) : null,
        };
      }) as GridValueSetter<ITransaction>,
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        let label: string | null = null;
        let color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | null = null;
        switch (params.row.transactionType?.id) {
          case TRANSACTION_TYPE.INCOME.id:
            label = TRANSACTION_TYPE.INCOME.name;
            color = 'primary';
            break;
          case TRANSACTION_TYPE.EXPENSES.id:
            label = TRANSACTION_TYPE.EXPENSES.name;
            color = 'error';
            break;
          case TRANSACTION_TYPE.TRANSFER.id:
            label = TRANSACTION_TYPE.TRANSFER.name;
            color = 'warning';
            break;
          default:
            label = null;
            color = null;
        }
        return label && color && <Chip sx={{ width: '100%' }} label={label} color={color} size="small" />;
      },
    },
    {
      field: "details",
      headerName: "Details",
      flex: 2,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        const row = params.row;

        const _transferComponent = () => {
          return (
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                width: "100%",
                backgroundColor: "transparent",
                "&:before": { display: "none" }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">
                  {row.formattedAmount ?? "-"}
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <Stack gap={0.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="column">
                      <Typography variant="body2" color="text.secondary">Account</Typography>
                      <Typography variant="body2">{row.account?.name ?? "-"}</Typography>
                    </Stack>
                    {row.account?.isDefault &&
                      <Circle color={"primary"} fontSize='small' sx={{ alignItems: "right", mt: 1 }} />}

                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">

                    <Stack direction="column" justifyContent="start">
                      <Typography variant="body2" color="text.secondary">Transferred To</Typography>
                      <Typography variant="body2">{row.pairTransaction?.name ?? "-"}</Typography>
                    </Stack>
                    {row.account?.isDefault &&
                      <Circle color={"primary"} fontSize='small' sx={{ alignItems: "right", mt: 1 }} />}
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        }

        const _expensesComponent = () => {
          return (
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                width: "100%",
                backgroundColor: "transparent",
                "&:before": { display: "none" }
              }}
            >

              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ minHeight: 40 }}
              >
                <Typography variant="body1" color="error" fontWeight="bold">
                  {row.formattedAmount ?? "-"}
                </Typography>
              </AccordionSummary>
              <Divider />

              <AccordionDetails>


                <Stack gap={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="column">
                      <Typography variant="body2" color="text.secondary">Account</Typography>
                      <Typography variant="body2">{row.account?.name ?? "-"}</Typography>
                    </Stack>
                    {row.account?.isDefault &&
                      <Circle color={"primary"} fontSize='small' sx={{ alignItems: "right", mt: 1 }} />}
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          )
        }

        const _incomeComponent = () => {

          return (
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                width: "100%",
                backgroundColor: "transparent",
                "&:before": { display: "none" }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ minHeight: 40 }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {row.formattedNetAmount ?? "-"}
                </Typography>
              </AccordionSummary>
              <Divider />

              <AccordionDetails>
                <Stack gap={0.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">Account</Typography> <br />
                    <Typography variant="body2">{row.account?.name ?? "-"}</Typography>
                    {row.account?.isDefault &&
                      <Chip sx={{ width: '40%', mt: 1 }} label={"Default"} color={"primary"} size="small" />}
                  </Stack>

                  {row.grossAmount &&
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Gross Amount</Typography> <br />
                      <Typography variant="body2">{row.formattedGrossAmount ?? "-"}</Typography>
                    </Stack>
                  }

                  {row.netAmount &&
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Net Amount</Typography> <br />
                      <Typography variant="body2" color="primary">{row.formattedNetAmount ?? "-"}</Typography>
                    </Stack>
                  }

                  {row.debitMonthYear &&
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Date</Typography> <br />
                      <Typography variant="body2">{row.debitMonthYear.slice(0, 7) ?? "-"}</Typography>
                      {row.account?.isDefault &&
                        <Chip sx={{ width: '40%', mt: 1 }} label={"Default"} color={"primary"} size="small" />}
                    </Stack>
                  }
                </Stack>

              </AccordionDetails>
            </Accordion>
          )
        }

        return row.transactionType?.id === TRANSACTION_TYPE.TRANSFER.id ? _transferComponent() :
          row.transactionType?.id === TRANSACTION_TYPE.INCOME.id ? _incomeComponent() :
            row.transactionType?.id === TRANSACTION_TYPE.EXPENSES.id ? _expensesComponent() :
              null;
      }
    },
    {
      field: 'amount', headerName: 'Amount', minWidth: 100, flex: 1, filterOperators: numberOperators, headerAlign: "center",
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        if (!params.row.amount) return "";
        return (
          <Box sx={{ textAlign: "right" }}>
            {params.row.formattedAmount}
          </Box>
        );
      }
    },
    {
      sortable: false,
      field: 'net_amount', headerName: 'NetAmount', minWidth: 100, flex: 1, filterOperators: numberOperators, headerAlign: "center",
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        if (!params.row.netAmount) return "";
        return (
          <Box sx={{ textAlign: "right" }}>{params.row.formattedNetAmount}</Box>
        );
      },
    },
    {
      field: 'gross_amount', headerName: 'Gross Amount', minWidth: 100, flex: 1, filterOperators: numberOperators, headerAlign: "center",
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        if (!params.row.grossAmount) return "";
        return (
          <Box sx={{ textAlign: "right" }}>{params.row.formattedGrossAmount}</Box>
        );
      },
    },
    {
      field: 'debit_month_year', headerName: 'IncomeMY', minWidth: 100, flex: 1, filterOperators: numberOperators, headerAlign: "center",
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        if (!params.row?.debitMonthYear) return "";
        return (
          <Box sx={{ textAlign: "center" }}>{params.row?.debitMonthYear.slice(0, 7)}</Box>
        );
      },
    },
    {
      field: 'name', headerName: 'Name', minWidth: 120, flex: 1, filterOperators: stringOperators,
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        return <Typography variant="body2"> {params.row.name} </Typography>
      },
    },
    {
      field: 'category__name', headerName: 'Category', minWidth: 100, flex: 1, filterOperators: stringOperators, headerAlign: "center",
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        const hasData = params.row.category?.id;
        if (!hasData) return null;
        return hasData && <Chip label={params.row.category?.name}
          sx={{ backgroundColor: params.row.category?.color }} size="small" />;
      },
    },
    {
      field: 'store__name', headerName: 'Store', minWidth: 100, flex: 1, filterOperators: stringOperators,
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        const hasData = params.row.store?.id && params.row.store?.name;
        return hasData ? <Typography variant="body2">{params.row.store?.name}</Typography> : null;
      },
    },
    {
      field: 'place__name', headerName: 'Place', minWidth: 100, flex: 1, filterOperators: stringOperators,
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        const hasData = params.row.place?.id && params.row.place?.name;
        return hasData ? <Typography variant="body2"> {params.row.place?.name} </Typography> : null;
      },
    },
    {
      field: 'tags__name', headerName: 'Tags', minWidth: 150, flex: 1, filterOperators: stringOperators, headerAlign: "center",
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        return (
          <>
            <Grid container flexWrap="wrap" gap={1} sx={{ my: 1 }}>
              {params.row.tags && params.row.tags.map(tag => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  sx={{ backgroundColor: tag.color ?? 'primary' }}
                  size="small"
                />
              ))}
            </Grid>
          </>
        );
      },
    },
    {
      field: 'notes', headerName: 'Notes', minWidth: 150, flex: 1, filterOperators: stringOperators, sortable: false,
      renderCell: (params: GridRenderCellParams<ITransaction>) => {
        return <Typography sx={{ my: 1 }} variant="body2"> {params.row.notes} </Typography>
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<ITransaction>) => (
        <>
          <Stack direction="row" height="100%" justifyContent="center" alignItems="center">
            <Button size="large" endIcon={<Edit />} color="secondary" onClick={() => {
              props.handleActionMenu(params.row.id);
              openEditModal(true)
            }}>
            </Button>
            <Button size="large" startIcon={<Delete />} color="error" onClick={() => {
              props.handleActionMenu(params.row.id);
              openDeleteModal(true)
            }}>
            </Button>
          </Stack>
        </>
      ),
    }
  ];

const TransactionsView: React.FC<ITransactionsViewModel> = (props) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);

  useEffect(() => {
    props.removeCurrentTransaction();
  }, [openCreateEditModal]);

  return (
    <BaseLayoutContainer currentPage={PAGES.TRANSACTIONS.label}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        <Stack>
          <CustomTableContainer tableData={props.transactions}
            pagination={props.pagination}
            tableColumns={tableColumns(props, setOpenCreateEditModal, setOpenDeleteModal)}
            handlePagination={props.handlePagination}
            buttonName={PAGES.TRANSACTIONS.label}
            handleFormModal={setOpenCreateEditModal}
            disableColumnSelector={true}
            invisibleColumns={{
              net_amount: false,
              gross_amount: false,
              amount: false,
              debit_month_year: false
            }}
          />
        </Stack>
      </Container>
      <>
        <TransactionModalContainer
          open={openCreateEditModal}
          onClose={() => setOpenCreateEditModal(false)}
          selectedTransaction={props.selectedTransaction}
        />
      </>
      <DeleteConfirmationModal
        open={openDeleteModal}
        pageTitle={PAGES.TRANSACTIONS.label}
        hasConfirmation={false}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={async () => {
          if (props.selectedTransaction !== null) {
            props.handleDelete(props.selectedTransaction.id);
          }
        }}
      />
    </BaseLayoutContainer>
  )
}

export default TransactionsView