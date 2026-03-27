import dayjs, { Dayjs } from "dayjs";
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

  return value
    .toString()
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(word => word !== "")
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};


/**
 * Returns an array of 7 numbers representing: 
 * 3 previous years, the current, 3 future years
 * @returns {number[]}
 */
export const  getYearRange = (): number[] => 
  Array.from({ length: 7 }, (_, i) => dayjs().year() - 3 + i);


export const toDayjs = (value: any): Dayjs => {
  if (!value) return dayjs(); // fallback

  return dayjs.isDayjs(value) ? value : dayjs(value);
};