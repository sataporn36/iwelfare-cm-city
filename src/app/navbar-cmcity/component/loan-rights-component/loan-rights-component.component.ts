import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexFill,
  ApexLegend,
  ApexPlotOptions
} from "ng-apexcharts";

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
  chartPie: ChartPie;
  chartBar: ChartBar;
  widthPie: any;
  widthBar: any;
  heightBar: any;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.userInfo = this.localStorageService.retrieve('employeeofmain');
    this.sumLoan = this.userInfo?.salary * 10;
    this.totalLoan = this.sumLoan - this.userInfo?.loanBalance;

    if (this.userInfo?.loanValue == 0.0) {
      this.loanValueNull = true;
    }

    if (window.innerWidth > 1680) {
      this.widthPie = 429;
      this.widthBar = 940;
      this.heightBar = 310;
    } else if (window.innerWidth > 1600){
      this.widthPie = 429;
      this.widthBar = 810;
      this.heightBar = 310;
    } else if (window.innerWidth >= 1529){
      this.widthPie = 429;
      this.widthBar = 750;
      this.heightBar = 310;
    } else if (window.innerWidth > 1366){
      this.widthPie = 400;
      this.widthBar = 780;
      this.heightBar = 286;
    } else if (window.innerWidth > 1280){
      this.widthPie = 380;
      this.widthBar = 648;
      this.heightBar = 268;
    } else if (window.innerWidth > 1240){
      this.widthPie = 360;
      this.widthBar = 600;
      this.heightBar = 253;
    } else {
      this.widthPie = 350;
      this.widthBar = 580;
      this.heightBar = 245;
    }

    const documentStyle = getComputedStyle(document.documentElement);

    this.chartPie = {
      series: [this.sumLoan, this.userInfo.loanBalance],
      chart: {
        width: this.widthPie,
        type: "pie",
        fontFamily: 'Kanit, sans-serif'
      },
      labels: ['เงินกู้สามัญสูงสุด', 'หนี้เงินกู้คงเหลือ'],
      responsive: [],
      colors: [
        documentStyle.getPropertyValue('--pink-800'),
        documentStyle.getPropertyValue('--pink-600'),
      ],
      legend: {
        position: 'bottom',
        fontSize: '14px',
      }
    };

    this.chartBar = {
      series: [
        {
          name: "จำนวนเงิน",
          data: [900000, this.sumLoan, this.userInfo.loanBalance, this.totalLoan]
        }
      ],
      chart: {
        type: "bar",
        width: this.widthBar,
        height: this.heightBar,
        stacked: true,
        fontFamily: 'Kanit, sans-serif'
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      dataLabels: {
        formatter: (val) => {
          return Number(val) / 1000 + "K";
        }
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          distributed: true
        }
      },
      xaxis: {
        categories: [
          "กู้ได้ไม่เกิน",
          "เงินกู้สามัญสูงสุด",
          "หนี้เงินกู้คงเหลือ",
          "ประมาณการรับเงินสุทธิ"
        ],
        labels: {
          style: {
            colors: [
              documentStyle.getPropertyValue('--pink-800'),
              documentStyle.getPropertyValue('--pink-600'),
            ],
            fontSize: "14px"
          }
        }
      },
      fill: {
        opacity: 1
      },
      colors: [
        documentStyle.getPropertyValue('--pink-800'),
        documentStyle.getPropertyValue('--pink-600'),
        documentStyle.getPropertyValue('--purple-800'),
        documentStyle.getPropertyValue('--purple-600'),
      ],
      yaxis: {
        labels: {
          formatter: (val) => {
            return val / 1000 + "K";
          }
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "14px"
      }
    };
  }
}

interface ChartPie {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  colors?: string[];
  legend: ApexLegend;
}

interface ChartBar {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
}