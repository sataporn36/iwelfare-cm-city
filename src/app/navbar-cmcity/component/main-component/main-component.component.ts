import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/model/employee';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit {
  formModel!: FormGroup;

  constructor(
    private service: MainService,
  ) { }

  ngOnInit(): void {
    const id = 1;
    this.getEmployee(id);
    this.initMainForm();
  }

  initMainForm() {
    this.formModel = new FormGroup({
      id: new FormControl(null),
      employeeCode: new FormControl(null),
      prefix: new FormControl(null),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      idCard: new FormControl(null),
      gender: new FormControl(null),
      maritalStatus: new FormControl(null),
      birthday: new FormControl(null),
      age: new FormControl(null),
      position: new FormControl(null),
      // affiliation
      // employeeType
      // level
      salary: new FormControl(null),
      compensation: new FormControl(null),
      contractStartDate: new FormControl(null),
      civilServiceDate: new FormControl(null),
      employeeStatus: new FormControl(null),
      billingStartDate: new FormControl(null),
      monthlyStockMoney: new FormControl(null),
      // address
      // contact
      dateOfDeath: new FormControl(null),
      resignationDate: new FormControl(null),
      approvedResignationDate: new FormControl(null),
      retirementDate: new FormControl(null),
      salaryBankAccountNumber: new FormControl(null),
      bankAccountReceivingNumber: new FormControl(null),
      reason: new FormControl(null),
      description: new FormControl(null),
      // user
      // stock
      // loan
      approveFlag: new FormControl(null),

      // custom
      fullName: new FormControl(null),
      positionName: new FormControl(null),
    });
    this.formModel.markAllAsTouched();
  }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      this.formModel.patchValue({
        ...data,
        fullName: data.firstName + ' ' + data.lastName,
        positionName: data.position.name
      })
    });
  }

  // TODO: ImgProfile
  checkImgProfile(gender: any) {
    let textGender = ""
    switch (gender) {
      case 'ชาย':
        textGender = "assets/images/boy.png"
        break;
      case 'หญิง':
        textGender = "assets/images/girl.png"
        break;
      default:
        break;
    }

    return textGender
  }
}
