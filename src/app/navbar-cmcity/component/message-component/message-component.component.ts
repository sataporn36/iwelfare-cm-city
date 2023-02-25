import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchNewResgter } from 'src/app/model/search-new-register';
import { MainService } from 'src/app/service/main.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-message-component',
  templateUrl: './message-component.component.html',
  styleUrls: ['./message-component.component.scss']
})
export class MessageComponentComponent implements OnInit {

  public data: Observable<SearchNewResgter[]> | any 


  // birthday = new Date(1988, 3, 15); 
  periodMonthDescOption: any = [];

  displayModal!: boolean;
  formModel!: FormGroup;
  id:any;
  
  constructor(
    private service: MainService,
    protected route: ActivatedRoute, 
    private fb: FormBuilder, 
    protected router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) {}

    initMainForm(){
      this.formModel = new FormGroup({
        remark: new FormControl(null,Validators.required)
      });
    }

    ngOnInit() {
      this.initMainForm();
      this.searchRegiste();
      this.setperiodMonthDescOption();
    }
  
    searchRegiste(): void {
    this.service.searchRegister().subscribe(data => this.data = data);
    }

    onClickApproveEmp(data :any){
      const approve = {
        id : data.id,
        approveFlag: true
      }
      this.confirmationService.confirm({
        message: 'ต้องการยืนยันการสมัครของ ' + data.prefix + data.firstName +' '+ data.lastName + ' ใช่หรือไม่',
        header: 'ยืนยันการสมัครเข้าใช้งานระบบ',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.service.approveRegister(approve).subscribe(data => {
            this.data = data
            this.ngOnInit();
          });
        },
        reject: () => {}
      });
      window.location.reload();
    }

    onClickCancleApproveEmp(data :any){
       this.id = data.id;
       this.displayModal = true;
    }

    onclikRemark(){
      const value = this.formModel.getRawValue();
      const cancelRegis = {
        id : this.id,
        remark : value.remark
      }
      this.service.cancelApproveRegister(cancelRegis).subscribe((data) => {
        this.data = data;
      });
      this.displayModal = false
      window.location.reload();
    }

    pipeDateTH(date: any){
      const format = new Date(date)
      const day = format.getDate()
      const month = format.getMonth()
      const year = format.getFullYear() + 543

      const monthSelect = this.periodMonthDescOption[month];

      return day + ' ' + monthSelect.label + ' ' + year
    }

    setperiodMonthDescOption() {
      this.periodMonthDescOption = [
        { value: '01', label: 'มกราคม' },
        { value: '02', label: 'กุมภาพันธ์' },
        { value: '03', label: 'มีนาคม' },
        { value: '04', label: 'เมษายน' },
        { value: '05', label: 'พฤษภาคม' },
        { value: '06', label: 'มิถุนายน' },
        { value: '07', label: 'กรกฎาคม' },
        { value: '08', label: 'สิงหาคม' },
        { value: '09', label: 'กันยายน' },
        { value: '10', label: 'ตุลาคม' },
        { value: '11', label: 'พฤศจิกายน' },
        { value: '12', label: 'ธันวาคม' },
      ];
    }

}
