import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  SwapHoriz as SwapHorizIcon,
  Savings as SavingsIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

export const PAGES = {
  LOGIN: {
    label: 'Login',
    path: '/login',
  },
  SIGNUP: {
    label: 'Signup',
    path: '/signup',
  },
  DASHBOARD: {
    label: 'Dashboard',
    path: '/dashboard',
  },
  ACCOUNTS: {
    label: 'Accounts',
    path: '/accounts',
  },
  TRANSACTIONS: {
    label: 'Transactions',
    path: '/transactions',
  },
  REPORTS: {
    label: 'Reports',
    path: '/reports',
  },
}

export const ACCOUNT_COLORS : string[] = [
  "#006CD1",
  "#0053A3",
  "#4DA3FF",
  "#2EB872",
  "#F5A524",
  "#E5484D"
];

export const SYSTEM_COLORS : Record<string, string> = {
  "#006CD1" : "primary",
  "#0053A3" : "secondary",
  "#2EB872" : "success",
  "#F5A524" : "warning",
  "#E5484D" : "error",
  "#4DA3FF" : "info"
}

export const ICON_MAP: Record<string, React.ElementType> = {
  "Default" : AccountBalanceWalletIcon,
  "Income": AccountBalanceWalletIcon,
  "Expenses": PaymentIcon,
  "Transfer": SwapHorizIcon,
  "Savings": SavingsIcon,
  "Payments" : PaymentIcon,
};