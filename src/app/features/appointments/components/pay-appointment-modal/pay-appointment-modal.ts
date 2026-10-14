import { Component, inject, input, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCoins,
  faCreditCard,
  faChevronDown,
  faTimes,
  faCheckCircle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { PaymentMethod } from '@features/appointments/models/PaymentMethod';
import { AppointmentFacade } from '../../services/appointment.facade';

export interface PayAppointmentData {
  id: number;
  patientName: string;
  amount: number;
}

@Component({
  selector: 'app-pay-appointment-modal',
  imports: [FontAwesomeModule],
  templateUrl: './pay-appointment-modal.html',
})
export class PayAppointmentModalComponent {
  readonly facade = inject(AppointmentFacade);

  /** The appointment to pay */
  readonly appointment = input.required<PayAppointmentData>();

  /** Emitted when the modal is closed (cancelled or after success) */
  readonly closed = output<void>();

  readonly faCoins = faCoins;
  readonly faCreditCard = faCreditCard;
  readonly faChevronDown = faChevronDown;
  readonly faTimes = faTimes;
  readonly faCheckCircle = faCheckCircle;
  readonly faSpinner = faSpinner;

  /** Currently selected payment method */
  readonly selectedMethod = signal<PaymentMethod>(PaymentMethod.Cash);

  readonly paymentMethodOptions: { value: PaymentMethod; label: string; icon: string }[] = [
    { value: PaymentMethod.Cash, label: 'نقداً', icon: '💵' },
    { value: PaymentMethod.VodafoneCash, label: 'فودافون كاش', icon: '📱' },
    { value: PaymentMethod.InstaPay, label: 'إنستا باي', icon: '⚡' },
  ];

  selectMethod(method: PaymentMethod): void {
    this.selectedMethod.set(method);
  }

  async confirmPay(): Promise<void> {
    const app = this.appointment();
    this.facade.payAppointment(app.id, this.selectedMethod());
    this.closed.emit();
  }

  close(): void {
    this.closed.emit();
  }
}
