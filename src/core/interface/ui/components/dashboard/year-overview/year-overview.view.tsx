
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
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
}

const YearOverviewView: React.FC<IYearOverviewView> = (props) => {
  const theme = useTheme();
  const dataAvailable = props.data && props.data.length > 0;
  const months = dataAvailable ? props.data[0].label : [];
  const year = dataAvailable ? props.data[0].year : dayjs().format("YYYY");
  const incomeName = TRANSACTION_TYPE.INCOME.name;
  const expensesName = TRANSACTION_TYPE.EXPENSES.name;

  const incomeData = dataAvailable
    ? props.data.find((d) => d.name === incomeName)?.data || []
    : [];
  const expensesData = dataAvailable
    ? props.data.find((d) => d.name === expensesName)?.data || []
    : [];

  const barOption: EChartsOption = {
    tooltip: { trigger: "axis" },
    legend: { data: [incomeName, expensesName] },
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
        name: incomeName,
        type: "bar",
        data: incomeData,
        itemStyle: { color:  theme.palette.primary.main },
      },
      {
        name: expensesName,
        type: "bar",
        data: expensesData,
        itemStyle: { color: theme.palette.error.main },
      },
    ],
  };

  useEffect(() => {
    fetchData(dayjs().year().toString());
  }, []);

  const [selectedYear, setSelectedYear] = useState<string>(dayjs().year().toString());

  // Get 3 previous, current, 3 future years
  const years = Array.from({ length: 7 }, (_, i) => dayjs().year() - 3 + i);

  const handleChange = async (event: SelectChangeEvent<string>) => {
    setSelectedYear(event.target.value);
    await fetchData(event.target.value);
  };

  const fetchData = async (filterYear: string) => {
    try {
      await props.onFilterChange({ "year" : filterYear});
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

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