import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, Message, MessageService, PrimeNGConfig } from 'primeng/api';
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
    private fb: FormBuilder, 
    protected router: Router, 
    protected route: ActivatedRoute,
    private service : MainService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) {
    //
  }

  ngOnInit(): void {
    this.initMainForm();
  }

  initMainForm(){
    // this.formModel = this.fb.group({
    //   userName: [null, require],
    //   password: [null, require],
    // })
    this.formModel = new FormGroup({
      userName: new FormControl(),
      password: new FormControl(),
    });
    this.formModel.markAllAsTouched();
  }

  clickLogin(){
    //this.userId = 10;
    // this.router.navigate(['main'],{
    //   state: {data: this.userId}
    // });
    // const playload = {
    //   installment: 0,
    //   stockValue: 0,
    //   stockAccumulate: 0
    // }
    // this.service.login().subscribe((res) => {
    //   console.log("test ---------------------> login ",res)
    //   if(res){
    //     this.router.navigate(['main'],{
    //       state: {data: this.userId}
    //     });
    //   }else{

    //   }
    // });
    this.userId = 10;
    this.confirmationService.confirm({
      message: 'คุณกำลังเข้าสู่ระบบสมาชิก',
      header: 'เข้าสู่ระบบ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          setTimeout(() => {
            
          }, 500);
          this.router.navigate(['/main/main-page'],{
            state: {data: this.userId}
          });
        
      },
      reject: () => {
          //this.displayModal = true;
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

  clickForgetPassWord(){
    
  }

}
