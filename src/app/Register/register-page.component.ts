import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MainService } from '../service/main.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit{

  formModel!: FormGroup;
  userId: any;
  constructor(
    protected route: ActivatedRoute, 
    private fb: FormBuilder, 
    private service : MainService,
    protected router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) {
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
      firstName: new FormControl(null,Validators.required),
      lastName: new FormControl(null,Validators.required),
      email: new FormControl(null,Validators.required),
      tel: new FormControl(null,Validators.required),
      //employeeCode: new FormControl(null,Validators.required),
      prefix: new FormControl(null,Validators.required),
      idCard: new FormControl(null,Validators.required),
      employeeType: new FormControl(null,Validators.required),
    });
  }

  onRegister(){
    const playload = this.formModel.getRawValue();
    this.service.register(playload).subscribe((res) => {
      console.log(res,'======================> res')
      if(res !== null){
        if(res.data.statusEmployee === 'normal'){
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
        }else if(res.data.statusEmployee === 'resign'){
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
                       if(res.data.statusEmployee === 'normal'){
                         this.messageService.add({severity:'success', summary: 'Success', detail: 'สมัครสมาชิกสำเร็จ'});  
                         this.formModel.reset();
                       }
                   }else{
                      this.messageService.add({severity:'error', summary: 'Error', detail: 'สมัครสมาชิกไม่สำเร็จ'});
                   }
              });
            },
            reject: () => { }
          });
        }else{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'สมัครสมาชิกสำเร็จ เเละรอการอนุมัติ'});  
          this.formModel.reset();
        }
      }else{
        setTimeout(() => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'สมัครสมาชิกไม่สำเร็จ'});
        }, 500); 
      }
    })
  }
  

}
