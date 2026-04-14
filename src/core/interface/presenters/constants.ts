import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  SwapHoriz as SwapHorizIcon,
  Savings as SavingsIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  Storefront as StorefrontIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';
import { getGridStringOperators } from '@mui/x-data-grid';

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
  CATEGORIES: {
    label: 'Categories',
    path: '/categories',
  },
  TAGS: {
    label: 'Tags',
    path: '/tags',
  },
  STORES: {
    label: 'Stores',
    path: '/stores',
  },
  PLACES: {
    label: 'Places',
    path: '/places',
  },
  REPORTS: {
    label: 'Reports',
    path: '/reports',
  },
  LOGS: {
    label: 'Logs',
    path: '/logs',
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
  "Logs": HistoryIcon,
  "Categories": CategoryIcon,
  "Tags": LocalOfferIcon,
  "Stores": StorefrontIcon,
  "Places": PlaceIcon,
};

export const STRING_OPERATORS = getGridStringOperators().filter((operator) =>
  ["contains", "startsWith", "endsWith", "=", "isEmpty", "isNotEmpty"].includes(operator.value)
)
