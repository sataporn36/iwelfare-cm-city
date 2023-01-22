import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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

  constructor(private primengConfig: PrimeNGConfig,  private service : MainService) {}

    ngOnInit() {
        this.items = [
            {label: 'ข้อมูลส่วนตัว',
              command: () => {
                this.onProfile();
              }
            },
            {label: 'Open',
              command: () => {
               
              }
            },
            {label: 'Undo',
              command: () => {
                
              }
            }
        ];
    }

  onProfile(){

  }

  showModalDialog() {
    this.displayModal = true;
  }

  showModalDialogRegister() {
    this.displayModalRegister = true;
  }

}
