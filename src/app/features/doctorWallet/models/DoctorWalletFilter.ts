import { WalletTransactionType } from './WalletTransactionType';
import { Period } from './Period';
/**Name	Description
DoctorId

Period

FromDate

ToDate
Type

PageNumber
PageSize

 */
export interface DoctorWalletFilter {
  DoctorId?: string;
  Period?: Period | null;
  FromDate?: string;
  ToDate?: string;
  Type?: WalletTransactionType | null;
  PageNumber?: number;
  PageSize?: number;
}
