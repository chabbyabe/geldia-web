import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  SwapHoriz as SwapHorizIcon,
  Savings as SavingsIcon,
  Payment as PaymentsIcon,
  History as HistoryIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  Storefront as StorefrontIcon,
  Place as PlaceIcon,
  MonetizationOn as MonetizationOnIcon,
  CreditCard as CreditCardIcon,
  AccountBox as AccountBoxIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { getGridStringOperators, getGridNumericOperators } from '@mui/x-data-grid';
import React from 'react';

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
  ACCOUNT_TRANSACTIONS: {
    label: 'Account Transactions',
    path: '/accounts/:accountId/transactions',
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

export const COLOR_OPTIONS : string[] = [
  "#006CD1",
  "#0053A3",
  "#4DA3FF",
  "#2EB872",
  "#F5A524",
  "#E5484D",
];

export const SYSTEM_COLORS : Record<string, string> = {
  "#006CD1" : "primary",
  "#0053A3" : "secondary",
  "#2EB872" : "success",
  "#F5A524" : "warning",
  "#E5484D" : "error",
  "#4DA3FF" : "info"
}

export const ACCOUNT_ICONS: Record<string,  React.ElementType> = {
  "Default" : AccountBalanceWalletIcon,
  "Savings": SavingsIcon,
  "MonetizationOn": MonetizationOnIcon,
  "CreditCard": CreditCardIcon,
  "AccountBox": AccountBoxIcon,
  "TrendingUp": TrendingUpIcon,
  "TrendingDown": TrendingDownIcon,
  "Transfer": SwapHorizIcon,
}

export const CATEGORY_ICONS: Record<string,  React.ElementType> = {
  ...ACCOUNT_ICONS,
};

export const ICON_MAP: Record<string,  React.ElementType> = {
  ...CATEGORY_ICONS,
  "Logs": HistoryIcon,
  "Categories": CategoryIcon,
  "Tags": LocalOfferIcon,
  "Stores": StorefrontIcon,
  "Places": PlaceIcon,
  "Income": AccountBalanceWalletIcon,
  "Expenses": PaymentsIcon,
};



export const MUI_STRING_OPERATORS = getGridStringOperators().filter((operator) =>
  ["contains", "startsWith", "endsWith", "=", "isEmpty", "isNotEmpty"].includes(operator.value)
)

export const MUI_NUMBER_OPERATORS = getGridNumericOperators().filter((op) =>
  [">", ">=", "<", "<=", "=", "isEmpty", "isNotEmpty"].includes(op.value)
);

export const ICON_TYPE = {
  Account: "account",
  Category: "category",
} as const;
export type IconType = typeof ICON_TYPE[keyof typeof ICON_TYPE];