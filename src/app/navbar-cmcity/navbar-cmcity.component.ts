import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
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


  constructor(private primengConfig: PrimeNGConfig, private service: MainService, protected router: Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'ข้อมูลส่วนตัว',
        command: () => {
          this.onProfile()
        }
      },
      {
        label: 'ออกจากระบบ',
        command: () => {
          this.onLogout()
        }
      }
    ];
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
        break;
      default:
        break;
    }
  }
}
