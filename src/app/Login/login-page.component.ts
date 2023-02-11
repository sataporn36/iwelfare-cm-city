import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MainService } from '../service/main.service';

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
    private messageService: MessageService,
    private service : MainService,
    ) {
  }

  ngOnInit(): void {
    this.initMainForm();
  }

  initMainForm(){
    this.formModel = new FormGroup({
      username: new FormControl(null,Validators.required),
      password: new FormControl(null,Validators.required),
    });
    this.formModel.markAllAsTouched();
  }

  clickLogin(){
    if(this.formModel.valid){
      const payload = this.formModel.getRawValue();
      this.service.login(payload).subscribe((res) => {
        console.log(res,'===================> res login')
        if(res !== null){
          this.userId = res.data.id;
          setTimeout(() => {}, 500);
          this.router.navigate(['/main/main-page'],{
            state: {data: this.userId}
          });
        }else{
          // this.confirmationService.confirm({
          //   message: 'เลขสมาชิกเเละรหัสผ่านไม่ถูกต้อง',
          //   header: 'เข้าสู่ระบบ',
          //   icon: 'pi pi-exclamation-triangle',
          //   accept: () => {
          //   },
          //   reject: () => {
          //   }
          // });
          this.messageService.add({severity:'error', summary: 'Error', detail: 'เลขสมาชิกเเละรหัสผ่านไม่ถูกต้อง'});
        }
      })
    }else{
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

  clickRegister(){
    this.router.navigate(['register'],{
      state: {data: null}
    });
  }

  clickForgetPassWord(){}

}
