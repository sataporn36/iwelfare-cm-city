import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit{

  formModel!: FormGroup;
  userId:any;
  displayModal: boolean = false;

  constructor(
    protected router: Router, 
    protected route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) {
  }

  ngOnInit(): void {
    this.initMainForm();
  }

  initMainForm(){
    this.formModel = new FormGroup({
      userName: new FormControl(),
      password: new FormControl(),
    });
    this.formModel.markAllAsTouched();
  }

  clickLogin(){
    this.userId = 10;
    this.confirmationService.confirm({
      message: 'คุณกำลังเข้าสู่ระบบสมาชิก',
      header: 'เข้าสู่ระบบ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          setTimeout(() => {}, 500);
          this.router.navigate(['/main/main-page'],{
            state: {data: this.userId}
          });
        
      },
      reject: () => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'เข้าสู๋ระบบไม่สำเร็จ'});
      }
    });
  }

  clickRegister(){
    this.userId = 10;
    this.router.navigate(['register'],{
      state: {data: this.userId}
    });
  }

  clickForgetPassWord(){}
}
