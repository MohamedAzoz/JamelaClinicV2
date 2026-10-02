import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-material-dialog',
  template: `
    <dialog
      #dialog
      dir="rtl"
      aria-labelledby="material-dialog-title"
      [attr.aria-busy]="busy()"
      (cancel)="cancel($event)"
      class="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-primary/15 bg-surface p-0 text-text shadow-xl backdrop:bg-black/50"
    >
      <header class="flex items-center justify-between gap-4 border-b border-primary/10 p-5">
        <h2 id="material-dialog-title" class="text-lg font-bold">{{ title() }}</h2>
        <button
          type="button"
          aria-label="إغلاق النافذة"
          (click)="close()"
          [disabled]="busy()"
          class="flex size-10 items-center justify-center rounded-lg border border-primary/20 text-2xl disabled:opacity-50"
        >
          ×
        </button>
      </header>
      <div class="p-5"><ng-content /></div>
    </dialog>
  `,
})
export class MaterialDialogComponent implements OnDestroy {
  readonly title = input.required<string>();
  readonly busy = input(false);
  readonly closed = output<void>();
  private readonly document = inject(DOCUMENT);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private previousFocus: HTMLElement | null = null;

  constructor() {
    afterNextRender(() => {
      const active = this.document.activeElement;
      this.previousFocus = active instanceof HTMLElement ? active : null;
      this.dialog().nativeElement.showModal();
    });
  }
  close(): void {
    if (!this.busy()) this.closed.emit();
  }
  cancel(event: Event): void {
    event.preventDefault();
    this.close();
  }
  ngOnDestroy(): void {
    this.dialog().nativeElement.close();
    const target =
      this.previousFocus?.isConnected && !this.previousFocus.matches(':disabled')
        ? this.previousFocus
        : this.document.getElementById('materials-heading');
    target?.focus();
  }
}
