import { LocationStrategy } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  data: any;
  options: any;

  @ViewChild('downloadLink') downloadLinkRef!: ElementRef;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private locationStrategy: LocationStrategy,
    private localStorageService: LocalStorageService
  ) { }

  initiateDownload(): void {
    this.downloadLinkRef.nativeElement.click();
  }

  ngOnInit(): void {
    this.userInfo = this.localStorageService.retrieve('employeeofmain');
    this.sumLoan = this.userInfo?.salary * 10;
    this.totalLoan = this.sumLoan - this.userInfo?.loanBalance;

    if (this.userInfo?.loanValue == 0.0) {
      this.loanValueNull = true;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['เงินกู้สามัญสูงสุด', 'หนี้เงินกู้คงเหลือ'],
      datasets: [
        {
          data: [this.sumLoan, this.userInfo.loanBalance],
          backgroundColor: [documentStyle.getPropertyValue('--pink-800'), documentStyle.getPropertyValue('--pink-600')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--pink-800'), documentStyle.getPropertyValue('--pink-600')]
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
            font: {
              family: 'Kanit, sans-serif',
              size: 16,
            }
          }
        }
      }
    };
  }
}
