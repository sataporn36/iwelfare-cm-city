import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import * as ApexCharts from 'apexcharts';
import { Chart } from 'chart.js';

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
  chartPie: Chart;
  chartBar: Chart;
  widthPie: any;
  widthBar: any;
  heightBar: any;
  sumMaxLoan: number = 0;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) { }

  onCalculateYearsOfWorking(data: any){
    const startDate = new Date(data.billingStartDate); // Replace with your start date
    const currentDate = new Date(); // Current date

    // Calculate the difference in milliseconds between the two dates
    const differenceMs = currentDate.getTime() - startDate.getTime();

    // Convert milliseconds to years
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Approximation of milliseconds in a year
    const yearsOfWork = differenceMs / millisecondsPerYear;
   
    if( Number(yearsOfWork.toFixed(0)) >= 3 ){
      this.sumLoan = data.salary * 30;
    }else if( Number(yearsOfWork.toFixed(0)) >= 2 ){
      this.sumLoan = data.salary * 20;
    }else if( Number(yearsOfWork.toFixed(0)) >= 1 ){
      this.sumLoan = data.salary * 10;
    }else{
      this.sumLoan = data.salary * 10;
    }
    //console.log('Years of working time:', yearsOfWork.toFixed(0));
  }

  ngOnInit(): void {
    this.userInfo = this.localStorageService.retrieve('employeeofmain');
    this.onCalculateYearsOfWorking(this.userInfo);
    this.sumMaxLoan = 900000;
    this.totalLoan = this.sumLoan - this.userInfo?.loanBalance;

    if (this.userInfo?.loanValue == 0.0) {
      this.loanValueNull = true;
    }

    const documentStyle = getComputedStyle(document.documentElement);

    const chartPie = {
      series: [this.sumLoan, this.userInfo.loanBalance],
      chart: {
        width: "200%",
        height: 320,
        type: "pie",
        fontFamily: 'Kanit, sans-serif'
      },
      labels: ['เงินกู้สามัญสูงสุด', 'หนี้เงินกู้คงเหลือ'],
      responsive: [
        {
          breakpoint: 1367,
          options: {
            chart: {
              width: "150%"
            }
          }
        },
        {
          breakpoint: 1101,
          options: {
            chart: {
              width: "280%"
            }
          }
        },
        {
          breakpoint: 1001,
          options: {
            chart: {
              width: "260%"
            }
          }
        },
        {
          breakpoint: 991,
          options: {
            chart: {
              width: "255%"
            }
          }
        },
        {
          breakpoint: 971,
          options: {
            chart: {
              width: "250%"
            }
          }
        },
        {
          breakpoint: 951,
          options: {
            chart: {
              width: "245%"
            }
          }
        },
        {
          breakpoint: 931,
          options: {
            chart: {
              width: "240%"
            }
          }
        },
        {
          breakpoint: 911,
          options: {
            chart: {
              width: "235%"
            }
          }
        },
        {
          breakpoint: 891,
          options: {
            chart: {
              width: "230%"
            }
          }
        },
        {
          breakpoint: 871,
          options: {
            chart: {
              width: "225%"
            }
          }
        },
        {
          breakpoint: 861,
          options: {
            chart: {
              width: "220%"
            }
          }
        },
        {
          breakpoint: 851,
          options: {
            chart: {
              width: "215%"
            }
          }
        },
        {
          breakpoint: 841,
          options: {
            chart: {
              width: "210%"
            }
          }
        },
        {
          breakpoint: 831,
          options: {
            chart: {
              width: "208%"
            }
          }
        },
        {
          breakpoint: 821,
          options: {
            chart: {
              width: "206%"
            }
          }
        },
        {
          breakpoint: 811,
          options: {
            chart: {
              width: "204%"
            }
          }
        },
        {
          breakpoint: 801,
          options: {
            chart: {
              width: "202%"
            }
          }
        },
        {
          breakpoint: 791,
          options: {
            chart: {
              width: "200%"
            }
          }
        },
        {
          breakpoint: 781,
          options: {
            chart: {
              width: "195%"
            }
          }
        },
        {
          breakpoint: 771,
          options: {
            chart: {
              width: "190%"
            }
          }
        },
        {
          breakpoint: 761,
          options: {
            chart: {
              width: "188%"
            }
          }
        },
        {
          breakpoint: 751,
          options: {
            chart: {
              width: "186%"
            }
          }
        },
        {
          breakpoint: 741,
          options: {
            chart: {
              width: "184%"
            }
          }
        },
        {
          breakpoint: 731,
          options: {
            chart: {
              width: "182%"
            }
          }
        },
        {
          breakpoint: 721,
          options: {
            chart: {
              width: "180%"
            }
          }
        },
        {
          breakpoint: 711,
          options: {
            chart: {
              width: "178%"
            }
          }
        },
        {
          breakpoint: 701,
          options: {
            chart: {
              width: "176%"
            }
          }
        },
        {
          breakpoint: 691,
          options: {
            chart: {
              width: "174%"
            }
          }
        },
        {
          breakpoint: 681,
          options: {
            chart: {
              width: "172%"
            }
          }
        },
        {
          breakpoint: 671,
          options: {
            chart: {
              width: "170%"
            }
          }
        },
        {
          breakpoint: 661,
          options: {
            chart: {
              width: "168%"
            }
          }
        },
        {
          breakpoint: 651,
          options: {
            chart: {
              width: "166%"
            }
          }
        },
        {
          breakpoint: 641,
          options: {
            chart: {
              width: "164%"
            }
          }
        },
        {
          breakpoint: 631,
          options: {
            chart: {
              width: "160%"
            }
          }
        },
        {
          breakpoint: 621,
          options: {
            chart: {
              width: "156%"
            }
          }
        },
        {
          breakpoint: 611,
          options: {
            chart: {
              width: "152%"
            }
          }
        },
        {
          breakpoint: 601,
          options: {
            chart: {
              width: "148%"
            }
          }
        },
        {
          breakpoint: 591,
          options: {
            chart: {
              width: "144%"
            }
          }
        },
        {
          breakpoint: 581,
          options: {
            chart: {
              width: "140%"
            }
          }
        },
        {
          breakpoint: 571,
          options: {
            chart: {
              width: "136%"
            }
          }
        },
        {
          breakpoint: 561,
          options: {
            chart: {
              width: "132%"
            }
          }
        },
        {
          breakpoint: 551,
          options: {
            chart: {
              width: "128%"
            }
          }
        },
        {
          breakpoint: 531,
          options: {
            chart: {
              width: "124%"
            }
          }
        },
        {
          breakpoint: 511,
          options: {
            chart: {
              width: "120%"
            }
          }
        },
        {
          breakpoint: 491,
          options: {
            chart: {
              width: "116%"
            }
          }
        },
        {
          breakpoint: 471,
          options: {
            chart: {
              width: "112%"
            }
          }
        },
        {
          breakpoint: 451,
          options: {
            chart: {
              width: "108%"
            }
          }
        },
        {
          breakpoint: 431,
          options: {
            chart: {
              width: "100%"
            }
          }
        },
      ],
      colors: [
        documentStyle.getPropertyValue('--pink-800'),
        documentStyle.getPropertyValue('--pink-600'),
      ],
      legend: {
        position: 'bottom',
        fontSize: '14px',
      },
    };

    const chart1 = new ApexCharts(document.querySelector('#chartPie'), chartPie);
    chart1.render();

    const chartBar = {
      series: [{
        name: "จำนวนเงิน",
        data: [900000, this.sumLoan, this.userInfo.loanBalance]
      }],
      chart: {
        type: "bar",
        width: "100%",
        height: 320,
        stacked: true,
        fontFamily: 'Kanit, sans-serif',
        redrawOnWindowResize: true,
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          distributed: true,
          horizontal: true,
        },
      },
      dataLabels: {
        formatter: (val) => Number(val) / 1000 + "K",
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: [
          "กู้ได้ไม่เกิน",
          "เงินกู้สามัญสูงสุด",
          "หนี้เงินกู้คงเหลือ",
        ],
        labels: {
          style: {
            colors: [
              documentStyle.getPropertyValue('--pink-800'),
              documentStyle.getPropertyValue('--pink-600'),
            ],
            fontSize: "14px",
          },
        },
      },
      legend: {
        position: "right",
        verticalAlign: "top",
        containerMargin: {
          left: 35,
          right: 60
        }
      },
      fill: {
        opacity: 1,
      },
      responsive: [{
        breakpoint: 1501,
        options: {
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
          legend: {
            position: "bottom",
          },
        },
      }],
      colors: [
        documentStyle.getPropertyValue('--pink-800'),
        documentStyle.getPropertyValue('--pink-600'),
        documentStyle.getPropertyValue('--purple-800'),
      ]
    };

    const chart = new ApexCharts(document.querySelector('#chartBar'), chartBar);
    chart.render();
  }
}