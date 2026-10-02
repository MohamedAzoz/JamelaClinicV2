import { WalletTransactionType } from './WalletTransactionType';

export interface DoctorWalletReport {
  id: number;
  doctorName: string;
  doctorId: string;
  type: WalletTransactionType;
  typeName: string;
  amount: number;
  appointmentId?: number;
  employeeName: string;
  description: string;
  createdAt: Date;
}
