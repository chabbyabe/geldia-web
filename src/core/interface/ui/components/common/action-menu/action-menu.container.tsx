import React, { useCallback, useState } from 'react'
import type { MouseEvent } from "react";
import ActionMenuView from '@interface/ui/components/common/action-menu/action-menu.view';
import AccountsController from '@interface/ui/screens/accounts/accounts.controller';

export interface IActionMenuContainerModel {
  children?: React.ReactNode
  handleEditModal: (value: boolean) => void
  handleDeleteModal: (value: boolean) => void
  handleModalAction: (value: number) => void
  actionId: number
}

export const ActionMenuContainer: React.FC<IActionMenuContainerModel> = (props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const controller = new AccountsController();

  const handleClose = () => {
    setAnchorEl(null);
    controller.removeCurrentAccount();
  };

  const openEditModal = useCallback(async () => {
    await props.handleModalAction(props.actionId);
    props.handleEditModal(true);
  }, []);

  const openDeleteModal = useCallback(async() => {
    await props.handleModalAction(props.actionId);
    props.handleDeleteModal(true);
  }, []);

  return <ActionMenuView
    children={props.children}
    handleOpen={handleOpen}
    handleClose={handleClose}
    handleEditModal={openEditModal}
    handleDeleteModal={openDeleteModal}
    open={open}
    anchorEl={anchorEl} 
  />
}