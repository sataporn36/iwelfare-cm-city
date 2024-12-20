export interface AdminStockReq {
  criteria?: AdminStockCriteria;
  order?: AdminStockOrder;
  pageReq: {
    page: number;
    pageSize: number;
  };
}

export interface AdminStockCriteria {
  employeeCode?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  idCard?: string | undefined;
}

export interface AdminStockOrder {
  id: string;
  createDate: string;
}
