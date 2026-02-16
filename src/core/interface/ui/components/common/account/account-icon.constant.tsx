import {
  Savings as SavingsIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  MonetizationOn as MonetizationOnIcon,
  Payments as PaymentsIcon,
  CreditCard as CreditCardIcon,
  AccountBox as AccountBoxIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'; 
import type { ReactNode } from 'react';

const IconOptions : Record<string, ReactNode> = {
    "Savings": <SavingsIcon sx={{ fontSize: 30 }} />,
    "AccountBalanceWallet": <AccountBalanceWalletIcon sx={{ fontSize: 30 }} />,
    "MonetizationOn": <MonetizationOnIcon sx={{ fontSize: 30 }}/>,
    "Payments": <PaymentsIcon sx={{ fontSize: 30 }} />,
    "CreditCard": <CreditCardIcon sx={{ fontSize: 30 }} />,
    "AccountBox": <AccountBoxIcon sx={{ fontSize: 30 }} />,
    "TrendingUp": <TrendingUpIcon sx={{ fontSize: 30 }} />
};

export default IconOptions