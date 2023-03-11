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
    marital: string;
    birthday: Date;
    // age: number;
    position: Positions;
    affiliation: Affiliation
    employeeType: EmployeeType
    level: Level
    salary: number;
    compensation: string;
    contractStartDate: Date;
    civilServiceDate: Date;
    employeeStatus: number;
    billingStartDate: Date;
    monthlyStockMoney: number;
    // address
    contact: Contact
    dateOfDeath: Date;
    resignationDate: Date;
    approvedResignationDate: Date;
    retirementDate: Date;
    salaryBankAccountNumber: string;
    bankAccountReceivingNumber: string;
    reason: string;
    description: string;
    // user
    // stock
    // loan
    beneficiaries: [Beneficiary]
    approveFlag: boolean;

}