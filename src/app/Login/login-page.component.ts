import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{

  formModel!: FormGroup;
  constructor(private fb: FormBuilder) {
    //
  }

  ngOnInit(): void {
    this.initMainForm();
  }

  initMainForm(){
    this.formModel = this.fb.group({
      userName: [null, require],
    })
    this.formModel.markAllAsTouched();
  }

}
