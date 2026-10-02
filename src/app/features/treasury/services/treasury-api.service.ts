import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Service } from '@angular/core';
import { Result } from '@core/models/Result';
import { environment } from 'environments/environment';
import { CreateExpense } from '../models/CreateExpense';
import { ReportExpense } from '../models/ReportExpense';
import { Expense } from '../models/Expense';
import { TreasurySummary } from '../models/TreasurySummary';
import { PaginatedResult } from '@core/models/PaginatedResult';

@Service()
export class TreasuryApiService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _environment = environment;
  private readonly _baseUrl = `${this._environment.appBaseUrl}/Treasury`;

  //     POST
  // /api/Treasury/expense
  postExpense(expense: CreateExpense) {
    return this._httpClient.post<Result<boolean>>(`${this._baseUrl}/expense`, expense);
  }

  // GET
  // /api/Treasury/report
  getReport(report: ReportExpense) {
    const params: string[] = [];
    if (report.Type) {
      params.push(`Type=${report.Type}`);
    }
    if (report.Period) {
      params.push(`Period=${report.Period}`);
    }
    if (report.FromDate) {
      params.push(`FromDate=${report.FromDate}`);
    }
    if (report.ToDate) {
      params.push(`DateTo=${report.ToDate}`);
    }
    if (report.PageNumber) {
      params.push(`PageNumber=${report.PageNumber}`);
    }
    if (report.PageSize) {
      params.push(`PageSize=${report.PageSize}`);
    }
    if (params.length > 0) {
      return this._httpClient.get<Result<PaginatedResult<Expense[]>>>(
        `${this._baseUrl}/report` + `?${params.join('&')}`,
      );
    }
    return this._httpClient.get<Result<PaginatedResult<Expense[]>>>(`${this._baseUrl}/report`);
  }

  // GET
  // /api/Treasury/summary
  getSummary(summary: ReportExpense) {
    const params: string[] = [];
    if (summary.Type) {
      params.push(`Type=${summary.Type}`);
    }
    if (summary.Period) {
      params.push(`Period=${summary.Period}`);
    }
    if (summary.FromDate) {
      params.push(`FromDate=${summary.FromDate}`);
    }
    if (summary.ToDate) {
      params.push(`DateTo=${summary.ToDate}`);
    }
    if (summary.PageNumber) {
      params.push(`PageNumber=${summary.PageNumber}`);
    }
    if (summary.PageSize) {
      params.push(`PageSize=${summary.PageSize}`);
    }
    if (params.length > 0) {
      return this._httpClient.get<Result<TreasurySummary>>(
        `${this._baseUrl}/summary?${params.join('&')}`,
      );
    }
    return this._httpClient.get<Result<TreasurySummary>>(`${this._baseUrl}/summary`);
  }

  // PUT
  // /api/Treasury/expense/{id}
  putExpense(id: number, expense: CreateExpense) {
    return this._httpClient.put<Result<boolean>>(`${this._baseUrl}/expense/${id}`, expense);
  }

  // DELETE
  // /api/Treasury/expense/{id}
  deleteExpense(id: number) {
    return this._httpClient.delete<Result<boolean>>(`${this._baseUrl}/expense/${id}`);
  }

  //   GET
  // /api/Treasury/export-excel
  exportExcel(report: ReportExpense) {
    const params: string[] = [];
    if (report.Type) params.push(`Type=${report.Type}`);
    if (report.Period) params.push(`Period=${report.Period}`);
    if (report.FromDate) params.push(`FromDate=${report.FromDate}`);
    if (report.ToDate) params.push(`DateTo=${report.ToDate}`);
    if (report.PageNumber) params.push(`PageNumber=${report.PageNumber}`);
    if (report.PageSize) params.push(`PageSize=${report.PageSize}`);
    if (params.length > 0) {
      return this._httpClient.get(`${this._baseUrl}/export-excel?${params.join('&')}`, {
        responseType: 'blob',
      });
    }
    return this._httpClient.get(`${this._baseUrl}/export-excel`, { responseType: 'blob' });
  }
}
