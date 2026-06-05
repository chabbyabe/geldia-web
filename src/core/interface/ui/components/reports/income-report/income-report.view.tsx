import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import { alpha, Theme, useTheme } from "@mui/material/styles";
import React, { useMemo, useState } from "react";
import { ICompanyReport, IIncomeReport } from "@domain/entities/report/income-report.entity";
import { formatCurrency, absoluteValue } from "@interface/presenters/helpers";
import { useAppSelector } from "@interface/presenters/store/hooks";
import { getColoredChipSx } from "@interface/presenters/helpers";

export interface IIncomeReportView {
  children?: React.ReactNode
  incomeReport: IIncomeReport | null
  selectedYear: string
  compareYear: string | null
}

type SortDirection = "asc" | "desc";
type FilterMode = "all" | "baseOnly" | "compareOnly";
type IncomeBasis = "allIncome" | "salaryOnly";

interface IIncomeRow {
  key: number;
  monthValue: number;
  month: string;
  baseGross: number;
  baseNet: number;
  compareGross: number;
  compareNet: number;
  differenceGross: number;
  differenceNet: number;
  baseCompanies: ICompanyReport[];
  compareCompanies: ICompanyReport[];
  currentCompanyBase: ICompanyReport | null;
  currentCompanyCompare: ICompanyReport | null;
  isSummary: boolean;
}

interface IMetricCard {
  label: string
  value: number
  tone: "primary" | "success" | "warning"
  helper: string
}

const SUMMARY_KEY = 0;

const hasRowValues = (gross: number, net: number, companies: ICompanyReport[]) =>
  gross > 0 || net > 0 || companies.length > 0;

const getValue = (row: IIncomeRow, key: string) => {
  switch (key) {
    case "month":
      return row.monthValue;
    case "baseGross":
      return row.baseGross;
    case "baseNet":
      return row.baseNet;
    case "compareGross":
      return row.compareGross;
    case "compareNet":
      return row.compareNet;
    case "differenceGross":
      return row.differenceGross;
    case "differenceNet":
      return row.differenceNet;
    default:
      return 0;
  }
};

const findCompany = (companies: ICompanyReport[], currentCompanyName: string | null) => {
  if (!currentCompanyName) return null;

  return companies.find((company) => company.name.toLowerCase() === currentCompanyName.toLowerCase()) ?? null;
};

const buildRows = (data: IIncomeReport | null, currentCompanyName: string | null): IIncomeRow[] => {
  if (!data?.baseData?.length) return [];

  const compareDataByMonth = new Map((data.compareData ?? []).map((monthData) => [monthData.month, monthData]));

  const rows: IIncomeRow[] = data.baseData.map((baseMonth) => {
    const compareMonth = compareDataByMonth.get(baseMonth.month);
    const baseCompanies = baseMonth.companies ?? [];
    const compareCompanies = compareMonth?.companies ?? [];
    const currentCompanyBase = findCompany(baseCompanies, currentCompanyName);
    const currentCompanyCompare = findCompany(compareCompanies, currentCompanyName);

    const baseGross = baseMonth.grossAmount ?? 0;
    const baseNet = baseMonth.netAmount ?? 0;
    const compareGross = compareMonth?.grossAmount ?? 0;
    const compareNet = compareMonth?.netAmount ?? 0;

    return {
      key: baseMonth.month,
      monthValue: baseMonth.month,
      month: baseMonth.monthLabel,
      baseGross,
      baseNet,
      compareGross,
      compareNet,
      differenceGross: baseGross - compareGross,
      differenceNet: baseNet - compareNet,
      baseCompanies,
      compareCompanies,
      currentCompanyBase,
      currentCompanyCompare,
      isSummary: false
    };
  });

  const summary: IIncomeRow = {
    key: SUMMARY_KEY,
    monthValue: SUMMARY_KEY,
    month: "Total",
    baseGross: rows.reduce((sum, row) => sum + row.baseGross, 0),
    baseNet: rows.reduce((sum, row) => sum + row.baseNet, 0),
    compareGross: rows.reduce((sum, row) => sum + row.compareGross, 0),
    compareNet: rows.reduce((sum, row) => sum + row.compareNet, 0),
    differenceGross: rows.reduce((sum, row) => sum + row.differenceGross, 0),
    differenceNet: rows.reduce((sum, row) => sum + row.differenceNet, 0),
    baseCompanies: [],
    compareCompanies: [],
    currentCompanyBase: {
      name: currentCompanyName ?? "Current Company",
      categoryName: currentCompanyName ?? "-",
      categoryColor: currentCompanyName ?? "Current Company",
      grossAmount: rows.reduce((sum, row) => sum + (row.currentCompanyBase?.grossAmount ?? 0), 0),
      netAmount: rows.reduce((sum, row) => sum + (row.currentCompanyBase?.netAmount ?? 0), 0)
    },
    currentCompanyCompare: {
      name: currentCompanyName ?? "Current Company",
      categoryName: currentCompanyName ?? "-",
      categoryColor: currentCompanyName ?? "Current Company",
      grossAmount: rows.reduce((sum, row) => sum + (row.currentCompanyCompare?.grossAmount ?? 0), 0),
      netAmount: rows.reduce((sum, row) => sum + (row.currentCompanyCompare?.netAmount ?? 0), 0)
    },
    isSummary: true
  };

  return [summary, ...rows];
};

