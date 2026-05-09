import React, { useMemo } from "react"
import { Box, Chip, Grid, Stack, Typography } from "@mui/material"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import { ILogCategory, ILogTag, ILogUser, ITransactionLog } from "@domain/entities/log/transaction-log.entity"
import { formatCurrency, formatToTitleCase, getColoredChipSx, getTransactionTypeChipSx, getTransactionTypeColor } from "@interface/presenters/helpers"
import CustomTableContainer from "@interface/ui/components/common/table/table.container"
import { PAGES, MUI_NUMBER_OPERATORS as numberOperators, MUI_STRING_OPERATORS as stringOperators } from "@interface/presenters/constants"
import { TRANSACTION_TYPE, USER_ACTIONS } from "@data/gateways/api/constants"
import { ChevronRight } from "@mui/icons-material"

export interface ILogsTransactionViewModel {
  logs: ITransactionLog[]
  pagination: IBasePagedListEntity
  handlePagination: (params: ILogSearchParams) => Promise<void>
}

interface ILogRow {
  id: number
  logId: number
  action: string
  transactionId: number | null
  performedBy: string
  transactionName: string
  transactionType: string
  category: ILogCategory | null
  parentCategory: string
  account: string
  accountBalance: number
  accountBalanceLabel: string
  pairTransaction: string
  pairTransactionBalance: number
  pairTransactionBalanceLabel: string
  previousPairTransactionBalance: number
  previousPairTransactionBalanceLabel: string
  store: string
  place: string
  amount: number
  amountLabel: string
  grossAmount: number
  grossAmountLabel: string
  netAmount: number
  netAmountLabel: string
  debitMonthYear: string | null
  previousBalance: number
  previousBalanceLabel: string
  tags: ILogTag[]
  transactionAt: string
  createdAt: string
  notes: string
}

