import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IdentityService } from '@core/services/identity-service';
import { AppMessageService } from '@core/services/app-message-service';
import { Result } from '@core/models/Result';
import { CreateMaterial, Material } from '../models/Material';
import { isValidMaterialPrice } from '../models/material-validation';
import { MaterialsApiService } from './materials-api.service';

type MaterialEditor = { mode: 'create' } | { mode: 'edit'; id: number; material: Material | null };

@Service()
export class MaterialsFacade {
  private readonly api = inject(MaterialsApiService);
  private readonly identity = inject(IdentityService);
  private readonly messages = inject(AppMessageService);
  private readonly destroyRef = inject(DestroyRef);
  private listRequestId = 0;
  private detailRequestId = 0;

  readonly canManage = computed(() => this.identity.isAdmin());
  readonly materials = signal<Material[]>([]);
  readonly isActiveFilter = signal<boolean | null>(null);
  readonly pageNumber = signal(1);
  readonly pageSize = signal(10);
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly listError = signal('');
  readonly editor = signal<MaterialEditor | null>(null);
  readonly loadingDetails = signal(false);
  readonly detailError = signal('');
  readonly formError = signal('');
  readonly materialToDelete = signal<Material | null>(null);
  readonly deleteError = signal('');
  readonly actionLoading = signal(false);
  readonly togglingId = signal<number | null>(null);

  initialize(): void {
    void this.loadMaterials();
  }

  async loadMaterials(): Promise<void> {
    if (!this.canManage()) return;
    const requestId = ++this.listRequestId;
    this.loading.set(true);
    this.listError.set('');
    try {
      const response = await firstValueFrom(
        this.api.getAllMaterials(
          this.pageNumber(),
          this.pageSize(),
          this.isActiveFilter() ?? undefined,
        ),
      );
      if (this.destroyRef.destroyed || requestId !== this.listRequestId) return;
      if (!response.isSuccess) {
        this.clearList();
        this.listError.set(response.message || 'تعذر تحميل المواد. حاول مرة أخرى.');
        return;
      }
      const data = response.data;
      const lastPage = Math.max(1, data?.totalPages ?? 0);
      if (this.pageNumber() > lastPage) {
        this.pageNumber.set(lastPage);
        await this.loadMaterials();
        return;
      }
      this.materials.set(data?.items ?? []);
      this.totalCount.set(data?.totalCount ?? 0);
      this.totalPages.set(data?.totalPages ?? 0);
    } catch {
      if (this.destroyRef.destroyed || requestId !== this.listRequestId) return;
      this.clearList();
      this.listError.set('تعذر تحميل المواد. تحقق من الاتصال وحاول مرة أخرى.');
    } finally {
      if (!this.destroyRef.destroyed && requestId === this.listRequestId) this.loading.set(false);
    }
  }

  setStatusFilter(status: boolean | null): void {
    this.isActiveFilter.set(status);
    this.pageNumber.set(1);
    void this.loadMaterials();
  }

