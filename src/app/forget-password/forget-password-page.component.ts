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
  newPass2: any;
  newPass2Validation: boolean = false;
  memNumber: any;
  memNumberValidation: boolean = false;
  iconStatus: boolean = false;
  pnumberCheck: any;
  pnumberValidation: boolean = false;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private service: MainService
  ) {
  }

  ngOnInit(): void {
    if(history.state.data){
      const data = history.state.data;
      if(data === 'changePassword'){
          this.confirmationService.confirm({
            message: 'กรุณาเปลี่ยนรหัสผ่านใหม่ของท่าน เนื่องจากท่านเป็นสมาชิกใหม่ที่ยังไม่เคยเข้าใช้งานระบบ',
            header: 'เปลี่ยนรหัสผ่านสมาชิก',
            icon: 'pi pi-exclamation-triangle',
            accept: () => { },
            reject: () => { }
          });
      }
    }
    this.initMainForm();
  }

  initMainForm() {
    this.formModel = new FormGroup({
      idCard: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      newPassword2: new FormControl(null, Validators.required),
      employeeCode: new FormControl(null, Validators.required),
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

  checkMemberNumer() {
    this.memNumber = this.formModel.get('employeeCode')?.value;
    if (this.memNumber?.match("^[0-9]{5}$")) {
      this.memNumberValidation = false;
    } else {
      this.memNumberValidation = true;
    }
  }

  checkNewPass() {
    this.newPass = this.formModel.get('newPassword')?.value;
    this.newPass2 = this.formModel.get('newPassword2')?.value;
    if (this.newPass?.match("^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$")) {
      this.newPassValidation = false;
      this.checkNewPass2();
    } else {
      this.newPassValidation = true;
    }
  }

  checkNewPass2() {
    this.newPass2 = this.formModel.get('newPassword2')?.value;
    this.newPass = this.formModel.get('newPassword')?.value;
    if (this.newPass?.match("^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$") && this.newPass === this.newPass2) {
      this.newPass2Validation = false;
      this.checkNewPass();
    } else {
      this.newPass2Validation = true;
    }
  }

  clickChangePassword(){
    const data = this.formModel.getRawValue();
    this.confirmationService.confirm({
      message: 'ท่านต้องการเปลี่ยนรหัสผ่านใหม่หรือไม่',
      header: 'เปลี่ยนรหัสผ่านสมาชิก',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.changePassword(data).subscribe((res) => {
             if(res != null){
                 if(res.data.statusEmployee === 'CHANGE_SUCCESS'){
                  this.messageService.add({severity:'success', summary: 'Success', detail: 'เปลี่ยนรหัสผ่านใหม่สำเร็จ'});  
                  this.iconStatus = true;
                  this.formModel.reset();
                  this.router.navigate(['/login'], {});
                 }else{
                  this.messageService.add({severity:'error', summary: 'Error', detail: 'เปลี่ยนรหัสผ่านใหม่ไม่สำเร็จ กรุณาตรวจสอบข้อมูลให้ถูกต้อง'});
                  this.iconStatus = false;
                 }
             }else{
                this.messageService.add({severity:'error', summary: 'Error', detail: 'เปลี่ยนรหัสผ่านใหม่ไม่สำเร็จ กรุณาตรวจสอบข้อมูลให้ถูกต้อง'});
                this.iconStatus = false;
             }
        });
      },
      reject: () => { }
    });
  }

  checkPhoneNumber() {
    this.pnumberCheck = this.formModel.get('tel')?.value;
    if (this.pnumberCheck?.match("^[0-9]{10}$")) {
      this.pnumberValidation = false;
    } else {
      this.pnumberValidation = true;
    }
  }
}
