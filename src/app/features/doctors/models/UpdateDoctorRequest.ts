export interface UpdateDoctorRequest {
  userId: string;
  fullName: string;
  clinicId: number;
  doctorPercentage: number;
  isActive: boolean;
}
