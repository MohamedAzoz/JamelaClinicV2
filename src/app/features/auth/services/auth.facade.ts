import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { IdentityService } from '../../../core/services/identity-service';
import { AppMessageService } from '../../../core/services/app-message-service';
import { RoutesManagement } from '@shared/constants/app-routes.constants';
import { LoginRequest } from '../models/LoginRequest';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { AdminChangePasswordRequest } from '../models/AdminChangePasswordRequest';
import { UserInfo } from '../models/UserInfo';
import { UserProfile } from '../models/UserProfile';
import { DoctorApiService } from '@features/doctors/services/doctor-api.service';
import { EmployeeApiService } from '@features/employees/services/employee-api.service';
import { Doctor } from '@features/doctors/models/Doctor';
import { Employee } from '@features/employees/models/Employee';
import { HttpErrorResponse } from '@angular/common/http';

export type ManagedUser = Doctor | Employee;
export type ManagedUserType = 'doctors' | 'employees';

@Service()
export class AuthFacade {
  private readonly _api = inject(AuthApiService);
  private readonly _identity = inject(IdentityService);
  private readonly _router = inject(Router);
  private readonly _messages = inject(AppMessageService);
  private readonly _doctorApi = inject(DoctorApiService);
  private readonly _employeeApi = inject(EmployeeApiService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly managedUserType = signal<ManagedUserType>('doctors');
  readonly managedUsers = signal<ManagedUser[]>([]);
  readonly managedUsersLoading = signal(false);
  readonly adminPasswordLoading = signal(false);
  readonly selectedManagedUser = signal<ManagedUser | null>(null);
  readonly isAdminPasswordModalOpen = signal(false);

  async selectManagedUserType(type: ManagedUserType): Promise<void> {
    this.managedUserType.set(type);
    await this.loadManagedUsers(type);
  }

  async loadManagedUsers(type: ManagedUserType = this.managedUserType()): Promise<void> {
    this.managedUsersLoading.set(true);

    try {
      const result =
        type === 'doctors'
          ? await firstValueFrom(this._doctorApi.getAllDoctors())
          : await firstValueFrom(this._employeeApi.getAllEmployees());

      if (result.isSuccess && result.data) {
        this.managedUsers.set(result.data);
      } else {
        this.managedUsers.set([]);
        this._messages.addErrorMessage(result.message || 'تعذر تحميل قائمة المستخدمين');
      }
    } catch {
      this.managedUsers.set([]);
      this._messages.addErrorMessage('حدث خطأ أثناء تحميل قائمة المستخدمين');
    } finally {
      this.managedUsersLoading.set(false);
    }
  }

  openAdminPasswordModal(user: ManagedUser): void {
    this.selectedManagedUser.set(user);
    this.isAdminPasswordModalOpen.set(true);
  }

  closeAdminPasswordModal(): void {
    this.isAdminPasswordModalOpen.set(false);
    this.selectedManagedUser.set(null);
  }

  async adminChangePassword(request: AdminChangePasswordRequest): Promise<boolean> {
    if (this.adminPasswordLoading()) return false;

    this.adminPasswordLoading.set(true);
    try {
      const result = await firstValueFrom(this._api.adminChangePassword(request));
      if (result.isSuccess) {
        this._messages.addSuccessMessage('تم تغيير كلمة مرور المستخدم بنجاح');
        return true;
      }

      this._messages.addErrorMessage(result.message || 'تعذر تغيير كلمة المرور');
      return false;
    } catch (e: any) {
      let msg = e.error.message;
      this._messages.addErrorMessage(msg || 'حدث خطأ أثناء تغيير كلمة المرور');
      this.error.set(msg);
      return false;
    } finally {
      this.adminPasswordLoading.set(false);
    }
  }
  async login(request: LoginRequest): Promise<void> {
    if (this.loading()) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await firstValueFrom(this._api.login(request));

      if (result.isSuccess && result.data?.token) {
        await this._identity.setAuth(result.data.token);
        this._messages.addSuccessMessage(`مرحبا ${result.data.fullName}`);
        this._router.navigate([`/${RoutesManagement.MAIN.path}`]);
      } else {
        const msg = result.message || 'فشل تسجيل الدخول. يرجى المحاولة مجدداً.';
        this.error.set(msg);
        this._messages.addErrorMessage(msg);
      }
    } catch (error: any) {
      const msg =
        error.error?.message ||
        (typeof error === 'string'
          ? error
          : 'حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.');

      this.error.set(msg);
      this._messages.addErrorMessage(msg);
    } finally {
      this.loading.set(false);
    }
  }
  logout() {
    this._identity.clearAuth();
    this._messages.addSuccessMessage('تم تسجيل الخروج بنجاح');
    void this._router.navigate([`/${RoutesManagement.AUTH.path}`]);
  }

  forceLogout() {
    this._identity.clearAuth();
    void this._router.navigate([`/${RoutesManagement.AUTH.path}`], { replaceUrl: true });
  }

  readonly changePasswordLoading = signal(false);

