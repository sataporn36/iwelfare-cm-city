export interface AdminEmployeeReq {
  criteria?: AdminEmployeeCriteria;
  order?: AdminEmployeeOrder;
  pageReq: {
    page: number;
    pageSize: number;
  };
}

export interface AdminEmployeeCriteria {
  employeeCode?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  idCard?: string | undefined;
}

export interface AdminEmployeeOrder {
  id: string;
  createDate: string;
}
