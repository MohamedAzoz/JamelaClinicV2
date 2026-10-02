import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from '@shared/components/loading/loading';
import { Toast } from '@shared/components/toast/toast';
import { ConfirmModalComponent } from '@shared/components/confirm-modal';

@Component({
  imports: [RouterOutlet, Toast, Loading, ConfirmModalComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Jamela Clinics');
}

