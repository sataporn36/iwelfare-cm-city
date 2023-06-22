import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-loan-rights-component',
  templateUrl: './loan-rights-component.component.html',
  styleUrls: ['./loan-rights-component.component.scss']
})
export class LoanRightsComponentComponent implements OnInit {

  userInfo: any;
  sumLoan: any;
  totalLoan: any;
  loanValueNull: any;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private locationStrategy: LocationStrategy,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.userInfo = this.localStorageService.retrieve('employeeofmain');
    this.sumLoan = this.userInfo?.salary * 10;
    this.totalLoan = this.sumLoan - this.userInfo?.loanBalance;
    
    if (this.userInfo?.loanValue == 0.0) {
      this.loanValueNull = true;
    }
  }
}
