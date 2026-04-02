import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
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
import { IIncomeReport } from "@domain/entities/report/income-report.entity";
import { formatCurrency } from "@interface/presenters/helpers";

export interface IIncomeReportView {
  children?: React.ReactNode
  incomeReport: IIncomeReport | null
  selectedYear: string
  compareYear: string | null
}

type SortDirection = "asc" | "desc";
type FilterMode = "all" | "baseOnly" | "compareOnly";

interface ICompany {
  name: string;
  grossAmount: number;
  netAmount: number;
}

interface IIncomeRow {
  key: number;
  monthValue: number;
  month: string;
  baseGross: number;
  baseNet: number;
  compareGross: number;
  compareNet: number;
  allTotalGross: number;
  allTotalNet: number;
  baseCompanies: ICompany[];
  compareCompanies: ICompany[];
  isSummary: boolean;
}

interface IColumnConfig {
  id: string;
  label: string;
}

const SUMMARY_KEY = 0;

const hasRowValues = (gross: number, net: number, companies: ICompany[]) =>
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
    case "allTotalGross":
      return row.allTotalGross;
    case "allTotalNet":
      return row.allTotalNet;
    default:
      return 0;
  }
};

const renderCompanies = (companies: ICompany[]) => {
  if (!companies.length) return "-";

  return (
    <Stack spacing={0.5}>
      {companies.map((company, index) => (
        <Box key={`${company.name}-${index}`}>
          <b>{company.name}</b> - G: {formatCurrency(company.grossAmount)} | N: {formatCurrency(company.netAmount)}
        </Box>
      ))}
    </Stack>
  );
};

