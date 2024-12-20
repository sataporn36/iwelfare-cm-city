export interface AdminLoanReq {
  criteria?: AdminLoanCriteria;
  order?: AdminLoanOrder;
  pageReq: {
    page: number;
    pageSize: number;
  };
}

export interface AdminLoanCriteria {
  employeeCode?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  idCard?: string | undefined;
  loanNo?: string | undefined;
  newMonth?: string | undefined;
  newYear?: string | undefined;
}

export interface AdminLoanOrder {
  id: string;
  createDate: string;
}
