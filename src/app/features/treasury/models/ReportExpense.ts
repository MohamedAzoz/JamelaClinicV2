export interface ReportExpense {
  Type?: TreasuryType;
  Period?: TreasuryPeriod;
  FromDate?: string;
  ToDate?: string;
  PageNumber?: number;
  PageSize?: number;
}

export enum TreasuryType {
  Income = 1, // الايرادات
  Expense = 2, // المصروفات
}

export enum TreasuryPeriod {
  Today = 1, // اليوم
  ThisMonth = 2, // هذا الشهر
  ThisYear = 3, // هذا العام
}
