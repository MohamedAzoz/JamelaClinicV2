import { Component, computed, inject, linkedSignal } from '@angular/core';
import { form, FormField, min, required, validate } from '@angular/forms/signals';
import { CreateMaterial } from '../../models/Material';
import { isValidMaterialPrice } from '../../models/material-validation';
import { MaterialsFacade } from '../../services/materials.facade';
import { MaterialDialogComponent } from '../material-dialog/material-dialog';

@Component({
  selector: 'app-material-form-modal',
  imports: [FormField, MaterialDialogComponent],
  templateUrl: './material-form-modal.html',
})
export class MaterialFormModalComponent {
  readonly facade = inject(MaterialsFacade);
  readonly isEdit = computed(() => this.facade.editor()?.mode === 'edit');
  readonly model = linkedSignal<CreateMaterial>(() => {
    const editor = this.facade.editor();
    const material = editor?.mode === 'edit' ? editor.material : null;
    return {
      name: material?.name ?? '',
      price: material?.price ?? 0,
      description: material?.description ?? '',
      isActive: material?.isActive ?? true,
    };
  });
  readonly materialForm = form(this.model, (path) => {
    required(path.name, { message: 'أدخل اسم المادة' });
    validate(path.name, ({ value }) =>
      value().trim() ? null : { kind: 'blank', message: 'أدخل اسم المادة' },
    );
    required(path.price, { message: 'أدخل السعر' });
    min(path.price, 0, { message: 'السعر يجب ألا يكون سالبًا' });
    validate(path.price, ({ value }) =>
      isValidMaterialPrice(value())
        ? null
        : { kind: 'price', message: 'أدخل سعرًا غير سالب بحد أقصى منزلتين عشريتين' },
    );
  });
  submit(event: Event): void {
    event.preventDefault();
    if (this.materialForm().invalid() || this.facade.actionLoading()) {
      this.materialForm().markAsTouched();
      return;
    }
    void this.facade.saveMaterial(this.model());
  }
}
