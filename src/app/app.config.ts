import {
  ApplicationConfig,
  inject,  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideCatbeeIndexedDB } from '@ng-catbee/indexed-db';
import { dbConfig } from './core/AppDbContext/dbconfig';
import { StorageMigrationService } from './core/AppDbContext/storage-migration-service';
import { IdentityService } from './core/services/identity-service';
import { SecureStorageService } from './core/services/secure-storage-service';
import { Theme } from './core/services/theme';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { dateTransformInterceptor } from './core/interceptors/date-transform.interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideCatbeeIndexedDB(dbConfig),
    provideAppInitializer(async () => {
      const secureStorage = inject(SecureStorageService);
      const identityService = inject(IdentityService);
      const theme = inject(Theme);
      const storageMigrationService = inject(StorageMigrationService);

      await secureStorage.init();
      await storageMigrationService.init();

      await identityService.init();
      await theme.init();
    }),
    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor, dateTransformInterceptor]),
    ),
  ],
};
