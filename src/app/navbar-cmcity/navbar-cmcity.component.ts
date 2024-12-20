import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee';
import { MainService } from '../service/main.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar-cmcity',
  templateUrl: './navbar-cmcity.component.html',
  styleUrls: ['./navbar-cmcity.component.scss'],
})
export class NavbarCmcityComponent implements OnInit {
  formModel!: FormGroup;
  items!: MenuItem[];
  displayModal: boolean = false;
  displayModalRegister: boolean = false;
  emp: Observable<Employee> | any;
  main: string = 'active';
  deposit!: string;
  stock!: string;
  loan!: string;
  rigths!: string;
  beneficiary!: string;
  guarantee!: string;
  dividend!: string;
  profile!: string;
  message!: string;
  countDatetime: number = 0;
  userId: any;
  messager: boolean = false;
  dataNotify!: any[];
  countNotify: any;
  imageSrc: SafeUrl;
  gender: any;
  profileImgId: any;
  setting: any;
  settingEmployee: any;
  settingStock: any;
  settingLoan: any;
  settingDividend: any;
  settingNews: any;
  settingDocs: any;
  settingSystem: any;
  admin: boolean = false;
  isSidenavOpen: boolean = false;
  isSidenavOpenFull: boolean = false;
  displayReset: boolean = false;
  newPass: any;
  newPassValidation: boolean = false;
  newPass2: any;
  newPass2Validation: boolean = false;
  iconStatus: boolean = false;
  formModelReset!: FormGroup;

  constructor(
    private service: MainService,
    protected router: Router,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.currentDate();
  }

  currentDate() {
    const formatDate = new Date();
    const day = formatDate.getDate();
    const month = formatDate.getMonth() + 1;
    const year = formatDate.getFullYear();
    const hours = formatDate.getHours();
    const minutes = formatDate.getMinutes();
    const seconds = formatDate.getSeconds();
    this.currentDateTime =
      month +
      '/' +
      day +
      '/' +
      year +
      ' ' +
      hours +
      ':' +
      (minutes + 5) +
      ':' +
      seconds;
    if (this.localStorageService.retrieve('countDatetime') === 0) {
      this.localStorageService.store(
        'currentDateTime',
        new Date().getTime() + 3600000
      );
    }
    this.countDatetime++;
    this.localStorageService.store('countDatetime', this.countDatetime);
  }

  countDemo: any;
  currentDateTime: any;

  x = setInterval(() => {
    let now = new Date().getTime();
    let countDate = new Date(
      this.localStorageService.retrieve('currentDateTime')
    ).getTime();
    let distance = countDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.countDemo = minutes + 'm ' + seconds + 's ';

    if (distance < 0) {
      clearInterval(this.x);
      this.countDemo = 'time out';
      setTimeout(() => {
        alert(' เวลาในระบบหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง ');
        this.onLogout();
      }, 500);
    }
  });

  ngOnInit() {
    this.checkURLClick(window.location.href.toString());
    this.items = [
      {
        label: 'ข้อมูลส่วนตัว',
        icon: 'uil uil-user',
        command: () => {
          this.onProfile();
        },
      },
      {
        label: 'เปลี่ยนรหัสผ่าน',
        icon: 'uil uil-edit',
        command: () => {
          // this.onForgetPassword();
          this.displayReset = true;
        },
      },
      {
        label: 'ออกจากระบบ',
        icon: 'uil uil-signout',
        command: () => {
          this.onLogout();
        },
      },
    ];
    this.userId = this.localStorageService.retrieve('empId');
    this.getEmployeeOfMain(this.userId);
    this.initMainForm();
    this.searchNotify();
    this.initMainFormReset();
    // if (this.adminFlag) {
    //   this.messager = true;
    //   this.admin = true;
    // }
  }

