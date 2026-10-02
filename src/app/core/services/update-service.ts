import { injectAsync, onIdle, Service } from '@angular/core';
import { VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Service()
export class UpdateService {
  private readonly swUpdate = injectAsync(
    () => import('@angular/service-worker').then((m) => m.SwUpdate),
    { prefetch: onIdle },
  );

  // دالة ترجع الـ Promise الخاص بحالة التفعيل
  readonly isEnabled = async () => (await this.swUpdate()).isEnabled;

  constructor() {
    // استدعاء الدالة فوراً لتفعيل الاشتراك في الـ versionUpdates
    this.listenToUpdates();
  }

  async init() {
    // يجب وضع await لقراءة القيمة الفعلية (true/false) من الـ Promise
    const isServiceWorkerEnabled = await this.isEnabled();

    if (!isServiceWorkerEnabled || !('requestIdleCallback' in window)) return;

    requestIdleCallback(() => {
      this.checkForUpdate();
    });
  }

  async checkForUpdate() {
    const isServiceWorkerEnabled = await this.isEnabled();
    if (!isServiceWorkerEnabled) return;

    try {
      (await this.swUpdate()).checkForUpdate();
    } catch (err) {
      console.warn('Service worker check failed:', err);
    }
  }

  private async listenToUpdates() {
    // انتهاء الـ Promise الخاص بـ SwUpdate والاشتراك في الأحداث
    const sw = await this.swUpdate();

    sw.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe((evt) => {
        if (
          (evt.currentVersion.appData as { version: string })?.version ===
          (evt.latestVersion.appData as { version: string })?.version
        ) {
          return;
        }
        this.confirmUpdate();
      });
  }

  private async confirmUpdate() {
    const isServiceWorkerEnabled = await this.isEnabled();
    if (!isServiceWorkerEnabled || !confirm('تحديث جديد متاح')) return;

    (await this.swUpdate()).activateUpdate().then(() => window.location.reload());
  }
}
