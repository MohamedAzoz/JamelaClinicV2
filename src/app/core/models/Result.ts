export interface Result<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
}
