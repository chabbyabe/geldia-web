import React from "react";
import type { MouseEvent } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


export interface IActionMenuViewModel {
  children?: React.ReactNode
    handleOpen: (event: MouseEvent<HTMLElement>) => void
    handleClose: () => void
    handleEditModal: () => void
    handleDeleteModal: () => void
    open: boolean | false
    anchorEl: HTMLElement | null
}

const ActionMenuView: React.FC<IActionMenuViewModel> = (props) => {
  return (
    <React.Fragment>
      <IconButton size="small" onClick={props.handleOpen}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={props.handleEditModal}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={props.handleDeleteModal} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default ActionMenuView;