import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme
} from "@mui/material"
import { Theme } from "@mui/material/styles"
import React, { useMemo, useRef, useState } from "react"
import { Circle, ExpandMore } from "@mui/icons-material"
import ReactECharts from "echarts-for-react"
import * as echarts from "echarts/core"
import { BarChart, LineChart, PieChart } from "echarts/charts"
import { CanvasRenderer } from "echarts/renderers"
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components"
import { type BarSeriesOption, type EChartsOption, type PieSeriesOption } from "echarts"
import { IExpenseReportData, IExpenseReportMonthData, IExpenseReportParentCategory } from "@domain/entities/report/expense-report.entity"
import { formatCurrency, formatToTitleCase, absoluteValue } from "@interface/presenters/helpers"
import pluralize from "pluralize"

echarts.use([
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart,
  BarChart,
  LineChart,
  CanvasRenderer
])

export interface IExpensesReportView {
  children?: React.ReactNode
  expensesReport: IExpenseReportData | null
  selectedYear: string
  compareYear: string | null
}

type FilterMode = "all" | "baseOnly" | "compareOnly"
type ComparisonView = "month" | "year"
type ExpenseViewMode = "overview" | "table"

interface INormalizedMonth {
  month: number
  label: string
  parentCategories: Record<string, IExpenseReportParentCategory>
  total: number
}

interface ICategoryBreakdown {
  parentCategory: string
  category: string
  label: string
  amount: number
  color: string | null
}

interface IExpenseTableRow {
  category: string
  color: string | null
  baseAmount: number
  compareAmount: number
  differenceAmount: number
}

interface IExpenseParentGroup {
  key: string
  parentCategory: string
  rows: IExpenseTableRow[]
  baseAmount: number
  compareAmount: number
  differenceAmount: number
}

interface IExpenseMonthSection {
  key: string
  month: string
  monthValue: number
  groups: IExpenseParentGroup[]
  baseAmount: number
  compareAmount: number
  differenceAmount: number
}

interface IExpenseExcelMatrixRow {
  key: string
  parentCategory: string
  categoryLabel: string
  color: string | null
  monthlyBaseAmounts: Record<string, number>
  monthlyCompareAmounts: Record<string, number>
  totalBaseAmount: number
  totalCompareAmount: number
  totalDifferenceAmount: number
  isSummary: boolean
}

const normalizeMonth = (month: IExpenseReportMonthData): INormalizedMonth => ({
  month: month.month,
  label: month.date,
  parentCategories: Object.fromEntries(
    Object.entries(month.parentCategories ?? {}).map(([parentCategory, categoryData]) => [
      parentCategory,
      {
        categories: Object.fromEntries(
          Object.entries(categoryData.categories ?? {}).map(([category, details]) => [
            category,
            {
              ...details,
              amount: Number(details.amount ?? 0),
              color: details.color ?? null
            }
          ])
        ),
        total: Number(categoryData.total ?? 0)
      }
    ])
  ),
  total: Number(month.total ?? 0)
})

const buildCategoryBreakdown = (months: INormalizedMonth[]): ICategoryBreakdown[] => {
  const categoryTotals = new Map<string, ICategoryBreakdown>()

  months.forEach((month) => {
    Object.entries(month.parentCategories ?? {}).forEach(([parentCategory, categoryData]) => {
      Object.entries(categoryData.categories ?? {}).forEach(([category, details]) => {
        const key = `${parentCategory}:::${category}`
        const currentValue = categoryTotals.get(key)

        categoryTotals.set(key, {
          parentCategory,
          category,
          label: formatToTitleCase(details.name ?? category),
          amount: (currentValue?.amount ?? 0) + Number(details.amount ?? 0),
          color: details.color ?? null
        })
      })
    })
  })

  return Array.from(categoryTotals.values()).sort((left, right) => right.amount - left.amount)
}

