export interface ErrorDto {
  code: string;
  message?: string;
  data?: Record<string, any>;
}
