import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { IExpenseReportData, IExpenseReportMonthData } from "@domain/entities/report/expense-report.entity";
import { formatCurrency } from "@interface/presenters/helpers";

export interface IExpensesReportView {
  children?: React.ReactNode
  expensesReport: IExpenseReportData | null
  selectedYear: string
  compareYear: string | null
}

type FilterMode = "all" | "baseOnly" | "compareOnly"
type SortDirection = "asc" | "desc"

interface IExpenseCategoryRow {
  key: string
  category: string
  isSummary: boolean
  baseValues: Record<string, string>
  compareValues: Record<string, string>
  baseTotal: number
  compareTotal: number
  allTotal: number
}

const EMPTY_AMOUNT = formatCurrency(0)
const SUMMARY_ROW_KEY = "__summary_total__"

const parseCurrency = (value?: string) => {
  if (!value) return 0
  const normalizedValue = value.replace(/[^\d.-]/g, "")
  return normalizedValue ? Number(normalizedValue) : 0
}

const getNumericValueBySortKey = (row: IExpenseCategoryRow, activeSortKey: string) => {
  if (activeSortKey === "baseTotal") return row.baseTotal
  if (activeSortKey === "compareTotal") return row.compareTotal
  if (activeSortKey === "allTotal") return row.allTotal
  if (activeSortKey.startsWith("compare-")) {
    return parseCurrency(row.compareValues[activeSortKey.replace("compare-", "")] ?? EMPTY_AMOUNT)
  }

  return parseCurrency(row.baseValues[activeSortKey] ?? EMPTY_AMOUNT)
}

const normalizeMonthValues = (months: IExpenseReportMonthData[]) =>
  months.map((month) => ({
    id: `${month.month}`,
    label: month.date,
    month
  }))

const buildCategoryRows = (
  baseMonths: ReturnType<typeof normalizeMonthValues>,
  compareMonths: ReturnType<typeof normalizeMonthValues>
): IExpenseCategoryRow[] => {
  const categorySet = new Set<string>()

  baseMonths.forEach(({ month }) => Object.keys(month.categories ?? {}).forEach((category) => categorySet.add(category)))
  compareMonths.forEach(({ month }) => Object.keys(month.categories ?? {}).forEach((category) => categorySet.add(category)))

  const categoryRows = Array.from(categorySet)
    .sort((left, right) => left.localeCompare(right))
    .map((category) => {
      const baseValues = Object.fromEntries(
        baseMonths.map(({ id, month }) => [id, month.categories?.[category] ?? EMPTY_AMOUNT])
      )
      const compareValues = Object.fromEntries(
        compareMonths.map(({ id, month }) => [id, month.categories?.[category] ?? EMPTY_AMOUNT])
      )

      const baseTotal = Object.values(baseValues).reduce((sum, amount) => sum + parseCurrency(amount), 0)
      const compareTotal = Object.values(compareValues).reduce((sum, amount) => sum + parseCurrency(amount), 0)

      return {
        key: category,
        category,
        isSummary: false,
        baseValues,
        compareValues,
        baseTotal,
        compareTotal,
        allTotal: baseTotal - compareTotal
      }
    })

  const summaryRow: IExpenseCategoryRow = {
    key: SUMMARY_ROW_KEY,
    category: "Total",
    isSummary: true,
    baseValues: Object.fromEntries(baseMonths.map(({ id, month }) => [id, month.total ?? EMPTY_AMOUNT])),
    compareValues: Object.fromEntries(compareMonths.map(({ id, month }) => [id, month.total ?? EMPTY_AMOUNT])),
    baseTotal: baseMonths.reduce((sum, { month }) => sum + parseCurrency(month.total), 0),
    compareTotal: compareMonths.reduce((sum, { month }) => sum + parseCurrency(month.total), 0),
    allTotal: 0
  }

  summaryRow.allTotal = summaryRow.baseTotal - summaryRow.compareTotal

  return [summaryRow, ...categoryRows]
}

