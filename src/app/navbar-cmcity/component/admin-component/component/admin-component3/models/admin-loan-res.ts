export interface AdminLoanRes {
  contents: ListAdminLoan[];
  totalPages: number;
  totalElements: number;
}

export interface ListAdminLoan {
  id: number;
  loanValue: number;
  loanBalance: number;
  loanTime: number;
  stockAccumulate: number;
  loanNo: string;
  employeeCode: string;
  employeeStatus: string;
  firstName: string;
  lastName: string;
  idCard: string;
  stockFlag: boolean;
  startLoanDate: string;
  guarantorOne: number;
  guarantorTwo: number;
  loanOrdinary: number;
  interestPercent: number;
  prefix: string;
  guarantorOneValue: string;
  guarantorTwoValue: string;
  interestDetail: number;
  loanBalanceDetail: number;
  loanMonth: string;
  loanYear: string;
  installment: number;
}
