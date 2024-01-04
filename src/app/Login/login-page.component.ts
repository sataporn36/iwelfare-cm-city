import { LocationStrategy } from '@angular/common';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthorizeService } from '../authorize.service';
import { LocalStorageService } from 'ngx-webstorage'
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [AuthorizeService]
})
export class LoginPageComponent implements OnInit {

  formModel!: FormGroup;
  formModelChild!: FormGroup;
  userId: any;
  displayModal: boolean = false;
  dataEmp: any;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private locationStrategy: LocationStrategy,
    private authorizeService: AuthorizeService,
    private localStorageService: LocalStorageService,
    private service: MainService,
  ) {
  }

  ngOnInit(): void {
    this.initMainForm();
    // this.preventBackButton();
  }

  // preventBackButton() {
  //   history.pushState(null, '', location.href);
  //   this.locationStrategy.onPopState(() => {
  //     history.pushState(null, '', location.href);
  //   })
  // }

  initMainForm() {
    this.formModel = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });;

  }

  clickForgetPassword() {
    this.router.navigate(['/forget-password'], {
      state: { data: '' }
    });
  }

  clickPageCloseForMaintenance(){
     // redirect to close for maintenance page
     this.router.navigate(['close-maintenance'], {});
  }
 
  clickLogin() {
    if (this.formModel.valid) {
      const payload = this.formModel.getRawValue();
      this.authorizeService.getAuthToken(payload).subscribe(
        {
          next: (res) => {
            if (res !== null && res.data.employeeStatus == 2 || res.data.employeeStatus == 5) {
              setTimeout(() => { }, 500);
              // ลองเช็คเมื่อ login ครั้งเเรก ให้ไปเปลี่ยน password ก่อน ถ้าครั้งสองไป ให้เข้าหน้า main ได้เลย  *** ต้องดึงข้อมูลมาจากหลังบ้าน รอเพิ่ม column เก็บ
              const statusChecklogin = false;
              // if (res.data.passwordFlag) {
                //this.getEmployeeOfMain(res.data.id);
                this.service.getEmployeeOfMain(res.data.id).subscribe((data) => {
                  if(data){
                    this.dataEmp = data;
                    this.localStorageService.store('employeeofmain', data);
                    this.localStorageService.store('profileImgId', data.profileImgId);
                    this.localStorageService.store('empId', res.data.id);
                    this.localStorageService.store('stockId', res.data.stockId);
                    this.localStorageService.store('loanId', res.data.loanId);
                    this.localStorageService.store('countDatetime', 0);
                    // redirect to main page
                    this.router.navigate(['/main/main-page'], {
                      //state: { data: this.userId }
                    });
                  }
                });
                
              // } else {
              //   this.router.navigate(['/forget-password'], {
              //     state: { data: 'changePassword' }
              //   });
              // }
            } else if (res.data.employeeStatus == 3) {
              this.messageService.add({ severity: 'error', detail: 'ท่านได้ลาออกแล้ว' });
            } else {
              this.messageService.add({ severity: 'error', detail: 'เลขสมาชิกเเละรหัสผ่านไม่ถูกต้อง' });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', detail: 'เลขสมาชิกเเละรหัสผ่านไม่ถูกต้อง' });
          },
          complete: () => {
            //
          }
        }
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

  getEmployeeOfMain(id: number): void {
    this.service.getEmployeeOfMain(id).subscribe((data) => {
      if(data){
        this.dataEmp = data;
      }
    });
  }

}
