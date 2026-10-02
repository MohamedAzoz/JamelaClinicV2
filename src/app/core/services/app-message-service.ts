import { Service, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface ToastMessage {
  id: number;
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
}
@Service()
export class AppMessageService {
  readonly toasts = signal<ToastMessage[]>([]);
  private nextId = 0;

  addSuccessMessage(message: string): void {
    this.add({ severity: 'success', summary: 'success', detail: message });
  }

  addInfoMessage(message: string): void {
    this.add({ severity: 'info', summary: 'Info', detail: message });
  }

  addWarnMessage(message: string): void {
    this.add({ severity: 'warn', summary: 'Warning', detail: message });
  }

  addErrorMessage(message: string): void {
    this.add({ severity: 'error', summary: 'Error', detail: message });
  }

  addErrorMessages(messages: string[]): void {
    messages.forEach((msg) => this.addErrorMessage(msg));
  }

  remove(id: number) {
    this.toasts.update((messages) => messages.filter((m) => m.id !== id));
  }

  private add(message: Omit<ToastMessage, 'id'>) {
    const id = this.nextId++;
    this.toasts.update((messages) => [...messages, { ...message, id }]);
    setTimeout(() => this.remove(id), 5000); // Auto remove after 5s
  }

  buildHttpErrorDetail(error: unknown, productionMessage: string): string {
    const statusCode = this.readStatusCode(error);

    if (environment.production) {
      return statusCode ? `${productionMessage} (Status: ${statusCode})` : productionMessage;
    }

    const backendMessage = this.readBackendMessage(error);
    if (backendMessage && statusCode) {
      return `${backendMessage} (Status: ${statusCode})`;
    }

    if (backendMessage) {
      return backendMessage;
    }

    return statusCode ? `${productionMessage} (Status: ${statusCode})` : productionMessage;
  }

  showHttpError(error: unknown, productionMessage: string): string {
    const detail = this.buildHttpErrorDetail(error, productionMessage);
    this.addErrorMessage(detail);
    return detail;
  }

  private readBackendMessage(error: unknown): string | null {
    const candidate = error as Record<string, unknown> | null;

    const fromNestedError =
      (candidate?.['error'] as Record<string, unknown> | undefined)?.['errorMessage'] ??
      (candidate?.['error'] as Record<string, unknown> | undefined)?.['message'];

    if (typeof fromNestedError === 'string' && fromNestedError.trim().length > 0) {
      return fromNestedError;
    }

    const fromRoot = candidate?.['errorMessage'] ?? candidate?.['message'];
    if (typeof fromRoot === 'string' && fromRoot.trim().length > 0) {
      return fromRoot;
    }

    return null;
  }

  private readStatusCode(error: unknown): number | null {
    const candidate = error as Record<string, unknown> | null;

    const status =
      candidate?.['status'] ??
      candidate?.['statusCode'] ??
      (candidate?.['error'] as Record<string, unknown> | undefined)?.['statusCode'];

    return typeof status === 'number' ? status : null;
  }
}
