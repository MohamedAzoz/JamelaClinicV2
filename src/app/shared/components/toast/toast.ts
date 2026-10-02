import { Component, inject } from '@angular/core';
import { AppMessageService } from '@core/services/app-message-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faInfoCircle,
  faX,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

// تعريف القواميس الثابتة خارج المكون لتحسين الأداء ومنع تكرار الحسابات
const TOAST_THEMES: Record<string, { container: string; accent: string; iconContainer: string }> = {
  success: {
    container: 'border-emerald-500/15 shadow-emerald-500/4 bg-white/90 dark:bg-slate-900/90',
    accent: 'bg-emerald-500',
    iconContainer: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  error: {
    container: 'border-red-500/15 shadow-red-500/4 bg-white/90 dark:bg-slate-900/90',
    accent: 'bg-red-500',
    iconContainer: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
  warn: {
    container: 'border-amber-500/15 shadow-amber-500/4 bg-white/90 dark:bg-slate-900/90',
    accent: 'bg-amber-500',
    iconContainer: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  info: {
    container: 'border-blue-500/15 shadow-blue-500/4 bg-white/90 dark:bg-slate-900/90',
    accent: 'bg-blue-500',
    iconContainer: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
};

const TOAST_ICONS: Record<string, IconDefinition> = {
  success: faCheckCircle,
  error: faTimesCircle,
  warn: faExclamationTriangle,
  info: faInfoCircle,
};

@Component({
  selector: 'app-toast',
  imports: [FontAwesomeModule],
  template: `
    <!-- الحاوية العلوية: مرنة وتدعم التموضع الذكي حسب لغة النظام (end-4) -->
    <div
      class="fixed top-4 md:top-6 inset-e-4 z-400 flex flex-col gap-3 w-full max-w-[calc(100vw-2rem)] sm:max-w-sm pointer-events-none"
      role="live"
      aria-live="assertive"
    >
      @for (toast of messageService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] flex p-4 items-start animate-toast-in transition-all duration-300"
          [class]="themes[toast.severity].container"
        >
          <!-- خط التميز الجانبي: يدعم الاتجاهات تلقائياً بفضل استخدام (start-0) بدلاً من left-0 -->
          <div
            class="absolute inset-y-0 inset-s-0 w-1.5"
            [class]="themes[toast.severity].accent"
          ></div>

          <!-- أيقونة الحالة الدلالية -->
          <div class="shrink-0">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl"
              [class]="themes[toast.severity].iconContainer"
            >
              <fa-icon [icon]="icons[toast.severity]" size="lg"></fa-icon>
            </div>
          </div>

          <!-- النصوص والبيانات: تم استبدال الهوامش الجانبية الثابتة بـ (ms-3) لتدعم العربي والإنجليزي كاملاً -->
          <div class="ms-3 w-0 flex-1 pt-0.5">
            <h4 class="text-sm font-bold text-slate-900 dark:text-slate-50 leading-snug">
              {{ toast.summary }}
            </h4>
            @if (toast.detail) {
              <p
                class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3"
              >
                {{ toast.detail }}
              </p>
            }
          </div>

          <!-- زر الإغلاق: (ms-4) تضمن مسافة مثالية متكيفة مع اتجاه الصفحة -->
          <div class="ms-4 flex shrink-0">
            <button
              type="button"
              class="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
              (click)="messageService.remove(toast.id)"
              aria-label="إغلاق التنبيه"
            >
              <fa-icon [icon]="faX" size="sm"></fa-icon>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes toastIn {
        0% {
          opacity: 0;
          transform: translateY(-12px) scale(0.96);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .animate-toast-in {
        animation: toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `,
  ],
})
export class Toast {
  public messageService = inject(AppMessageService);

  // إتاحة القواميس والأيقونات بداخل الـ Template بدون ميثودز مكررة
  readonly themes = TOAST_THEMES;
  readonly icons = TOAST_ICONS;
  readonly faX = faX;
}
