import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.css'],
})
export class NotFound {
  private readonly location = inject(Location);
  title = signal('الصفحة غير موجودة');
  description = signal(
    'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التحقق من الرابط أو العودة إلى لوحة القيادة.',
  );
  goBack() {
    this.location.back();
  }
}
