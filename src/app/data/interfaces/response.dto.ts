import { ErrorDto } from './error.dto';

export interface ResponseDto<T> {
  result: 'SUCCESS' | 'FAIL' | 'OK';
  message?: string;
  data?: T;
  error?: ErrorDto;
}
