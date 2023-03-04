import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';
import { Beneficiary } from 'src/app/model/beneficiary';
import { Observable } from 'rxjs';

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
  // beneficiary: Beneficiary | any;
   beneficiarys: Observable<Beneficiary[]> | any 
  controls: any;
  wife!: Boolean;
  
  // checked: boolean;
  // checked: boolean = true;
  // checked1: boolean = false;

  // checked2: boolean = true;

  constructor(private primengConfig: PrimeNGConfig, private service: MainService, protected router: Router) { }

  ngOnInit(): void {
    const id = 1;
    this.getEmployee(id);
    this.initMainForm();
    this.formModel.disable();
    this.setperiodMonthDescOption();
    // this.getMarital();
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
      marital: new FormControl(null),
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
      bureauName: new FormControl(null),
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

      relationship: new FormControl('0'),
      birthdayCalendar: new FormControl(null),
      checkState: new FormControl(true),

      textHidden: new FormControl(null),
      // beneficiary
      // beneficiarys: new FormControl(null),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl(null),
      beneficiaryMarital: new FormControl(null),
      // wife: new FormControl(null),
    });
  }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      this.formModel.patchValue({
        ...data, 
        fullName: data.firstName + ' ' + data.lastName,
        positionName: data.position?.name ? data.position?.name: '-',
        affiliationName: data.affiliation?.name ? data.affiliation?.name: '-',
        bureauName: data.affiliation?.bureau?.name ? data.affiliation?.bureau?.name: '-',
        employeeTypeName: data.employeeType?.name ? data.employeeType?.name: '-',
        levelName: data.level?.name ? data.level?.name: '-',
        birthday: this.pipeDateTH(data?.birthday),
        birthdayCalendar: new Date(data.birthday),
        age: this.transformAge(data.birthday),
        
        // contact
        tel: data.contact?.tel ? data.contact?.tel: '-',
        officePhone: data.contact?.officePhone ? data.contact?.officePhone: '-',
        email: data.contact?.email ? data.contact?.email: '-',
        fax: data.contact?.fax ? data.contact?.fax: '-',
        lineId: data.contact?.lineId ? data.contact?.lineId: '-',
        facebook: data.contact?.facebook ? data.contact?.facebook: '-',
        address: data.contact?.address ? data.contact?.address: '-',
        
        retirementDate: this.checkRetirementDate(data?.birthday),

        compensation: data.compensation ? data.compensation: '-',
        contractStartDate: data.contractStartDate ? data.contractStartDate: '-',
        civilServiceDate: data.civilServiceDate ? data.civilServiceDate: '-',
        employeeStatus:  data.employeeStatus ? data.employeeStatus: '-',
        billingStartDate: data.billingStartDate ? data.billingStartDate: '-',
        monthlyStockMoney: data.monthlyStockMoney ? data.monthlyStockMoney: '-',
        salaryBankAccountNumber: data.salaryBankAccountNumber ? data.salaryBankAccountNumber: '-',
        bankAccountReceivingNumber: data.bankAccountReceivingNumber ? data.bankAccountReceivingNumber: '-',
        // beneficiary
        // beneficiary = data.beneficiary,
        // if (data.beneficiary?.relationship == 'บิดา'){
        // }
        // Object.keys(data.beneficiaries).forEach(name => {
        //   if (this.controls[name]) {
        //     this.controls[name].patchValue(value[name], {onlySelf: true, emitEvent});
        //   }
        // });
        // beneficiary: data.beneficiaries,
        // data?.beneficiaries.forEach(beneficiarie => {
        //   if (beneficiarie.relationship == 'บิดา') {
        //     dadRelationship: data.beneficiaries?.relationship,
        //   }
        // }),
        // beneficiary: data.beneficiaries,
        // if (beneficiary.relationship === 'บิดา') {
        // }

        // beneficiary: data.beneficiaries,
        beneficiaryPrefix: data.beneficiaries?.prefix,
        beneficiaryFirstName: data.beneficiaries?.firstName,
        beneficiaryLastName: data.beneficiaries?.lastName,
        // beneficiaryGender: data.beneficiary?.gender,
        beneficiaryBirthday: data.beneficiaries?.birthday,
        beneficiaryRelationship: data.beneficiaries?.relationship,
        beneficiaryMarital: data.beneficiaries?.marital,
      })

      // this.beneficiarys = data.beneficiaries
      // console.log("beneficiary -----------------> ", data.beneficiaries);
      // console.log("beneficiary -----------------> ", this.beneficiary);
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

  checkRetirementDate(dateOfBirth: any){
    const formatDate = new Date(dateOfBirth)
    const day = formatDate.getDate()
    const month = formatDate.getMonth() + 1
    const year = formatDate.getFullYear() + 543
    
    const monthSelect = this.periodMonthDescOption[month - 1];
    if(month > 9){
      return day + ' ' + monthSelect.label + ' ' + (year + 61)
    }else{
      return day + ' ' + monthSelect.label + ' ' + (year + 60)
    }
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

  // onClickWife(event: any){
  //   this.wife = true;
  //   console.log("event-------------------- ", event.target.value);
    
  // }

  handleChange(e: any) {
    // let isChecked = e.checked;
    if (e.checked) {
      this.wife = true;
    }else{
      this.wife = false;
    }

    console.log(e.checked);
    
  }
  // getMarital(): void {
  //   this.service.searchMarital().subscribe(data => {this.marital = data
  //   // console.log(data);
  //   });
  
  
  // }
  
  accept(){}
  reject(){}
}
