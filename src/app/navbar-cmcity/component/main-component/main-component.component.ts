import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit {

  maxLength: number = 10;
  dataStockDetail: any[] = [];
  loading!: boolean;
  stockId: any;
  userId: any;

  userInfo: any;
  countDemo: any;
  arrayBeneficiary: any;
  countBeneficiary: any;
  gender: any;
  profileImgId: any;
  imageSrc: SafeUrl;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private service: MainService,
    private locationStrategy: LocationStrategy,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      history.go(0);
    } else {
      localStorage.removeItem('foo');
      this.setperiodMonthDescOption();
      this.userId = this.localStorageService.retrieve('empId');
      this.userInfo = this.localStorageService.retrieve('employeeofmain');
      this.stockId = this.localStorageService.retrieve('stockId');
      this.gender = this.userInfo.gender;
      this.profileImgId = this.userInfo.profileImgId;
      this.getImage(this.userInfo.profileImgId);
      this.searchStockDetail(this.stockId);
      this.getBeneficiaryByEmpId(this.userId);
      this.searchNewsMain();
    }
  }

  getBeneficiaryByEmpId(id: any) {
    this.service.getBeneficiaryByEmpId(id).subscribe(data => {
      this.arrayBeneficiary = data;
      this.countBeneficiary = data.length;
    });
  }

  searchStockDetail(id: any): void {
    this.service.searchStockDetail(id, "desc").subscribe(data => {
      this.dataStockDetail.push(data[0], data[1], data[2]);
    });
  }

  listNews: any;
  imgNewsList: SafeUrl[] = []; 
  searchNewsMain() {
    this.service.searchNewsMain().subscribe(data => {
      this.listNews = data;

      // Loop through the list of news and fetch images
      for (let i = 0; i < this.listNews.length; i++) {
        const news = this.listNews[i];
  
        this.service.getImageNews(news.coverImgId).subscribe(
          (imageBlob: Blob) => {
            const imgURL = URL.createObjectURL(imageBlob);
            const sanitizedURL = this.sanitizer.bypassSecurityTrustUrl(imgURL);
            
            // Store the sanitized image URL at the corresponding index
            this.imgNewsList[i] = sanitizedURL;
          },
          (error: any) => {
            console.error('Failed to fetch image:', error);
          }
        );
      }
    });
  }

  periodMonthDescOption: any = [];
  pipeDateTHD(date: any) {
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

  profileImg() {
    let textGender = ''
    if (this.profileImgId != 0) {
      return this.imageSrc
    } else {
      switch (this.gender) {
        case 'ชาย':
          textGender = 'assets/images/boy.png'
          break;
        case 'หญิง':
          textGender = 'assets/images/girl.png'
          break;
        default:
          break;
      }
      return textGender
    }
  }

  beneficiaryImg(gender: any) {
    let textGender = ''
    switch (gender) {
      case 'ชาย':
        textGender = 'assets/images/boy.png'
        break;
      case 'หญิง':
        textGender = 'assets/images/girl.png'
        break;
      default:
        break;
    }
    return textGender
  }

  countDate = new Date("march 25, 2023 15:37:25").getTime();
  x = setInterval(() => {
    let now = new Date().getTime();
    let distance = this.countDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    this.countDemo = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  })

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, '', location.href);
    })
  }

  checkBeneficiaryCss() {
    try {
      if (this.arrayBeneficiary.length == 0) {
        return "margin-top: -12rem;"
      } else {
        return "margin-top: -12rem;"
      }
    } catch (error) {
      return "margin-top: 19rem;"
    }
  }

  getImage(id: any) {
    if (id != 0) {
      this.service.getImage(id).subscribe(
        (imageBlob: Blob) => {
          this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
          this.localStorageService.store('imageSrc', this.imageSrc);
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
        }
      );
    }
  }

  // transformText(value: string, limit: number): string {
  //   if (value.length > limit) {
  //     return value.substring(0, limit) + '...';
  //   }
  //   return value;
  // }
}
