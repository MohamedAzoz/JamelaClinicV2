import { Component, computed, ElementRef, inject, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBoxOpen,
  faExclamationTriangle,
  faPlus,
  faSpinner,
  faTrashAlt,
  faChevronDown,
  faSearch,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { AppointmentFacade } from '../../services/appointment.facade';
import { AppointmentsMaterial } from '../../models/AppointmentsMaterial';
import { AddMaterialToAppointment } from '../../models/AddMaterialToAppointment';

@Component({
  selector: 'app-appointment-materials-section',
  imports: [FontAwesomeModule, DecimalPipe],
  templateUrl: './appointment-materials-section.html',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class AppointmentMaterialsSectionComponent {
  readonly facade = inject(AppointmentFacade);
  private readonly elementRef = inject(ElementRef);
  readonly appointment = input.required<AppointmentsMaterial>();

  // FontAwesome Icons
  readonly faBoxOpen = faBoxOpen;
  readonly faPlus = faPlus;
  readonly faTrashAlt = faTrashAlt;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly faSpinner = faSpinner;
  readonly faChevronDown = faChevronDown;
  readonly faSearch = faSearch;
  readonly faCheck = faCheck;

  // Dropdown & Form State
  readonly isDropdownOpen = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly selectedMaterialId = signal<number | null>(null);
  readonly quantity = signal<number>(1);

  readonly hasMaterials = computed(
    () => (this.appointment()?.materials?.length ?? 0) > 0,
  );

  readonly selectedMaterial = computed(() => {
    const id = this.selectedMaterialId();
    if (!id) return null;
    return this.facade.availableMaterials().find((m) => m.id === id) ?? null;
  });

  readonly filteredMaterials = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const list = this.facade.availableMaterials();
    if (!query) return list;
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        (m.description && m.description.toLowerCase().includes(query)),
    );
  });

  toggleDropdown(): void {
    if (this.facade.availableMaterials().length === 0 && !this.facade.isLoadingMaterials()) {
      void this.facade.loadActiveMaterials(true);
    }
    this.isDropdownOpen.update((v) => !v);
  }

  selectMaterial(id: number): void {
    this.selectedMaterialId.set(id);
    this.isDropdownOpen.set(false);
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
  }

  onDropdownScroll(event: Event): void {
    const target = event.target as HTMLElement;
    // Check if scrolled near bottom (20px threshold)
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
      void this.facade.loadMoreMaterials();
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }

  onQuantityChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.quantity.set(val > 0 ? val : 1);
  }
  getStatus(status: string | null | undefined): boolean {
    switch (status) {
      case 'Unpaid':
        return true;
      case 'InProgress':
        return true;
      case 'Completed':
        return false;
      case 'Cancelled':
        return false;
      default:
        return true;
    }
  }
  async addMaterial(event: Event): Promise<void> {
    event.preventDefault();

    const matId = this.selectedMaterialId();
    const qty = this.quantity();

    if (!matId || qty < 1 || this.facade.isAddingMaterial()) return;

    const payload: AddMaterialToAppointment = {
      appointmentId: this.appointment().id,
      materialId: matId,
      quantity: qty,
    };

    const ok = await this.facade.addMaterialToAppointment(payload);
    if (ok) {
      this.selectedMaterialId.set(null);
      this.quantity.set(1);
    }
  }

  async removeMaterial(appointmentMaterialId: number): Promise<void> {
    if (this.facade.removingMaterialId() !== null) return;
    await this.facade.removeMaterialFromAppointment(
      appointmentMaterialId,
      this.appointment().id,
    );
  }
}
