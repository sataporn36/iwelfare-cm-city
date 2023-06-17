// import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { LocalStorageService } from 'ngx-webstorage';
// import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {

  // formModel!: FormGroup;
  // userId: any;
  // countDemo: any;

  // countDate = new Date("march 25, 2023 15:37:25").getTime();
  // x = setInterval(() => {
  //   let now = new Date().getTime();
  //   let distance = this.countDate - now;
  //   let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //   let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //   let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  //   this.countDemo = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  // })

  // constructor(
  //   protected router: Router,
  //   protected route: ActivatedRoute,
  //   private service: MainService,
  //   private locationStrategy: LocationStrategy,
  //   private localStorageService: LocalStorageService,
  // ) {}

  // ngOnInit(): void {
  //   if (!localStorage.getItem('foo')) {
  //     localStorage.setItem('foo', 'no reload');
  //     history.go(0);
  //   } else {
  //     localStorage.removeItem('foo')
  //     this.initMainForm();
  //     this.userId = this.localStorageService.retrieve('empId');
  //     this.getEmployee(this.userId);
  //   }
  //   this.preventBackButton();
  // }

  // preventBackButton() {
  //   history.pushState(null, '', location.href);
  //   this.locationStrategy.onPopState(() => {
  //     history.pushState(null, '', location.href);
  //   })
  // }

  // initMainForm() {
  //   this.formModel = new FormGroup({
  //     id: new FormControl(null),
  //     employeeCode: new FormControl(null),
  //     prefix: new FormControl(null),
  //     firstName: new FormControl(null),
  //     lastName: new FormControl(null),
  //     idCard: new FormControl(null),
  //     gender: new FormControl(null),
  //     maritalStatus: new FormControl(null),
  //     birthday: new FormControl(null),
  //     age: new FormControl(null),
  //     position: new FormControl(null),
  //     // affiliation
  //     // employeeType
  //     // level
  //     salary: new FormControl(null),
  //     compensation: new FormControl(null),
  //     contractStartDate: new FormControl(null),
  //     civilServiceDate: new FormControl(null),
  //     employeeStatus: new FormControl(null),
  //     billingStartDate: new FormControl(null),
  //     monthlyStockMoney: new FormControl(null),
  //     // address
  //     // contact
  //     dateOfDeath: new FormControl(null),
  //     resignationDate: new FormControl(null),
  //     approvedResignationDate: new FormControl(null),
  //     retirementDate: new FormControl(null),
  //     salaryBankAccountNumber: new FormControl(null),
  //     bankAccountReceivingNumber: new FormControl(null),
  //     reason: new FormControl(null),
  //     description: new FormControl(null),
  //     // user
  //     stock: new FormControl(null),
  //     stockAccumulate: new FormControl(null),

  //     loan: new FormControl(null),
  //     loanValue: new FormControl(null),

  //     approveFlag: new FormControl(null),

  //     // custom
  //     fullName: new FormControl(null),
  //     positionName: new FormControl(null),
  //   });
  // }

  // getEmployee(id: any): void {
  //   this.service.getEmployee(id).subscribe(data => {
  //     this.formModel.patchValue({
  //       ...data,
  //       fullName: data.firstName + ' ' + data.lastName,
  //       positionName: data.position.name,
  //       stockAccumulate: data.stock?.stockAccumulate ? data.stock?.stockAccumulate : '',
  //       loanValue: data.loan?.loanValue ? data.loan?.loanValue : '',
  //     })

  //     console.log(data);

  //   });
  // }

}