  checkURLClick(textUrl: any) {
    const baseUrl = 'http://localhost:4200/main/';
    const url = textUrl.replace(baseUrl, '');

    if (url.toLowerCase().includes('main')) {
      this.checkActive('main');
    } else if (url.toLowerCase().includes('share')) {
      this.checkActive('stock');
    } else if (url.toLowerCase().includes('rigths')) {
      this.checkActive('rigths');
    } else if (url.toLowerCase().includes('loan')) {
      this.checkActive('loan');
    } else if (url.toLowerCase().includes('beneficiary')) {
      this.checkActive('beneficiary');
    } else if (url.toLowerCase().includes('guarantee')) {
      this.checkActive('guarantee');
    } else if (url.toLowerCase().includes('dividend')) {
      this.checkActive('dividend');
    } else if (url.toLowerCase().includes('page1')) {
      this.checkActive('settingEmployee');
    } else if (url.toLowerCase().includes('page2')) {
      this.checkActive('settingStock');
    } else if (url.toLowerCase().includes('page3')) {
      this.checkActive('settingLoan');
    } else if (url.toLowerCase().includes('page4')) {
      this.checkActive('settingDividend');
    } else if (url.toLowerCase().includes('profile')) {
      this.checkActive('profile');
    } else if (url.toLowerCase().includes('news-page')) {
      this.checkActive('settingNews');
    } else if (url.toLowerCase().includes('setting-page')) {
      this.checkActive('settingSystem');
    } else if (url.toLowerCase().includes('deposit-page')) {
      this.checkActive('deposit');
    } else if (url.toLowerCase().includes('doc-page')) {
      this.checkActive('settingDocs');
    }
    //  else if(url.toLowerCase().includes('')){
    //   this.checkActive('setting')
    //  }
  }

  isCollapsed: boolean = false;