  async changePassword(request: ChangePasswordRequest): Promise<boolean> {
    if (this.changePasswordLoading()) return false;

    this.changePasswordLoading.set(true);

    try {
      const result = await firstValueFrom(this._api.changePassword(request));

      if (result?.isSuccess !== false) {
        this._messages.addSuccessMessage('تم تغيير كلمة المرور بنجاح');
        // If the API returns a new token, update stored auth
        if (result?.token) {
          await this._identity.setAuth(result.token);
        }
        return true;
      } else {
        const msg = result?.message ?? 'فشل تغيير كلمة المرور. يرجى التأكد من البيانات المدخلة.';
        this._messages.addErrorMessage(msg);
        return false;
      }
    } catch (e: any) {
      let msg = e.error.message;
      this._messages.addErrorMessage(msg || 'حدث خطأ أثناء تغيير كلمة المرور');
      this.error.set(msg);
      return false;
    } finally {
      this.changePasswordLoading.set(false);
    }
  }

  // ═════════════════════════════════════════════════════════════════════
  // USER PROFILE STATE & METHODS
  // ═════════════════════════════════════════════════════════════════════
  readonly userProfile = signal<UserProfile | null>(null);
  readonly profileLoading = signal<boolean>(false);

  async loadUserProfile(): Promise<void> {
    this.profileLoading.set(true);
    try {
      const res = await firstValueFrom(this._api.getCurrentUser());
      if (res.isSuccess && res.data) {
        this.userProfile.set(res.data);
      } else {
        this._messages.addErrorMessage(res.message || 'فشل في جلب بيانات الملف الشخصي');
      }
    } catch {
      this._messages.addErrorMessage('حدث خطأ أثناء الاتصال بالخادم لجلب الملف الشخصي');
    } finally {
      this.profileLoading.set(false);
    }
  }

  // ═════════════════════════════════════════════════════════════════════
  // USER LOGIN LOGS STATE & METHODS
  // ═════════════════════════════════════════════════════════════════════
  readonly loginLogs = signal<UserInfo[]>([]);
  readonly loginLogsLoading = signal<boolean>(false);
  readonly loginLogsPageNumber = signal<number>(1);
  readonly loginLogsPageSize = signal<number>(10);
  readonly loginLogsTotalCount = signal<number>(0);
  readonly loginLogsTotalPages = signal<number>(0);
  readonly loginLogsSearchQuery = signal<string>('');

  readonly filteredLoginLogs = computed(() => {
    const query = this.loginLogsSearchQuery().trim().toLowerCase();
    const logs = this.loginLogs();
    if (!query) return logs;
    return logs.filter(
      (log) =>
        log.fullName?.toLowerCase().includes(query) ||
        log.username?.toLowerCase().includes(query) ||
        log.roles?.toLowerCase().includes(query) ||
        log.deviceInfo?.toLowerCase().includes(query),
    );
  });

  readonly hasPreviousPage = computed(() => this.loginLogsPageNumber() > 1);
  readonly hasNextPage = computed(() => this.loginLogsPageNumber() < this.loginLogsTotalPages());
  readonly successfulLoginsCount = computed(
    () => this.loginLogs().filter((l) => l.isSuccessful).length,
  );
  readonly failedLoginsCount = computed(
    () => this.loginLogs().filter((l) => !l.isSuccessful).length,
  );

  async loadUserLoginLogs(
    pageNumber: number = this.loginLogsPageNumber(),
    pageSize: number = this.loginLogsPageSize(),
  ): Promise<void> {
    this.loginLogsLoading.set(true);
    this.loginLogsPageNumber.set(pageNumber);
    this.loginLogsPageSize.set(pageSize);

    try {
      const result = await firstValueFrom(this._api.userLoginLog(pageNumber, pageSize));

      if (result.isSuccess && result.data) {
        this.loginLogs.set(result.data.items || []);
        this.loginLogsPageNumber.set(result.data.pageNumber || pageNumber);
        this.loginLogsPageSize.set(result.data.pageSize || pageSize);
        this.loginLogsTotalCount.set(result.data.totalCount || 0);
        this.loginLogsTotalPages.set(result.data.totalPages || 0);
      } else {
        this._messages.addErrorMessage(result.message || 'فشل في جلب سجلات تسجيل الدخول');
      }
    } catch {
      this._messages.addErrorMessage('حدث خطأ غير متوقع عند جلب سجلات تسجيل الدخول');
    } finally {
      this.loginLogsLoading.set(false);
    }
  }

  setLoginLogsSearchQuery(query: string): void {
    this.loginLogsSearchQuery.set(query);
  }

  nextLoginLogsPage(): void {
    if (this.hasNextPage()) {
      void this.loadUserLoginLogs(this.loginLogsPageNumber() + 1, this.loginLogsPageSize());
    }
  }

  previousLoginLogsPage(): void {
    if (this.hasPreviousPage()) {
      void this.loadUserLoginLogs(this.loginLogsPageNumber() - 1, this.loginLogsPageSize());
    }
  }

  changeLoginLogsPageSize(newSize: number): void {
    void this.loadUserLoginLogs(1, newSize);
  }
}