const parseAmount = (value: string | null | undefined) => {
  if (!value) return 0
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const getUserLabel = (user: ILogUser | null | undefined) => {
  if (!user) return "-"

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
  return fullName ? `${fullName} (@${user.username})` : user.username
}

const jsonOrderField = "new_data__"

const tableColumns = (): GridColDef<ILogRow>[] => [
  {
    field: "id",
    headerName: "Log ID",
    minWidth: 85,
    flex: 0.5,
    filterOperators: numberOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) => {
      return <Box>{params.row.logId}</Box>
    }
  },
  {
    field: "action",
    headerName: "Action",
    minWidth: 90,
    flex: 0.7,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) => {
      const color =
        params.row.action === USER_ACTIONS.CREATE.name ? "success" :
          params.row.action === USER_ACTIONS.UPDATE.name ? "warning" :
            "error"

      return <Chip label={params.row.action} color={color} size="small" variant="outlined" />
    }
  },
  {
    field: `${jsonOrderField}id`,
    headerName: "Trans ID",
    minWidth: 85,
    flex: 0.7,
    filterOperators: numberOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) => {
      return <Box>{params.row.transactionId}</Box>
    }
  },
  {
    field: `${jsonOrderField}transaction_at`,
    headerName: "Date & Time",
    minWidth: 100,
    flex: 0.9,
    filterable: false,
    renderCell: (params: GridRenderCellParams<ILogRow>) => <Box>{params.row.transactionAt.substring(0, 10)}</Box>
  },
  {
    field: `${jsonOrderField}name`,
    headerName: "Transaction Name",
    minWidth: 180,
    flex: 1,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) => <Box>{params.row.transactionName}</Box>
  },
  {
    field: `${jsonOrderField}transaction_type__name`,
    headerName: "Type",
    minWidth: 100,
    flex: 0.7,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) => (
      <Chip
        label={params.row.transactionType}
        size="small"
        sx={{ ...getTransactionTypeChipSx(getTransactionTypeColor(params.row.transactionType)), my: 1 }}
      />
    )
  },
  {
    field: `${jsonOrderField}account__name`,
    headerName: "Account",
    minWidth: 180,
    flex: 1,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) =>
      <Box sx={{ lineHeight: 1, my: 1 }}>{params.row.account}
        <Stack direction="row">
          {params.row.action === USER_ACTIONS.CREATE.name &&
            <>
              <Typography color="text.secondary" variant="body2">{params.row.previousBalanceLabel}</Typography>
              <ChevronRight fontSize="small" />
            </>
          }

          <Typography fontWeight="bold" variant="body2">{params.row.accountBalanceLabel}</Typography>
        </Stack>
      </Box>
  },
  {
    field: `${jsonOrderField}pair_transaction__name`,
    headerName: "Account To",
    minWidth: 180,
    flex: 1,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) =>
      <Box sx={{ lineHeight: 1, my: 1 }}>{params.row.pairTransaction}
        {params.row.transactionType === TRANSACTION_TYPE.TRANSFER.name &&
          <Stack direction="row">
            <Typography color="text.secondary" variant="body2">{params.row.previousPairTransactionBalanceLabel}</Typography>
            <ChevronRight fontSize="small" />
            <Typography fontWeight="bold" variant="body2">{params.row.pairTransactionBalanceLabel}</Typography>
          </Stack>
        }
      </Box>
  },
  {
    field: `${jsonOrderField}amount`,
    headerName: "Amount",
    minWidth: 120,
    flex: 0.7,
    filterable: false,
    renderCell: (params: GridRenderCellParams<ILogRow>) => {
      const color = params.row.transactionType === TRANSACTION_TYPE.TRANSFER.name ? "" : "error"
      return (params.row.transactionType !== TRANSACTION_TYPE.INCOME.name && params.row.action !== USER_ACTIONS.UPDATE.name ?
        <Box><Typography fontWeight="bold" color={color} >{params.row.amountLabel}</Typography></Box> : "")
    }
  },
  {
    field: `${jsonOrderField}gross_amount`,
    headerName: "Gross",
    minWidth: 100,
    flex: 0.7,
    filterable: false,
    renderCell: (params: GridRenderCellParams<ILogRow>) => (params.row.transactionType === TRANSACTION_TYPE.INCOME.name &&
       <Box>{params.row.grossAmountLabel}</Box>)
  },
  {
    field: `${jsonOrderField}net_amount`,
    headerName: "Net",
    minWidth: 100,
    flex: 0.7,
    filterable: false,
    renderCell: (params: GridRenderCellParams<ILogRow>) => (params.row.transactionType === TRANSACTION_TYPE.INCOME.name &&
      params.row.action !== USER_ACTIONS.UPDATE.name ? <Box><Typography fontWeight="bold">{params.row.netAmountLabel}</Typography></Box> : "")
  },
  {
    field: `${jsonOrderField}debit_month_year`,
    headerName: "DebitMY",
    minWidth: 110,
    flex: 0.7,
    filterable: false,
    renderCell: (params: GridRenderCellParams<ILogRow>) => (params.row.transactionType === TRANSACTION_TYPE.INCOME.name &&
       <Box>{params.row.debitMonthYear}</Box> )
  },
  {
    field: `${jsonOrderField}category__name`,
    headerName: "Category",
    minWidth: 160,
    flex: 0.9,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) => params.row.category && <Chip label={params.row.category?.name}
      sx={getColoredChipSx(params.row.category?.color)} size="small" />
  },

  {
    field: `${jsonOrderField}store__name`,
    headerName: "Store",
    minWidth: 140,
    flex: 0.8,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) => params.row.store && <Box>{params.row.store}</Box>
  },
  {
    field: `${jsonOrderField}place__name`,
    headerName: "Place",
    minWidth: 140,
    flex: 0.8,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) => params.row.place && <Box>{params.row.place}</Box>
  },
  {
    field: "tags",
    headerName: "Tags",
    minWidth: 130,
    flex: 0.9,
    filterable: false,
    sortable: false,
    renderCell: (params: GridRenderCellParams<ILogRow>) => {
      return (
        <>
          <Grid container flexWrap="wrap" gap={1} sx={{ my: 1 }}>
            {params.row.tags && params.row.tags.map(tag => (
              <Chip
                key={tag.id}
                label={tag.name}
                sx={getColoredChipSx(tag.color)}
                size="small"
              />
            ))}
          </Grid>
        </>
      );
    }
  },
  {
    field: `${jsonOrderField}notes`,
    headerName: "Note",
    minWidth: 500,
    flex: 1,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<ILogRow>) => <Box>{params.row.notes}</Box>
  },
  {
    field: "performed_by__name",
    headerName: "Performed By",
    minWidth: 150,
    flex: 1,
    filterable: false,
    renderCell: (params: GridRenderCellParams<ILogRow>) => <Box>{params.row.performedBy}</Box>
  },
  {
    field: "created_at",
    headerName: "Log Created",
    minWidth: 100,
    flex: 0.9,
    filterable: false,
    renderCell: (params: GridRenderCellParams<ILogRow>) => params.row.createdAt && 
      <Box>{params.row.createdAt.substring(0, 10)} <br/> <Typography variant="body2" color="text.secondary" lineHeight={1}>{params.row.createdAt.substring(11, 19)} </Typography></Box>
  },
]

