import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import React from 'react';
import { PAGE_NAMES, PAGE_URLS } from '@interface/presenters/constants';

export interface ISidebarViewModel {
  onToggleSidebar: () => void
  sidebarOpen: boolean
  currentPage: string
  navigateTo: (path: string) => void
}

type SidebarItem = {
  name: string;
  isCurrentPage: boolean;
  icon: React.ReactNode;
  navigatePath : string
};

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export const SidebarView: React.FC<ISidebarViewModel> = (props) => {

  const mainList : SidebarItem[] = [
    {
      name: PAGE_NAMES.DASHBOARD,
      isCurrentPage: props.currentPage === PAGE_NAMES.DASHBOARD,
      icon: <DashboardIcon />,
      navigatePath: PAGE_URLS.DASHBOARD
    }
  ];

  return (
    <Drawer variant="permanent" open={props.sidebarOpen}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={props.onToggleSidebar}>
          <ChevronLeftIcon />
        </IconButton>

      </Toolbar>
      <Divider />
      <List component="nav">

      {mainList.map((element: SidebarItem) => (
        <React.Fragment key={element.name}>
          <ListItemButton
            sx={{
              backgroundColor: element.isCurrentPage
                ? "bg-primary"
                : "inherit",
            }}
            selected={element.isCurrentPage}
            onClick={() => props.navigateTo(element.navigatePath)}
          >
            <ListItemIcon>{element.icon}</ListItemIcon>
            <ListItemText primary={element.name} />
          </ListItemButton>
        </React.Fragment>
      ))}

      <Divider sx={{ my: 1 }} />

      </List>
    </Drawer >
  )
}