  toggleCollapse(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
  }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent): void {
  //   this.isCollapsed = true;
  // }

  preventCollapse(event: MouseEvent): void {
    event.stopPropagation();
  }

  initMainForm() {
    this.formModel = new FormGroup({
      gender: new FormControl(null),
    });
  }

  onProfile() {
    this.router.navigate(['/main/profile-page']);
    this.checkActive('profile');
  }

  onForgetPassword() {
    this.router.navigate(['/main/reset-password-page']);
  }

  onLogout() {
    this.localStorageService.clear('empId');
    this.localStorageService.clear('currentDateTime');
    this.localStorageService.clear('countDatetime');
    this.localStorageService.clear('stockId');
    this.localStorageService.clear('loanId');
    this.localStorageService.clear('employeeofmain');
    this.router.navigate(['/login']);
  }

  showModalDialog() {
    this.displayModal = true;
  }

  showModalDialogRegister() {
    this.displayModalRegister = true;
  }

  // check active model
  checkActive(data: any) {
    switch (data) {
      case 'main':
        this.main = 'active';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'deposit':
        this.main = '';
        this.deposit = 'active';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'stock':
        this.main = '';
        this.deposit = '';
        this.stock = 'active';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'loan':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = 'active';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'rigths':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = 'active';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'beneficiary':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = 'active';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'guarantee':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = 'active';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'dividend':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = 'active';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'profile':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = 'active';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'message':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = 'active';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = '';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        this.isCollapsed = false;
        break;
      case 'settingEmployee':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = 'active';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = 'active';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        break;
      case 'settingStock':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = 'active';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = 'active';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        break;
      case 'settingLoan':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = 'active';
        this.settingDividend = '';
        this.setting = 'active';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        break;
      case 'settingDividend':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = 'active';
        this.setting = 'active';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = '';
        break;
      case 'settingNews':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = 'active';
        this.settingNews = 'active';
        this.settingDocs = '';
        this.settingSystem = '';
        break;
      case 'settingSystem':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = 'active';
        this.settingNews = '';
        this.settingDocs = '';
        this.settingSystem = 'active';
        break;
      case 'settingDocs':
        this.main = '';
        this.deposit = '';
        this.stock = '';
        this.loan = '';
        this.rigths = '';
        this.beneficiary = '';
        this.guarantee = '';
        this.dividend = '';
        this.profile = '';
        this.message = '';
        this.settingEmployee = '';
        this.settingStock = '';
        this.settingLoan = '';
        this.settingDividend = '';
        this.setting = 'active';
        this.settingNews = '';
        this.settingDocs = 'active';
        this.settingSystem = '';
        break;
      default:
        break;
    }
  }

  adminFlag: any = false;
  getEmployeeOfMain(id: any): void {
    this.service.getEmployeeOfMain(id).subscribe((data) => {
      this.formModel.patchValue({
        ...data,
      });

      this.adminFlag = data.adminFlag;
      if (this.adminFlag) {
        this.messager = true;
      }
      this.admin = data.adminFlag;
      this.localStorageService.store('employeeofmain', data);
      this.getImage(data.profileImgId);
      this.gender = data.gender;
      this.profileImgId = data.profileImgId;
      this.localStorageService.store('profileImgId', data.profileImgId);
    });
  }

  profileImg() {
    let textGender = '';
    if (this.profileImgId != 0) {
      return this.imageSrc;
    } else {
      switch (this.gender) {
        case 'ชาย':
          textGender = 'assets/images/boy.png';
          break;
        case 'หญิง':
          textGender = 'assets/images/girl.png';
          break;
        default:
          break;
      }
      return textGender;
    }
  }

  checkCount(count: any): any {
    if (count == 0) {
      return 'none';
    }
  }

  searchNotify(): void {
    this.service.searchNotify().subscribe((data) => {
      this.dataNotify = data;
      this.countNotify = this.dataNotify.length;
    });
  }

  getImage(id: any) {
    if (id != 0) {
      this.service.getImage(id).subscribe(
        (imageBlob: Blob) => {
          this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(imageBlob)
          );
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
        }
      );
    }
  }

  toggleSidenav() {
    this.isSidenavOpenFull = !this.isSidenavOpenFull;
  }

  // reset password
  initMainFormReset() {
    this.formModel = new FormGroup({
      id: new FormControl(null, Validators.required),
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
    });
  }

  checkNewPass() {
    this.newPass = this.formModel.get('newPassword')?.value;
    this.newPass2 = this.formModel.get('confirmPassword')?.value;
    if (this.newPass?.match('^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$')) {
      this.newPassValidation = false;
      this.checkNewPass2();
    } else {
      this.newPassValidation = true;
    }
  }

  checkNewPass2() {
    this.newPass2 = this.formModel.get('confirmPassword')?.value;
    this.newPass = this.formModel.get('newPassword')?.value;
    if (
      this.newPass?.match('^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$') &&
      this.newPass === this.newPass2
    ) {
      this.newPass2Validation = false;
      this.checkNewPass();
    } else {
      this.newPass2Validation = true;
    }
  }

  clickChangePassword() {
    this.formModel.markAllAsTouched();
    this.formModel.get('id').setValue(this.userId);
    if (
      this.formModel.valid &&
      !this.newPassValidation &&
      !this.newPass2Validation
    ) {
      const data = this.formModel.getRawValue();
      //data.id = this.userId;
      if (data.newPassword === data.confirmPassword) {
        if (data.newPassword === data.oldPassword) {
          this.messageService.add({
            severity: 'warn',
            detail: 'กรุณาเปลี่ยนรหัสผ่านใหม่',
          });
        } else {
          this.confirmationService.confirm({
            message: 'ท่านต้องการเปลี่ยนรหัสผ่านใหม่หรือไม่',
            header: 'เปลี่ยนรหัสผ่าน',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.service.resetPassword(data).subscribe(async (res) => {
                if (res != null) {
                  if (res.statusEmployee === 'success') {
                    this.messageService.add({
                      severity: 'success',
                      detail: 'เปลี่ยนรหัสผ่านใหม่สำเร็จ',
                    });
                    this.iconStatus = true;
                    this.formModel.reset();
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    this.onLogout();
                  } else {
                    this.messageService.add({
                      severity: 'error',
                      detail: 'เปลี่ยนรหัสผ่านใหม่ไม่สำเร็จ',
                    });
                    this.iconStatus = false;
                  }
                } else {
                  this.messageService.add({
                    severity: 'error',
                    detail: 'เปลี่ยนรหัสผ่านใหม่ไม่สำเร็จ',
                  });
                  this.iconStatus = false;
                }
              });
            },
            reject: () => {},
          });
        }
      } else {
        this.messageService.add({
          severity: 'warn',
          detail: 'รหัสผ่านใหม่ไม่ตรงกัน',
        });
        this.iconStatus = false;
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        detail: 'กรุณากรอกข้อมูลให้ครบถ้วนเเละถูกต้อง',
      });
    }
  }

  onCancleReset() {
    this.formModelReset.reset();
    this.displayReset = false;
  }
}
