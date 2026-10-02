export function isValidMoney(value: number): boolean {
  const cents = value * 100;
  return (
    Number.isFinite(value) &&
    value >= 0 &&
    Number.isSafeInteger(Math.round(cents)) &&
    Math.abs(cents - Math.round(cents)) < 0.000001
  );
}

export function readDoctorPercentage(value: unknown): number | undefined {
  if (typeof value !== 'number' && typeof value !== 'string') return undefined;
  if (typeof value === 'string' && !/^\d+(?:\.\d+)?$/.test(value.trim())) return undefined;
  const percentage = Number(value);
  return Number.isFinite(percentage) && percentage >= 0 && percentage <= 100
    ? percentage
    : undefined;
}

export function getDoctorShare(fee: number, value: unknown): number | null {
  const percentage = readDoctorPercentage(value);
  if (
    !isValidMoney(fee) ||
    percentage === undefined ||
    !Number.isFinite(percentage) ||
    percentage < 0 ||
    percentage > 100
  )
    return null;
  // Keep the maximum discount within the doctor's share, including fractional cents.
  return Math.floor((Math.round(fee * 100) * percentage) / 100 + 0.000001) / 100;
}

export function getDiscountError(
  fee: number,
  discount: number,
  percentage: unknown,
): string | null {
  if (!isValidMoney(discount)) return 'أدخل خصمًا غير سالب بحد أقصى منزلتان عشريتان';
  if (!isValidMoney(fee)) return 'أدخل قيمة كشف صحيحة أولًا';
  if (discount === 0) return null;
  const share = getDoctorShare(fee, percentage);
  if (share === null) return 'اختر طبيبًا تتوفر بيانات نسبته قبل إدخال الخصم';
  return discount > share ? `الخصم لا يمكن أن يتجاوز حصة الطبيب (${share.toFixed(2)} ج.م)` : null;
}

export function calculateAppointmentPricing(fee: number, discount: number, percentage: unknown) {
  const doctorShare = getDoctorShare(fee, percentage);
  if (doctorShare === null || getDiscountError(fee, discount, percentage)) return null;
  const feeCents = Math.round(fee * 100);
  const discountCents = Math.round(discount * 100);
  const doctorCents = Math.round(doctorShare * 100);
  return {
    doctorShare,
    doctorEarnings: (doctorCents - discountCents) / 100,
    centerEarnings: (feeCents - doctorCents) / 100,
    finalPaidAmount: (feeCents - discountCents) / 100,
  };
}
