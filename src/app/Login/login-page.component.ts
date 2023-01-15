import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{

  formModel!: FormGroup;
  userId:any

  constructor(
    private fb: FormBuilder, 
    protected router: Router, 
    protected route: ActivatedRoute,
    private service : MainService
    ) {
    //
  }

  ngOnInit(): void {
    this.initMainForm();
  }

  initMainForm(){
    this.formModel = this.fb.group({
      userName: [null, require],
      password: [null, require],
    })
    this.formModel.markAllAsTouched();
  }

  clickLogin(){
    this.userId = 10;
    this.router.navigate(['profile'],{
      state: {data: this.userId}
    });

  }

  clickForgetPassWord(){
    this.router.navigate(['main']);
  }

}
