import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AuthFacade } from '../../services/auth.facade';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header';
import { ProfileDetailsComponent } from '../../components/profile-details/profile-details';

@Component({
  selector: 'app-user-profile',
  imports: [FontAwesomeModule, ProfileHeaderComponent, ProfileDetailsComponent],
  templateUrl: './profile.html',
})
export class UserProfilePage implements OnInit {
  public facade = inject(AuthFacade);

  readonly faSpinner = faSpinner;

  ngOnInit(): void {
    void this.facade.loadUserProfile();
  }
}