const buildRows = (data: IIncomeReport | null): IIncomeRow[] => {
  if (!data?.baseData?.length) return [];

  const compareDataByMonth = new Map((data.compareData ?? []).map((monthData) => [monthData.month, monthData]));

  const rows: IIncomeRow[] = data.baseData.map((baseMonth) => {
    const compareMonth = compareDataByMonth.get(baseMonth.month);
    const baseCompanies = baseMonth.companies ?? [];
    const compareCompanies = compareMonth?.companies ?? [];

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
      allTotalGross: baseGross - compareGross,
      allTotalNet: baseNet - compareNet,
      baseCompanies,
      compareCompanies,
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
    allTotalGross: rows.reduce((sum, row) => sum + row.allTotalGross, 0),
    allTotalNet: rows.reduce((sum, row) => sum + row.allTotalNet, 0),
    baseCompanies: [],
    compareCompanies: [],
    isSummary: true
  };

  return [summary, ...rows];
};

const IncomeReportView: React.FC<IIncomeReportView> = (props) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sortKey, setSortKey] = useState("baseGross");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    month: true,
    baseCompanies: true,
    baseGross: true,
    baseNet: true,
    compareCompanies: true,
    compareGross: true,
    compareNet: true,
    allTotalGross: true,
    allTotalNet: true
  });

  const rows = useMemo(() => buildRows(props.incomeReport), [props.incomeReport]);
  const hasCompareData = Boolean(props.compareYear && props.incomeReport?.compareData?.length);
  const columnOptions = useMemo<IColumnConfig[]>(() => {
    const columns: IColumnConfig[] = [
      { id: "month", label: "Month" },
      { id: "baseCompanies", label: `${props.selectedYear} Companies` },
      { id: "baseGross", label: `${props.selectedYear} Gross` },
      { id: "baseNet", label: `${props.selectedYear} Net` }
    ];

    if (props.compareYear) {
      columns.push(
        { id: "compareCompanies", label: `${props.compareYear} Companies` },
        { id: "compareGross", label: `${props.compareYear} Gross` },
        { id: "compareNet", label: `${props.compareYear} Net` }
      );
    }

    columns.push(
      { id: "allTotalGross", label: "All Total Gross" },
      { id: "allTotalNet", label: "All Total Net" }
    );

    return columns;
  }, [props.compareYear, props.selectedYear]);

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filteredRows = rows.filter((row) => {
      if (row.isSummary) {
        return true;
      }

      if (query && !row.month.toLowerCase().includes(query)) {
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
  }, [filter, rows, search, sortDirection, sortKey]);

  const toggleSort = (nextKey: string) => {
    if (sortKey === nextKey) {
      setSortDirection((currentDirection) => currentDirection === "asc" ? "desc" : "asc");
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "month" ? "asc" : "desc");
  };

  const toggleColumn = (columnId: string) => {
    setVisibleColumns((currentColumns) => ({
      ...currentColumns,
      [columnId]: !currentColumns[columnId]
    }));
  };

  const stickyCell = {
    position: "sticky" as const,
    left: 0,
    zIndex: 2,
    backgroundColor: "background.paper",
    borderRight: "1px solid",
    borderColor: "divider",
    minWidth: 160
  };

  if (!props.incomeReport?.baseData?.length) {
    return <Typography>No income data available</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <TextField
          size="small"
          label="Search month"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="income-report-filter-label">Filter</InputLabel>
          <Select
            labelId="income-report-filter-label"
            value={filter}
            label="Filter"
            onChange={(event: SelectChangeEvent<FilterMode>) => setFilter(event.target.value as FilterMode)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="baseOnly">{props.selectedYear} Only</MenuItem>
            <MenuItem value="compareOnly" disabled={!hasCompareData}>
              {props.compareYear ?? "Compare"} Only
            </MenuItem>
          </Select>
        </FormControl>
        <Paper variant="outlined" sx={{ px: 1.5, py: 0.65, width: "fit-content" }}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {columnOptions.map((column) => (
              <FormControlLabel
                key={column.id}
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    size="small"
                    sx={{ p: 0.5 }}
                    checked={visibleColumns[column.id] ?? false}
                    onChange={() => toggleColumn(column.id)}
                  />
                }
                label={column.label}
              />
            ))}
          </Stack>
        </Paper>
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: "80vh" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {visibleColumns.month && (
                <TableCell sx={stickyCell}>
                  <TableSortLabel
                    active={sortKey === "month"}
                    direction={sortDirection}
                    onClick={() => toggleSort("month")}
                  >
                    Month
                  </TableSortLabel>
                </TableCell>
              )}

              {visibleColumns.baseCompanies && <TableCell>{props.selectedYear} Companies</TableCell>}

              {visibleColumns.baseGross && (
                <TableCell align="right">
                  <TableSortLabel
                    active={sortKey === "baseGross"}
                    direction={sortDirection}
                    onClick={() => toggleSort("baseGross")}
                  >
                    Gross
                  </TableSortLabel>
                </TableCell>
              )}

              {visibleColumns.baseNet && (
                <TableCell align="right">
                  <TableSortLabel
                    active={sortKey === "baseNet"}
                    direction={sortDirection}
                    onClick={() => toggleSort("baseNet")}
                  >
                    Net
                  </TableSortLabel>
                </TableCell>
              )}

              {props.compareYear && (
                <>
                  {visibleColumns.compareCompanies && <TableCell>{props.compareYear} Companies</TableCell>}

                  {visibleColumns.compareGross && (
                    <TableCell align="right">
                      <TableSortLabel
                        active={sortKey === "compareGross"}
                        direction={sortDirection}
                        onClick={() => toggleSort("compareGross")}
                      >
                        {props.compareYear} Gross
                      </TableSortLabel>
                    </TableCell>
                  )}

                  {visibleColumns.compareNet && (
                    <TableCell align="right">
                      <TableSortLabel
                        active={sortKey === "compareNet"}
                        direction={sortDirection}
                        onClick={() => toggleSort("compareNet")}
                      >
                        {props.compareYear} Net
                      </TableSortLabel>
                    </TableCell>
                  )}
                </>
              )}

              {visibleColumns.allTotalGross && <TableCell align="right">All Total Gross</TableCell>}
              {visibleColumns.allTotalNet && <TableCell align="right">All Total Net</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                key={row.key}
                sx={{
                  backgroundColor: row.isSummary ? "action.hover" : "inherit",
                  "& td": { fontWeight: row.isSummary ? 700 : 400 }
                }}
              >
                {visibleColumns.month && <TableCell sx={stickyCell}>{row.month}</TableCell>}
                {visibleColumns.baseCompanies && <TableCell>{renderCompanies(row.baseCompanies)}</TableCell>}
                {visibleColumns.baseGross && <TableCell align="right">{formatCurrency(row.baseGross)}</TableCell>}
                {visibleColumns.baseNet && <TableCell align="right">{formatCurrency(row.baseNet)}</TableCell>}

                {props.compareYear && (
                  <>
                    {visibleColumns.compareCompanies && <TableCell>{renderCompanies(row.compareCompanies)}</TableCell>}
                    {visibleColumns.compareGross && <TableCell align="right">{formatCurrency(row.compareGross)}</TableCell>}
                    {visibleColumns.compareNet && <TableCell align="right">{formatCurrency(row.compareNet)}</TableCell>}
                  </>
                )}

                {visibleColumns.allTotalGross && <TableCell align="right">{formatCurrency(row.allTotalGross)}</TableCell>}
                {visibleColumns.allTotalNet && <TableCell align="right">{formatCurrency(row.allTotalNet)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default IncomeReportView;
