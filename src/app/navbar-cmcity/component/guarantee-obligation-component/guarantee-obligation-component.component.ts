import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-guarantee-obligation-component',
  templateUrl: './guarantee-obligation-component.component.html',
  styleUrls: ['./guarantee-obligation-component.component.scss']
})
export class GuaranteeObligationComponentComponent implements OnInit {

  formModel!: FormGroup;
  userInfo: any;
  guarantor: any;
  guarantorIf: any;
  guarantee: any;
  guaranteeIf: any;
  userId: any;

  constructor(
    private service: MainService,
    protected router: Router,
    protected route: ActivatedRoute,
    private locationStrategy: LocationStrategy,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('foo')
    this.initMainForm();
    this.userInfo = this.localStorageService.retrieve('employeeofmain');
    this.userId = this.localStorageService.retrieve('empId');
    // this.getEmployeeOfMain(this.userInfo);
    this.getGuarantor(this.userId);
    this.getGuarantee(this.userId);
    this.preventBackButton();
  }

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, '', location.href);
    })
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
      stockAccumulate: new FormControl(null),
      loanValue: new FormControl(null),
      approveFlag: new FormControl(null),
      fullName: new FormControl(null),
      positionName: new FormControl(null),
    });
  }

  // getEmployeeOfMain(data: any): void {

  //   // this.formModel.patchValue({
  //   //   ...data,
  //   //   fullName: data.firstName + ' ' + data.lastName
  //   // })
  // }

  getGuarantor(id: any) {
    this.service.getGuarantor(id).subscribe(data => {
      this.guarantor = data;
      if (data.codeGuarantorOne == null) {
        this.guarantorIf = true;
      }else{
        this.guarantorIf = false;
      }
    });
  }

  getGuarantee(id: any) {
    this.service.getGuarantee(id).subscribe(data => {

      console.log(data);
      this.guarantee = data;
      if (data.codeGuaranteeOne == null) {
        this.guaranteeIf = true;
      }else{
        this.guaranteeIf = false;
      }
    });
  }

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
