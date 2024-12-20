export interface AdminEmployeeRes {
  contents: ListAdminEmployee[];
  totalPages: number;
  totalElements: number;
}

export interface ListAdminEmployee {
  id: number;
  employeeCode: string;
  prefix: string;
  firstName: string;
  lastName: string;
  idCard: string;
  gender: string;
  birthday: Date;
  age: number;
  employeeStatus: number;
  levelName: string;
  employeeTypeName: string;
  positionName: string;
  departmentName: string;
  affiliationName: string;
  bureauName: string;
  imageId: number;
  image: string;
}
