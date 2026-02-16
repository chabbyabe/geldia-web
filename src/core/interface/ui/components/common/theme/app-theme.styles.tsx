import { createTheme } from '@mui/material/styles';
import { lighten, darken } from '@mui/material';

const primaryMain = '#006CD1';

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      dark: '#0053A3',
      light: '#4DA3FF',
      contrastText: '#FFFFFF',
    },
    // Secondary color based on primary
    secondary: {
      main: lighten(primaryMain, 0.2),  // 20% lighter than primary
      light: lighten(primaryMain, 0.4), // 40% lighter
      dark: darken(primaryMain, 0.2),   // 20% darker
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2EB872',
      light: '#E6F7EF',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F5A524',
      light: '#FFF5E5',
      contrastText: '#1F2A37',
    },
    error: {
      main: '#E5484D',
      light: '#FDEBEC',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFC', // background
      paper: '#FFFFFF', // surface
    },
    text: {
      primary: '#1F2A37',
      secondary: '#6B7C93', // muted
    },
  },
  shape: {
    borderRadius: 5,
  },
});