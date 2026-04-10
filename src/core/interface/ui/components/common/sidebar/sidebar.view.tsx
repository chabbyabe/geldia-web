import React from 'react';
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
import ListSubheader from '@mui/material/ListSubheader';
import { PAGES } from '@interface/presenters/constants';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ReceiptLong as ReceiptLongIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon
} from "@mui/icons-material";

export interface ISidebarViewModel {
  onToggleSidebar: () => void
  sidebarOpen: boolean
  currentPage: string
  navigateTo: (path: string) => void
}

interface ISidebarItem {
  name: string
  isCurrentPage: boolean
  icon: React.ReactNode
  navigatePath: string
}

const primaryMenuList = (currentPage: string) : ISidebarItem[] => [
  {
    name: PAGES.DASHBOARD.label,
    isCurrentPage: currentPage === PAGES.DASHBOARD.label,
    icon: <DashboardIcon />,
    navigatePath: PAGES.DASHBOARD.path,
  },
  {
    name: PAGES.TRANSACTIONS.label,
    isCurrentPage: currentPage === PAGES.TRANSACTIONS.label,
    icon: <AccountBalanceWalletIcon />,
    navigatePath: PAGES.TRANSACTIONS.path,
  },
  {
    name: PAGES.ACCOUNTS.label,
    isCurrentPage: currentPage === PAGES.ACCOUNTS.label,
    icon: <ReceiptLongIcon />,
    navigatePath: PAGES.ACCOUNTS.path,
  },
  {
    name: PAGES.REPORTS.label,
    isCurrentPage: currentPage === PAGES.REPORTS.label,
    icon: <AssessmentIcon />,
    navigatePath: PAGES.REPORTS.path,
  },
  {
    name: PAGES.LOGS.label,
    isCurrentPage: currentPage === PAGES.LOGS.label,
    icon: <HistoryIcon />,
    navigatePath: PAGES.LOGS.path,
  },
];

const settingsMenuList = (currentPage: string): ISidebarItem[] => [
  {
    name: PAGES.CATEGORIES.label,
    isCurrentPage: currentPage === PAGES.CATEGORIES.label,
    icon: <CategoryIcon />,
    navigatePath: PAGES.CATEGORIES.path,
  },
  {
    name: PAGES.TAGS.label,
    isCurrentPage: currentPage === PAGES.TAGS.label,
    icon: <LocalOfferIcon />,
    navigatePath: PAGES.TAGS.path,
  },
]

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
        {primaryMenuList(props.currentPage).map((element: ISidebarItem) => (
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
        <ListSubheader inset>Settings</ListSubheader>
        {settingsMenuList(props.currentPage).map((element: ISidebarItem) => (
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
      </List>
    </Drawer >
  )
}
