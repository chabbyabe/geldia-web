
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { type EChartsOption } from "echarts";
import { TRANSACTION_TYPE } from "@data/gateways/api/constants";
import dayjs from "dayjs";
import { IYearOverview } from "@domain/entities/dashboard/year-overview.entity";
import { IYearOverviewFilterParams } from "@domain/entities/dashboard/filter.entity";
import { getYearRange } from "@interface/presenters/helpers";

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer
]);

export interface IYearOverviewView {
  children?: React.ReactNode
  data: IYearOverview[]
  onFilterChange: (filterParams: IYearOverviewFilterParams) => void
  filterParams: IYearOverviewFilterParams
}

const YearOverviewView: React.FC<IYearOverviewView> = (props) => {
  const theme = useTheme();
  const incomeName = TRANSACTION_TYPE.INCOME.name;
  const expensesName = TRANSACTION_TYPE.EXPENSES.name;
  const [selectedYear, setSelectedYear] = useState(props.filterParams.year);
  const years = getYearRange();

  const { months, year, incomeNetData, incomeGrossData, expensesData } = useMemo(() => {
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
    const incomeNet = [];
    const incomeGross = [];
    const expenses = [];
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

  const barOption: EChartsOption = useMemo(() => {
    return {
      tooltip: { trigger: "axis" },
      legend: {
        data: [
          `${incomeName} (Net)`,
          `${incomeName} (Gross)`,
          expensesName,
        ],
      },
      xAxis: {
        type: "category",
        data: months,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value) => `€${value.toLocaleString()}`,
        },
      },
      series: [
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
    };
  }, [
    incomeName,
    expensesName,
    months,
    incomeNetData,
    incomeGrossData,
    expensesData,
    theme,
  ]);

  const handleChange = async (event: SelectChangeEvent<string>) => {
    setSelectedYear(event.target.value);
    await fetchData(event.target.value);
  };

  const fetchData = async (filterYear: string) => {
    try {
      await props.onFilterChange({ "year": filterYear });
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [])
  return (
    <>
      <Card sx={{ borderRadius: 4, flex: 1, sm: 12, md: 9, minWidth: 350, maxWidth: 1400, width: "100%", mt: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mx={1}>
            <Typography variant="h6" fontWeight="bold">
              {year} Year: Income - Expenses
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Year</InputLabel>
              <Select value={selectedYear} label="Year" onChange={handleChange}>
                {years.map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <ReactECharts option={barOption} style={{ height: 400 }} />
        </CardContent>
      </Card>
    </>
  );
};
export default YearOverviewView;