const buildTableSections = (
  baseMonths: INormalizedMonth[],
  compareMonths: INormalizedMonth[],
  filterMode: FilterMode,
  query: string
): IExpenseMonthSection[] => {
  const compareByMonth = new Map(compareMonths.map((month) => [month.month, month]))
  const allMonths = baseMonths.map((baseMonth) => ({
    base: baseMonth,
    compare: compareByMonth.get(baseMonth.month)
  }))
  const normalizedQuery = query.trim().toLowerCase()
  const sections: IExpenseMonthSection[] = []

  allMonths.forEach(({ base, compare }) => {
    const monthMatchesQuery = !normalizedQuery || base.label.toLowerCase().includes(normalizedQuery)
    const parentCategoryNames = Array.from(
      new Set([
        ...Object.keys(base.parentCategories ?? {}),
        ...Object.keys(compare?.parentCategories ?? {})
      ])
    )

    const detailRows = parentCategoryNames
      .flatMap((parentCategory) => {
        const baseCategories = base.parentCategories[parentCategory]?.categories ?? {}
        const compareCategories = compare?.parentCategories?.[parentCategory]?.categories ?? {}
        const categoryNames = Array.from(
          new Set([
            ...Object.keys(baseCategories),
            ...Object.keys(compareCategories)
          ])
        )

        return categoryNames.map((category) => {
          const baseAmount = Number(baseCategories[category]?.amount ?? 0)
          const compareAmount = Number(compareCategories[category]?.amount ?? 0)

          return {
            parentCategory,
            color: baseCategories[category]?.color ?? compareCategories[category]?.color ?? null,
            category,
            baseAmount,
            compareAmount,
            differenceAmount: baseAmount - compareAmount
          }
        })
      })
      .filter((row) => {
        const matchesQuery = !normalizedQuery ||
          monthMatchesQuery ||
          row.parentCategory.toLowerCase().includes(normalizedQuery) ||
          row.category.toLowerCase().includes(normalizedQuery)

        if (!matchesQuery) return false
        if (filterMode === "baseOnly") return row.baseAmount > 0
        if (filterMode === "compareOnly") return row.compareAmount > 0
        return true
      })
      .sort((left, right) => {
        if (left.parentCategory !== right.parentCategory) {
          return left.parentCategory.localeCompare(right.parentCategory)
        }

        return left.category.localeCompare(right.category)
      })

    const hasVisibleMonthTotal = filterMode === "all"
      ? base.total > 0 || (compare?.total ?? 0) > 0 || monthMatchesQuery
      : filterMode === "baseOnly"
        ? base.total > 0
        : (compare?.total ?? 0) > 0

    if (!detailRows.length && !hasVisibleMonthTotal) {
      return
    }

    const parentGroups = new Map<string, IExpenseTableRow[]>()
    const visibleDetailRows = detailRows.length
      ? detailRows
      : []

    visibleDetailRows.forEach((row) => {
      const groupRows = parentGroups.get(row.parentCategory) ?? []
      groupRows.push({
        category: row.category,
        color: row.color,
        baseAmount: row.baseAmount,
        compareAmount: row.compareAmount,
        differenceAmount: row.differenceAmount
      })
      parentGroups.set(row.parentCategory, groupRows)
    })

    const groups = Array.from(parentGroups.entries()).map(([parentCategory, groupRows]) => ({
      key: `${base.month}-${parentCategory}`,
      parentCategory,
      rows: groupRows,
      baseAmount: Number(base.parentCategories[parentCategory]?.total ?? groupRows.reduce((sum, row) => sum + row.baseAmount, 0)),
      compareAmount: Number(compare?.parentCategories?.[parentCategory]?.total ?? groupRows.reduce((sum, row) => sum + row.compareAmount, 0)),
      differenceAmount:
        Number(base.parentCategories[parentCategory]?.total ?? groupRows.reduce((sum, row) => sum + row.baseAmount, 0)) -
        Number(compare?.parentCategories?.[parentCategory]?.total ?? groupRows.reduce((sum, row) => sum + row.compareAmount, 0))
    }))

    sections.push({
      key: `${base.month}`,
      month: base.label,
      monthValue: base.month,
      groups,
      baseAmount: base.total,
      compareAmount: compare?.total ?? 0,
      differenceAmount: base.total - (compare?.total ?? 0)
    })
  })

  return sections
}

