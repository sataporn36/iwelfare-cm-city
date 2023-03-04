import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee';
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-navbar-cmcity',
  templateUrl: './navbar-cmcity.component.html',
  styleUrls: ['./navbar-cmcity.component.scss']
})
export class NavbarCmcityComponent implements OnInit {

  formModel!: FormGroup;
  items!: MenuItem[];
  displayModal: boolean = false;
  displayModalRegister: boolean = false;
  // displayCount!: string;
  // count: any;
  
  emp: Observable<Employee> | any 
  countNewRegister: Observable<any> | any 

  // check active model
  main: string = 'active';
  deposit!: string;
  stock!: string;
  loan!: string;
  rigths!: string;
  beneficiary!: string;
  guarantee!: string;
  dividend!: string;
  profile!: string;
  message!: string;
  countDatetime: number = 0;

  constructor(private primengConfig: PrimeNGConfig, 
    private service: MainService, 
    protected router: Router,
    private localStorageService: LocalStorageService,
    ) { 
      this.currentDate();
    }

   currentDate(){
    const formatDate = new Date();
    const day = formatDate.getDate();
    const month = formatDate.getMonth() + 1;
    const year = formatDate.getFullYear(); 
    const hours = formatDate.getHours();
    const minutes = formatDate.getMinutes();
    const seconds = formatDate.getSeconds();
    const Milliseconds = formatDate.getMilliseconds() + 300000;
    console.log(day+'/'+month+'/'+year+' ' + hours+':'+minutes+':'+seconds);
    this.currentDateTime = month+'/'+day+'/'+year+' ' + hours+':'+(minutes + 5)+':'+seconds;
    if(this.localStorageService.retrieve('countDatetime') === 0){
      this.localStorageService.store('currentDateTime',this.currentDateTime);
    }
    this.countDatetime ++;
    this.localStorageService.store('countDatetime',this.countDatetime);
   }

   countDemo: any;
   currentDateTime: any;
   //countDate = new Date(this.localStorageService.retrieve('currentDateTime')).getTime();
   //countDate = new Date("3/5/2023 1:20:00").getTime();
   //countDate = new Date().getTime();
   x = setInterval(()=>{
     let now = new Date().getTime();
     let countDate = new Date(this.localStorageService.retrieve('currentDateTime')).getTime();
     let distance = countDate - now;
     let days = Math.floor(distance/(1000*60*60*24));
     let hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
     let minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
     let seconds = Math.floor((distance % (1000*60)) / 1000);
     //this.countDemo = days + "d " + hours + "h " + minutes + "m " + seconds + "s " ;
     this.countDemo = minutes + "m " + seconds + "s " ;
     if(distance < 0){
        clearInterval(this.x);
        this.countDemo = 'time out';
        setTimeout(() => {
          alert(' เวลาในระบบหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง ');
          this.onLogout();
        }, 500);
     }
  })
 

  ngOnInit() {
    this.items = [
      {
        label: 'ข้อมูลส่วนตัว',
        icon: 'pi pi-user',
        command: () => {
          this.onProfile()
        }
      },
      {
        label: 'ออกจากระบบ',
        icon: 'pi pi-sign-out',
        command: () => {
          this.onLogout()
        }
      }
    ];
    const id = 1;
    this.getEmployee(id);
    this.conutNewRegister();
    this.initMainForm();
  }

  initMainForm() {
    this.formModel = new FormGroup({
      gender: new FormControl(null),
    });
  }

  onProfile() {
    this.router.navigate(['/main/profile-page'])
    this.checkActive("profile")
  }

  onLogout() {
    this.localStorageService.clear('empId');
    this.localStorageService.clear('currentDateTime');
    this.localStorageService.clear('countDatetime');
    this.router.navigate(['/login'])
  }

  showModalDialog() {
    this.displayModal = true;
  }

  showModalDialogRegister() {
    this.displayModalRegister = true;
  }

  // check active model
  checkActive(data: any) {
    switch (data) {
      case "main":
        this.main = "active";
        this.deposit = "";
        this.stock = "";
        this.loan = "";
        this.rigths = "";
        this.beneficiary = "";
        this.guarantee = "";
        this.dividend = "";
        this.profile = "";
        this.message = "";
        break;
      case "deposit":
        this.main = "";
        this.deposit = "active";
        this.stock = "";
        this.loan = "";
        this.rigths = "";
        this.beneficiary = "";
        this.guarantee = "";
        this.dividend = "";
        this.profile = "";
        this.message = "";
        break;
      case "stock":
        this.main = "";
        this.deposit = "";
        this.stock = "active";
        this.loan = "";
        this.rigths = "";
        this.beneficiary = "";
        this.guarantee = "";
        this.dividend = "";
        this.profile = "";
        this.message = "";
        break;
      case "loan":
        this.main = "";
        this.deposit = "";
        this.stock = "";
        this.loan = "active";
        this.rigths = "";
        this.beneficiary = "";
        this.guarantee = "";
        this.dividend = "";
        this.profile = "";
        this.message = "";
        break;
      case "rigths":
        this.main = "";
        this.deposit = "";
        this.stock = "";
        this.loan = "";
        this.rigths = "active";
        this.beneficiary = "";
        this.guarantee = "";
        this.dividend = "";
        this.profile = "";
        this.message = "";
        break;
      case "beneficiary":
        this.main = "";
        this.deposit = "";
        this.stock = "";
        this.loan = "";
        this.rigths = "";
        this.beneficiary = "active";
        this.guarantee = "";
        this.dividend = "";
        this.profile = "";
        this.message = "";
        break;
      case "guarantee":
        this.main = "";
        this.deposit = "";
        this.stock = "";
        this.loan = "";
        this.rigths = "";
        this.beneficiary = "";
        this.guarantee = "active";
        this.dividend = "";
        this.profile = "";
        this.message = "";
        break;
      case "dividend":
        this.main = "";
        this.deposit = "";
        this.stock = "";
        this.loan = "";
        this.rigths = "";
        this.beneficiary = "";
        this.guarantee = "";
        this.dividend = "active";
        this.profile = "";
        this.message = "";
        break;
      case "profile":
        this.main = "";
        this.deposit = "";
        this.stock = "";
        this.loan = "";
        this.rigths = "";
        this.beneficiary = "";
        this.guarantee = "";
        this.dividend = "";
        this.profile = "active";
        this.message = "";
        break;
      case "message":
        this.main = "";
        this.deposit = "";
        this.stock = "";
        this.loan = "";
        this.rigths = "";
        this.beneficiary = "";
        this.guarantee = "";
        this.dividend = "";
        this.profile = "";
        this.message = "message";
        break;
      default:
      break;
    }
  }

  // getEmployee(id: any): void {
  //   this.service.getEmployee(id).subscribe(data => {this.emp = data
  //     console.log('data------------------------> ', data);
  //   });
  // }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      this.formModel.patchValue({
        ...data
      })
    });
  }

  // TODO: ImgProfile
  checkImgProfile(gender: any) {
    let textGender = ''
    switch (gender) {
      case 'ชาย':
        textGender = 'assets/images/boyV2.png'
        break;
      case 'หญิง':
        textGender = 'assets/images/girlV2.png'
        break;
      default:
      break;
    }
    return textGender
  }

  conutNewRegister(): void {
    this.service.conutNewRegister().subscribe(data => this.countNewRegister = data);
  }

  checkCount(count: any): any {
    if (count == 0) {
      return "none"
    }
  }


}
