import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit{

  userId: any;

  constructor(protected route: ActivatedRoute, protected router: Router) {
  }
  
  ngOnInit(): void {
      if(history.state.data){
         console.log(history.state.data," =========================> history.state.data");
         this.userId = history.state.data;
         //window.location.reload();
      }
      this.initValue();
  }

  initValue(){
    console.log(this.userId," =========================> iopipipipipi");
  }


}
