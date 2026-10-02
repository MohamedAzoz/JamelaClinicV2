export interface AppointmentsStatistics {
  totalAppointments: number;
  unpaidCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  totalNetConsultationFees: number; // new
  totalMaterialsCost: number; // new
  totalDoctorEarnings: number;
  totalCenterEarnings: number;
}

/** "totalAppointments": 0,
    "unpaidCount": 0,
    "inProgressCount": 0,
    "completedCount": 0,
    "cancelledCount": 0,
    "totalNetConsultationFees": 0,
    "totalMaterialsCost": 0,
    "totalDoctorEarnings": 0,
    "totalCenterEarnings": 0 */
