export interface OfferOrder {
  id: number;
  companyId: number;
  title: string;
  companyName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  employeeId: string;
  employeeName: string;
  createdAt: string;
  treasuryTransactionId: number | null;
}
