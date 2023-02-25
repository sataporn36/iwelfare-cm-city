import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-forget-password-page',
  templateUrl: './forget-password-page.component.html',
  styleUrls: ['./forget-password-page.component.scss']
})
export class ForgetPasswordPageComponent implements OnInit{

  formModel!: FormGroup;
  userId: any;
  displayModal: boolean = false;
  emailCheck: any;
  emailValidation: boolean = false;
  idCardCheck: any;
  idCardValidation: boolean = false;
  newPass: any;
  newPassValidation: boolean = false;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private service: MainService,
    private locationStrategy: LocationStrategy
  ) {
  }

  ngOnInit(): void {
    this.initMainForm();
  }

  initMainForm() {
    this.formModel = new FormGroup({
      idCard: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
    });
    this.formModel.markAllAsTouched();
  }

  checkEmail() {
    this.emailCheck = this.formModel.get('email')?.value;
    if (this.emailCheck?.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
      this.emailValidation = false;
    } else {
      this.emailValidation = true;
    }
  }

  checkIdCard() {
    this.idCardCheck = this.formModel.get('idCard')?.value;
    if (this.idCardCheck?.match("^[0-9]{13}$")) {
      this.idCardValidation = false;
    } else {
      this.idCardValidation = true;
    }
  }

  checkNewPass() {
    this.newPass = this.formModel.get('newPassword')?.value;
    if (this.newPass?.match("^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$")) {
      this.newPassValidation = false;
    } else {
      this.newPassValidation = true;
    }
  }

  clickChangePassword(){
    const data = this.formModel.getRawValue();
    console.log('===================> data new pass',data)
  }

}
