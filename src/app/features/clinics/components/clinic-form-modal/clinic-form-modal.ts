import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHospital, faXmark, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ClinicFacade } from '../../services/clinic.facade';

interface ClinicFormModel {
  name: string;
}

@Component({
  selector: 'app-clinic-form-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './clinic-form-modal.html',
})
export class ClinicFormModalComponent {
  public facade = inject(ClinicFacade);

  readonly faHospital = faHospital;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  private readonly _model = signal<ClinicFormModel>({ name: '' });

  readonly clinicForm = form(this._model, (path) => {
    required(path.name, { message: 'يرجى إدخال اسم العيادة' });
    minLength(path.name, 2, { message: 'يجب أن يتكون اسم العيادة من حرفين على الأقل' });
  });

  constructor() {
    // Synchronize form values whenever facade.selectedClinic signal changes
    effect(() => {
      const clinic = this.facade.selectedClinic();
      if (clinic) {
        this._model.set({ name: clinic.name });
      } else {
        this._model.set({ name: '' });
      }
    });
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault();
    if (this.clinicForm().invalid()) {
      this.clinicForm().markAsTouched();
      return;
    }

    const name = this._model().name;
    const selected = this.facade.selectedClinic();

    if (selected) {
      this.facade.updateClinic(selected.id, name);
    } else {
      this.facade.createClinic(name);
    }
  }

  close(): void {
    this.facade.closeFormModal();
  }
}

