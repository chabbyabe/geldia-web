/*
Function to convert object to query string
  Input: 
    const params = {
      filterBy: 'Month',
      startDate: '2026-03-01',
      endDate: '2026-03-13',
    };

  Output: "filterBy=Month&startDate=2026-03-01&endDate=2026-03-13"
*/
export const toQueryString = (params: Record<string, any>): string => {
  const filtered = Object.entries(params).filter(
    ([_, value]) => value !== undefined && value !== null
  );

  return new URLSearchParams(
    filtered.map(([key, value]) => [key, String(value)])
  ).toString();
};