const buildExcelMatrixRows = (
  baseMonths: INormalizedMonth[],
  compareMonths: INormalizedMonth[],
  filterMode: FilterMode,
  query: string
): IExpenseExcelMatrixRow[] => {
  const compareByMonth = new Map(compareMonths.map((month) => [month.month, month]))
  const parentMap = new Map<string, {
    monthlyBaseAmounts: Record<string, number>
    monthlyCompareAmounts: Record<string, number>
    totalBaseAmount: number
    totalCompareAmount: number
  }>()
  const categoryMap = new Map<string, IExpenseExcelMatrixRow>()
  const normalizedQuery = query.trim().toLowerCase()

  baseMonths.forEach((baseMonth) => {
    const monthKey = String(baseMonth.month)
    const compareMonth = compareByMonth.get(baseMonth.month)
    const parentCategoryNames = Array.from(
      new Set([
        ...Object.keys(baseMonth.parentCategories ?? {}),
        ...Object.keys(compareMonth?.parentCategories ?? {})
      ])
    )

    parentCategoryNames.forEach((parentCategory) => {
      const baseParent = baseMonth.parentCategories[parentCategory]
      const compareParent = compareMonth?.parentCategories?.[parentCategory]
      const baseParentTotal = Number(baseParent?.total ?? 0)
      const compareParentTotal = Number(compareParent?.total ?? 0)

      const currentParent = parentMap.get(parentCategory) ?? {
        monthlyBaseAmounts: {},
        monthlyCompareAmounts: {},
        totalBaseAmount: 0,
        totalCompareAmount: 0
      }
      currentParent.monthlyBaseAmounts[monthKey] = baseParentTotal
      currentParent.monthlyCompareAmounts[monthKey] = compareParentTotal
      currentParent.totalBaseAmount += baseParentTotal
      currentParent.totalCompareAmount += compareParentTotal
      parentMap.set(parentCategory, currentParent)

      const baseCategories = baseParent?.categories ?? {}
      const compareCategories = compareParent?.categories ?? {}
      const categoryNames = Array.from(
        new Set([
          ...Object.keys(baseCategories),
          ...Object.keys(compareCategories)
        ])
      )

      categoryNames.forEach((category) => {
        const baseAmount = Number(baseCategories[category]?.amount ?? 0)
        const compareAmount = Number(compareCategories[category]?.amount ?? 0)
        const key = `${parentCategory}:::${category}`
        const existingRow = categoryMap.get(key) ?? {
          key,
          parentCategory,
          categoryLabel: category,
          color: baseCategories[category]?.color ?? compareCategories[category]?.color ?? null,
          monthlyBaseAmounts: {},
          monthlyCompareAmounts: {},
          totalBaseAmount: 0,
          totalCompareAmount: 0,
          totalDifferenceAmount: 0,
          isSummary: false
        }

        existingRow.monthlyBaseAmounts[monthKey] = baseAmount
        existingRow.monthlyCompareAmounts[monthKey] = compareAmount
        existingRow.totalBaseAmount += baseAmount
        existingRow.totalCompareAmount += compareAmount
        existingRow.totalDifferenceAmount = existingRow.totalBaseAmount - existingRow.totalCompareAmount
        categoryMap.set(key, existingRow)
      })
    })
  })

  const rows: IExpenseExcelMatrixRow[] = []

  Array.from(parentMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([parentCategory, parentData]) => {
      const parentMatchesQuery = !normalizedQuery || parentCategory.toLowerCase().includes(normalizedQuery)
      const categoryRows = Array.from(categoryMap.values())
        .filter((row) => row.parentCategory === parentCategory)
        .filter((row) => {
          const categoryMatchesQuery = !normalizedQuery ||
            parentMatchesQuery ||
            row.categoryLabel.toLowerCase().includes(normalizedQuery)

          if (!categoryMatchesQuery) return false
          if (filterMode === "baseOnly") return row.totalBaseAmount > 0
          if (filterMode === "compareOnly") return row.totalCompareAmount > 0
          return true
        })
        .sort((left, right) => left.categoryLabel.localeCompare(right.categoryLabel))

      const hasVisibleParent = filterMode === "all"
        ? parentData.totalBaseAmount > 0 || parentData.totalCompareAmount > 0 || parentMatchesQuery
        : filterMode === "baseOnly"
          ? parentData.totalBaseAmount > 0
          : parentData.totalCompareAmount > 0

      if (!categoryRows.length && !hasVisibleParent) {
        return
      }

      rows.push({
        key: `${parentCategory}-summary`,
        parentCategory,
        categoryLabel: "Total",
        color: null,
        monthlyBaseAmounts: parentData.monthlyBaseAmounts,
        monthlyCompareAmounts: parentData.monthlyCompareAmounts,
        totalBaseAmount: parentData.totalBaseAmount,
        totalCompareAmount: parentData.totalCompareAmount,
        totalDifferenceAmount: parentData.totalBaseAmount - parentData.totalCompareAmount,
        isSummary: true
      })

      rows.push(...categoryRows)
    })

  return rows
}

const buildPieOption = (
  title: string,
  data: ICategoryBreakdown[],
  emptyLabel: string
): EChartsOption => ({
  tooltip: {
    trigger: "item",
    formatter: (params: any) => `${params.name}: ${formatCurrency(params.name === emptyLabel ? 0 : Number(params?.value ?? 0))}`
  },
  legend: {
    bottom: 0,
    type: "scroll"
  },
  series: [
    {
      name: title,
      type: "pie",
      radius: ["38%", "68%"],
      center: ["50%", "42%"],
      data: data.length
        ? data.map((item) => ({
          value: item.amount,
          name: item.label,
          itemStyle: item.color ? { color: item.color } : undefined
        }))
        : [{
          value: 1,
          name: emptyLabel,
          itemStyle: { color: "#D7DCE3" }
        }],
      label: {
        formatter: (params: any) => `${params.name}\n${formatCurrency(params.name === emptyLabel ? 0 : Number(params?.value ?? 0))}`
      },
      emphasis: {
        label: {
          fontWeight: "bold"
        }
      }
    } satisfies PieSeriesOption
  ]
})

