import { Service, signal } from '@angular/core';

@Service()
export class LoadingService {
  isLoading = signal<boolean>(false);
  private activeRequests = 0; // عداد الطلبات النشطة

  show() {
    this.activeRequests++;
    this.isLoading.set(true);
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.isLoading.set(false);
    }
  }
}
