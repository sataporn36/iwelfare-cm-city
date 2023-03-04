import { Affiliation } from "./affiliation";
import { Beneficiary } from "./beneficiary";
import { Contact } from "./contact";
import { EmployeeType } from "./employee-type";
import { Level } from "./level";
import { Positions } from "./position";

export interface Employee {
    id: number;
    employeeCode: string;
    prefix: string;
    firstName: string;
    lastName: string;
    idCard: string;
    gender: string;
    maritalStatus: string;
    birthday: Date;
    // age: number;
    position: Positions;
    affiliation: Affiliation
    employeeType: EmployeeType
    level: Level
    salary: number;
    compensation: string;
    contractStartDate: string;
    civilServiceDate: string;
    employeeStatus: number;
    billingStartDate: Date;
    monthlyStockMoney: number;
    // address
    contact: Contact
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
    beneficiaries: [Beneficiary]
    approveFlag: boolean;

}