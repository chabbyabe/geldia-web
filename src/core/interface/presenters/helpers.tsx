import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "@base/config";
import { TRANSACTION_TYPE } from "@data/gateways/api/constants";
import dayjs, { Dayjs } from "dayjs";
import { alpha, darken, getContrastRatio, lighten } from "@mui/material/styles";
import { ACCOUNT_ICONS, ICON_MAP } from "./constants";
import { Wallet } from "@mui/icons-material";

export const getCurrentDateTime = (): string => {
  // Format: 2026-02-20T14:35 (YYYY-MM-DDTHH:MM)
  return dayjs().format("YYYY-MM-DDTHH:mm");
};

export const formatDateTime = (
  data: string,
  getTime: boolean,
  getDate: boolean
): string => {
  if (!data) return "";

  const d = dayjs(data);
  if (!d.isValid()) return "";

  if (getDate && getTime) return d.format("YYYY-MM-DDTHH:mm");

  if (getTime) return d.format("HH:mm");

  if (getDate) return d.format("YYYY-MM-DD");

  return d.format("YYYY-MM-DDTHH:mm");
};

export const formatToTitleCase = (value: string) => {
  if (!value) return "";

  const words = value.trim().split(/\s+/);

  return words
    .map(word =>
      word === word.toLowerCase()
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word
    )
    .join(" ");
};

export const toDayjs = (value: any): Dayjs => {
  if (!value) return dayjs(); // fallback

  return dayjs.isDayjs(value) ? value : dayjs(value);
};

/**
 * Returns an array of 7 numbers representing: 
 * 3 previous years, the current, 3 future years
 * @returns {number[]}
 */
export const getYearRange = (): number[] =>
  Array.from({ length: 7 }, (_, i) => dayjs().year() - 3 + i);

export const getMonths = (format: "short" | "long", locale = DEFAULT_LOCALE): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { month: format });

  return Array.from({ length: 12 }, (_, i) =>
    formatter.format(new Date(2020, i, 1))
  );
};

export const formatCurrency = (amount: number | null | undefined, locale: string = DEFAULT_LOCALE, currency: string = DEFAULT_CURRENCY): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  if (amount == null || Number.isNaN(amount)) {
    amount = 0;
  }

  return formatter
    .formatToParts(amount)
    .filter(part => part.type !== 'literal')
    .map(part => part.value)
    .join('');
};

export const getColoredChipSx = (
  color: string | null | undefined,
  fallbackColor: string = "#006CD1"
) => {
  const baseColor = color ?? fallbackColor;
  const textColor = getContrastRatio(baseColor, "#006CD1") >= 4.5
    ? "#006CD1"
    : darken(baseColor, 0.45);

  return {
    backgroundColor: alpha(baseColor, 0.14),
    color: textColor,
    border: `1px solid ${alpha(baseColor, 0.24)}`,
    fontWeight: 600,
    '& .MuiChip-icon': {
      color: textColor
    },
    '&:hover': {
      backgroundColor: alpha(lighten(baseColor, 0.02), 0.2),
      borderColor: alpha(baseColor, 0.3)
    }
  };
};

export const getTransactionTypeChipSx = (
  color: string | null | undefined,
  fallbackColor: string = "#006CD1"
) => ({
  backgroundColor: color || fallbackColor,
  color: color === "#F5A524" ? 'black' : 'white',
  fontWeight: 700,
  letterSpacing: '0.01em'
});

export const getTransactionTypeColor = (transactionType: string | null | undefined) => {
  switch (transactionType) {
    case TRANSACTION_TYPE.INCOME.name:
      return "#006CD1";
    case TRANSACTION_TYPE.EXPENSES.name:
      return '#E5484D';
    case TRANSACTION_TYPE.TRANSFER.name:
      return '#F5A524';
    default:
      return "#006CD1";
  }
};

export const renderCategoryIcon = (
  icon: string | null,
  color: string | null,
  fontSize: number = 22
) => {
  const IconComponent = icon ? ICON_MAP[icon] : undefined
  const FinalIcon = IconComponent ?? Wallet

  return (
    <FinalIcon
      sx={{
        fontSize: fontSize,
        color: color ?? "#006CD1",
      }}
    />
  )
}

export const renderAccountIcon = (
  icon: string | null,
  color: string | null = "#006CD1",
  fontSize: number = 30
) => {
  const IconComponent = icon ? ACCOUNT_ICONS[icon] : undefined
  const FinalIcon = IconComponent ?? Wallet

  return (
    <FinalIcon
      sx={{
        fontSize: fontSize,
        color: color,
      }}
    />
  )
}

export const  truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text;
}

export const absoluteValue = (num: number): number => Math.abs(num);