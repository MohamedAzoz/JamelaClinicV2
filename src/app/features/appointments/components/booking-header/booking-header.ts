import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarPlus, faHospitalUser, faClock, faUserCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-booking-header',
  imports: [FontAwesomeModule],
  templateUrl: './booking-header.html',
})
export class BookingHeaderComponent {
  readonly faCalendarPlus = faCalendarPlus;
  readonly faHospitalUser = faHospitalUser;
  readonly faClock = faClock;
  readonly faUserCheck = faUserCheck;
}
