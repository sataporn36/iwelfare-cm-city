import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';
import {CalendarModule} from 'primeng/calendar';

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.scss']
})
export class ProfileComponentComponent implements OnInit {
  formModel!: FormGroup;
  periodMonthDescOption: any = [];
  date: Date | any;
  selected!: Date;
  isInline = true;
  mode: boolean = true;
  textString: string = 'form-control-plaintext';
  textSelect: string = 'form-control';
  constructor(private primengConfig: PrimeNGConfig, private service: MainService, protected router: Router) { }


  ngOnInit(): void {
    const id = 1;
    this.getEmployee(id);
    this.initMainForm();
    this.formModel.disable();
    this.setperiodMonthDescOption();
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
      affiliation: new FormControl(null),
      employeeType: new FormControl(null),
      level: new FormControl(null),
      salary: new FormControl(null),
      compensation: new FormControl(null),
      contractStartDate: new FormControl(null),
      civilServiceDate: new FormControl(null),
      employeeStatus: new FormControl(null),
      billingStartDate: new FormControl(null),
      monthlyStockMoney: new FormControl(null),
      // address
      contact: new FormControl(null),
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
      affiliationName: new FormControl(null),
      employeeTypeName: new FormControl(null),
      levelName: new FormControl(null),

      // custom contact
      tel: new FormControl(null),
      officePhone: new FormControl(null),
      email: new FormControl(null),
      fax: new FormControl(null),
      lineId: new FormControl(null),
      facebook: new FormControl(null),
      address: new FormControl(null),
    });
  }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      this.formModel.patchValue({
        ...data, 
        fullName: data.firstName + ' ' + data.lastName,
        positionName: data.position.name,
        affiliationName: data.affiliation.name,
        employeeTypeName: data.employeeType.name,
        levelName: data.level.name,
        birthday: this.pipeDateTH(data.birthday),
        age: this.transformAge(data.birthday),

        tel: data.contact.tel,
        officePhone: data.contact.officePhone,
        email: data.contact.email,
        fax: data.contact.fax,
        lineId: data.contact.lineId,
        facebook: data.contact.facebook,
        address: data.contact.address,
      })
    });
  }

  pipeDateTH(date: any){
    const format = new Date(date)
    const day = format.getDate()
    const month = format.getMonth()
    const year = format.getFullYear() + 543

    const monthSelect = this.periodMonthDescOption[month];

    return day + ' ' + monthSelect.label + ' ' + year
  }

  setperiodMonthDescOption() {
    this.periodMonthDescOption = [
      { value: '01', label: 'มกราคม' },
      { value: '02', label: 'กุมภาพันธ์' },
      { value: '03', label: 'มีนาคม' },
      { value: '04', label: 'เมษายน' },
      { value: '05', label: 'พฤษภาคม' },
      { value: '06', label: 'มิถุนายน' },
      { value: '07', label: 'กรกฎาคม' },
      { value: '08', label: 'สิงหาคม' },
      { value: '09', label: 'กันยายน' },
      { value: '10', label: 'ตุลาคม' },
      { value: '11', label: 'พฤศจิกายน' },
      { value: '12', label: 'ธันวาคม' },
    ];
  }

  transformAge(dateOfBirth: any): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  checkImgProfile(gender: any) {
    let textGender = ""
    switch (gender) {
      case 'ชาย':
        textGender = "assets/images/boy.png"
        break;
      case 'หญิง':
        textGender = "assets/images/girlV2.png"
        break;
      default:
        break;
    }

    return textGender
  }

  onClickEdit(){

    this.textString = 'form-control';
    this.mode = false;
    this.formModel.enable();

  }

  onClickCancal(){
    this.mode = true;
    this.formModel.disable();
    this.textString = 'form-control-plaintext';
    this.formModel.reset();
    this.ngOnInit();
  }
  
  accept(){}
  reject(){}
}
