import { Component, inject, OnInit } from '@angular/core';
import { AuthFacade } from '../../services/auth.facade';
import { AdminPasswordNavComponent } from '../../components/admin-password-nav/admin-password-nav';
import { AdminPasswordTableComponent } from '../../components/admin-password-table/admin-password-table';
import { AdminPasswordModalComponent } from '../../components/admin-password-modal/admin-password-modal';

@Component({
  selector: 'app-admin-password-management',
  imports: [AdminPasswordNavComponent, AdminPasswordTableComponent, AdminPasswordModalComponent],
  templateUrl: './admin-password-management.html',
})
export class AdminPasswordManagementPage implements OnInit {
  private readonly facade = inject(AuthFacade);

  ngOnInit(): void {
    void this.facade.loadManagedUsers('doctors');
  }
}
