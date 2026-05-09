import React, { useMemo } from "react"
import { Box, Chip, Grid, Stack, Typography } from "@mui/material"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IAccountLog } from "@domain/entities/log/account-log.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import { formatCurrency, formatToTitleCase, getColoredChipSx, renderAccountIcon } from "@interface/presenters/helpers"
import CustomTableContainer from "@interface/ui/components/common/table/table.container"
import { PAGES, MUI_NUMBER_OPERATORS as numberOperators, MUI_STRING_OPERATORS as stringOperators } from "@interface/presenters/constants"
import { USER_ACTIONS } from "@data/gateways/api/constants"
import { ChevronRight } from "@mui/icons-material"

export interface ILogsAccountViewModel {
  logs: IAccountLog[]
  pagination: IBasePagedListEntity
  handlePagination: (params: ILogSearchParams) => Promise<void>
}

interface IAccountLogRow {
  id: number
  logId: number
  action: string
  accountId: number | null
  accountName: string
  accountIcon: string | null
  accountColor: string | null
  balance: number
  balanceLabel: string
  oldBalance: string | null
  isOldNewBalanceSame: boolean
  notes: string
  isDefault: boolean
  isSavings: boolean
  countInAssets: boolean
  categories: { id: number, name: string, color: string | null }[]
  performedBy: string
  createdAt: string
}

const parseAmount = (value: string | null | undefined) => {
  if (!value) return 0
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const getUserLabel = (username?: string, firstName?: string, lastName?: string) => {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim()
  if (!username) return fullName || "-"
  return fullName ? `${fullName} (@${username})` : username
}

const jsonOrderField = "new_data__"

const tableColumns = (): GridColDef<IAccountLogRow>[] => [
  {
    field: "id",
    headerName: "Log ID",
    minWidth: 90,
    flex: 0.55,
    filterOperators: numberOperators,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) => <Box>{params.row.logId}</Box>
  },
  {
    field: "action",
    headerName: "Action",
    minWidth: 100,
    flex: 0.7,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) => {
      const color =
        params.row.action === USER_ACTIONS.CREATE.name ? "success" :
          params.row.action === USER_ACTIONS.UPDATE.name ? "warning" :
            "error"

      return <Chip label={params.row.action} color={color} size="small" variant="outlined" />
    }
  },
  {
    field: `${jsonOrderField}id`,
    headerName: "Acct ID",
    minWidth: 95,
    flex: 0.6,
    filterOperators: numberOperators,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) => <Box>{params.row.accountId ?? "-"}</Box>
  },
  {
    field: `${jsonOrderField}name`,
    headerName: "Account",
    minWidth: 220,
    flex: 1.15,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) => (
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ my: 1 }}>
        {renderAccountIcon(params.row.accountIcon, params.row.accountColor, 28)}
        <Typography variant="body2" fontWeight={600}>{params.row.accountName}</Typography>
      </Stack>
    )
  },
  {
    field: `${jsonOrderField}balance`,
    headerName: "Balance",
    minWidth: 120,
    flex: 0.7,
    filterOperators: numberOperators,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) =>
      <Box sx={{ lineHeight: 1, my: 1 }}>
        <Stack direction="row">
          {!params.row.isOldNewBalanceSame ?

            <>

              <Typography color="text.secondary" variant="body2">{params.row.oldBalance}</Typography>
              <ChevronRight fontSize="small" />
            </> : null}
          <Typography fontWeight="bold" variant="body2">{params.row.balanceLabel}</Typography>
        </Stack>
      </Box>
  },
  {
    field: "categories",
    headerName: "Categories",
    minWidth: 240,
    flex: 1.2,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) => (
      <Grid container flexWrap="wrap" gap={1} sx={{ my: 1 }}>
        {params.row.categories.length > 0 ? params.row.categories.map((category) => (
          <Chip
            key={`account-log-category-${params.row.id}-${category.id}`}
            label={category.name}
            size="small"
            sx={getColoredChipSx(category.color)}
          />
        )) : (
          <Typography variant="body2" color="text.secondary">No categories</Typography>
        )}
      </Grid>
    )
  },
  {
    field: "account_flags",
    headerName: "Flags",
    minWidth: 220,
    flex: 1.05,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) => (
      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ my: 1 }}>
        {params.row.isDefault && <Chip size="small" label="Default" />}
        {params.row.isSavings && <Chip size="small" label="Savings" color="primary" />}
        {params.row.countInAssets && <Chip size="small" label="Count in Assets" variant="outlined" />}
        {!params.row.isDefault && !params.row.isSavings && !params.row.countInAssets && (
          <Typography variant="body2" color="text.secondary">No flags</Typography>
        )}
      </Stack>
    )
  },
  {
    field: `${jsonOrderField}notes`,
    headerName: "Notes",
    minWidth: 260,
    flex: 1.3,
    filterOperators: stringOperators,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) => <Box>{params.row.notes || "-"}</Box>
  },
  {
    field: "performed_by__name",
    headerName: "Performed By",
    minWidth: 180,
    flex: 1,
    filterable: false,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) => <Box>{params.row.performedBy}</Box>
  },
  {
    field: "created_at",
    headerName: "Log Created",
    minWidth: 150,
    flex: 0.9,
    filterable: false,
    renderCell: (params: GridRenderCellParams<IAccountLogRow>) => params.row.createdAt ? (
      <Box>
        {params.row.createdAt.substring(0, 10)}
        <br />
        <Typography variant="body2" color="text.secondary" lineHeight={1}>
          {params.row.createdAt.substring(11, 19)}
        </Typography>
      </Box>
    ) : null
  },
]

const LogsAccountView: React.FC<ILogsAccountViewModel> = (props) => {
  const rows = useMemo<IAccountLogRow[]>(() => {
    return props.logs.map((item) => {
      const snapshot = item.newData ?? item.oldData
      const isOldNewBalanceSame = parseAmount(item.oldData?.balance) === parseAmount(snapshot?.balance);
      const balance = parseAmount(snapshot?.balance ?? item.account?.balance)
      return {
        id: item.id,
        logId: item.id,
        action: formatToTitleCase(item.action),
        accountId: snapshot?.id ?? item.account?.id ?? null,
        accountName: snapshot?.name ?? item.account?.name ?? "-",
        accountIcon: snapshot?.icon ?? item.account?.icon ?? null,
        accountColor: snapshot?.color ?? item.account?.color ?? null,
        balance,
        balanceLabel: formatCurrency(balance),
        oldBalance: formatCurrency(parseAmount(item.oldData?.balance)),
        isOldNewBalanceSame,
        notes: snapshot?.notes ?? item.note ?? "",
        isDefault: snapshot?.isDefault ?? item.account?.isDefault ?? false,
        isSavings: snapshot?.isSavings ?? false,
        countInAssets: snapshot?.countInAssets ?? false,
        categories: item.account?.categories ?? [],
        performedBy: getUserLabel(item.performedBy?.username, item.performedBy?.firstName, item.performedBy?.lastName),
        createdAt: item.createdAt
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
        buttonName={PAGES.LOGS_ACCOUNTS.label}
        handleFormModal={() => undefined}
        hideAddButton={true}
        disableColumnSelector={true}
        invisibleColumns={{}}
      />
    </Stack>
  )
}

export default LogsAccountView