const buildComparisonOption = (
  baseMonths: INormalizedMonth[],
  compareMonths: INormalizedMonth[],
  selectedYear: string,
  compareYear: string | null,
  theme: Theme
): EChartsOption => {
  const compareByMonth = new Map(compareMonths.map((month) => [month.month, month]))
  const labels = baseMonths.map((month) => month.label)
  const baseSeries = baseMonths.map((month) => month.total)
  const compareSeries = baseMonths.map((month) => compareByMonth.get(month.month)?.total ?? 0)
  const differenceSeries = baseMonths.map((month, index) => baseSeries[index] - compareSeries[index])

  return {
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: any) => formatCurrency(Number(value ?? 0))
    },
    legend: {
      top: 0
    },
    grid: {
      top: 48,
      left: 48,
      right: 24,
      bottom: 32,
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: labels
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: number) => formatCurrency(value)
      }
    },
    series: [
      {
        name: selectedYear,
        type: "bar",
        data: baseSeries,
        itemStyle: { color: theme.palette.primary.main }
      },
      ...(compareYear ? [{
        name: compareYear,
        type: "bar",
        data: compareSeries,
        itemStyle: { color: theme.palette.grey[500] }
      } satisfies BarSeriesOption] : []),
      {
        name: "Difference",
        type: "line",
        smooth: true,
        data: differenceSeries,
        itemStyle: { color: theme.palette.success.main }
      }
    ]
  }
}

const buildYearComparisonOption = (
  selectedYear: string,
  compareYear: string | null,
  baseTotal: number,
  compareTotal: number,
  theme: Theme
): EChartsOption => {
  const labels = compareYear ? [compareYear, selectedYear] : [selectedYear]
  const values = compareYear ? [compareTotal, baseTotal] : [baseTotal]

  return {
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: any) => formatCurrency(Number(value ?? 0))
    },
    grid: {
      top: 32,
      left: 48,
      right: 24,
      bottom: 32,
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: labels
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: number) => formatCurrency(value)
      }
    },
    series: [
      {
        name: "Total Expenses",
        type: "bar",
        data: values,
        itemStyle: {
          color: (params: { dataIndex: number }) => compareYear && params.dataIndex === 0
            ? theme.palette.grey[500]
            : theme.palette.primary.main
        }
      } satisfies BarSeriesOption
    ]
  }
}

const chartCardStyles = {
  borderRadius: 3,
  height: "100%"
}

const TABLE_STICKY_FIRST_COLUMN_WIDTH = 120
const TABLE_STICKY_SECOND_COLUMN_WIDTH = 250
const TABLE_HEADER_FIRST_ROW_OFFSET = 0
const TABLE_HEADER_SECOND_ROW_OFFSET = 35

const stickyCellStyles = {
  backgroundColor: "background.paper",
  position: "sticky" as const,
  left: 0,
  zIndex: 2,
  borderRight: "1px solid",
  borderColor: "divider"
}

const stickySecondCellStyles = {
  backgroundColor: "background.paper",
  position: "sticky" as const,
  left: TABLE_STICKY_FIRST_COLUMN_WIDTH,
  zIndex: 3,
  borderRight: "1px solid",
  borderColor: "divider"
}

const tableContainerStyles = {
  width: "100%",
  maxHeight: "82vh",
  overflowX: "auto",
  overflowY: "auto",
  borderRadius: 2,
  "& .MuiTable-root": {
    width: "max-content"
  },
  "&::-webkit-scrollbar": {
    height: 10,
    width: 10
  }
}

