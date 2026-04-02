import { PAGES } from '@interface/presenters/constants';
import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
import { Button, Typography, Select, MenuItem, SelectChangeEvent, Grid, Checkbox } from '@mui/material';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getYearRange } from '@core/interface/presenters/helpers';
import { FileDownload } from '@mui/icons-material';
import { TabsContainer } from '@interface/ui/components/reports/tab-table/tab-table.container';
import { ITab } from '@interface/ui/components/reports/tab-table/tab-table.view';
import { IIncomeReport } from '@domain/entities/report/income-report.entity';
import { useAppSelector } from '@base/core/interface/presenters/store/hooks';

export interface IReportsViewModel {
  children?: React.ReactNode
  incomeReport: IIncomeReport | null
  exportReport: (options: {
    reportName: string
    selectedYear: string
    compareYear?: string
    enableComparison?: boolean
    rows: Record<string, string | number | boolean | null | undefined>[]
  }) => void
}

export const reportTabs: ITab[] = [
  { id: 1, label: 'Income' },
  { id: 2, label: 'Expenses' },
];
const baseYears = getYearRange();

const ReportsView: React.FC<IReportsViewModel> = (props) => {
  const [compareYear, setCompareYear] = useState<string>(dayjs().subtract(1, "year").year().toString());
  const [selectedYear, setSelectedYear] = useState<string>(dayjs().year().toString());
  const [enableComparison, setEnableComparison] = useState(false);
  const reportTab = useAppSelector(state => state.reportState.reportTab);

  // Get 3 previous, current, 3 future years
  const selected = Number(selectedYear);
  // all years less than selected year
  const compareYearsBase = baseYears.filter((y) => y < selected);
  // if selected is first year, extend by 1 extra year before
  const isFirstYear = selected === baseYears[0];
  const compareYears = isFirstYear
    ? [selected - 1, ...compareYearsBase]
    : compareYearsBase;

  useEffect(() => {
    setCompareYear(String(Number(selectedYear) - 1));
  }, [selectedYear]);

  const handleYearChange = async (event: SelectChangeEvent<string>, isCurrent: boolean) => {
    if (isCurrent) {
      return setSelectedYear(event.target.value);
    }
    setCompareYear(event.target.value);
  };

  const handleExport = () => {
    const rows = (props.incomeReport?.baseData ?? []).flatMap((month) => {
      if (!month.companies.length) {
        return [{
          month: month.monthLabel,
          company: '-',
          grossAmount: month.grossAmount,
          netAmount: month.netAmount
        }];
      }

      return month.companies.map((company) => ({
        month: month.monthLabel,
        company: company.name,
        grossAmount: company.grossAmount,
        netAmount: company.netAmount
      }));
    });

    props.exportReport({
      reportName: 'Income',
      selectedYear,
      compareYear,
      enableComparison,
      rows
    });
  };

  return (
    <BaseLayoutContainer currentPage={PAGES.REPORTS.label}>
      <Grid container flexDirection="column" gap={1} >
        <Grid container flexDirection="row" alignItems="center" justifyContent="space-between">
          <Grid container flexDirection="row" alignItems="center">
            <Typography variant="body1" sx={{ mr: 1 }}> Summary for the year: </Typography>
            <Select
              size="small"
              value={selectedYear}
              onChange={(event) => handleYearChange(event, true)}
              sx={{ minWidth: 150 }}>
              {baseYears.map((year) => (
                (!enableComparison || year > parseInt(compareYear)) && (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                )
              ))}
            </Select>
          </Grid>
          {reportTab === 0 && <Button variant="contained" startIcon={<FileDownload />} onClick={handleExport}>Export</Button>}
        </Grid>
        <Grid container flexDirection="row" alignItems="center">
          <Checkbox
            checked={enableComparison}
            onChange={(e) => setEnableComparison(e.target.checked)}
          />
          <Typography> Enable Year Comparison </Typography>
          {enableComparison && (
            <Grid container flexDirection="row" alignItems="center">
              <Select
                size="small"
                value={compareYear}
                onChange={(event) => handleYearChange(event, false)}
                sx={{ minWidth: 150, ml: 1 }}>
                {compareYears.map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              <Typography sx={{ mx: 1 }}> and </Typography>
              <Typography sx={{ fontWeight: "bold" }}> {selectedYear} </Typography>
            </Grid>
          )}
        </Grid>

        <TabsContainer
          tabs={reportTabs}
          selectedYear={selectedYear}
          compareYear={enableComparison ? compareYear : null}
        />
      </Grid>
    </BaseLayoutContainer >
  )
}

export default ReportsView
