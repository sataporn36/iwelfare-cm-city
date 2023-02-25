import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { fromEvent } from 'rxjs';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit{

  userId: any;

  constructor(
    private fb: FormBuilder, 
    protected router: Router, 
    protected route: ActivatedRoute,
    private service : MainService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private locationStrategy: LocationStrategy
    ) {
    //
  }

  ngOnInit(): void {
    if(history.state.data){
      console.log(history.state.data," =========================> history.state.data");
      this.userId = history.state.data;
      setTimeout(() => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'เข้าสู่ระบบสำเร็จ'});  
      }, 500);
      
    }
    this.preventBackButton();
  }

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, '', location.href);
    })
  }

}
