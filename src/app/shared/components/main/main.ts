import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Aside } from '../aside/aside';

@Component({
  selector: 'app-main',
  imports: [Header, RouterOutlet, Aside],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  protected readonly isMobileSidebarOpen = signal(false);

  protected toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update((v) => !v);
  }

  protected closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}
