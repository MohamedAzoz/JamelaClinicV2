import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialogService } from '@shared/components/confirm-modal';
import { MaterialsFacade } from '../../services/materials.facade';
import { Material } from '../../models/Material';

@Component({
  selector: 'app-materials-table',
  imports: [DecimalPipe, FontAwesomeModule],
  templateUrl: './materials-table.html',
})
export class MaterialsTableComponent {
  readonly facade = inject(MaterialsFacade);
  private readonly _confirmService = inject(ConfirmDialogService);

  readonly icons = { edit: faPen, delete: faTrash, power: faPowerOff };

  async toggleMaterialStatus(material: Material): Promise<void> {
    const isActivating = !material.isActive;
    const confirmed = isActivating
      ? await this._confirmService.activate(
          material.name,
          `هل أنت تأكد من رغبتك في إعادة تفعيل المادة "${material.name}"؟`
        )
      : await this._confirmService.deactivate(
          material.name,
          `هل أنت تأكد من رغبتك في إيقاف وتطبيط تفعيل المادة "${material.name}"؟`
        );

    if (confirmed) {
      this.facade.toggleMaterialStatus(material);
    }
  }
}
