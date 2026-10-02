import { Component, inject, OnInit } from '@angular/core';
import { AuthFacade } from '../../services/auth.facade';
import { UserLoginLogToolbarComponent } from '../../components/user-login-log-toolbar/user-login-log-toolbar';
import { UserLoginLogTableComponent } from '../../components/user-login-log-table/user-login-log-table';

@Component({
  selector: 'app-user-login-log',
  imports: [UserLoginLogToolbarComponent, UserLoginLogTableComponent],
  templateUrl: './user-login-log.html', 
})
export class UserLoginLogPage implements OnInit {
  public facade = inject(AuthFacade);

  ngOnInit(): void {
    void this.facade.loadUserLoginLogs();
  }
}
