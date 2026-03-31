export interface IReportExportOptions {
  reportName: string
  selectedYear: string
  compareYear?: string
  enableComparison?: boolean
  rows: Record<string, string | number | boolean | null | undefined>[]
}

export default class ReportsController {

  exportReport({
    reportName,
    selectedYear,
    compareYear,
    enableComparison = false,
    rows
  }: IReportExportOptions) {
    const csvContent = this.buildCsvContent({
      reportName,
      selectedYear,
      compareYear,
      enableComparison,
      rows
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', this.buildFileName(reportName, selectedYear, compareYear, enableComparison));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private buildCsvContent({
    reportName,
    selectedYear,
    compareYear,
    enableComparison,
    rows
  }: IReportExportOptions) {
    if (!rows.length) {
      return [
        `Report,${this.escapeCsvValue(reportName)}`,
        `Year,${this.escapeCsvValue(selectedYear)}`,
        enableComparison ? `Comparison Year,${this.escapeCsvValue(compareYear ?? '')}` : '',
        '',
        'No data available'
      ].filter(Boolean).join('\n');
    }

    const headers = Object.keys(rows[0]);
    const metadataRows = [
      `Report,${this.escapeCsvValue(reportName)}`,
      `Year,${this.escapeCsvValue(selectedYear)}`
    ];

    if (enableComparison) {
      metadataRows.push(`Comparison Year,${this.escapeCsvValue(compareYear ?? '')}`);
    }

    const dataRows = rows.map((row) => (
      headers.map((header) => this.escapeCsvValue(row[header])).join(',')
    ));

    return [
      ...metadataRows,
      '',
      headers.map((header) => this.escapeCsvValue(header)).join(','),
      ...dataRows
    ].join('\n');
  }

  private buildFileName(
    reportName: string,
    selectedYear: string,
    compareYear?: string,
    enableComparison?: boolean
  ) {
    const normalizedName = reportName.toLowerCase().replace(/\s+/g, '-');
    const comparisonSuffix = enableComparison && compareYear ? `-vs-${compareYear}` : '';

    return `${normalizedName}-report-${selectedYear}${comparisonSuffix}.csv`;
  }

  private escapeCsvValue(value: string | number | boolean | null | undefined) {
    const normalizedValue = value ?? '';
    const stringValue = String(normalizedValue).replace(/"/g, '""');

    return `"${stringValue}"`;
  }
}
