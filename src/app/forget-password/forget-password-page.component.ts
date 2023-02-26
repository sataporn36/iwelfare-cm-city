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
  iconStatus: boolean = false;

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
    this.confirmationService.confirm({
      message: 'ท่านต้องการเปลี่ยนรหัสผ่านใหม่หรือไม่',
      header: 'เปลี่ยนรหัสผ่านสมาชิก',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.changePassword(data).subscribe((res) => {
             if(res != null){
                 if(res.data.statusEmployee === 'CHANGE_SUCCESS'){
                  //  this.router.navigate(['/login'],{
                  //   state: {data: 'changePassword'}
                  //  });
                  // setTimeout(() => {}, 500);
                  this.messageService.add({severity:'success', summary: 'Success', detail: 'เปลี่ยนรหัสผ่านใหม่สำเร็จ'});  
                  this.iconStatus = true;
                  this.formModel.reset();
                 }else{
                  this.messageService.add({severity:'error', summary: 'Error', detail: 'เปลี่ยนรหัสผ่านใหม่ไม่สำเร็จ ตรวจสอบข้อมูลให้ถูกต้อง'});
                  this.iconStatus = false;
                 }
             }else{
                this.messageService.add({severity:'error', summary: 'Error', detail: 'เปลี่ยนรหัสผ่านใหม่ไม่สำเร็จ ตรวจสอบข้อมูลให้ถูกต้อง'});
                this.iconStatus = false;
             }
        });
      },
      reject: () => { }
    });
  }

}
