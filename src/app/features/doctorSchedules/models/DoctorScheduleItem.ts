export interface DoctorScheduleItem {
  clinicName: string;
  id: number;
  doctorId: string;
  doctorName: string;
  date: Date;
  dayName: string;
  appointmentsCount: number;
  isActive: boolean;
}