const ExpensesReportView: React.FC<IExpensesReportView> = (props) => {
  const expenseData = props.expensesReport
  const [searchValue, setSearchValue] = useState("")
  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [sortKey, setSortKey] = useState("baseTotal")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const baseMonths = useMemo(
    () => normalizeMonthValues(expenseData?.baseData ?? []),
    [expenseData]
  )
  const compareMonths = useMemo(
    () => normalizeMonthValues(expenseData?.compareData ?? []),
    [expenseData]
  )

  const categoryRows = useMemo(
    () => buildCategoryRows(baseMonths, compareMonths),
    [baseMonths, compareMonths]
  )

  const visibleRows = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    const filteredRows = categoryRows.filter((row) => {
      if (row.isSummary) {
        return true
      }

      if (query && !row.category.toLowerCase().includes(query)) {
        return false
      }

      if (filterMode === "baseOnly") {
        return row.baseTotal > 0
      }

      if (filterMode === "compareOnly") {
        return row.compareTotal > 0
      }

      return true
    })

    const [summaryRow, ...rows] = filteredRows
    const sortedRows = [...rows].sort((left, right) => {
      const directionFactor = sortDirection === "asc" ? 1 : -1

      if (sortKey === "category") {
        return directionFactor * left.category.localeCompare(right.category)
      }

      const leftValue = getNumericValueBySortKey(left, sortKey)
      const rightValue = getNumericValueBySortKey(right, sortKey)

      return directionFactor * (leftValue - rightValue)
    })

    return summaryRow ? [summaryRow, ...sortedRows] : sortedRows
  }, [categoryRows, filterMode, searchValue, sortDirection, sortKey])

  const baseGrandTotal = useMemo(
    () => categoryRows.find((row) => row.isSummary)?.baseTotal ?? 0,
    [categoryRows]
  )
  const compareGrandTotal = useMemo(
    () => categoryRows.find((row) => row.isSummary)?.compareTotal ?? 0,
    [categoryRows]
  )
  const hasCompareData = Boolean(compareMonths.length && expenseData?.compareYear)

  const toggleSort = (nextKey: string) => {
    if (sortKey === nextKey) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc")
      return
    }

    setSortKey(nextKey)
    setSortDirection(nextKey === "category" ? "asc" : "desc")
  }

  const stickyFirstColumnStyles = {
    position: "sticky" as const,
    left: 0,
    minWidth: 220,
    zIndex: 2,
    backgroundColor: "background.paper",
    borderRight: "1px solid",
    borderColor: "divider"
  }

  if (!expenseData?.baseData?.length) {
    return <Typography variant="body2">No expenses report data available.</Typography>
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ flex: 1 }}>
          <TextField
            label="Search categories"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by category name"
            size="small"
            sx={{ minWidth: 240, maxWidth: 360 }}
          />
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="expense-report-filter-label">Filter</InputLabel>
            <Select
              labelId="expense-report-filter-label"
              label="Filter"
              value={filterMode}
              onChange={(event: SelectChangeEvent<FilterMode>) => setFilterMode(event.target.value as FilterMode)}
            >
              <MenuItem value="all">All categories</MenuItem>
              <MenuItem value="baseOnly">Has {expenseData.selectedYear} values</MenuItem>
              <MenuItem value="compareOnly" disabled={!hasCompareData}>Has {expenseData.compareYear ?? "compare"} values</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
        >
          <Paper variant="outlined" sx={{ px: 1.5, py: 1 }}>
            <Typography variant="caption" color="text.secondary">{expenseData.selectedYear} total</Typography>
            <Typography fontWeight={700}>{formatCurrency(baseGrandTotal)}</Typography>
          </Paper>
          {hasCompareData && (
            <Paper variant="outlined" sx={{ px: 1.5, py: 1 }}>
              <Typography variant="caption" color="text.secondary">{expenseData.compareYear} total</Typography>
              <Typography fontWeight={700}>{formatCurrency(compareGrandTotal)}</Typography>
            </Paper>
          )}
        </Stack>
      </Stack>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          maxHeight: "80vh",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            height: 10,
            width: 10
          }
        }}
      >
        <Table stickyHeader size="small" sx={{ maxHeight: "80vh", minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...stickyFirstColumnStyles,
                  top: 0,
                  zIndex: 4,
                  fontWeight: 700
                }}
              >
                <TableSortLabel
                  active={sortKey === "category"}
                  direction={sortKey === "category" ? sortDirection : "asc"}
                  onClick={() => toggleSort("category")}
                >
                  Category
                </TableSortLabel>
              </TableCell>

              {baseMonths.map(({ id, label }) => (
                <TableCell key={`base-${id}`} align="right" sx={{ top: 0, fontWeight: 700, whiteSpace: "nowrap" }}>
                  <TableSortLabel
                    active={sortKey === id}
                    direction={sortKey === id ? sortDirection : "asc"}
                    onClick={() => toggleSort(id)}
                  >
                    {label} {expenseData.selectedYear}
                  </TableSortLabel>
                </TableCell>
              ))}

              <TableCell align="right" sx={{ top: 0, fontWeight: 700, whiteSpace: "nowrap" }}>
                <TableSortLabel
                  active={sortKey === "baseTotal"}
                  direction={sortKey === "baseTotal" ? sortDirection : "desc"}
                  onClick={() => toggleSort("baseTotal")}
                >
                  Total {expenseData.selectedYear}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                key={row.key}
                hover={!row.isSummary}
                sx={{
                  backgroundColor: row.isSummary ? "action.hover" : "inherit",
                  "& td": {
                    fontWeight: row.isSummary ? 700 : 400
                  }
                }}
              >
                <TableCell sx={{ ...stickyFirstColumnStyles, backgroundColor: row.isSummary ? "action.hover" : "background.paper" }}>
                  {row.category}
                </TableCell>

                {baseMonths.map(({ id }) => (
                  <TableCell key={`${row.key}-base-${id}`} align="right">
                    {formatCurrency(parseInt(row.baseValues[id]))}
                  </TableCell>
                ))}

                <TableCell align="right">{formatCurrency(row.baseTotal)}</TableCell>
              </TableRow>
            ))}

            {!visibleRows.length && (
              <TableRow>
                <TableCell colSpan={baseMonths.length + compareMonths.length + 4}>
                  <Box py={3} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      No categories match the current search and filter.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>


        {hasCompareData &&
          <>
            <Divider sx={{ mt: 4 }} />
            <Table stickyHeader size="small" sx={{ maxHeight: "80vh", minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...stickyFirstColumnStyles,
                      top: 0,
                      zIndex: 4,
                      fontWeight: 700
                    }}
                  >
                    <TableSortLabel
                      active={sortKey === "category"}
                      direction={sortKey === "category" ? sortDirection : "asc"}
                      onClick={() => toggleSort("category")}
                    >
                      Category
                    </TableSortLabel>
                  </TableCell>

                  {hasCompareData && compareMonths.map(({ id, label }) => {
                    const compareSortKey = `compare-${id}`

                    return (
                      <TableCell key={`compare-${id}`} align="right" sx={{ top: 0, fontWeight: 700, whiteSpace: "nowrap" }}>
                        <TableSortLabel
                          active={sortKey === compareSortKey}
                          direction={sortKey === compareSortKey ? sortDirection : "asc"}
                          onClick={() => toggleSort(compareSortKey)}
                        >
                          {label} {expenseData.compareYear}
                        </TableSortLabel>
                      </TableCell>
                    )
                  })}

                  {hasCompareData && (
                    <TableCell align="right" sx={{ top: 0, fontWeight: 700, whiteSpace: "nowrap" }}>
                      <TableSortLabel
                        active={sortKey === "compareTotal"}
                        direction={sortKey === "compareTotal" ? sortDirection : "desc"}
                        onClick={() => toggleSort("compareTotal")}
                      >
                        Total {expenseData.compareYear}
                      </TableSortLabel>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow
                    key={row.key}
                    hover={!row.isSummary}
                    sx={{
                      backgroundColor: row.isSummary ? "action.hover" : "inherit",
                      "& td": {
                        fontWeight: row.isSummary ? 700 : 400
                      }
                    }}
                  >
                    <TableCell sx={{ ...stickyFirstColumnStyles, backgroundColor: row.isSummary ? "action.hover" : "background.paper" }}>
                      {row.category}
                    </TableCell>

                    {hasCompareData && compareMonths.map(({ id }) => (
                      <TableCell key={`${row.key}-compare-${id}`} align="right">
                        {formatCurrency(parseInt(row.compareValues[id]))}

                      </TableCell>
                    ))}

                    {hasCompareData && <TableCell align="right">{formatCurrency(row.compareTotal)}</TableCell>}
                  </TableRow>
                ))}

                {!visibleRows.length && (
                  <TableRow>
                    <TableCell colSpan={baseMonths.length + compareMonths.length + 4}>
                      <Box py={3} textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                          No categories match the current search and filter.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        }
      </TableContainer>
    </Stack>
  )
}

export default ExpensesReportView
