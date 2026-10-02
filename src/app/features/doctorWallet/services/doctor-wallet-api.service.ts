import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { PaginatedResult } from '@core/models/PaginatedResult';
import { Result } from '@core/models/Result';
import { environment } from 'environments/environment';
import { DoctorWalletFilter } from '../models/DoctorWalletFilter';
import { DoctorWalletTransaction } from '../models/DoctorWalletTransaction';
import { DoctorWalletSummary } from '../models/DoctorWalletSummary';
import { DoctorWalletReport } from '../models/DoctorWalletReport';

@Service()
export class DoctorWalletApiService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.appBaseUrl}/DoctorWallet/`;
  // GET
  // /api/DoctorWallet/transactions-report
  getTransactionsReport(searchParams: DoctorWalletFilter) {
    let url = `${this._baseUrl}transactions-report`;
    const params: string[] = [];

    if (searchParams.DoctorId) params.push(`DoctorId=${searchParams.DoctorId}`);
    if (searchParams.Period) params.push(`Period=${searchParams.Period}`);
    if (searchParams.FromDate) params.push(`FromDate=${searchParams.FromDate}`);
    if (searchParams.ToDate) params.push(`ToDate=${searchParams.ToDate}`);
    if (searchParams.Type) params.push(`Type=${searchParams.Type}`);

    params.push(`PageNumber=${searchParams.PageNumber ?? 1}`);
    params.push(`PageSize=${searchParams.PageSize ?? 10}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._http.get<Result<PaginatedResult<DoctorWalletReport[]>>>(url);
  }

  // GET
  // /api/DoctorWallet/summary-report
  //Ex:   /transactions-report?FromDate=2026-09-20&ToDate=2026-09-22

  getSummaryReport(searchParams: DoctorWalletFilter) {
    let url = `${this._baseUrl}summary-report`;
    const params: string[] = [];

    if (searchParams.DoctorId) params.push(`DoctorId=${searchParams.DoctorId}`);
    if (searchParams.Period) params.push(`Period=${searchParams.Period}`);
    if (searchParams.FromDate) params.push(`FromDate=${searchParams.FromDate}`);
    if (searchParams.ToDate) params.push(`ToDate=${searchParams.ToDate}`);
    if (searchParams.Type) params.push(`Type=${searchParams.Type}`);

    params.push(`PageNumber=${searchParams.PageNumber ?? 1}`);
    params.push(`PageSize=${searchParams.PageSize ?? 10}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._http.get<Result<DoctorWalletSummary>>(url);
  }
  // POST
  // /api/DoctorWallet/deposit
  deposit(transaction: DoctorWalletTransaction) {
    return this._http.post<Result<boolean>>(`${this._baseUrl}deposit`, transaction);
  }
  // POST
  // /api/DoctorWallet/withdraw
  withdraw(transaction: DoctorWalletTransaction) {
    return this._http.post<Result<boolean>>(`${this._baseUrl}withdraw`, transaction);
  }

  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  //   GET
  // /api/DoctorWallet/transactions/{id}
  getTransactionById(id: number) {
    return this._http.get<Result<DoctorWalletReport>>(`${this._baseUrl}transactions/${id}`);
  }
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // DELETE
  // /api/DoctorWallet/transactions/{id}
  deleteTransaction(id: number) {
    return this._http.delete<Result<boolean>>(`${this._baseUrl}transactions/${id}`);
  }
}
