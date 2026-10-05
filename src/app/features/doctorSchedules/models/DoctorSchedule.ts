export interface DoctorSchedule {
  id: number;
  doctorId: string;
  doctorName: string;
  clinicId?: number;
  clinicName?: string;
  date: Date;
  dayName: string;
  isActive: boolean;
  appointmentsCount: number;
}