const formatPercentage = (value: number) => `${value.toFixed(0)}%`;

const renderCompanyList = (companies: ICompanyReport[], theme: Theme) => {
  if (!companies.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No company records
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {companies.map((company, index) => (
        <Paper
          key={`${company.name}-${index}`}
          variant="outlined"
          sx={{
            p: 1.25,
            borderRadius: 2,
            background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.12)}, ${alpha(theme.palette.background.paper, 0.95)})`
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={0.75}
          >
            <Stack direction="row" justifyContent="start" alignItems="center" gap={2} > 
              <Typography fontWeight={500}>{company.name}</Typography>
              <Chip size="small" sx={getColoredChipSx(company.categoryColor)} label={`${company.categoryName}`} />
            </Stack>
            <Stack direction="row" justifyContent="start" alignItems="center" gap={1} flexWrap="wrap">
              { company.grossAmount > 0 && <Chip size="small" label={`Gross: ${formatCurrency(company.grossAmount)}`} />}
              <Typography fontWeight={700}> {`${formatCurrency(company.netAmount)}`}</Typography>
            </Stack>

          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

const IncomeReportView: React.FC<IIncomeReportView> = (props) => {
  const theme = useTheme();
  const currentUser = useAppSelector((state) => state.authState.user);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [basis, setBasis] = useState<IncomeBasis>("allIncome");
  const [sortKey, setSortKey] = useState("baseNet");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const currentCompanyName = currentUser?.company?.name ?? null;

  const rows = useMemo(
    () => buildRows(props.incomeReport, currentCompanyName),
    [currentCompanyName, props.incomeReport]
  );
  const hasCompareData = Boolean(props.compareYear && props.incomeReport?.compareData?.length);
  const totalCompanyCount = useMemo(
    () => new Set(
      rows
        .flatMap((row) => row.baseCompanies.map((company) => company.name))
        .filter(Boolean)
    ).size,
    [rows]
  );

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filteredRows = rows.filter((row) => {
      if (row.isSummary) {
        return true;
      }

      const currentCompanyMatches = row.currentCompanyBase?.name.toLowerCase().includes(query)
        || row.currentCompanyCompare?.name.toLowerCase().includes(query);
      const anyCompanyMatches = row.baseCompanies.some((company) => company.name.toLowerCase().includes(query))
        || row.compareCompanies.some((company) => company.name.toLowerCase().includes(query));

      if (query && !row.month.toLowerCase().includes(query) && !currentCompanyMatches && !anyCompanyMatches) {
        return false;
      }

      if (filter === "baseOnly") {
        return hasRowValues(row.baseGross, row.baseNet, row.baseCompanies);
      }

      if (filter === "compareOnly") {
        return hasRowValues(row.compareGross, row.compareNet, row.compareCompanies);
      }

      return true;
    });

    const [summaryRow, ...dataRows] = filteredRows;
    const sortedRows = [...dataRows].sort((left, right) => {
      const directionFactor = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "month") {
        return directionFactor * (left.monthValue - right.monthValue);
      }

      return directionFactor * (getValue(left, sortKey) - getValue(right, sortKey));
    });

    return summaryRow ? [summaryRow, ...sortedRows] : sortedRows;
  }, [basis, filter, rows, search, sortDirection, sortKey]);

  const summaryRow = visibleRows[0] ?? null;

  const metricCards = useMemo<IMetricCard[]>(() => {
    if (!summaryRow) return [];

    if (basis === "salaryOnly") {
      const deductions = summaryRow.baseGross - summaryRow.baseNet;
      const compareDeductions = summaryRow.compareGross - summaryRow.compareNet;

      return [
        {
          label: "Gross salary",
          value: summaryRow.baseGross,
          tone: "primary",
          helper: hasCompareData ? `${props.compareYear}: ${formatCurrency(summaryRow.compareGross)}` : "Before taxes and deductions"
        },
        {
          label: "Net salary",
          value: summaryRow.baseNet,
          tone: "success",
          helper: hasCompareData ? `${props.compareYear}: ${formatCurrency(summaryRow.compareNet)}` : "After deductions"
        },
        {
          label: "Deductions",
          value: deductions,
          tone: "warning",
          helper: hasCompareData ? `${props.compareYear}: ${formatCurrency(compareDeductions)}` : "Gross minus net"
        }
      ];
    }

    return [
      {
        label: "Gross income",
        value: summaryRow.baseGross,
        tone: "primary",
        helper: hasCompareData ? `${props.compareYear}: ${formatCurrency(summaryRow.compareGross)}` : `${totalCompanyCount} source${totalCompanyCount === 1 ? "" : "s"}`
      },
      {
        label: "Net income",
        value: summaryRow.baseNet,
        tone: "success",
        helper: hasCompareData ? `${props.compareYear}: ${formatCurrency(summaryRow.compareNet)}` : "Take-home income"
      },
      {
        label: "Net change",
        value: summaryRow.differenceNet,
        tone: "warning",
        helper: hasCompareData ? `${props.selectedYear} vs ${props.compareYear}` : "Compared with selected comparison period"
      }
    ];
  }, [basis, currentCompanyName, hasCompareData, props.compareYear, props.selectedYear, summaryRow, totalCompanyCount]);

  const toggleSort = (nextKey: string) => {
    if (sortKey === nextKey) {
      setSortDirection((currentDirection) => currentDirection === "asc" ? "desc" : "asc");
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "month" ? "asc" : "desc");
  };

  if (!props.incomeReport?.baseData?.length) {
    return <Typography>No income data available.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          background: "background.paper",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`
        }}
      >
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
            gap={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Income Report
              </Typography>
            </Box>
            <ToggleButtonGroup
              exclusive
              value={basis}
              onChange={(_, value: IncomeBasis | null) => value && setBasis(value)}
              sx={{
                flexWrap: "wrap",
                "& .MuiToggleButton-root": {
                  borderRadius: 999,
                  px: 2,
                  py: 0.9,
                  textTransform: "none",
                  fontWeight: 700
                }
              }}
            >
              <ToggleButton value="allIncome">All income</ToggleButton>
              <ToggleButton value="salaryOnly">My Salary</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Grid container spacing={2}>
            {metricCards.map((card, index) => {
              const isLast = index === metricCards.length - 1;
              const toneColor = card.tone === "primary"
                ? theme.palette.primary.main
                : card.tone === "success"
                  ? theme.palette.success.main
                  : theme.palette.warning.main;
              const isPercent = card.label === "Share of all income";

              return (
                <Grid key={card.label} size={{ xs: 12, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      background: `linear-gradient(180deg, ${alpha(toneColor, 0.18)}, ${alpha(theme.palette.background.paper, 0.96)})`,
                      color : isLast ? card.value >= 0 ? "success.main" : "error.main" : "inherit",
                      border: `1px solid ${alpha(toneColor, 0.2)}`
                    }}
                  >
                    <CardContent>
                      <Typography variant="overline" sx={{ color: toneColor, fontWeight: 800 }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h4" fontWeight={800} sx={{ my: 1 }}>
                        {isPercent ? formatPercentage(absoluteValue(card.value)) : formatCurrency(absoluteValue(card.value))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.helper}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Box>

      <Stack direction={{ xs: "column", xl: "row" }} gap={2}>
        <Stack direction="row" gap={2} flexWrap="wrap" flex={1}>
          <TextField
            size="small"
            label="Search month or company"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ minWidth: 220 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="income-report-filter-label">Visibility</InputLabel>
            <Select
              labelId="income-report-filter-label"
              value={filter}
              label="Visibility"
              onChange={(event: SelectChangeEvent<FilterMode>) => setFilter(event.target.value as FilterMode)}
            >
              <MenuItem value="all">All rows</MenuItem>
              <MenuItem value="baseOnly">{props.selectedYear} only</MenuItem>
              <MenuItem value="compareOnly" disabled={!hasCompareData}>
                {props.compareYear ?? "Compare"} only
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>


      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 110 }}>
                <TableSortLabel
                  active={sortKey === "month"}
                  direction={sortDirection}
                  onClick={() => toggleSort("month")}
                >
                  Month
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ minWidth: 280 }}>
                {basis === "salaryOnly" ? "Salary reading" : "Income sources"}
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortKey === "baseGross"}
                  direction={sortDirection}
                  onClick={() => toggleSort("baseGross")}
                >
                  {props.selectedYear} Gross
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortKey === "baseNet"}
                  direction={sortDirection}
                  onClick={() => toggleSort("baseNet")}
                >
                  {props.selectedYear} Net
                </TableSortLabel>
              </TableCell>
              {props.compareYear && (
                <>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortKey === "compareGross"}
                      direction={sortDirection}
                      onClick={() => toggleSort("compareGross")}
                    >
                      {props.compareYear} Gross
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortKey === "compareNet"}
                      direction={sortDirection}
                      onClick={() => toggleSort("compareNet")}
                    >
                      {props.compareYear} Net
                    </TableSortLabel>
                  </TableCell>
                </>
              )}
              <TableCell align="right">Net Difference</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => {
              const displayedBaseGross = row.baseGross;
              const displayedBaseNet =  row.baseNet;
              const displayedCompareGross = row.compareGross;
              const displayedCompareNet = row.compareNet;
              const displayedDifferenceNet = displayedBaseNet - displayedCompareNet;
              const differenceColor = displayedDifferenceNet > 0
                ? "success.main"
                : displayedDifferenceNet < 0
                  ? "error.main"
                  : "text.primary";
              const deductionAmount = row.baseGross - row.baseNet;
              const takeHomeRate = row.baseGross > 0 ? (row.baseNet / row.baseGross) * 100 : 0;

              return (
                <TableRow
                  key={row.key}
                  sx={{
                    backgroundColor: row.isSummary ? alpha(theme.palette.primary.main, 0.06) : "inherit",
                    "& td": { fontWeight: row.isSummary ? 700 : 400, verticalAlign: "top", fontWidth: 700 }
                  }}
                >
                  <TableCell>{row.month}</TableCell>
                  <TableCell>
                    {basis === "salaryOnly" && (
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        <Chip label={`Gross ${formatCurrency(row.baseGross)}`} />
                        <Chip color="success" label={`Net ${formatCurrency(row.baseNet)}`} />
                        <Chip variant="outlined" label={`Take-home ${formatPercentage(takeHomeRate)}`} />
                      </Stack>
                    )}

                    {basis === "allIncome" && renderCompanyList(row.baseCompanies, theme)}
                  </TableCell>
                  <TableCell align="right">{formatCurrency(displayedBaseGross)}</TableCell>
                  <TableCell align="right">{formatCurrency(displayedBaseNet)}</TableCell>
                  {props.compareYear && (
                    <>
                      <TableCell align="right" color={alpha(theme.palette.primary.light, 0.12)}>{formatCurrency(displayedCompareGross)}</TableCell>
                      <TableCell align="right">{formatCurrency(absoluteValue(displayedCompareNet))}</TableCell>
                    </>
                  )}
                  <TableCell align="right" sx={{ color: differenceColor, fontWeight: 700 }}>
                    {formatCurrency(absoluteValue(displayedDifferenceNet))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default IncomeReportView;
