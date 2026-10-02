import { TreasuryType } from './ReportExpense';

export interface Expense {
  id: number;
  type: TreasuryType;
  typeName: string;
  amount: number;
  description: string;
  appointmentId: number | null;
  doctorWalletTransactionId: number | null;
  offerOrderId: number | null;
  userName: string;
  createdAt: string;
}
