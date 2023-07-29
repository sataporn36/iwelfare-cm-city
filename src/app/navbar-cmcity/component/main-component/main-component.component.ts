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
  ) { 
    // this.userId = this.localStorageService.retrieve('empId');
    // this.userInfo = this.localStorageService.retrieve('employeeofmain');
  }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      history.go(0);
    } else {
      localStorage.removeItem('foo');

      this.userId = this.localStorageService.retrieve('empId');
      this.userInfo = this.localStorageService.retrieve('employeeofmain');
      this.gender = this.userInfo.gender;
      this.profileImgId = this.userInfo.profileImgId;
      this.getImage(this.userInfo.profileImgId);
      this.stockId = this.localStorageService.retrieve('stockId');
      this.searchStockDetail(this.stockId);
      this.getBeneficiaryByEmpId(this.userId);
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

  transformText(value: string, limit: number): string {
    if (value.length > limit) {
      return value.substring(0, limit) + '...';
    }
    return value;
  }
  
}
