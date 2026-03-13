import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import React, { useState } from "react";
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import dayjs, { Dayjs } from "dayjs";
import { DATE_RANGES } from "@data/gateways/api/constants";
import { DatePicker } from "@mui/x-date-pickers";

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer
]);

export interface IDateFilterView<T = any, P = any> {
  children?: React.ReactNode
  onFilterChange: (params: T) => void
  filterParams: P
}

const DateFilterView = <T, P>(props: IDateFilterView<T, P>) => {
  const [filterDate, setFilterDate] = useState<string>(DATE_RANGES.MONTH);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [loading, setLoading] = useState(false);

  const onChangeDate = async (value: string, start?: Dayjs | null, end?: Dayjs | null) => {
    setFilterDate(value);

    const now = dayjs();
    let newStart: Dayjs | null = null;
    let newEnd: Dayjs | null = null;

    switch (value) {
      case DATE_RANGES.WEEK:
        newStart = now.startOf("week");
        newEnd = now.endOf("week");
        break;
      case DATE_RANGES.MONTH:
        newStart = now.startOf("month");
        newEnd = now.endOf("month");
        break;
      case DATE_RANGES.YEAR:
        newStart = now.startOf("year");
        newEnd = now.endOf("year");
        break;
      case DATE_RANGES.CUSTOM:
        newStart = start ?? now.subtract(1, "month").startOf("month");
        newEnd = end ?? now.endOf("month");
        break;
    }

    setStartDate(newStart);
    setEndDate(newEnd);
    await fetchData(value, newStart, newEnd);
  };

  const fetchData = async (filterBy: string, start: Dayjs | null, end: Dayjs | null) => {
    setLoading(true);
    try {
      const startDate = start?.format("YYYY-MM-DD");
      const endDate = end?.format("YYYY-MM-DD");
      await props.onFilterChange({ filterBy, startDate, endDate } as T);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onChangeSelect = async (event: SelectChangeEvent<string>) => {
    await onChangeDate(event.target.value);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Filter</InputLabel>
        <Select
          value={filterDate}
          label="Filter"
          onChange={onChangeSelect}>
          <MenuItem value={DATE_RANGES.WEEK}>Current {DATE_RANGES.WEEK}</MenuItem>
          <MenuItem value={DATE_RANGES.MONTH}>Current {DATE_RANGES.MONTH}</MenuItem>
          <MenuItem value={DATE_RANGES.YEAR}>Current {DATE_RANGES.YEAR}</MenuItem>
          <MenuItem value={DATE_RANGES.CUSTOM}>{DATE_RANGES.CUSTOM}</MenuItem>
        </Select>
      </FormControl>

      {filterDate === DATE_RANGES.CUSTOM && (
        <Stack direction="row" spacing={2} mb={2}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue: Dayjs | null | undefined) => {
              const safeValue = newValue ?? null;
              onChangeDate?.(DATE_RANGES.CUSTOM, safeValue, endDate);
            }}
            slotProps={{ textField: { size: "small", sx: { width: 180 } } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue: Dayjs | null | undefined) => {
              onChangeDate?.(DATE_RANGES.CUSTOM, startDate, newValue);
            }}
            slotProps={{ textField: { size: "small", sx: { width: 180 } } }}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default DateFilterView;