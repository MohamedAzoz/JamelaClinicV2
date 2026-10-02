import { computed, inject, Service, signal } from '@angular/core';
import { AppMessageService } from '@core/services/app-message-service';
import { finalize } from 'rxjs/operators';
import { OfferOrdersApiService } from './offer-orders-api.service';
import { OfferOrder } from '../models/OfferOrder';
import { AddOfferOrder } from '../models/AddOfferOrder';
import { PayOfferOrder } from '../models/PayOfferOrder';
import { CompanyFinancialSummary } from '../models/CompanyFinancialSummary';
import { CompaniesApiService } from '../../companies/services/companies-api.service';

@Service()
export class OfferOrdersFacade {
  private readonly _apiService = inject(OfferOrdersApiService);
  private readonly _companiesApi = inject(CompaniesApiService);
  private readonly _messageService = inject(AppMessageService);

  // === State Signals ===
  readonly companyId = signal<number | null>(null);
  readonly companyName = signal<string>('');
  readonly orders = signal<OfferOrder[]>([]);
  readonly summary = signal<CompanyFinancialSummary | null>(null);
  readonly loading = signal<boolean>(false);
  readonly actionLoading = signal<boolean>(false);

  // === Modal State ===
  readonly isAddOrderModalOpen = signal<boolean>(false);
  readonly isPayModalOpen = signal<boolean>(false);
  readonly isDeleteOrderModalOpen = signal<boolean>(false);
  readonly selectedOrder = signal<OfferOrder | null>(null);
  readonly orderToDelete = signal<OfferOrder | null>(null);
  readonly orderToPay = signal<OfferOrder | null>(null);

  // === Order Details State ===
  readonly selectedOrderDetails = signal<OfferOrder | null>(null);
  readonly loadingOrderDetails = signal<boolean>(false);
  readonly orderDetailsError = signal<string | null>(null);

  // === Computed ===
  readonly totalOrdersCount = computed(() => this.orders().length);
  readonly totalOrdersAmount = computed(() =>
    this.orders().reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  );
  readonly totalPaidAmount = computed(() =>
    this.orders().reduce((sum, o) => sum + (o.paidAmount || 0), 0),
  );
  readonly totalRemainingAmount = computed(() =>
    this.orders().reduce((sum, o) => sum + (o.remainingAmount || 0), 0),
  );

  // === API Wrappers ===

  loadCompanyDetails(id: number): void {
    this._companiesApi.getCompanyById(id).subscribe({
      next: (res) => {
        if (res?.isSuccess && res.data) {
          this.companyName.set(res.data.name);
        }
      },
    });
  }

  loadCompanyOrders(id: number): void {
    this.loading.set(true);
    this._apiService
      .getAllOfferOrders(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && Array.isArray(res.data)) {
            this.orders.set(res.data);
            if (res.data.length > 0 && res.data[0].companyName) {
              this.companyName.set(res.data[0].companyName);
            }
          } else {
            this.orders.set([]);
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err?.error?.message || 'تعذر تحميل طلبات الشركة',
          );
        },
      });
  }

  loadCompanySummary(id: number): void {
    this._apiService.getCompanyFinancialSummary(id).subscribe({
      next: (res) => {
        if (res?.isSuccess && res.data) {
          this.summary.set(res.data);
        }
      },
    });
  }

  loadOrderDetails(id: number): void {
    this.loadingOrderDetails.set(true);
    this.orderDetailsError.set(null);
    this._apiService
      .getOfferOrderById(id)
      .pipe(finalize(() => this.loadingOrderDetails.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && res.data) {
            this.selectedOrderDetails.set(res.data);
          } else {
            this.orderDetailsError.set(res?.message || 'تعذر تحميل تفاصيل أمر الشراء/العرض');
          }
        },
        error: (err) => {
          this.orderDetailsError.set(err?.error?.message || 'تعذر تحميل تفاصيل أمر الشراء/العرض');
        },
      });
  }

  addOfferOrder(data: AddOfferOrder): void {
    this.actionLoading.set(true);
    this._apiService
      .addOfferOrder(data)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && res.data) {
            this._messageService.addSuccessMessage(
              res.message || 'تمت إضافة الطلب بنجاح',
            );
            this.orders.update((list) => [res.data!, ...list]);
            this.closeAddOrderModal();
            const id = this.companyId();
            if (id) this.loadCompanySummary(id);
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'فشل في إضافة الطلب',
            );
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err?.error?.message || 'فشل في إضافة الطلب',
          );
        },
      });
  }

  payRemainingOfferOrder(id: number, data: PayOfferOrder): void {
    this.actionLoading.set(true);
    this._apiService
      .payRemainingOfferOrder(id, data)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess && res.data) {
            this._messageService.addSuccessMessage(
              res.message || 'تم تسجيل الدفعة بنجاح',
            );
            this.orders.update((list) =>
              list.map((o) => (o.id === id ? res.data! : o)),
            );
            if (this.selectedOrderDetails()?.id === id) {
              this.selectedOrderDetails.set(res.data);
            }
            this.closePayModal();
            const companyId = this.companyId();
            if (companyId) this.loadCompanySummary(companyId);
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'فشل في تسجيل الدفعة',
            );
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err?.error?.message || 'فشل في تسجيل الدفعة',
          );
        },
      });
  }

  deleteOfferOrder(id: number): void {
    this.actionLoading.set(true);
    this._apiService
      .deleteOfferOrder(id)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res?.isSuccess) {
            this._messageService.addSuccessMessage(
              res.message || 'تم حذف الطلب بنجاح',
            );
            this.orders.update((list) => list.filter((o) => o.id !== id));
            this.closeDeleteOrderModal();
            const companyId = this.companyId();
            if (companyId) this.loadCompanySummary(companyId);
          } else {
            this._messageService.addErrorMessage(
              res?.message || 'فشل في حذف الطلب',
            );
          }
        },
        error: (err) => {
          this._messageService.addErrorMessage(
            err?.error?.message || 'فشل في حذف الطلب',
          );
        },
      });
  }

  // === Modal Handlers ===

  openAddOrderModal(): void {
    this.isAddOrderModalOpen.set(true);
  }

  closeAddOrderModal(): void {
    this.isAddOrderModalOpen.set(false);
  }

  openPayModal(order: OfferOrder): void {
    this.orderToPay.set(order);
    this.isPayModalOpen.set(true);
  }

  closePayModal(): void {
    this.isPayModalOpen.set(false);
    this.orderToPay.set(null);
  }

  openDeleteOrderModal(order: OfferOrder): void {
    this.orderToDelete.set(order);
    this.isDeleteOrderModalOpen.set(true);
  }

  closeDeleteOrderModal(): void {
    this.isDeleteOrderModalOpen.set(false);
    this.orderToDelete.set(null);
  }

  confirmDeleteOrder(): void {
    const order = this.orderToDelete();
    if (order) {
      this.deleteOfferOrder(order.id);
    }
  }

  // Initialize with company id
  initialize(companyId: number): void {
    this.companyId.set(companyId);
    this.loadCompanyDetails(companyId);
    this.loadCompanyOrders(companyId);
    this.loadCompanySummary(companyId);
  }

  refreshData(): void {
    const id = this.companyId();
    if (id) {
      this.loadCompanyOrders(id);
      this.loadCompanySummary(id);
    }
  }
}
