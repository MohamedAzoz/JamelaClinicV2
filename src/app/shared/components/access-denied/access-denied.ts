import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  imports: [],
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.css',
})
export class AccessDenied {
  title = signal('الوصول مرفوض');
  description = signal(
    'عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. يتطلب هذا القسم مستوى وصول إداري أو طبي متخصص. يرجى التواصل مع مسؤول النظام إذا كنت تعتقد أن هذا خطأ.',
  );

  navigateToDashboard() {
    // التوجيه للرئيسية
  }

  requestPermission() {
    // إرسال طلب الصلاحية للـ Backend
  }
}
