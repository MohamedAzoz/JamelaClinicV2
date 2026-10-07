import { NavItem } from '@shared/models/nav-item';

export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'clinics', label: 'العيادات', route: '/main/clinics' },
  { icon: 'doctors', label: 'الأطباء', route: '/main/doctors' },
  { icon: 'users', label: 'الموظفين', route: '/main/employees' },
  { icon: 'payment', label: 'إدارة المصروفات', route: '/main/treasury' },
  { icon: 'wallet', label: 'حسابات الأطباء', route: '/main/doctor-wallet' },
  { icon: 'schedule', label: 'أطباء اليوم', route: '/main/today-doctor-schedules' },
  { icon: 'schedule', label: 'مواعيد الأطباء', route: '/main/doctor-schedules' },
  { icon: 'appointments', label: 'الحجوزات', route: '/main/appointments' },
  { icon: 'company', label: 'الشركات الموردة', route: '/main/companies' },
  { icon: 'discount', label: 'الخصومات والعروض', route: '/main/special-offers' },
  { icon: 'logs', label: 'سجلات الدخول', route: '/main/user-login-logs' },
  {
    icon: 'manage-password',
    label: 'إدارة كلمات المرور',
    route: '/main/admin-password-management',
  },
  { icon: 'settings', label: 'الإعدادات', route: '/main/change-password' },
];

export const DOCTOR_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'schedule', label: 'مواعيد اليوم', route: '/main/doctor-today-appointments' },
  { icon: 'wallet', label: 'حسابي المالي', route: '/main/doctor-wallet' },
  { icon: 'schedule', label: 'مواعيدي المتاحة', route: '/main/doctor-schedules' },
  { icon: 'settings', label: 'الإعدادات', route: '/main/change-password' },
];

export const RECEPTIONIST_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'schedule', label: 'جدول المواعيد', route: '/main/doctor-schedules' },
  { icon: 'schedule', label: 'أطباء اليوم', route: '/main/today-doctor-schedules' },
  { icon: 'appointments', label: 'حجز موعد مريض', route: '/main/appointment-booking' },
  { icon: 'discount', label: 'الخصومات والعروض', route: '/main/special-offers' },
  { icon: 'settings', label: 'الإعدادات', route: '/main/change-password' },
];

export const ACCOUNTANT_NAV_ITEMS: readonly NavItem[] = [
  { icon: 'dashboard', label: 'الرئيسية', route: '/main/dashboard' },
  { icon: 'payment', label: 'إدارة المصروفات', route: '/main/treasury' },
  { icon: 'wallet', label: 'حسابات الأطباء', route: '/main/doctor-wallet' },
  { icon: 'appointments', label: 'الحجوزات', route: '/main/appointments' },
  { icon: 'company', label: 'الشركات الموردة', route: '/main/companies' },
  { icon: 'discount', label: 'الخصومات والعروض', route: '/main/special-offers' },
  { icon: 'settings', label: 'الإعدادات', route: '/main/change-password' },
];
