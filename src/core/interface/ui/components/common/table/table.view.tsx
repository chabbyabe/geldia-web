import { IBasePagedListEntity } from "@base/core/domain/entities/base/base.paged.entity";
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridFilterModel, GridSortModel, GridToolbarProps } from "@mui/x-data-grid";
import { Box, Button, Pagination, Stack, TextField, Menu, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import { Add } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import { Toolbar, ColumnsPanelTrigger, FilterPanelTrigger, ExportCsv, ExportPrint } from '@mui/x-data-grid';
import { ToolbarButton } from '@mui/x-data-grid';
import {
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { DATE_RANGES } from "@data/gateways/api/constants";

export interface ICustomTableViewModel<T = any, P = any> {
  children?: React.ReactNode
  tableData: T[]
  pagination: IBasePagedListEntity
  tableColumns: GridColDef[],
  handlePagination: (params: P) => Promise<void>
  handleFormModal: (value: boolean) => void
  buttonName: string
  disableColumnSelector: boolean
  invisibleColumns: GridColumnVisibilityModel
  hideAddButton?: boolean
  hideFilter?: boolean
  reloadKey?: number
}

type RowWithId = { id: string | number };

interface CustomToolbarProps extends GridToolbarProps {
  loading?: boolean;
  disableColumnSelector?: boolean
}

const CustomToolbarWithoutSearch: React.FC<CustomToolbarProps> =
  React.memo((props) => {
    const { loading } = props;

    const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(undefined);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(undefined);
    };

    return (
      <Toolbar>
        {props.disableColumnSelector &&
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ViewColumnIcon fontSize="small" />
          </ColumnsPanelTrigger>
        }
        <FilterPanelTrigger
          render={(triggerProps: any) => (
            <ToolbarButton
              {...triggerProps}
              disabled={loading}
            >
              <FilterListIcon fontSize="small" />
            </ToolbarButton>
          )}
        />

        <ToolbarButton onClick={handleOpen}>
          <FileDownloadIcon fontSize="small" />
        </ToolbarButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <ExportPrint render={<MenuItem />} onClick={handleClose}>
            Print
          </ExportPrint>
          <ExportCsv render={<MenuItem />} onClick={handleClose}>
            Download as CSV
          </ExportCsv>
        </Menu>
      </Toolbar>
    );
  });

const CustomTablePagination: React.FC<any> = function (footer: any) {
  const { pagination, onChangePage } = footer;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 2,
      }}
    >
      <Pagination
        count={pagination.totalPages}
        page={pagination.currentPageNumber}
        onChange={onChangePage}
        color="primary"
        size="large"
        variant="outlined"
        shape="rounded"
      />
    </Box>
  );
}

export const CustomTableView = <T extends RowWithId, P extends any>(props: ICustomTableViewModel<T, P>) => {
  const {
    children,
    tableData,
    pagination,
    tableColumns,
    handlePagination,
    handleFormModal,
    buttonName,
    disableColumnSelector,
    invisibleColumns,
    hideAddButton,
    hideFilter,
    reloadKey,
  } = props;
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [filterDate, setFilterDate] = useState<string>(DATE_RANGES.MONTH);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const gridRootRef = React.useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async (page?: number) => {
    setLoading(true);
    try {
      const ordering =
        sortModel.length > 0
          ? `${sortModel[0].sort === 'desc' ? '-' : ''}${sortModel[0].field}`
          : '';
      await handlePagination({
        page: page,
        search: searchText,
        ordering: ordering,
        filterModel: JSON.stringify(filterModel),
        filterDate: filterDate,
        startDate: startDate?.format("YYYY-MM-DD") ?? '',
        endDate: endDate?.format("YYYY-MM-DD") ?? '',
      } as P);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    endDate,
    filterDate,
    filterModel,
    handlePagination,
    searchText,
    sortModel,
    startDate,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData, reloadKey]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const onChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchData(page);
  };

  const onChangeDate = (value: string, start?: Dayjs | null, end?: Dayjs | null) => {
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
  };

  const onChangeSelect = (event: SelectChangeEvent<string>) => {
    onChangeDate(event.target.value);
  };

  return (
    <Stack ref={gridRootRef}>
      <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" gap={2} flexWrap="wrap">
          {!hideAddButton ? (
            <Button
              onClick={() => handleFormModal?.(true)}
              variant="contained"
              startIcon={<Add />}
              size="large"
            >
              {"Add " + buttonName}
            </Button>
          ) : null}
          {children}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          {!hideFilter ?
            <>
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
            </>
          : null}
          <TextField
            label="Search"
            variant="outlined"
            value={searchText}
            size="small"
            onChange={handleSearch}
          />
        </Stack>
      </Stack>

      <Box sx={{ height: "80vh", width: '100%' }}>
        <DataGrid
          rows={tableData ?? []}
          columns={tableColumns}
          getRowId={(row) => row.id}
          rowCount={pagination?.count ?? 0}
          columnVisibilityModel={{ ...invisibleColumns }}
          disableColumnSelector={disableColumnSelector}
          getRowHeight={() => "auto"}
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel?.(model)}
          onFilterModelChange={(model) => setFilterModel?.(model)}
          loading={loading}
          disableRowSelectionOnClick
          hideFooterPagination
          onRowClick={(params, event) => event.defaultMuiPrevented = true}
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
          slots={{
            footer: () => (
              <CustomTablePagination
                pagination={pagination}
                onChangePage={onChangePage}
              />
            ),
            toolbar: CustomToolbarWithoutSearch,
          }}
          showToolbar
        />
      </Box>
    </Stack>
  );
}
