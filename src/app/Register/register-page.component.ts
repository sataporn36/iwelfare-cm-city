import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Affiliation } from '../model/affiliation';
import { Positions } from '../model/position';
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit{

  formModel!: FormGroup;
  userId: any;
  emailCheck: any;
  emailValidation: boolean = false;
  idCardCheck: any;
  idCardValidation: boolean = false;
  pnumberCheck: any;
  pnumberValidation: boolean = false;
  iconName: any;
  statusCheck: any;

  public position: Observable<Positions[]> | any 
  public affiliation: Observable<Affiliation[]> | any 

  constructor(
    protected route: ActivatedRoute, 
    private fb: FormBuilder, 
    private service : MainService,
    protected router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if(history.state.data){
      console.log(history.state.data," =========================> history.state.data");
      this.userId = history.state.data;
    }
    this.initMainForm();
    this.getPositions();
    this.getAffiliation();
  }

  getPositions(): void {
    this.service.searchPosition().subscribe(data => this.position = data);
  }

  getAffiliation(): void {
    this.service.searchAffiliation().subscribe(data => this.affiliation = data);
  }

  initMainForm(){
    this.formModel = new FormGroup({
      prefix: new FormControl('0',Validators.required),
      firstName: new FormControl(null,Validators.required),
      lastName: new FormControl(null,Validators.required),
      idCard: new FormControl(null,Validators.required),
      tel: new FormControl(null,Validators.required),
      positionId: new FormControl('0',Validators.required),
      affiliationId: new FormControl('0',Validators.required),
      email: new FormControl(null,Validators.required),
    });
  }

  checkNullOfValue() {
    const data = this.formModel.getRawValue();
    if (data.prefix === '0' || data.positionId === '0' || data.affiliationId === '0') {
     return false;
    } else {
      return true;
    }
  }

  checkEmail() {
    this.emailCheck = this.formModel.get('email')?.value;
    if (this.emailCheck?.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
      this.emailValidation = false;
    } else {
      this.emailValidation = true;
    }
  }

  checkIdCard() {
    this.idCardCheck = this.formModel.get('idCard')?.value;
    if (this.idCardCheck?.match("^[0-9]{13}$")) {
      this.idCardValidation = false;
    } else {
      this.idCardValidation = true;
    }
  }

  checkPhoneNumber() {
    this.pnumberCheck = this.formModel.get('tel')?.value;
    if (this.pnumberCheck?.match("^[0-9]{10}$")) {
      this.pnumberValidation = false;
    } else {
      this.pnumberValidation = true;
    }
  }

  onRegister(){
    const playload = this.formModel.getRawValue();
    this.service.register(playload).subscribe((res) => {
      console.log(res,'======================> res')
      if(res !== null){
        if(res.data.statusEmployee === 'NORMAL_EMPLOYEE'){
          this.confirmationService.confirm({
            message: 'ท่านเป็นสมาชิกปัจจุบัน ไม่สามารถสมัครสมาชิกได้',
            header: 'สมัครสมาชิก',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              setTimeout(() => {}, 500);
              this.router.navigate(['/login'],{
                state: {data: ''}
              });
              this.formModel.reset();
            },
            reject: () => {}
          });
        }else if(res.data.statusEmployee === 'RESIGN_EMPLOYEE'){
          this.confirmationService.confirm({
            message: 'ท่านเป็นสมาชิกที่ลาออก กดยืนยันเพื่อกลับมาเป็นสมาชิกปัจุบัน',
            header: 'สมัครสมาชิก',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              const playload = {
                id: res.data.id
              }
              this.service.editStatusEmployeeResign(playload).subscribe((res) => {
                   if(res != null){
                       if(res.data.statusEmployee === 'NORMAL_EMPLOYEE'){
                         this.messageService.add({severity:'success', summary: 'Success', detail: 'สมัครสมาชิกสำเร็จ'});  
                         this.iconName = 'bi bi-check-circle'
                         this.formModel.reset();
                       }
                   }else{
                      this.messageService.add({severity:'error', summary: 'Error', detail: 'สมัครสมาชิกไม่สำเร็จ'});
                      this.iconName = 'bi bi-x-circle'
                   }
              });
            },
            reject: () => { }
          });
        }else if(res.data.statusEmployee === 'NEW_EMPLOYEE'){
          this.messageService.add({severity:'success', summary: 'Success', detail: 'สมัครสมาชิกสำเร็จ เเละรอการอนุมัติ'});  
          this.iconName = 'bi bi-check-circle'
          this.formModel.reset();
        }else if(res.data.statusEmployee === 'ERROR_EMPLOYEE'){
          this.messageService.add({severity:'error', summary: 'Error', detail: 'สมัครสมาชิกไม่สำเร็จ'});
          this.iconName = 'bi bi-x-circle'
        }
      }else{
        setTimeout(() => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'สมัครสมาชิกไม่สำเร็จ'});
          this.iconName = 'bi bi-x-circle'
        }, 500); 
      }
    })
  }
}
