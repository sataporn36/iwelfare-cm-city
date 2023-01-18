import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit{

  formModel!: FormGroup;
  userId: any;
  constructor(protected route: ActivatedRoute, 
    private fb: FormBuilder, 
    private service : MainService,
    protected router: Router) {
    //
  }

  ngOnInit(): void {
    if(history.state.data){
      console.log(history.state.data," =========================> history.state.data");
      this.userId = history.state.data;
      //window.location.reload();
   }
    this.initMainForm();
  }

  initMainForm(){
    this.formModel = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      phoneNumber: new FormControl(),
      userName: new FormControl(),
      password: new FormControl(),
    });
    // this.formModel = this.fb.group({
    //   firstName: [null, require],
    //   lastName: [null, require],
    //   email: [null, require],
    //   phoneNumber: [null, require],
    //   userName: [null, require],
    //   password: [null, require],
     
    // })
    this.formModel.markAllAsTouched();
  }

  onRegister(){
    const playload = {
      installment: 0,
      stockValue: 0,
      stockAccumulate: 0
    }
    this.service.postUser(playload).subscribe((r) => (
      console.log("test ---------------------> add Stock")
    ))
  }
  


}
