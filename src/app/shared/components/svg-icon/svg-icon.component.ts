import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBookMedical,
  faBox,
  faCalendar,
  faCalendarCheck,
  faFileMedical,
  faGear,
  faHospital,
  faMoneyBillTrendUp,
  faTableCellsLarge,
  faTram,
  faUserDoctor,
  faUsers,
  faGift,
  faWheelchair,
  faBuilding,
  faWallet,
  faFlask,
  faKey,
  faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  host: {
    class: 'block w-full h-full',
  },
  imports: [FontAwesomeModule],
})
export class SvgIconComponent {
  icon = input.required<string>();

  faLab = faFlask;
  faSchedule = faCalendar;
  faDashboard = faTableCellsLarge;
  faDoctors = faUserDoctor;
  faClinics = faHospital;
  faAppointments = faBookMedical;
  faLogs = faClockRotateLeft;
  // faQueue = faPeopleGroup;
  faVisits = faWheelchair;
  faPayment = faMoneyBillTrendUp;
  faUsers = faUsers;
  faSettings = faGear;
  faRequests = faCalendarCheck;
  faInventory = faBox;
  faDiscount = faGift;
  faInventoryDamaged = faTram;
  faWallet = faWallet;
  faCompany = faBuilding;
  faManagePassword = faKey;
}
