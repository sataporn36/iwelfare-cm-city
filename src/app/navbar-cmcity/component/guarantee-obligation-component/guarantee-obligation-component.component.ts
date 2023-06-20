import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-guarantee-obligation-component',
  templateUrl: './guarantee-obligation-component.component.html',
  styleUrls: ['./guarantee-obligation-component.component.scss']
})
export class GuaranteeObligationComponentComponent implements OnInit {

  formModel!: FormGroup;
  userInfo: any;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private locationStrategy: LocationStrategy,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      history.go(0);
    } else {
      localStorage.removeItem('foo')
      this.initMainForm();
      this.userInfo = this.localStorageService.retrieve('employeeofmain');
      this.getEmployeeOfMain(this.userInfo);
    }
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

  getEmployeeOfMain(data: any): void {
    this.formModel.patchValue({
      ...data,
      fullName: data.firstName + ' ' + data.lastName
    })
  }
}
