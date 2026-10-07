import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBoxOpen,
  faExclamationTriangle,
  faSave,
  faSpinner,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentsMaterial } from '../../models/AppointmentsMaterial';

@Component({
  selector: 'app-appointment-materials-section',
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './appointment-materials-section.html',
})
export class AppointmentMaterialsSectionComponent {
  readonly facade = inject(AppointmentFacade);
  readonly appointment = input.required<AppointmentsMaterial>();

  readonly faBoxOpen = faBoxOpen;
  readonly faSave = faSave;
  readonly faTrashAlt = faTrashAlt;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly faSpinner = faSpinner;

  readonly materialsDescription = signal<string>('');
  readonly totalMaterialsCost = signal<number>(0);

  constructor() {
    effect(() => {
      const app = this.appointment();
      if (app) {
        this.materialsDescription.set(app.materialsDescription || '');
        this.totalMaterialsCost.set(app.totalMaterialsCost || 0);
      }
    });
  }

  readonly hasMaterials = computed(
    () =>
      (this.appointment()?.totalMaterialsCost ?? 0) > 0 ||
      !!this.appointment()?.materialsDescription,
  );

  saveMaterials(event?: Event): void {
    if (event) event.preventDefault();
    this.facade.updateMaterials({
      appointmentId: this.appointment().id,
      materialsDescription: this.materialsDescription().trim(),
      totalMaterialsCost: Number(this.totalMaterialsCost()) || 0,
    });
  }

  clearMaterials(): void {
    this.facade.clearMaterials(this.appointment().id);
  }

  chackStatus(): boolean {
    return this.appointment().status === 'Completed' || this.appointment().status === 'Cancelleted';
  }
}
