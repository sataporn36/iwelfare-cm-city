export interface AdminStockRes {
  contents: ListAdminStock[];
  totalPages: number;
  totalElements: number;
}

export interface ListAdminStock {
  id: number;
  stockValue: number;
  stockAccumulate: number;
  employeeCode: string;
  prefix: string;
  firstName: string;
  lastName: string;
  employeeStatus: number;
  idCard: string;
  status: string;
  employeeId: number;
}
