import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Affiliation } from '../model/affiliation';
import { Bureau } from '../model/bureau';
import { Department } from '../model/department';
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
  iconStatus: boolean = false;
  statusCheck: any;
  level: any;
  employeeType: any;
  periodMonthDescOption: any = [];


  public position: Observable<Positions[]> | any 
  public affiliation: Observable<Affiliation[]> | any 
  public bureau: Observable<Bureau[]> | any 
  public dapartment: Observable<Department[]> | any;

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
    this.getBureau();
    this.getDapartment();
    this.searchLevel();
    this.searchEmployeeType();
    this.setperiodMonthDescOption();
  }

  getPositions(): void {
    this.service.searchPosition().subscribe(data => this.position = data);
  }

  getBureau(): void {
    this.service.searchBureau().subscribe(data => this.bureau = data);
  }

  getDapartment(): void {
    this.service.searchDepartment().subscribe(data => this.dapartment = data)
  }

  searchLevel(): void {
    this.service.searchLevel().subscribe(data => this.level = data);
  }

  searchEmployeeType(): void {
    this.service.searchEmployeeType().subscribe(data => this.employeeType = data);
  }

  initMainForm(){
    this.formModel = new FormGroup({
      prefix: new FormControl('0',Validators.required),
      firstName: new FormControl(null,Validators.required),
      lastName: new FormControl(null,Validators.required),
      idCard: new FormControl(null,Validators.required),
      tel: new FormControl(null,Validators.required),
      positionId: new FormControl('0',Validators.required),
      bureauId: new FormControl('0',Validators.required),
      affiliationId: new FormControl('0',Validators.required),
      email: new FormControl(null,Validators.required),
      dapartmentId: new FormControl('0',Validators.required),
      levelId: new FormControl('0',Validators.required),
      employeeTypeId: new FormControl('0',Validators.required),
      stockValue: new FormControl(null,Validators.required),
      stockMonth: new FormControl(null),
      stockYear: new FormControl(null),
    });
  }

  month: any;
  year: any;
  time: any;
  pipeDateTH() {
    const format = new Date()
    const day = format.getDate()
    const month = format.getMonth()
    const year = format.getFullYear() + 543
    this.year = year;
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    const time = format.getHours() + ':' + format.getMinutes() + ' น.';
    this.time = time;
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
    playload.stockMonth = this.month;
    playload.stockYear = this.year;

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
                       if(res.data.statusEmployee === 'NEW_EMPLOYEE'){
                         this.messageService.add({severity:'success', summary: 'Success', detail: 'สมัครสมาชิกสำเร็จ'});  
                         this.iconStatus = true;
                         this.formModel.reset();
                       }
                   }else{
                      this.messageService.add({severity:'error', summary: 'Error', detail: 'สมัครสมาชิกไม่สำเร็จ'});
                      this.iconStatus = false;
                   }
              });
            },
            reject: () => { }
          });
        }else if(res.data.statusEmployee === 'NEW_EMPLOYEE'){
          this.messageService.add({severity:'success', summary: 'Success', detail: 'สมัครสมาชิกสำเร็จ เเละรอการอนุมัติ'});  
          this.iconStatus = true;
          this.formModel.reset();
          this.router.navigate(['/login'], {});
        }else if(res.data.statusEmployee === 'ERROR_EMPLOYEE'){
          this.messageService.add({severity:'error', summary: 'Error', detail: 'สมัครสมาชิกไม่สำเร็จ'});
          this.iconStatus = false;
        }
      }else{
        setTimeout(() => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'สมัครสมาชิกไม่สำเร็จ'});
          this.iconStatus = false;
        }, 500); 
      }
    })
  }

  checkBureau(id: any){
    // console.log("data ---------------> ", data.target.value);
    this.service.searchByBureau(id.target.value).subscribe(data => this.affiliation = data);
  }
}
