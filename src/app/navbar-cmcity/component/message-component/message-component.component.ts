import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchNewResgter } from 'src/app/model/search-new-register';
import { MainService } from 'src/app/service/main.service';
import { DecimalPipe, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Representative } from 'src/app/model/ccustomerTest';
import { LocalStorageService } from 'ngx-webstorage';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-message-component',
  templateUrl: './message-component.component.html',
  styleUrls: ['./message-component.component.scss'],
})
export class MessageComponentComponent implements OnInit {
  public data: Observable<SearchNewResgter[]> | any;
  loading!: boolean;
  dataNotify!: any[];
  // birthday = new Date(1988, 3, 15);
  periodMonthDescOption: any = [];
  clonedProducts: { [s: number]: any } = {};
  representatives!: Representative[];
  mess!: MenuItem[];
  mess2!: MenuItem[];
  mess3!: MenuItem[];
  messMonthlyStockMoney!: MenuItem[];
  displayModal!: boolean;
  displayModalUser!: boolean;
  displayEditByMonthlyStock: boolean = false;
  formModel!: FormGroup;
  id: any;
  employeeId: any;
  statuses!: any[];
  selectedItem: any = null;
  detail: boolean;
  detailModel: FormGroup;
  statusNotifys: any;
  userId: any;
  descriptionUser: any;
  arrayListDescriptionUser: any[] = [];
  idNotify: any;
  displayEditByUser: boolean;
  firstNameOld: any;
  lastNameOld: any;
  maritalOld: any;
  profileImgId: any;
  monthlyStockMoneyOld: any;

  constructor(
    private service: MainService,
    protected route: ActivatedRoute,
    protected router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  initMainForm() {
    this.formModel = new FormGroup({
      remark: new FormControl(null, Validators.required),
    });

    this.detailModel = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      idCard: new FormControl(null),
      gender: new FormControl(null),
      levelName: new FormControl(null),
      positionName: new FormControl(null),
      affiliationName: new FormControl(null),
      employeeTypeName: new FormControl(null),
      bureauName: new FormControl(null),
      departmentName: new FormControl(null),
      stockAccumulate: new FormControl(null),
      loanBalance: new FormControl(null),
      marital: new FormControl('-'),
    });

