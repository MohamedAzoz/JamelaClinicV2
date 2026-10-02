export interface DoctorSchedule {
  id: number;
  doctorId: string;
  doctorName: string;
  date: Date;
  dayName: string;
  isActive: boolean;
  appointmentsCount: number;
}
