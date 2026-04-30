import React from 'react';
import { GridColDef, GridColumnVisibilityModel,
} from '@mui/x-data-grid';
import { IBasePagedListEntity } from '@domain/entities/base/base.paged.entity';
import { CustomTableView } from './table.view';
import pluralize from "pluralize";

export interface ICustomTableContainer<T = any, P = any> {
  children?: React.ReactNode
  tableData: T[]
  pagination: IBasePagedListEntity
  tableColumns: GridColDef[]
  handlePagination: (params: P) => Promise<void>
  handleFormModal: (value: boolean) => void,
  buttonName: string
  disableColumnSelector?: boolean
  invisibleColumns?: GridColumnVisibilityModel
  hideAddButton?: boolean
  hideFilter?: boolean
  reloadKey?: number
}

type RowWithId = { id: string | number };
export const CustomTableContainer = <T extends RowWithId, P extends any>(props: ICustomTableContainer<T, P>) => {
  return (
    <CustomTableView
      children={props.children}
      tableData={props.tableData}
      pagination={props.pagination}
      tableColumns={props.tableColumns}
      handlePagination={props.handlePagination}
      handleFormModal={props.handleFormModal ?? undefined}
      buttonName={pluralize.singular(props.buttonName)}
      disableColumnSelector={props.disableColumnSelector ?? false}
      invisibleColumns={props.invisibleColumns ?? {}}
      hideAddButton={props.hideAddButton ?? false}
      hideFilter={props.hideFilter ?? false}
      reloadKey={props.reloadKey}
    />
  );
};

export default CustomTableContainer;
