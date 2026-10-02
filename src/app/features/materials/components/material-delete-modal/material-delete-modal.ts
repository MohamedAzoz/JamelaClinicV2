import { Component, inject } from '@angular/core';
import { ConfirmModalComponent } from '@shared/components/confirm-modal';
import { MaterialsFacade } from '../../services/materials.facade';

@Component({
  selector: 'app-material-delete-modal',
  imports: [ConfirmModalComponent],
  template: `
    <app-confirm-modal
      [isOpen]="!!facade.materialToDelete()"
      variant="danger"
      title="تأكيد حذف المادة"
      [itemName]="facade.materialToDelete()?.name"
      message="هل أنت أصلًا متأكد من رغبتك في حذف المادة المحددة؟ يمكنك تعطيل المادة بدلًا من حذفها إذا كنت تريد الاحتفاظ ببياناتها."
      warningMessage="تحذير: هذا الإجراء سيؤدي إلى حذف المادة وسجلاتها نهائياً."
      confirmText="حذف المادة"
      cancelText="إلغاء"
      [isLoading]="facade.actionLoading()"
      (confirmed)="facade.deleteMaterial()"
      (cancelled)="facade.closeDelete()"
    />
  `,
})
export class MaterialDeleteModalComponent {
  readonly facade = inject(MaterialsFacade);
}
