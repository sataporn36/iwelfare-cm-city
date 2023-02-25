import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
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


  constructor(private primengConfig: PrimeNGConfig, private service: MainService, protected router: Router) { }

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
  }

  onProfile() {
    this.router.navigate(['/main/profile-page'])
    this.checkActive("profile")
  }

  onLogout() {
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

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => this.emp = data);
  }

  // TODO: ImgProfile
  checkImgProfile(gender: any) {
    let textGender = ""
    switch (gender) {
      case 'ชาย':
        textGender = "assets/images/boyV2.png"
        break;
      case 'หญิง':
        textGender = "assets/images/girlV2.png"
        break;
      default:
        console.log("Not Null");
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
