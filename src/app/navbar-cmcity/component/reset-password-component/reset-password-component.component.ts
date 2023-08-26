import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-reset-password-component',
  templateUrl: './reset-password-component.component.html',
  styleUrls: ['./reset-password-component.component.scss']
})
export class ResetPasswordComponentComponent implements OnInit {

  formModel!: FormGroup;
  userInfo: any;
  userId: any;
  newPass: any;
  newPassValidation: boolean = false;
  newPass2: any;
  newPass2Validation: boolean = false;
  iconStatus: boolean = false;

  constructor(
    private service: MainService,
    protected router: Router,
    protected route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.userInfo = this.localStorageService.retrieve('employeeofmain');
    this.userId = this.localStorageService.retrieve('empId');
    this.initMainForm();
  }

  initMainForm() {
    this.formModel = new FormGroup({
      id: new FormControl(null, Validators.required),
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
    });
  }

  checkNewPass() {
    this.newPass = this.formModel.get('newPassword')?.value;
    this.newPass2 = this.formModel.get('confirmPassword')?.value;
    if (this.newPass?.match("^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$")) {
      this.newPassValidation = false;
      this.checkNewPass2();
    } else {
      this.newPassValidation = true;
    }
  }

  checkNewPass2() {
    this.newPass2 = this.formModel.get('confirmPassword')?.value;
    this.newPass = this.formModel.get('newPassword')?.value;
    if (this.newPass?.match("^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$") && this.newPass === this.newPass2) {
      this.newPass2Validation = false;
      this.checkNewPass();
    } else {
      this.newPass2Validation = true;
    }
  }

  clickChangePassword() {
    const data = this.formModel.getRawValue();
    data.id = this.userId
    this.confirmationService.confirm({
      message: 'ท่านต้องการเปลี่ยนรหัสผ่านใหม่หรือไม่',
      header: 'เปลี่ยนรหัสผ่าน',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.resetPassword(data).subscribe((res) => {
          if (res != null) {
            if (res.statusEmployee === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'เปลี่ยนรหัสผ่านใหม่สำเร็จ' });
              this.iconStatus = true;
              this.formModel.reset();
              this.onLogout();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'เปลี่ยนรหัสผ่านใหม่ไม่สำเร็จ' });
              this.iconStatus = false;
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'เปลี่ยนรหัสผ่านใหม่ไม่สำเร็จ' });
            this.iconStatus = false;
          }
        });
      },
      reject: () => { }
    });
  }

  onLogout() {
    this.localStorageService.clear('empId');
    this.localStorageService.clear('currentDateTime');
    this.localStorageService.clear('countDatetime');
    this.localStorageService.clear('stockId');
    this.localStorageService.clear('loanId');
    this.localStorageService.clear('employeeofmain');
    this.router.navigate(['/login']);
  }

}
