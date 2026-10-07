export interface DoctorSchedule {
  id: number;
  doctorId: string;
  doctorName: string;
  date: Date;
  dayName: string;
  isActive: boolean;
  appointmentsCount: number;
}
// {
//     "id": 0,
//     "doctorId": "string",
//     "doctorName": "string",
//     "date": "2026-10-07",
//     "dayName": "string",
//     "isActive": true,
//     "appointmentsCount": 0
//   }
