import { Component, inject, input } from '@angular/core';
import { LoadingService } from '@core/services/loading-service';
import { HospitalName } from '@shared/constants/app-routes.constants';
import { NgOptimizedImage } from '@angular/common';
import { Theme } from '@core/services/theme';

@Component({
  selector: 'app-loading',
  imports: [NgOptimizedImage],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  /** Optional custom loading message */
  readonly loadingText = input<string>('جاري التحميل');
  readonly title = HospitalName;
  protected readonly loadingService = inject(LoadingService);
  private theme = inject(Theme);

  isDark = this.theme.isDark;
}
