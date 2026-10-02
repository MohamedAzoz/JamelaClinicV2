import { TestBed } from '@angular/core/testing';
import { DoctorPercentageInfoComponent } from '../components/doctor-percentage-info/doctor-percentage-info';
import {
  calculateAppointmentPricing,
  getDiscountError,
  getDoctorShare,
  readDoctorPercentage,
} from './appointment-pricing';

describe('Doctor percentage from API data', () => {
  it.each([70, '70.00', ' 70.00 '])(
    'uses %s for discount validation and earnings',
    (percentage) => {
      expect(readDoctorPercentage(percentage)).toBe(70);
      expect(getDoctorShare(100, percentage)).toBe(70);
      expect(getDiscountError(100, 70, percentage)).toBeNull();
      expect(getDiscountError(100, 70.01, percentage)).not.toBeNull();
      expect(calculateAppointmentPricing(100, 20, percentage)).toEqual({
        doctorShare: 70,
        doctorEarnings: 50,
        centerEarnings: 30,
        finalPaidAmount: 80,
      });
    },
  );
  it.each([undefined, null, '', ' ', 'not-a-number', true, -1, 101])(
    'does not invent a percentage for %s',
    (percentage) => {
      expect(readDoctorPercentage(percentage)).toBeUndefined();
      expect(getDoctorShare(100, percentage)).toBeNull();
      expect(getDiscountError(100, 1, percentage)).not.toBeNull();
    },
  );
  it('recognizes zero as a valid doctor percentage', () => {
    expect(readDoctorPercentage('0.00')).toBe(0);
    expect(getDiscountError(100, 0, '0.00')).toBeNull();
    expect(getDiscountError(100, 0.01, '0.00')).not.toBeNull();
  });
  it('shows the selected percentage independently of fee and discount and updates on selection', () => {
    const fixture = TestBed.createComponent(DoctorPercentageInfoComponent);
    fixture.componentRef.setInput('doctor', { fullName: 'طبيب أول', doctorPercentage: '70.00' });
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.textContent).toContain('70%');
    expect(host.textContent).toContain('طبيب أول');
    fixture.componentRef.setInput('doctor', { fullName: 'طبيب ثان', doctorPercentage: 40 });
    fixture.detectChanges();
    expect(host.textContent).toContain('40%');
    expect(host.textContent).not.toContain('70%');
    fixture.componentRef.setInput('doctor', { fullName: 'طبيب ثالث' });
    fixture.detectChanges();
    expect(host.textContent).toContain('نسبة الطبيب غير متاحة');
  });
});
