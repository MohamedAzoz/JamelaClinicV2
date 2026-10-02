import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding, faPhone, faXmark, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CompaniesFacade } from '../../services/companies.facade';

interface CompanyFormModel {
  name: string;
  phone: string;
}

@Component({
  selector: 'app-company-form-modal',
  imports: [FormField, FormRoot, FontAwesomeModule],
  templateUrl: './company-form-modal.html',
}) 
export class CompanyFormModalComponent {
  readonly facade = inject(CompaniesFacade);

  readonly faBuilding = faBuilding;
  readonly faPhone = faPhone;
  readonly faXmark = faXmark;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  private readonly _model = signal<CompanyFormModel>({
    name: '',
    phone: '',
  });

  readonly companyForm = form(this._model, (path) => {
    required(path.name, { message: 'اسم الشركة مطلوب' });
    minLength(path.name, 2, { message: 'يجب أن يتكون اسم الشركة من حرفين على الأقل' });
    required(path.phone, { message: 'رقم الهاتف مطلوب' });
    minLength(path.phone, 6, { message: 'يرجى إدخال رقم هاتف صحيح' });
  });

  constructor() {
    effect(() => {
      const company = this.facade.selectedCompany();
      if (company) {
        this._model.set({
          name: company.name || '',
          phone: company.phone || '',
        });
      } else {
        this._model.set({
          name: '',
          phone: '',
        });
      }
    });
  }

  onSubmit(event?: Event): void {
    if (event) event.preventDefault();

    if (this.companyForm().invalid()) {
      this.companyForm().markAsTouched();
      return;
    }

    const payload = {
      name: this._model().name.trim(),
      phone: this._model().phone.trim(),
    };

    const selected = this.facade.selectedCompany();
    if (selected) {
      this.facade.updateCompany(selected.id, payload);
    } else {
      this.facade.addCompany(payload);
    }
  }

  close(): void {
    this.facade.closeFormModal();
  }
}
