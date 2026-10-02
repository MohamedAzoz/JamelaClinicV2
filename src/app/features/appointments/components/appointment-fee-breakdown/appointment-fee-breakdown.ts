import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { calculateAppointmentPricing } from '../../utils/appointment-pricing';

@Component({
  selector: 'app-appointment-fee-breakdown',
  imports: [DecimalPipe],
  template: `
    @if (pricing(); as amounts) {
      <dl
        class="grid grid-cols-1 gap-3 rounded-xl border border-primary/15 bg-main-bg p-4 text-sm text-text sm:grid-cols-3"
        aria-live="polite"
      >
        <div>
          <dt class="text-xs">المطلوب من المريض بعد الخصم</dt>
          <dd class="mt-1 font-bold">{{ amounts.finalPaidAmount | number: '1.2-2' }} ج.م</dd>
        </div>
        <!-- <div>
          <dt class="text-xs">حصة الطبيب بعد الخصم</dt>
          <dd class="mt-1 font-bold">{{ amounts.doctorEarnings | number: '1.2-2' }} ج.م</dd>
        </div>
        <div>
          <dt class="text-xs">حصة المركز دون خصم</dt>
          <dd class="mt-1 font-bold">{{ amounts.centerEarnings | number: '1.2-2' }} ج.م</dd>
        </div> -->
      </dl>
    }
  `,
})
export class AppointmentFeeBreakdownComponent {
  readonly fee = input.required<number>();
  readonly discount = input.required<number>();
  readonly doctorPercentage = input<number>();
  readonly pricing = computed(() =>
    calculateAppointmentPricing(this.fee(), this.discount(), this.doctorPercentage()),
  );
}
