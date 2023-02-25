import { Positions } from "./position";

export interface Employee {
    id: number;
    employeeCode: string;
    prefix: string;
    firstName: string;
    lastName: string;
    idCard: string;
    gender: string;
    maritalStatus: number;
    birthday: Date;
    age: number;
    position: Positions;
    // affiliation
    // employeeType
    // level
    salary: number;
    compensation: string;
    contractStartDate: string;
    civilServiceDate: string;
    employeeStatus: number;
    billingStartDate: Date;
    monthlyStockMoney: number;
    // address
    // contact
    dateOfDeath: Date;
    resignationDate: Date;
    approvedResignationDate: Date;
    retirementDate: Date;
    salaryBankAccountNumber: Date;
    bankAccountReceivingNumber: Date;
    reason: string;
    description: string;
    // user
    // stock
    // loan
    approveFlag: boolean;

}