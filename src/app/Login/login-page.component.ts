import { LocationStrategy } from '@angular/common';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthorizeService } from '../authorize.service';
import { MainService } from '../service/main.service';
import {LocalStorageService} from 'ngx-webstorage'
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers:[AuthorizeService]
})
export class LoginPageComponent implements OnInit {

  formModel!: FormGroup;
  userId: any;
  displayModal: boolean = false;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private service: MainService,
    private locationStrategy: LocationStrategy,
    private authorizeService: AuthorizeService,
    private localStorageService: LocalStorageService,
    private bnIdle: BnNgIdleService
  ) {
  }

  ngOnInit(): void {
    this.initMainForm();
    this.preventBackButton();
  }

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, '', location.href);
    })
  }

  initMainForm() {
    this.formModel = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
    this.formModel.markAllAsTouched();
  }

  clickForgetPassword(){
    this.router.navigate(['/forget-password'], {
      state: { data: '' }
    });
  }

  clickLogin() {
    if (this.formModel.valid) {
      const payload = this.formModel.getRawValue();
      this.authorizeService.getAuthToken(payload).subscribe(
      {
        next: (res) => {
          console.log(res, '===================> res login')
          if (res !== null && res.data.id !== 0) {
            this.localStorageService.store('empId',res.data.id);
            this.localStorageService.store('countDatetime',0);
            //this.userId = res.data.id;
            setTimeout(() => { }, 500);
            //this.service.userId.next(this.userId);

            // this.bnIdle.startWatching(10).subscribe((isTimedOut: boolean) =>{
            //   console.log(' isTimedOut ==> ', isTimedOut);
            //   if(isTimedOut){
            //     console.log(' Timeout Token 555');
            //     this.localStorageService.clear('empId');
            //     alert(' เวลาในระบบหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง ');
            //     this.router.navigate(['/login']);
            //     this.bnIdle.stopTimer();
            //   }
            // });

            this.router.navigate(['/main/main-page'], {
              //state: { data: this.userId }
            });
          } else {
            // this.confirmationService.confirm({
            //   message: 'เลขสมาชิกเเละรหัสผ่านไม่ถูกต้อง',
            //   header: 'เข้าสู่ระบบ',
            //   icon: 'pi pi-exclamation-triangle',
            //   accept: () => {
            //   },
            //   reject: () => {
            //   }
            // });
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'เลขสมาชิกเเละรหัสผ่านไม่ถูกต้อง' });
          }
        },
        error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'เลขสมาชิกเเละรหัสผ่านไม่ถูกต้อง' });
        },
        complete: () => {
           //
        }}
      )
    } else {
      this.confirmationService.confirm({
        message: 'กรุณากรอกเลขสมาชิกเเละรหัสผ่าน',
        header: 'เข้าสู่ระบบ',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
        },
        reject: () => {
        }
      });
    }

  }

  clickRegister() {
    this.router.navigate(['register'], {
      state: { data: null }
    });
  }

  clickForgetPassWord() { }

}