const ExpensesReportView: React.FC<IExpensesReportView> = (props) => {
  const theme = useTheme()
  const expenseData = props.expensesReport
  const [searchValue, setSearchValue] = useState("")
  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [comparisonView, setComparisonView] = useState<ComparisonView>("month")
  const [viewMode, setViewMode] = useState<ExpenseViewMode>("overview")
  const [expandedOverviewMonth, setExpandedOverviewMonth] = useState<string | false | undefined>(undefined)
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const currentPieRef = useRef<ReactECharts | null>(null)
  const previousPieRef = useRef<ReactECharts | null>(null)
  const comparisonChartRef = useRef<ReactECharts | null>(null)

  const baseMonths = useMemo(
    () => (expenseData?.baseData ?? []).map(normalizeMonth),
    [expenseData]
  )
  const compareMonths = useMemo(
    () => (expenseData?.compareData ?? []).map(normalizeMonth),
    [expenseData]
  )
  const hasCompareData = Boolean(props.compareYear && compareMonths.length)
  const availableMonths = useMemo(
    () => baseMonths.map((month) => ({ value: String(month.month), label: month.label })),
    [baseMonths]
  )
  const filteredBaseMonths = useMemo(
    () => selectedMonth === "all"
      ? baseMonths
      : baseMonths.filter((month) => String(month.month) === selectedMonth),
    [baseMonths, selectedMonth]
  )
  const filteredCompareMonths = useMemo(
    () => selectedMonth === "all"
      ? compareMonths
      : compareMonths.filter((month) => String(month.month) === selectedMonth),
    [compareMonths, selectedMonth]
  )

  const baseBreakdown = useMemo(() => buildCategoryBreakdown(filteredBaseMonths), [filteredBaseMonths])
  const compareBreakdown = useMemo(() => buildCategoryBreakdown(filteredCompareMonths), [filteredCompareMonths])
  const baseGrandTotal = useMemo(
    () => filteredBaseMonths.reduce((sum, month) => sum + month.total, 0),
    [filteredBaseMonths]
  )
  const compareGrandTotal = useMemo(
    () => filteredCompareMonths.reduce((sum, month) => sum + month.total, 0),
    [filteredCompareMonths]
  )
  const allYearBaseGrandTotal = useMemo(
    () => baseMonths.reduce((sum, month) => sum + month.total, 0),
    [baseMonths]
  )
  const allYearCompareGrandTotal = useMemo(
    () => compareMonths.reduce((sum, month) => sum + month.total, 0),
    [compareMonths]
  )
  const differenceTotal = baseGrandTotal - compareGrandTotal

  const overviewSections = useMemo(
    () => buildTableSections(filteredBaseMonths, filteredCompareMonths, filterMode, searchValue),
    [filteredBaseMonths, filteredCompareMonths, filterMode, searchValue]
  )
  const tableRows = useMemo(
    () => buildExcelMatrixRows(baseMonths, compareMonths, filterMode, searchValue),
    [baseMonths, compareMonths, filterMode, searchValue]
  )

  const comparisonChartOption = useMemo(
    () => comparisonView === "year"
      ? buildYearComparisonOption(
        props.selectedYear,
        props.compareYear,
        allYearBaseGrandTotal,
        allYearCompareGrandTotal,
        theme
      )
      : buildComparisonOption(
        filteredBaseMonths,
        filteredCompareMonths,
        props.selectedYear,
        props.compareYear,
        theme
      ),
    [
      allYearBaseGrandTotal,
      allYearCompareGrandTotal,
      comparisonView,
      filteredBaseMonths,
      filteredCompareMonths,
      props.compareYear,
      props.selectedYear,
      theme
    ]
  )

  const comparisonChartTitle = comparisonView === "year"
    ? "Yearly Expense Comparison"
    : selectedMonth === "all"
      ? "Monthly Comparison By Year"
      : `${availableMonths.find((month) => month.value === selectedMonth)?.label ?? "Month"} Comparison By Year`

  const defaultExpandedMonth = useMemo(() => {
    if (!overviewSections.length) return false

    const currentMonthValue = new Date().getMonth() + 1
    return overviewSections.find((section) => section.monthValue === currentMonthValue)?.key ?? overviewSections[0].key
  }, [overviewSections])

  const activeExpandedMonth = expandedOverviewMonth === undefined
    ? defaultExpandedMonth
    : expandedOverviewMonth

  if (!expenseData?.baseData?.length) {
    return <Typography variant="body2">No expenses report data available.</Typography>
  }

  return (
    <Stack spacing={2.5}>
      <Tabs
        value={viewMode}
        onChange={(_, value: ExpenseViewMode) => setViewMode(value)}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Tab value="overview" label="Normal View" />
        <Tab value="table" label="Table View" />
      </Tabs>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Search month or category"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search month, parent category, or category"
            size="small"
            sx={{ minWidth: 260 }}
          />

          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="expense-report-filter-label">Filter</InputLabel>
            <Select
              labelId="expense-report-filter-label"
              label="Filter"
              value={filterMode}
              onChange={(event: SelectChangeEvent<FilterMode>) => setFilterMode(event.target.value as FilterMode)}>
              <MenuItem value="all">All entries</MenuItem>
              <MenuItem value="baseOnly">Has {expenseData.selectedYear} values</MenuItem>
              <MenuItem value="compareOnly" disabled={!hasCompareData}>
                Has {expenseData.compareYear ?? "compare"} values
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="expense-report-month-label">Month</InputLabel>
            <Select
              labelId="expense-report-month-label"
              label="Month"
              value={selectedMonth}
              onChange={(event: SelectChangeEvent<string>) => setSelectedMonth(event.target.value)}
              disabled={viewMode === "table"}>
              <MenuItem value="all">All months</MenuItem>
              {availableMonths.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="expense-report-comparison-view-label">Compare by</InputLabel>
            <Select
              labelId="expense-report-comparison-view-label"
              label="Compare by"
              value={comparisonView}
              onChange={(event: SelectChangeEvent<ComparisonView>) => setComparisonView(event.target.value as ComparisonView)}
              disabled={viewMode !== "overview"}>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Paper variant="outlined" sx={{ px: 1.5, py: 1.1 }}>
            <Typography variant="caption" color="text.secondary">{expenseData.selectedYear} total</Typography>
            <Typography fontWeight={700}>{formatCurrency(baseGrandTotal)}</Typography>
          </Paper>
          {hasCompareData && (
            <>
              <Paper variant="outlined" sx={{ px: 1.5, py: 1.1 }}>
                <Typography variant="caption" color="text.secondary">{expenseData.compareYear} total</Typography>
                <Typography fontWeight={700}>{formatCurrency(compareGrandTotal)}</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ px: 1.5, py: 1.1 }}>
                <Typography variant="caption" color="text.secondary">Difference</Typography>
                <Typography fontWeight={700} color={differenceTotal >= 0 ? "error.main" : "success.main"}>
                  {formatCurrency(absoluteValue(differenceTotal))}
                </Typography>
              </Paper>
            </>
          )}
        </Stack>
      </Stack>

      {viewMode === "overview" && (
        <Stack spacing={2.5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: hasCompareData ? 4 : 5 }}>
              <Card variant="outlined" sx={chartCardStyles}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    {expenseData.selectedYear} Category Split
                  </Typography>
                  <ReactECharts
                    ref={currentPieRef}
                    option={buildPieOption(`${expenseData.selectedYear} Category Split`, baseBreakdown, "No expense data")}
                    style={{ height: 340, width: "100%" }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {hasCompareData && (
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={chartCardStyles}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      {expenseData.compareYear} Category Split
                    </Typography>
                    <ReactECharts
                      ref={previousPieRef}
                      option={buildPieOption(`${expenseData.compareYear} Category Split`, compareBreakdown, "No expense data")}
                      style={{ height: 340, width: "100%" }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid size={{ xs: 12, md: hasCompareData ? 4 : 7 }}>
              <Card variant="outlined" sx={chartCardStyles}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    {comparisonChartTitle}
                  </Typography>
                  {hasCompareData && (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
                      <Paper variant="outlined" sx={{ flex: 1, px: 1.5, py: 1.25 }}>
                        <Typography variant="caption" color="text.secondary">
                          {expenseData.selectedYear}
                        </Typography>
                        <Typography fontWeight={700}>{formatCurrency(baseGrandTotal)}</Typography>
                      </Paper>
                      <Paper variant="outlined" sx={{ flex: 1, px: 1.5, py: 1.25 }}>
                        <Typography variant="caption" color="text.secondary">
                          {expenseData.compareYear}
                        </Typography>
                        <Typography fontWeight={700}>{formatCurrency(compareGrandTotal)}</Typography>
                      </Paper>
                    </Stack>
                  )}
                  <ReactECharts
                    ref={comparisonChartRef}
                    option={comparisonChartOption}
                    style={{ height: 340, width: "100%" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Stack spacing={1.5}>
            {overviewSections.map((section) => (
              <Accordion
                key={section.key}
                expanded={activeExpandedMonth === section.key}
                onChange={(_, expanded) => setExpandedOverviewMonth(expanded ? section.key : false)}
                disableGutters
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  "&:before": {
                    display: "none"
                  }
                }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  disabled={!section.groups.length}
                  sx={{
                    backgroundColor: activeExpandedMonth === section.key ? `${theme.palette.primary.main}20` : "background.paper"
                  }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    justifyContent="space-between"
                    width="100%">
                    <Stack spacing={0.25}>
                      <Typography fontWeight={700}>
                        {`${section.month} (${pluralize("Main Category", section.groups.length, true)})`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`${pluralize("Category", section.groups.reduce((sum, group) => sum + group.rows.length, 0), true)}`}
                      </Typography>
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ pr: 1 }}>
                      <Paper variant="outlined" sx={{ px: 1.25, py: 0.75, minWidth: 120 }}>
                        <Typography variant="caption" color="text.secondary">{expenseData.selectedYear}</Typography>
                        <Typography fontWeight={700}>{formatCurrency(section.baseAmount)}</Typography>
                      </Paper>
                      {hasCompareData && (
                        <Paper variant="outlined" sx={{ px: 1.25, py: 0.75, minWidth: 120 }}>
                          <Typography variant="caption" color="text.secondary">{expenseData.compareYear}</Typography>
                          <Typography fontWeight={700}>{formatCurrency(section.compareAmount)}</Typography>
                        </Paper>
                      )}
                      <Paper variant="outlined" sx={{ px: 1.25, py: 0.75, minWidth: 120 }}>
                        <Typography variant="caption" color="text.secondary">Difference</Typography>
                        <Typography
                          fontWeight={700}
                          color={section.differenceAmount > 0 ? "error.main" : section.differenceAmount < 0 ? "success.main" : undefined}>
                          {formatCurrency(absoluteValue(section.differenceAmount))}
                        </Typography>
                      </Paper>
                    </Stack>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <TableContainer component={Box}>
                    <Table
                      size="small"
                      sx={{
                        minWidth: 920,
                        borderCollapse: "collapse",
                        "& .MuiTableCell-root": {
                          borderColor: "divider"
                        }
                      }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap", minWidth: 300 }}>
                            Details
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                            {expenseData.selectedYear}
                          </TableCell>
                          {hasCompareData && (
                            <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                              {expenseData.compareYear}
                            </TableCell>
                          )}
                          <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                            Difference
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {section.groups.map((group) => (
                          <React.Fragment key={group.key}>
                            <TableRow sx={{ backgroundColor: "action.hover" }}>
                              <TableCell>
                                <Typography fontWeight={700}>{formatToTitleCase(group.parentCategory)}</Typography>
                              </TableCell>
                              <TableCell align="right">{formatCurrency(group.baseAmount)}</TableCell>
                              {hasCompareData && (
                                <TableCell align="right">{formatCurrency(group.compareAmount)}</TableCell>
                              )}
                              <TableCell
                                align="right"
                                sx={{ color: group.differenceAmount > 0 ? "error.main" : group.differenceAmount < 0 ? "success.main" : undefined }}>
                                {formatCurrency(absoluteValue(group.differenceAmount))}
                              </TableCell>
                            </TableRow>

                            {group.rows.map((row) => (
                              <TableRow key={`${group.key}-${row.category}`}>
                                <TableCell>
                                  <Stack direction="row" alignItems="center">
                                    <Circle sx={{ mr: 1, color: row.color }} fontSize="small" />
                                    <Typography>{formatToTitleCase(row.category)}</Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell align="right">{formatCurrency(row.baseAmount)}</TableCell>
                                {hasCompareData && (
                                  <TableCell align="right">{formatCurrency(row.compareAmount)}</TableCell>
                                )}
                                <TableCell
                                  align="right"
                                  sx={{ color: row.differenceAmount > 0 ? "error.main" : row.differenceAmount < 0 ? "success.main" : undefined }}>
                                  {formatCurrency(absoluteValue(row.differenceAmount))}
                                </TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}

            {!overviewSections.length && (
              <Paper variant="outlined">
                <Box py={3} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No entries match the current search and filter.
                  </Typography>
                </Box>
              </Paper>
            )}
          </Stack>
        </Stack>
      )}

      {viewMode === "table" && (
        <Stack spacing={1.5}>
          <TableContainer component={Paper} variant="outlined" sx={tableContainerStyles}>
            <Table
              stickyHeader
              size="small"
              sx={{
                borderCollapse: "collapse",
                "& .MuiTableCell-root": {
                  borderColor: "divider"
                },
                "& .MuiTableRow-root:hover td": {
                  backgroundColor: "action.hover"
                }
              }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    rowSpan={hasCompareData ? 2 : 1}
                    sx={{
                      ...stickyCellStyles,
                      top: TABLE_HEADER_FIRST_ROW_OFFSET,
                      zIndex: 8,
                      fontWeight: 700,
                      minWidth: TABLE_STICKY_FIRST_COLUMN_WIDTH,
                      backgroundColor: "grey.100"
                    }}>
                    Category
                  </TableCell>
                  <TableCell
                    rowSpan={hasCompareData ? 2 : 1}
                    sx={{
                      ...stickySecondCellStyles,
                      top: TABLE_HEADER_FIRST_ROW_OFFSET,
                      zIndex: 8,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      minWidth: TABLE_STICKY_SECOND_COLUMN_WIDTH,
                      backgroundColor: "grey.100"
                    }}>
                    Expense Item
                  </TableCell>
                  {hasCompareData ? baseMonths.map((month) => (
                    <TableCell
                      key={`table-month-group-${month.month}`}
                      align="center"
                      colSpan={2}
                      sx={{
                        position: "sticky",
                        top: TABLE_HEADER_FIRST_ROW_OFFSET,
                        zIndex: 7,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        minWidth: 240,
                        backgroundColor: "grey.100"
                      }}>
                      {month.label}
                    </TableCell>
                  )) : baseMonths.map((month) => (
                    <TableCell
                      key={`table-month-${month.month}`}
                      align="right"
                      sx={{
                        position: "sticky",
                        top: TABLE_HEADER_FIRST_ROW_OFFSET,
                        zIndex: 7,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        minWidth: 120,
                        backgroundColor: "grey.100"
                      }}>
                      {month.label}
                    </TableCell>
                  ))}
                  <TableCell
                    rowSpan={hasCompareData ? 2 : 1}
                    align="right"
                    sx={{
                      position: "sticky",
                      top: TABLE_HEADER_FIRST_ROW_OFFSET,
                      zIndex: 7,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      minWidth: 140,
                      backgroundColor: "grey.100"
                    }}>
                    {expenseData.selectedYear} Total
                  </TableCell>
                  {hasCompareData && (
                    <TableCell
                      rowSpan={2}
                      align="right"
                      sx={{
                        position: "sticky",
                        top: TABLE_HEADER_FIRST_ROW_OFFSET,
                        zIndex: 7,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        minWidth: 140,
                        backgroundColor: "grey.100"
                      }}>
                      {expenseData.compareYear} Total
                    </TableCell>
                  )}
                  <TableCell
                    rowSpan={hasCompareData ? 2 : 1}
                    align="right"
                    sx={{
                      position: "sticky",
                      top: TABLE_HEADER_FIRST_ROW_OFFSET,
                      zIndex: 7,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      minWidth: 120,
                      backgroundColor: "grey.100"
                    }}>
                    Difference
                  </TableCell>
                </TableRow>
                {hasCompareData && (
                  <TableRow>
                    {baseMonths.map((month) => (
                      <React.Fragment key={`table-subheader-${month.month}`}>
                        <TableCell
                          align="right"
                          sx={{
                            position: "sticky",
                            top: TABLE_HEADER_SECOND_ROW_OFFSET,
                            zIndex: 6,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            minWidth: 120,
                            backgroundColor: "grey.50"
                          }}>
                          {expenseData.selectedYear}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            position: "sticky",
                            top: TABLE_HEADER_SECOND_ROW_OFFSET,
                            zIndex: 6,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            minWidth: 120,
                            backgroundColor: `${theme.palette.primary.main}`,
                            color:"white"
                          }}>
                          {expenseData.compareYear}
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                )}
              </TableHead>

              <TableBody>
                {tableRows.map((row, index) => (
                  <TableRow
                    key={row.key}
                    sx={{
                      backgroundColor: row.isSummary ? "action.hover" : "background.paper",
                      "& td": {
                        borderTopWidth: row.isSummary ? 1 : 0
                      }
                    }}>
                    <TableCell
                      sx={{
                        ...stickyCellStyles,
                        backgroundColor: row.isSummary ? "action.hover" : "background.paper",
                        fontWeight: row.isSummary ? 700 : 500
                      }}>
                      {row.isSummary && formatToTitleCase(row.parentCategory)}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...stickySecondCellStyles,
                        backgroundColor: row.isSummary ? "action.hover" : "background.paper",
                        fontWeight: row.isSummary ? 700 : 400
                      }}>
                      {row.isSummary || !row.color ? (
                        row.isSummary ? row.categoryLabel : formatToTitleCase(row.categoryLabel)
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Circle sx={{ color: row.color }} fontSize="small" />
                          <Typography>{formatToTitleCase(row.categoryLabel)}</Typography>
                        </Stack>
                      )}
                    </TableCell>
                    {baseMonths.map((month) => (
                      hasCompareData ? (
                        <React.Fragment key={`${row.key}-month-pair-${month.month}`}>
                          <TableCell align="right" sx={row.isSummary ? { fontWeight: 700 } :undefined}>
                            {formatCurrency(row.monthlyBaseAmounts[String(month.month)] ?? 0)}
                          </TableCell>
                          <TableCell align="right" sx={row.isSummary ? { fontWeight: 700 } : { backgroundColor: `${theme.palette.primary.main}10`,}}>
                            {formatCurrency(row.monthlyCompareAmounts[String(month.month)] ?? 0)}
                          </TableCell>
                        </React.Fragment>
                      ) : (
                        <TableCell key={`${row.key}-base-${month.month}`} align="right" sx={row.isSummary ? { fontWeight: 700 } : undefined}>
                          {formatCurrency(row.monthlyBaseAmounts[String(month.month)] ?? 0)}
                        </TableCell>
                      )
                    ))}
                    <TableCell align="right" sx={row.isSummary ? { fontWeight: 700 } : undefined}>
                      {formatCurrency(row.totalBaseAmount)}
                    </TableCell>
                    {hasCompareData && (
                      <TableCell align="right" sx={row.isSummary ? { fontWeight: 700 } : undefined}>
                        {formatCurrency(row.totalCompareAmount)}
                      </TableCell>
                    )}
                    <TableCell
                      align="right"
                      sx={{
                        ...(row.isSummary ? { fontWeight: 700 } : {}),
                        color: row.totalDifferenceAmount > 0 ? "error.main" : row.totalDifferenceAmount < 0 ? "success.main" : undefined
                      }}>
                      {formatCurrency(absoluteValue(row.totalDifferenceAmount))}
                    </TableCell>
                  </TableRow>
                ))}

                {!tableRows.length && (
                  <TableRow>
                    <TableCell colSpan={hasCompareData ? (baseMonths.length * 2) + 5 : baseMonths.length + 4}>
                      <Box py={3} textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                          No entries match the current search and filter.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </Stack>
  )
}

export default ExpensesReportView
