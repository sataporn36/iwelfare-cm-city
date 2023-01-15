import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit{

  formModel!: FormGroup;
  constructor(private fb: FormBuilder) {
    //
  }

  ngOnInit(): void {
    this.initMainForm();
  }

  initMainForm(){
    this.formModel = this.fb.group({
      firstName: [null, require],
      lastName: [null, require],
      email: [null, require],
      phoneNumber: [null, require],
      userName: [null, require],
      password: [null, require],
     
    })
    this.formModel.markAllAsTouched();
  }


}