    this.formModelInfo = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      marital: new FormControl(null),
      monthlyStockMoney: new FormControl(null),
    });
  }

  ngOnInit() {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      history.go(0);
    } else {
      localStorage.removeItem('foo');
      this.initMainForm();
      this.setperiodMonthDescOption();
      this.searchNotify();
    }

    this.checkStatus();
    this.checkMess();
  }

  checkPrefix(data: any): any {
    switch (data) {
      case 'นาย':
        return '1';
      case 'นางสาว':
        return '2';
      case 'นาง':
        return '3';
      case 'ด.ช':
        return '4';
      case 'ด.ญ':
        return '5';
      case 'ว่าที่ร้อยตรี':
        return '6';
      case 'ว่าที่ร้อยตรีหญิง':
        return '7';
      case 'ว่าที่ร้อยโท':
        return '8';
      case 'ว่าที่ร้อยโทหญิง':
        return '9';
      case 'ว่าที่ร้อยเอก':
        return '10';
      case 'ว่าที่ร้อยเอกหญิง':
        return '11';
      case 'สิบตรี':
        return '12';
      case 'สิบตรีหญิง':
        return '13';
      case 'สิบโท':
        return '14';
      case 'สิบโทหญิง':
        return '15';
      case 'สิบเอก':
        return '16';
      case 'สิบเอกหญิง':
        return '17';
      case 'จ่าสิบตรี':
        return '18';
      case 'จ่าสิบตรีหญิง':
        return '19';
      case 'จ่าสิบโท':
        return '20';
      case 'จ่าสิบโทหญิง':
        return '21';
      case 'จ่าสิบเอก':
        return '22';
      case 'จ่าสิบเอกหญิง':
        return '23';
      default:
        break;
    }
  }

  checkMess() {
    this.mess = [
      {
        label: 'ข้อมูลสมาชิก',
        icon: 'pi pi-eye',
        command: (event) => {
          this.detail = true;
          this.detailModel.patchValue({
            ...this.selectedItem.employee,
            prefix: this.checkPrefix(this.selectedItem.employee?.prefix),
          });

          this.descriptionUser = null;
          this.idNotify = this.selectedItem.id;
          this.funCheckImagePro(this.selectedItem.employee);
        },
      },
      {
        label: 'ยืนยัน',
        icon: 'pi pi-check-circle ',
        command: () => {
          this.onClickApproveEmp(this.selectedItem);
        },
      },
      {
        label: 'ปฏิเสธ',
        icon: 'pi pi-times-circle',
        command: () => {
          this.onClickCancleApproveEmp(this.selectedItem);
        },
      },
    ];
    this.mess2 = [
      {
        label: 'ข้อมูลสมาชิก',
        icon: 'pi pi-eye',
        command: (event) => {
          this.detail = true;
          this.detailModel.patchValue({
            ...this.selectedItem.employee,
            prefix: this.checkPrefix(this.selectedItem.employee?.prefix),
          });

          this.idNotify = this.selectedItem.id;
          this.funCheckImagePro(this.selectedItem.employee);
        },
      },
      {
        label: 'ข้อมูลการเปลี่ยนผู้รับผลประโยชน์',
        icon: 'pi pi-check-circle ',
        command: () => {
          this.descriptionUser = this.selectedItem.description;
          this.idNotify = this.selectedItem.id;
          this.onCheckBeneficiary();
        },
      },
    ];
    this.mess3 = [
      {
        label: 'ข้อมูลสมาชิก',
        icon: 'pi pi-eye',
        command: (event) => {
          this.detail = true;
          this.detailModel.patchValue({
            ...this.selectedItem.employee,
            prefix: this.checkPrefix(this.selectedItem.employee?.prefix),
          });

          this.descriptionUser = this.selectedItem.description;
          this.idNotify = this.selectedItem.id;
          this.funCheckImagePro(this.selectedItem.employee);
        },
      },
      {
        label: 'การแก้ไขข้อมูลส่วนตัว',
        icon: 'pi pi-check-circle ',
        command: () => {
          this.formModelInfo.get('firstName').disable();
          this.formModelInfo.get('lastName').disable();
          this.formModelInfo.get('marital').disable();

          this.firstNameOld = this.selectedItem.employee.firstName
            ? this.selectedItem.employee.firstName
            : null;
          this.lastNameOld = this.selectedItem.employee.lastName
            ? this.selectedItem.employee.lastName
            : null;
          this.maritalOld = this.selectedItem.employee.marital
            ? this.selectedItem.employee.marital
            : '-';

          this.descriptionUser = this.selectedItem.description;
          this.idNotify = this.selectedItem.id;
          this.onCheckInfo();
        },
      },
    ];
    this.messMonthlyStockMoney = [
      {
        label: 'ข้อมูลสมาชิก',
        icon: 'pi pi-eye',
        command: (event) => {
          this.detail = true;
          this.detailModel.patchValue({
            ...this.selectedItem.employee,
            prefix: this.checkPrefix(this.selectedItem.employee?.prefix),
          });

          this.descriptionUser = this.selectedItem.description;
          this.idNotify = this.selectedItem.id;
          this.funCheckImagePro(this.selectedItem.employee);
        },
      },
      {
        label: 'การแก้ไขเงินหุ้นส่งรายเดือน',
        icon: 'pi pi-check-circle ',
        command: () => {
          this.descriptionUser = this.selectedItem.reason;
          this.monthlyStockMoneyOld = this.formattedNumber(
            this.selectedItem.description
          );
          this.idNotify = this.selectedItem.id;
          this.onCheckMonthlyStockMoneyOld();
        },
      },
    ];
  }

  funCheckImagePro(data: any) {
    this.profileImgId = data.profileImgId != null ? data.profileImgId : null;
    this.gender = data.gender;

    if (this.profileImgId == null) {
      this.checkImgProfile();
    } else {
      this.getImage(this.profileImgId);
    }
  }

  clearDialog() {
    this.gender = null;
    this.profileImgId = null;
    this.imageSrc = null;
    // this.checkImgProfile();

    this.firstNameOld = null;
    this.lastNameOld = null;
    this.maritalOld = null;

    this.monthlyStockMoneyOld = null;
  }

  onRowEditInit(stock: any) {
    this.clonedProducts[stock.id!] = { ...stock };
  }

  statusNotify(value: any) {
    const status = this.statuses[value - 1];
    return status.label;
  }

  checkStatus() {
    this.statuses = [
      // { label: 'เลือกสถานะ', value: 0 },
      { label: 'ลาออก', value: '1' },
      { label: 'หุ้นรายเดือน', value: '2' },
      { label: 'สมัครสมาชิก', value: '3' },
      { label: 'ผู้รับผลประโยชน์', value: '4' },
      { label: 'ข้อมูลส่วนตัว', value: '5' },
    ];
  }

  searchNotify(): void {
    this.service.searchNotify().subscribe((data) => {
      this.dataNotify = data.sort((a, b) => {
        return (
          new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        );
      });
    });
  }

  onClickApproveEmp(data: any) {
    if (data.status == 3) {
      const approve = {
        id: data.employee.id,
        approveFlag: true,
        noId: data.id,
      };
      this.confirmationService.confirm({
        message:
          'ต้องการยืนยันการสมัครของ ' +
          data.employee.prefix +
          data.employee.firstName +
          ' ' +
          data.employee.lastName +
          ' ใช่หรือไม่',
        header: 'ยืนยันการสมัครเข้าใช้งานระบบ',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.service.approveRegister(approve).subscribe((data) => {
            this.messageService.add({
              severity: 'success',
              detail: 'แก้ไขสำเร็จ',
            });
            this.data = data;
            this.ngOnInit();
          });
        },
        reject: () => {},
      });
    } else {
      const approve = {
        id: data.employee.id,
        value: data.reason,
        type: data.status,
        noId: data.id,
      };
      let message = '';
      if (data.status == 1) {
        message =
          'ต้องการยืนยันการลาออกของ ' +
          data.employee.prefix +
          data.employee.firstName +
          ' ' +
          data.employee.lastName +
          ' ใช่หรือไม่';
      } else {
        message =
          'ต้องการยืนยันเปลี่ยนหุ้นรายเดือนของ ' +
          data.employee.prefix +
          data.employee.firstName +
          ' ' +
          data.employee.lastName +
          ' ใช่หรือไม่';
      }

      this.confirmationService.confirm({
        message: message,
        header: 'ยืนยันการแก้ไข',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.service.updateResignAdmin(approve).subscribe((data) => {
            this.messageService.add({
              severity: 'success',
              detail: 'แก้ไขสำเร็จ',
            });
            this.data = data;
            this.ngOnInit();
          });
        },
        reject: () => {},
      });
    }
  }

  onClickCancleApproveEmp(data: any) {
    this.id = data.id;
    this.employeeId = data.employee.id;
    this.statusNotifys = data.status;
    this.displayModal = true;
  }

  onclikRemark() {
    // const value = this.formModel.getRawValue();

    // if (this.statusNotifys == 3) {
    //   const cancelRegis = {
    //     id: this.employeeId,
    //     remark: value.remark
    //   }
    //   this.service.cancelApproveRegister(cancelRegis).subscribe((data) => {
    //     this.data = data;
    //     this.ngOnInit();
    //   });
    // } else {
    //   this.service.cancelNotification(this.id, this.employeeId).subscribe();
    //   this.ngOnInit();
    // }

    if (this.statusNotifys == 2) {
      this.service.cancelNotification(this.id, this.employeeId).subscribe();
    } else if (this.statusNotifys == 3) {
      this.service.rejectRegister(this.id, this.employeeId).subscribe();
    } else {
      this.service.deleteNotify(this.id).subscribe();
    }

    this.displayModalUser = false;
    this.displayModal = false;
    this.displayEditByMonthlyStock = false;
    this.ngOnInit();
  }

  onclikCancel() {
    this.service.deleteNotify(this.idNotify).subscribe();
    this.displayEditByUser = false;
    this.displayModalUser = false;
    this.displayModal = false;
    this.displayEditByMonthlyStock = false;
    this.ngOnInit();
  }

  pipeDateTH(date: any) {
    const format = new Date(date);
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;

    const monthSelect = this.periodMonthDescOption[month];

    return day + ' ' + monthSelect.label + ' ' + year;
  }

  onTime(date: any) {
    const format = new Date(date);
    const hours = format.getHours().toString().padStart(2, '0');
    const minutes = format.getMinutes().toString().padStart(2, '0');

    return hours + ':' + minutes + ' น.';
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

  imageSrc: SafeUrl;
  gender: any;
  checkImgProfile() {
    let textGender = '';
    if (this.profileImgId != null) {
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
    }

    return textGender;
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

  filteredData: any = [];
  onCheckBeneficiary() {
    this.arrayListDescriptionUser = JSON.parse(this.descriptionUser);
    this.displayModalUser = true;
    this.filteredData = this.arrayListDescriptionUser.filter(
      (item) => item.active === true
    );
  }

  descriptionUserInfo: any;
  formModelInfo!: FormGroup;
  onCheckInfo() {
    this.descriptionUserInfo = JSON.parse(this.descriptionUser);
    this.displayEditByUser = true;
    this.formModelInfo.patchValue({ ...this.descriptionUserInfo });
  }

  onCheckMonthlyStockMoneyOld() {
    this.descriptionUserInfo = this.descriptionUser;
    this.displayEditByMonthlyStock = true;
    this.formModelInfo.patchValue({
      monthlyStockMoney: this.formattedNumber(this.descriptionUserInfo),
    });
  }

  formattedNumber(number: any): any {
    const decimalPipe = new DecimalPipe('en-US');
    return number !== null ? decimalPipe.transform(number) : '';
  }

  approveUpdateByUser() {
    this.service
      .approveUpdateByUser(this.descriptionUserInfo)
      .subscribe((data) => {
        this.showSuccess();
        this.displayEditByUser = false;
        this.service.deleteNotify(this.idNotify).subscribe();
        this.ngOnInit();
      });
  }

  updateBeneficairyList(arrayListDescriptionUser: any[]) {
    this.service
      .updateBeneficiaryLogic(arrayListDescriptionUser)
      .subscribe((data) => {
        this.showSuccess();
        this.displayModalUser = false;
        this.detail = false;
        this.service.deleteNotify(this.idNotify).subscribe();
        this.ngOnInit();
      });
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'แก้ไขผู้รับผลประโยชน์',
    });
  }

  checkRelationshipColor(relationship: any) {
    switch (relationship) {
      case 'บุตรบุญธรรม':
        return '#ffca28';
      case 'บุตร':
        return '#ffa726';
      case 'บิดา':
        return '#ab47bc';
      case 'มารดา':
        return '#7e57c2';
      case 'สามี':
        return '#26a69a';
      case 'ภรรยา':
        return '#26c6da';
      default:
        return '#ffa726';
    }
  }

  approveUpdateByMonthlyStockMoney() {
    this.onClickApproveEmp(this.selectedItem);
  }

  cancleMonthlyStockMoney() {
    this.onClickCancleApproveEmp(this.selectedItem);
  }

  // profileImgById(gender: any) {
  //   console.log(gender);

  //   let textGender = '';
  //   switch (gender) {
  //     case 'ชาย':
  //       textGender = 'assets/images/boy.png';
  //       break;
  //     case 'หญิง':
  //       textGender = 'assets/images/girl.png';
  //       break;
  //     default:
  //       break;
  //   }
  //   return textGender;
  // }
}
