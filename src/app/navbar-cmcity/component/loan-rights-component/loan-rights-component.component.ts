import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import * as ApexCharts from 'apexcharts';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-loan-rights-component',
  templateUrl: './loan-rights-component.component.html',
  styleUrls: ['./loan-rights-component.component.scss'],
})
export class LoanRightsComponentComponent implements OnInit {
  userInfo: any;
  sumLoan: any;
  sumLoanBalance: any;
  totalLoan: any;
  loanValueNull: any;
  data: any;
  options: any;
  chartPie: Chart;
  chartBar: Chart;
  widthPie: any;
  widthBar: any;
  heightBar: any;
  sumMaxLoan: number = 0;
  mockPercent: number = 82000;
  loanSumPercent: number = 0;
  periodMonthDescOption: any = [];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}

  onCalculateYearsOfWorking(data: any) {
    const startDate = new Date(data.billingStartDate); // Replace with your start date
    const currentDate = new Date(); // Current date

    // Calculate the difference in milliseconds between the two dates
    const differenceMs = currentDate.getTime() - startDate.getTime();

    // Convert milliseconds to years
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Approximation of milliseconds in a year
    const yearsOfWork = differenceMs / millisecondsPerYear;

    if (Number(yearsOfWork.toFixed(0)) >= 3) {
      this.sumLoan = data.salary * 30;
    } else if (Number(yearsOfWork.toFixed(0)) >= 2) {
      this.sumLoan = data.salary * 20;
    } else if (Number(yearsOfWork.toFixed(0)) >= 1) {
      this.sumLoan = data.salary * 10;
    } else {
      this.sumLoan = data.salary * 10;
    }
  }

  pipeDateTH(date: any) {
    if (date == null) {
      return ' ';
    }

    const format = new Date(date);
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;

    const monthSelect = this.periodMonthDescOption[month];

    return day + ' ' + monthSelect.label + ' ' + year;
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

  ngOnInit(): void {
    this.userInfo = this.localStorageService.retrieve('employeeofmain');
    this.onCalculateYearsOfWorking(this.userInfo);
    this.sumMaxLoan = 900000;
    this.totalLoan = this.sumLoan - this.userInfo?.loanBalance;

    this.sumLoanBalance = this.userInfo.loanValue - this.userInfo.loanBalance;

    this.loanSumPercent = Math.round(
      (this.sumLoanBalance / (this.sumLoanBalance + this.userInfo.loanValue)) *
        100
    );

    if (this.userInfo?.loanValue == 0.0) {
      this.loanValueNull = true;
    }

    this.setperiodMonthDescOption();
    this.chartOne();
    this.chartTwo();
    this.chartThree();
  }

  chartOne() {
    const documentStyle = getComputedStyle(document.documentElement);
    const chartPie = {
      series: [
        this.sumMaxLoan,
        this.mockPercent,
        this.sumLoan,
        this.userInfo.loanBalance,
        this.userInfo.loanValue,
      ],
      chart: {
        width: '200%',
        type: 'donut',
        fontFamily: 'Kanit, sans-serif',
      },
      labels: [
        'กู้ได้ไม่เกิน',
        'ดอกเบี้ย (%)',
        'เงินกู้สามัญสูงสุด',
        'วงเงินกู้ปัจจุบัน',
        'หนี้เงินกู้คงเหลือ',
      ],
      colors: ['#8174A0', '#A2D2DF', '#FFD2A0', '#EFB6C8', '#36B990'],
      legend: {
        position: 'right',
        fontSize: '14px',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '40%',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: function (value, { seriesIndex }) {
            if (seriesIndex === 1) {
              return '5%';
            }
            return value;
          },
        },
      },
    };

    const chart1 = new ApexCharts(
      document.querySelector('#chartPie'),
      chartPie
    );
    chart1.render();
  }

  chartTwo() {
    const documentStyle = getComputedStyle(document.documentElement);
    const loanPie = {
      series: [this.sumLoanBalance, this.userInfo.loanValue],
      chart: {
        width: '100%',
        type: 'donut',
        fontFamily: 'Kanit, sans-serif',
      },
      colors: [
        documentStyle.getPropertyValue('--pink-400'),
        documentStyle.getPropertyValue('--pink-100'),
      ],
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            background: '#ffffff',
            size: '50%',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: [],
    };

    const chart2 = new ApexCharts(document.querySelector('#loanPie'), loanPie);
    chart2.render();
  }

  chartThree() {
    const documentStyle = getComputedStyle(document.documentElement);
    const loanPieNew = {
      series: [this.sumLoan, this.sumMaxLoan],
      chart: {
        width: '100%',
        type: 'donut',
        fontFamily: 'Kanit, sans-serif',
      },
      colors: [
        documentStyle.getPropertyValue('--orange-400'),
        documentStyle.getPropertyValue('--orange-100'),
      ],
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            background: '#ffffff',
            size: '50%',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['เงินกู้สามัญสูงสุด', 'กู้ได้ไม่เกิน'],
    };

    const chart3 = new ApexCharts(
      document.querySelector('#loanPieNew'),
      loanPieNew
    );
    chart3.render();
  }
}
