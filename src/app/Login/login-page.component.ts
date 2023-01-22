import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    // this.service.postUser(playload).subscribe((r) => (
    //   console.log("test ---------------------> add Stock")
    // ))

    this.router.navigate(['navbar'],{
      state: {data: this.userId}
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