  setPage(page: number): void {
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      page > this.totalPages() ||
      page === this.pageNumber()
    )
      return;
    this.pageNumber.set(page);
    void this.loadMaterials();
  }

  setPageSize(size: number): void {
    if (![10, 25, 50].includes(size)) return;
    this.pageSize.set(size);
    this.pageNumber.set(1);
    void this.loadMaterials();
  }

  openCreate(): void {
    if (!this.canManage() || this.actionLoading()) return;
    ++this.detailRequestId;
    this.detailError.set('');
    this.formError.set('');
    this.loadingDetails.set(false);
    this.editor.set({ mode: 'create' });
  }

  openEdit(material: Material): void {
    if (!this.canManage() || this.actionLoading()) return;
    this.editor.set({ mode: 'edit', id: material.id, material: null });
    this.formError.set('');
    void this.loadEditorDetails();
  }

  async loadEditorDetails(): Promise<void> {
    const editor = this.editor();
    if (!this.canManage() || editor?.mode !== 'edit') return;
    const requestId = ++this.detailRequestId;
    this.loadingDetails.set(true);
    this.detailError.set('');
    try {
      const response = await firstValueFrom(this.api.getMaterialById(editor.id));
      if (this.destroyRef.destroyed || requestId !== this.detailRequestId) return;
      if (!response.isSuccess || !response.data || response.data.id !== editor.id) {
        this.detailError.set(response.message || 'تعذر تحميل تفاصيل المادة.');
        return;
      }
      this.editor.set({ mode: 'edit', id: editor.id, material: response.data });
    } catch {
      if (!this.destroyRef.destroyed && requestId === this.detailRequestId)
        this.detailError.set('تعذر تحميل تفاصيل المادة. حاول مرة أخرى.');
    } finally {
      if (!this.destroyRef.destroyed && requestId === this.detailRequestId)
        this.loadingDetails.set(false);
    }
  }

  closeEditor(): void {
    if (this.actionLoading()) return;
    ++this.detailRequestId;
    this.editor.set(null);
    this.loadingDetails.set(false);
    this.formError.set('');
  }

  async saveMaterial(value: CreateMaterial): Promise<void> {
    const editor = this.editor();
    if (!this.canManage() || !editor || this.actionLoading() || this.loadingDetails()) return;
    if (editor.mode === 'edit' && !editor.material) return;
    if (!value.name.trim() || !isValidMaterialPrice(value.price)) {
      this.formError.set('أدخل اسم المادة وسعرًا غير سالب بحد أقصى منزلتان عشريتان.');
      return;
    }
    const payload = { ...value, name: value.name.trim(), description: value.description.trim() };
    this.formError.set('');
    const request =
      editor.mode === 'create'
        ? this.api.createMaterial(payload)
        : this.api.updateMaterial({ ...payload, id: editor.id });
    await this.runMutation(
      request,
      editor.mode === 'create' ? 'تمت إضافة المادة بنجاح' : 'تم تعديل المادة بنجاح',
      (message) => this.formError.set(message),
      () => {
        this.editor.set(null);
        if (editor.mode === 'create') this.pageNumber.set(1);
      },
    );
  }

  requestDelete(material: Material): void {
    if (!this.canManage() || this.actionLoading()) return;
    this.deleteError.set('');
    this.materialToDelete.set(material);
  }

  closeDelete(): void {
    if (this.actionLoading()) return;
    this.materialToDelete.set(null);
    this.deleteError.set('');
  }

  async deleteMaterial(): Promise<void> {
    const material = this.materialToDelete();
    if (!this.canManage() || !material || this.actionLoading()) return;
    this.deleteError.set('');
    await this.runMutation(
      this.api.deleteMaterial(material.id),
      'تم حذف المادة بنجاح',
      (message) => this.deleteError.set(message),
      () => this.materialToDelete.set(null),
    );
  }

  async toggleMaterialStatus(material: Material): Promise<void> {
    if (!this.canManage() || this.actionLoading()) return;
    this.togglingId.set(material.id);
    await this.runMutation(
      this.api.toggleMaterialStatus(material.id),
      'تم تغيير حالة المادة بنجاح',
      (message) => this.messages.addErrorMessage(message),
    );
    this.togglingId.set(null);
  }

  private async runMutation(
    request: Observable<Result<Material | boolean>>,
    success: string,
    onError: (message: string) => void,
    onSuccess: () => void = () => {},
  ): Promise<void> {
    this.actionLoading.set(true);
    try {
      const response = await firstValueFrom(request);
      if (this.destroyRef.destroyed) return;
      if (!response.isSuccess || response.data === false) {
        onError(response.message || 'تعذر تنفيذ العملية. حاول مرة أخرى.');
        return;
      }
      onSuccess();
      this.messages.addSuccessMessage(success);
      await this.loadMaterials();
    } catch (error) {
      if (!this.destroyRef.destroyed)
        onError(this.messages.buildHttpErrorDetail(error, 'تعذر تنفيذ العملية. حاول مرة أخرى.'));
    } finally {
      if (!this.destroyRef.destroyed) this.actionLoading.set(false);
    }
  }

  private clearList(): void {
    this.materials.set([]);
    this.totalCount.set(0);
    this.totalPages.set(0);
  }
}
