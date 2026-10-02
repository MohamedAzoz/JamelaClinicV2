export interface RegisterEmployeeRequest {
  username: string;
  fullName: string;
  password: string;
  roleName: 'Accountant' | 'Reception';
}
