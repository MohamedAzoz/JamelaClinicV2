export interface RegisterEmployeeRequest {
  username: string;
  fullName: string;
  password: string;
  roleName: 'Accountant' | 'Reception';
}
// {
//   "username": "string",
//   "fullName": "string",
//   "password": "string",
//   "roleName": "string"
// }