const LogsTransactionView: React.FC<ILogsTransactionViewModel> = (props) => {

  const rows = useMemo<ILogRow[]>(() => {
    return props.logs.map((item) => {
      const logTransaction = item.newData ?? item.transaction

      const amount = parseAmount(logTransaction?.amount)
      const grossAmount = parseAmount(logTransaction?.grossAmount)
      const netAmount = parseAmount(logTransaction?.netAmount)
      const accountBalance = parseAmount(logTransaction?.account?.balance)
      const pairTransactionBalance = parseAmount(logTransaction?.pairTransaction?.balance)
      const previousBalance = parseAmount(logTransaction?.previousBalance)
      const previousPairTransactionBalance = parseAmount(logTransaction?.pairPreviousBalance)

      return {
        id: item.id,
        logId: item.id,
        action: formatToTitleCase(item.action),
        transactionId: logTransaction?.id ?? null,
        performedBy: getUserLabel(item.performedBy),
        transactionName: logTransaction?.name ?? "-",
        transactionType: logTransaction?.transactionType?.name ?? "",
        category: logTransaction?.category ?? null,
        parentCategory: logTransaction?.category?.parentCategory?.name ?? "",
        store: logTransaction?.store?.name ?? "",
        account: logTransaction?.account?.name ?? "",
        accountBalance: accountBalance ?? 0,
        accountBalanceLabel: formatCurrency(accountBalance),
        pairTransaction: logTransaction?.transactionType?.name ?
          (logTransaction?.pairTransaction?.name ?? "") : "",
        pairTransactionBalance: pairTransactionBalance ?? 0,
        pairTransactionBalanceLabel: formatCurrency(pairTransactionBalance),
        previousPairTransactionBalance: previousPairTransactionBalance ?? 0,
        previousPairTransactionBalanceLabel: formatCurrency(previousPairTransactionBalance),
        place: logTransaction?.place?.name ?? "",
        amount,
        amountLabel: formatCurrency(amount),
        grossAmount,
        grossAmountLabel: formatCurrency(grossAmount),
        netAmount,
        netAmountLabel: formatCurrency(netAmount),
        debitMonthYear: logTransaction?.debitMonthYear?.substring(0, 7) ?? null,
        previousBalance,
        previousBalanceLabel: formatCurrency(previousBalance),
        tags: logTransaction?.tags ?? [],
        transactionAt: logTransaction?.transactionAt ?? "",
        createdAt: item.createdAt,
        notes: logTransaction?.notes ?? ""
      }
    })
  }, [props.logs])

  return (
    <Stack spacing={2.5}>
      <CustomTableContainer
        tableData={rows}
        pagination={props.pagination}
        tableColumns={tableColumns()}
        handlePagination={props.handlePagination}
        buttonName={PAGES.LOGS_TRANSACTIONS.label}
        handleFormModal={() => undefined}
        hideAddButton={true}
        disableColumnSelector={true}
        invisibleColumns={{}}
      />
    </Stack>
  )
}

export default LogsTransactionView
