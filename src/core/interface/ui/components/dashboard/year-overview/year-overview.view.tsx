import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption, BarSeriesOption } from "echarts";

import { TRANSACTION_TYPE } from "@data/gateways/api/constants";
import dayjs from "dayjs";
import {
  IYearOverview,
} from "@domain/entities/dashboard/year-overview.entity";
import {
  IYearOverviewFilterParams,
} from "@domain/entities/dashboard/filter.entity";
import { formatCurrency, getYearRange } from "@interface/presenters/helpers";

echarts.use([
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);

export interface IYearOverviewView {
  children?: React.ReactNode;
  data: IYearOverview[];
  onFilterChange: (filterParams: IYearOverviewFilterParams) => void;
  filterParams: IYearOverviewFilterParams;
}

const YearOverviewView: React.FC<IYearOverviewView> = (props) => {
  const theme = useTheme();

  const incomeName = TRANSACTION_TYPE.INCOME.name;
  const expensesName = TRANSACTION_TYPE.EXPENSES.name;

  const years = useMemo(() => getYearRange(), []);

  const [selectedYear, setSelectedYear] = useState(props.filterParams.year ?? dayjs().year().toString());

  const currencyFormatter = useCallback(
    (value: any) => formatCurrency(value),
    []
  );

  const { months, year, incomeNetData, incomeGrossData, expensesData } =
    useMemo(() => {
      if (!props.data?.length) {
        return {
          months: [],
          year: dayjs().format("YYYY"),
          incomeNetData: [],
          incomeGrossData: [],
          expensesData: [],
        };
      }

      const first = props.data[0];

      const incomeNet: number[] = [];
      const incomeGross: number[] = [];
      const expenses: number[] = [];

      for (const item of props.data) {
        if (item.name === incomeName && !item.isGross) {
          incomeNet.push(...item.data);
        } else if (item.name === incomeName && item.isGross) {
          incomeGross.push(...item.data);
        } else if (item.name === expensesName) {
          expenses.push(...item.data);
        }
      }

      return {
        months: first.label ?? [],
        year: first.year ?? dayjs().format("YYYY"),
        incomeNetData: incomeNet,
        incomeGrossData: incomeGross,
        expensesData: expenses,
      };
    }, [props.data, incomeName, expensesName]);

  const series = useMemo<BarSeriesOption[]>(
    () => [
      {
        name: `${incomeName} (Net)`,
        type: "bar",
        data: incomeNetData,
        itemStyle: { color: theme.palette.primary.main },
      },
      {
        name: `${incomeName} (Gross)`,
        type: "bar",
        data: incomeGrossData,
        itemStyle: { color: theme.palette.success.main },
      },
      {
        name: expensesName,
        type: "bar",
        data: expensesData,
        itemStyle: { color: theme.palette.error.main },
      },
    ],
    [
      incomeName,
      expensesName,
      incomeNetData,
      incomeGrossData,
      expensesData,
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.error.main,
    ]
  );

  // -----------------------------
  // ECharts option
  // -----------------------------
  const barOption: EChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: "axis" ,
        valueFormatter: currencyFormatter,
      },
      legend: {
        data: [
          `${incomeName} (Net)`,
          `${incomeName} (Gross)`,
          expensesName,
        ],
      },
      grid: {
        bottom: "12%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: months,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: currencyFormatter,
        },
      },
      series,
    };
  }, [
    currencyFormatter,
    incomeName,
    expensesName,
    months,
    series,
  ]);

  // -----------------------------
  // Actions
  // -----------------------------
  const fetchData = useCallback(
    async (filterYear: string) => {
      try {
        await props.onFilterChange({ year: filterYear });
      } catch (err) {
        console.error(err);
      }
    },
    [props]
  );

  const handleChange = async (event: SelectChangeEvent<string>) => {
    const year = event.target.value;
    setSelectedYear(year);
    await fetchData(year);
  };

  useEffect(() => {
    setSelectedYear(props.filterParams.year);
  }, [props.filterParams.year]);

  useEffect(() => {
    fetchData(selectedYear);
  }, []);

  return (
    <Card
      sx={{
        borderRadius: 4,
        flex: 1,
        minWidth: 350,
        maxWidth: 1400,
        width: "100%",
        mt: 2,
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mx={1}>
          <Typography variant="h6" fontWeight="bold">
            {year} Year: Income - Expenses
          </Typography>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} label="Year" onChange={handleChange}>
              {years.map((y) => (
                <MenuItem key={y} value={y.toString()}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <ReactECharts option={barOption} style={{ height: 400 }} />
      </CardContent>
    </Card>
  );
};

export default YearOverviewView;