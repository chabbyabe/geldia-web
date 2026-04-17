import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { ICategoryOverview } from "@domain/entities/dashboard/category-overview.entity";
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from "echarts";
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { DateFilterContainer } from "@interface/ui/components/common/date-filter/date-filter.container";
import { ICategoryOverviewFilterParams } from "@domain/entities/dashboard/filter.entity";
import { formatCurrency } from "@interface/presenters/helpers";

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer
]);

export interface ICategoryOverviewView {
  children?: React.ReactNode
  data: ICategoryOverview[]
  onFilterChange: (params: ICategoryOverviewFilterParams) => void
  filterParams: ICategoryOverviewFilterParams
}


const donutOption = (props: ICategoryOverviewView): EChartsOption => ({
  tooltip: {
    trigger: "item",
    formatter: (params: any) => `${params.name}: ${formatCurrency(params.data.amount)}`,
  },
  legend: {
    show: true,
    bottom: 10,
    orient: 'horizontal',
    textStyle: { fontSize: 16 },
  },
  series: [
    {
      type: "pie",
      radius: ['30%', '50%'],
      center: ["50%", "30%"],
      avoidLabelOverlap: true,
      data: (props.data || [])
        .map((item) => ({
          value: item.amount,
          name: item.name,
          amount: item.amount,
          itemStyle: item.color ? { color: item.color } : undefined,
        })),
      label: {
        formatter: (params: any) => {
          return `${params.name}\n${formatCurrency(params.data.amount)}`;
        },
        overflow: 'truncate',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      }
    },
  ],
});

const CategoryOverviewView: React.FC<ICategoryOverviewView> = (props) => {
  const chartRef = useRef<ReactECharts | null>(null);

  useEffect(() => {
    const handleResize = () => {
      chartRef.current?.getEchartsInstance().resize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card sx={{ borderRadius: 4, height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Category Overview
        </Typography>
        <Box style={{ flex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <DateFilterContainer onFilterChange={props.onFilterChange} filterParams={props.filterParams} />
          </Stack>
          <ReactECharts
            ref={chartRef}
            option={donutOption(props)}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryOverviewView;