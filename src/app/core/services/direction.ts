// import { DOCUMENT, effect, inject, Service, signal } from '@angular/core';
// import { AppDatabase } from '@core/AppDbContext/app-database';
// import { DirectionPreference } from '@core/AppDbContext/storage.models';
// import { TranslocoService } from '@jsverse/transloco';

// @Service()
// export class Direction {
//   private document = inject(DOCUMENT);
//   private translocoService = inject(TranslocoService);
//   private readonly appDb = inject(AppDatabase);

//   private readonly isRtl = signal<boolean>(false);

//   // حدد اللغات التي تدعم الكتابة من اليمين لليسار هنا
//   private rtlLanguages = ['ar'];

//   async initDirection() {
//     const persistedDirection = await this.appDb.getDirectionPreference();
//     if (persistedDirection) {
//       this.translocoService.setActiveLang(persistedDirection);
//       const direction = this.rtlLanguages.includes(persistedDirection) ? 'rtl' : 'ltr';
//       const htmlTag = this.document.getElementsByTagName('html')[0];
//       if (htmlTag) {
//         htmlTag.setAttribute('dir', direction);
//         htmlTag.setAttribute('lang', persistedDirection);
//       }
//     }
//     // الاشتراك في التغييرات اللحظية للغة عند تبديلها
//     this.translocoService.langChanges$.subscribe((lang) => {
//       const isRtl = this.rtlLanguages.includes(lang);
//       const direction = isRtl ? 'rtl' : 'ltr';

//       // تحديث خصائص وسم <html> مباشرة
//       const htmlTag = this.document.getElementsByTagName('html')[0];
//       if (htmlTag) {
//         htmlTag.setAttribute('dir', direction);
//         htmlTag.setAttribute('lang', lang);
//       }
//       this.appDb.saveDirectionPreference(lang as DirectionPreference);
//     });
//   }
// }
