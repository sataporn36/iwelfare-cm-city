import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Product } from 'src/app/constans/Product';
import { Affiliation } from 'src/app/model/affiliation';
import { Bureau } from 'src/app/model/bureau';
import { Department } from 'src/app/model/department';
import { EmployeeType } from 'src/app/model/employee-type';
import { Level } from 'src/app/model/level';
import { Positions } from 'src/app/model/position';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-admin-component1',
  templateUrl: './admin-component1.component.html',
  styleUrls: ['./admin-component1.component.scss']
})
export class AdminComponent1Component {

  detailModel!: FormGroup;
  formModelInterest!: FormGroup;
  formModelSignature!: FormGroup;
  configAdmin: any;
  profileImgId: any;
  imageSrc: SafeUrl;
  imageSrcPro: SafeUrl;
  imageBlob1: Blob;
  imageBlob2: Blob;
  imageSrc1: SafeUrl;
  imageSrc2: SafeUrl;
  fileImg1: any;
  fileImg2: any;
  interestId: any;
  periodMonthDescOption: any = [];
  empDetail: any;
  loanId: any;
  userId: any;
  admin!: boolean;
  listEmp: any;
  loading: boolean = false;
  displayBasic1: boolean | undefined;
  images1: any[] = [];
  displayBasic2: boolean | undefined;
  images2: any[] = [];
  detail: boolean;
  gender: any;
  imageSrcAddress: SafeUrl;
  imageSrcIdCard: SafeUrl;
  textString: string = 'form-control-plaintext';
  textSelect: string = 'form-control';
  textStringGf: string = 'form-control-plaintext';
  textStringGm: string = 'form-control-plaintext';
  textStringMom: string = 'form-control-plaintext';
  textStringDad: string = 'form-control-plaintext';
  textStringChild: string = 'form-control-plaintext';
  mode: boolean = true;
  defaultDateline: Date = new Date("12/31/2003");

  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5
    },
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  sourceProducts: Product[];
  targetProducts: Product[];
  sourceEmployeeRole: any[] = [];
  targetEmployeeRole: any[] = [];
  public position: Observable<Positions[]> | any;
  public affiliation: Observable<Affiliation[]> | any;
  public bureau: Observable<Bureau[]> | any;
  public department: Observable<Department[]> | any;
  public level: Observable<Level[]> | any;
  public employeeType: Observable<EmployeeType[]> | any;

  constructor(private service: MainService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    protected router: Router,
    protected route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.initMainForm();
    this.setperiodMonthDescOption();
    this.pipeDateTH();
    this.initMainFormInterest();

    this.userId = this.localStorageService.retrieve('empId');
    this.empDetail = this.localStorageService.retrieve('employeeofmain');
    this.loanId = this.localStorageService.retrieve('loanid');

    this.searchEmployee();
    this.checkDefaultImage();
  }

  checkDefaultImage() {
    if (this.imageSrcAddress == null) {
      this.imageSrcAddress = 'assets/images/image-default2.png';
    }

    if (this.imageSrcIdCard == null) {
      this.imageSrcIdCard = 'assets/images/image-default2.png';
    }
  }

  getPositions(): void {
    this.service.searchPosition().subscribe(data => this.position = data);
  }

  getBureau(): void {
    this.service.searchBureau().subscribe(data => this.bureau = data);
  }

  getDepartment(): void {
    this.service.searchDepartment().subscribe(data => this.department = data);
  }

  searchLevel(): void {
    this.service.searchLevel().subscribe(data => this.level = data);
  }

  searchEmployeeType(): void {
    this.service.searchEmployeeType().subscribe(data => this.employeeType = data);
  }

  initMainForm() {
    this.detailModel = new FormGroup({
      id: new FormControl(null),
      employeeCode: new FormControl(null),
      prefix: new FormControl(null),
      selectPrefix: new FormControl(null),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      idCard: new FormControl(null),
      gender: new FormControl(null),
      marital: new FormControl(null),
      birthday: new FormControl(null),
      age: new FormControl(null),
      position: new FormControl(null),
      affiliation: new FormControl(null),
      employeeType: new FormControl(null),
      level: new FormControl(null),
      salary: new FormControl(null),
      compensation: new FormControl(null),
      contractStartDate: new FormControl(null),
      civilServiceDate: new FormControl(null),
      employeeStatus: new FormControl(null),
      billingStartDate: new FormControl(null),
      monthlyStockMoney: new FormControl(null),
      contact: new FormControl(null),
      dateOfDeath: new FormControl(null),
      resignationDate: new FormControl(null),
      approvedResignationDate: new FormControl(null),
      retirementDate: new FormControl(null),
      salaryBankAccountNumber: new FormControl(null),
      bankAccountReceivingNumber: new FormControl(null),
      user: new FormControl(null),

      // custom
      fullName: new FormControl(null),
      positionName: new FormControl(null),
      bureauName: new FormControl(null),
      affiliationName: new FormControl(null),
      employeeTypeName: new FormControl(null),
      levelName: new FormControl(null),

      // custom contact
      tel: new FormControl(null),
      officePhone: new FormControl(null),
      email: new FormControl(null),
      fax: new FormControl(null),
      lineId: new FormControl(null),
      facebook: new FormControl(null),
      address: new FormControl(null),

      relationship: new FormControl('0'),
      birthdayCalendar: new FormControl(null),
      contractStart: new FormControl(null),
      civilService: new FormControl(null),
      billingStart: new FormControl(null),
      textHidden: new FormControl(null),
      selectMarital: new FormControl(null),

      levelId: new FormControl('0', Validators.required),
      employeeTypeId: new FormControl('0', Validators.required),
      positionId: new FormControl('0', Validators.required),
      bureauId: new FormControl('0', Validators.required),
      affiliationId: new FormControl('0', Validators.required),
      departmentId: new FormControl('0', Validators.required),

      department: new FormControl(null),
      departmentName: new FormControl(null),
    });
  }

  onCheckAge(event: any) {
    const data = event;
    this.detailModel.get('age')?.setValue(this.transformAge(data) > 0 ? this.transformAge(data) : 0);
  }

  onClearAge() {
    this.detailModel.get('age')?.setValue(null);
  }

  pnumberCheck: any;
  pnumberValidation: boolean = false;
  checkPhoneNumber() {
    this.pnumberCheck = this.detailModel.get('tel')?.value;
    if (this.pnumberCheck?.match("^[0-9]{10}$")) {
      this.pnumberValidation = false;
    } else {
      this.pnumberValidation = true;
    }
  }

  emailCheck: any;
  emailValidation: boolean = false;
  checkEmail() {
    this.emailCheck = this.detailModel.get('email')?.value;
    if (this.emailCheck?.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")) {
      this.emailValidation = false;
    } else {
      this.emailValidation = true;
    }
  }

  onClickEdit() {
    this.textString = 'form-control';
    this.mode = false;
    this.detailModel.enable();
  }

  changeToNumber(value: any) {
    return parseInt(value.replace(/,/g, ''), 10);
  }

  checkMaritalV2_text(data: any): any {
    switch (data) {
      case '1':
        return 'โสด'
      case '2':
        return 'อยู่ร่วมกัน'
      case '3':
        return 'เป็นหม้าย'
      case '4':
        return 'หย่าร้าง'
      case '5':
        return 'แยกกันอยู่'
      default:
        break;
    }
  }

  onAccept() {
    const detail = this.detailModel.getRawValue();
    const playload = {
      id: this.infoId,
      prefix: detail.prefix,
      firstName: detail.firstName,
      lastName: detail.lastName,
      gender: detail.gender,
      idCard: detail.idCard,
      birthday: detail.birthday,
      tel: detail.tel,
      lineId: detail.lineId,
      facebook: detail.facebook,
      email: detail.email,
      address: detail.address,
      levelId: Number(detail.levelId) !== 0 ? Number(detail.levelId) : null,
      employeeTypeId: Number(detail.employeeTypeId) !== 0 ? Number(detail.employeeTypeId) : null,
      positionId: Number(detail.positionId) !== 0 ? Number(detail.positionId) : null,
      departmentId: Number(detail.departmentId) !== 0 ? Number(detail.departmentId) : null,
      affiliationId: Number(detail.affiliationId) !== 0 ? Number(detail.affiliationId) : null,
      marital: this.checkMaritalV2_text(detail.selectMarital),
      salary: detail.salary ? this.changeToNumber(detail.salary) : null,
      compensation: detail.compensation ? this.changeToNumber(detail.compensation) : null,
      monthlyStockMoney: detail.monthlyStockMone ? this.changeToNumber(detail.monthlyStockMoney) : null,
      contractStartDate: detail.contractStartDate,
      civilServiceDate: detail.civilServiceDate,
      billingStartDate: detail.billingStartDate,
      salaryBankAccountNumber: detail.salaryBankAccountNumber,
      bankAccountReceivingNumber: detail.bankAccountReceivingNumber
    }

    this.service.updateInfo(playload).subscribe((res) => {
      this.detailModel.disable();
      this.initMainForm();
      this.textString = 'form-control-plaintext';
      this.mode = true;
      this.detail = false;
      this.messageService.add({ severity: 'success', detail: 'แก้ไขสำเร็จ' });
    },
      () => {
        this.messageService.add({ severity: 'error', detail: 'แก้ไขไม่สำเร็จ เกิดข้อผิดพลาด' });
      });
  }

  onClear() {
    this.mode = true;
    this.textString = 'form-control-plaintext';
  }

  clearDialog() {
    this.mode = true;
    this.textString = 'form-control-plaintext';
    this.imageSrcIdCard = null;
    this.imageSrcAddress = null;
    this.checkDefaultImage();
    this.initMainForm();
    this.infoId = null;
  }

  myDefaultDate = new Date();
  checkBureau(id: any) {
    if (id.target.value != null) {
      this.service.searchByBureau(id.target.value).subscribe(data => this.affiliation = data);
    }
  }

  profileDetailImg() {
    let textGender = '';

    if (this.profileImgId != 0) {
      return this.imageSrcPro;
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

  getEmployeeOfMain(id: any) {
    this.service.getEmployeeOfMain(id).subscribe(main => {
      if (main) {
        this.profileImgId = main.profileImgId;
        this.getImagePro(main.profileImgId);
      }

    });
  }

  displayBasicAddress: boolean | undefined;
  displayBasicIdCard: boolean | undefined;
  imagesAddress: any[] = [];
  imagesIdCard: any[] = [];
  getImagePro(id: any) {
    this.imagesAddress = [];
    this.imagesIdCard = [];
    if (id != 0) {
      this.service.getImage(id).subscribe(
        (imageBlob: Blob) => {
          this.imageSrcPro = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
        }
      );

      this.service.getImageAddress(id).subscribe(
        (imageBlob: Blob) => {
          this.imageSrcAddress = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
          this.imagesAddress.push({
            itemImageSrc: this.imageSrcAddress
          })
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
          this.imageSrcAddress = null;
        }
      );

      this.service.getImageIdCard(id).subscribe(
        (imageBlob: Blob) => {
          this.imageSrcIdCard = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
          this.imagesIdCard.push({
            itemImageSrc: this.imageSrcIdCard
          })
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
          this.imageSrcIdCard = null;
        }
      );
    }
  }

  onProfilePicChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('empId', this.infoId.toString());

    this.service.uploadImage(formData).subscribe(
      () => {
        this.ngOnInit();
        this.getEmployeeOfMain(this.infoId);
        this.clickInfo(this.infoId);
        this.messageService.add({ severity: 'success', detail: 'อัพโหลดรูปสำเร็จ' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb' });
      }
    );
  }

  onProfilePicChangeDocAddress(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('empId', this.infoId.toString());

    this.service.uploadImageAddress(formData).subscribe(
      () => {
        this.ngOnInit();
        this.getEmployeeOfMain(this.infoId);
        this.clickInfo(this.infoId);
        this.messageService.add({ severity: 'success', detail: 'อัพโหลดรูปทะเบียนบ้านสำเร็จ' });
      },
      (error) => {
        if (error.error.text === 'ProfileNull') {
          this.messageService.add({ severity: 'error', detail: 'กรุณาเพิ่มรูปประจำตัวก่อน' });
        } else {
          this.messageService.add({ severity: 'error', detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb' });
        }
      }
    );
  }

  onProfilePicChangeDocIdCard(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('empId', this.infoId.toString());

    this.service.uploadImageIdCard(formData).subscribe(
      () => {
        this.ngOnInit();
        this.getEmployeeOfMain(this.infoId);
        this.clickInfo(this.infoId);
        this.messageService.add({ severity: 'success', detail: 'อัพโหลดรูปบัตรประชาชนสำเร็จ' });
      },
      (error) => {
        if (error.error.text === 'ProfileNull') {
          this.messageService.add({ severity: 'error', detail: 'กรุณาเพิ่มรูปประจำตัวก่อน' });
        } else {
          this.messageService.add({ severity: 'error', detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb' });
        }
      }
    );
  }

  month: any;
  year: any;
  time: any;
  monthValue: any;
  pipeDateTH() {
    const format = new Date()
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;
    this.year = year;
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    this.monthValue = monthSelect.value;
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

  initMainFormInterest() {
    this.formModelInterest = new FormGroup({
      id: new FormControl(null),
      interest: new FormControl(null),
    });
  }

  getImgSig1(dataImg: any, id: any) {
    if (id !== null || id) {
      this.getImage(id, 1, dataImg);
    } else {
      this.imageSrc1 = this.profileImg(dataImg);
    }
  }

  getImgSig2(dataImg: any, id: any) {
    if (id !== null || id) {
      this.getImage(id, 2, dataImg);
    } else {
      this.imageSrc2 = this.profileImg(dataImg);
    }
  }

  profileImg(dataImg: any) {
    let textImg = '';
    switch (dataImg) {
      case 'signature1':
        textImg = 'assets/images/text1.png';
        break;
      case 'signature2':
        textImg = 'assets/images/text2.png';
        break;
      default:
        break;
    }
    return textImg;
  }

  getImage(id: any, imageSrc: any, dataImg: any) {
    if (id != 0 || id != null) {
      this.service.getImageConfig(id).subscribe(
        (imageBlob: Blob) => {
          if (imageSrc === 1) {
            this.imageSrc1 = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
            this.images1.push({
              itemImageSrc: this.imageSrc1,
              thumbnailImageSrc: this.imageSrc1,
            });
          } else {
            this.imageSrc2 = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
            this.images2.push({
              itemImageSrc: this.imageSrc2,
              thumbnailImageSrc: this.imageSrc2,
            });
          }
        },
        (error: any) => {
          if (imageSrc === 1) {
            this.imageSrc1 = this.profileImg(dataImg);
          } else {
            this.imageSrc2 = this.profileImg(dataImg);
          }
          console.error('Failed to fetch image:', error);
        }
      );
    }
  }

  onConfigPicChange(event: Event, signature: any) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('empId', this.checkIndexSignature(signature));

    this.service.uploadImageConfig(formData).subscribe(
      () => {
        this.ngOnInit();
        this.ngOnInit();
        this.messageService.add({ severity: 'success', detail: 'อัพโหลดรูปสำเร็จ' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb' });
      }
    );
  }

  checkIndexSignature(signature: any) {
    if (signature === 'signature1') {
      return this.fileImg1.toString();
    } else {
      return this.fileImg2.toString();
    }
  }

  monthNew: any;
  yearNew: any;
  timeNew: any;
  pipeDateTHNewLan() {
    const format = new Date();
    format.setMonth(format.getMonth());
    const month = format.getMonth();
    format.setDate(0);
    const day = format.getDate();
    const year = format.getFullYear();
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    const time = format.getHours() + ':' + format.getMinutes() + ' น.';
    this.time = time;

    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1).getDate();
    return year + '-' + monthSelect.value + '-' + lastDayOfMonth;
  }


  updateIntereat() {
    const datePayLoanNew = this.pipeDateTHNewLan();
    const data = this.formModelInterest.getRawValue();
    const payload = {
      configId: this.interestId,
      value: data.interest,
      monthCurrent: this.month,
      yearCurrent: this.year.toString(),
      paymentStartDate: datePayLoanNew
    }
    this.service.editConfig(payload).subscribe((res) => {
      if (res.data !== null || res.data) {
        this.localStorageService.clear('employeeofmain');
        this.getEmployeeOfMains(this.userId, '');
        this.localStorageService.clear('loanId');
        this.localStorageService.store('loanId', res.data.id);
        this.ngOnInit();
        this.messageService.add({ severity: 'success', detail: 'แก้ไขข้อมูลสำเร็จ' });
      }
    });
  }

  getEmployeeOfMains(id: any, text: any): void {
    this.service.getEmployeeOfMain(id).subscribe(data => {
      if (data) {
        this.localStorageService.store('employeeofmain', data);
        if (text === 'user') {
          this.router.navigate(['/main/main-page'], {});
        } else {
          setTimeout(() => {
            this.ngOnInit();
          }, 500);

        }
      }
    });
  }

  resetInterst() {
    this.formModelInterest.reset();
    this.ngOnInit();
  }

  reFreshEmpOfMain(text: any) {
    this.localStorageService.clear('employeeofmain');
    this.getEmployeeOfMains(this.userId, text);
  }

  blockedDocument: boolean = false;
  blockDocument() {
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
    }, 500);
  }

  searchEmployee(): void {
    this.service.searchEmployee().subscribe(data => {
      const value = data;
      this.listEmp = value.filter(item => item.employeeCode !== '00000');
      this.loading = false;
    });
  }

  checkPrefix(data: any): any {
    switch (data) {
      case 'นาย':
        return '1'
      case 'นางสาว':
        return '2'
      case 'นาง':
        return '3'
      case 'ด.ช':
        return '4'
      case 'ด.ญ':
        return '5'
      case 'ว่าที่ร้อยตรี':
        return '6'
      case 'ว่าที่ร้อยตรีหญิง':
        return '7'
      case 'ว่าที่ร้อยโท':
        return '8'
      case 'ว่าที่ร้อยโทหญิง':
        return '9'
      case 'ว่าที่ร้อยเอก':
        return '10'
      case 'ว่าที่ร้อยเอกหญิง':
        return '11'
      case 'สิบตรี':
        return '12'
      case 'สิบตรีหญิง':
        return '13'
      case 'สิบโท':
        return '14'
      case 'สิบโทหญิง':
        return '15'
      case 'สิบเอก':
        return '16'
      case 'สิบเอกหญิง':
        return '17'
      case 'จ่าสิบตรี':
        return '18'
      case 'จ่าสิบตรีหญิง':
        return '19'
      case 'จ่าสิบโท':
        return '20'
      case 'จ่าสิบโทหญิง':
        return '21'
      case 'จ่าสิบเอก':
        return '22'
      case 'จ่าสิบเอกหญิง':
        return '23'
      default:
        break;
    }
  }

  pipeDateTHD(date: any) {
    const format = new Date(date);
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;

    const monthSelect = this.periodMonthDescOption[month];
    return day + ' ' + monthSelect.label + ' ' + year;
  }

  transformAge(dateOfBirth: any): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  checkMaritalV2(data: any): any {
    switch (data) {
      case 'โสด':
        return '1'
      case 'อยู่ร่วมกัน':
        return '2'
      case 'เป็นหม้าย':
        return '3'
      case 'หย่าร้าง':
        return '4'
      case 'แยกกันอยู่':
        return '5'
      default:
        break;
    }
  }

  checkRetirementDate(dateOfBirth: any) {
    const formatDate = new Date(dateOfBirth);
    const day = formatDate.getDate();
    const month = formatDate.getMonth() + 1;
    const year = formatDate.getFullYear() + 543;

    const monthSelect = this.periodMonthDescOption[9 - 1];
    if (month > 9) {
      return 30 + ' ' + monthSelect.label + ' ' + (year + 61);
    } else {
      return 30 + ' ' + monthSelect.label + ' ' + (year + 60);
    }
  }

  infoId: any;
  clickInfo(id: any) {
    this.infoId = id;
    this.service.getEmployee(id).subscribe(data => {
      const decimalPipe = new DecimalPipe('en-US');
      this.gender = data.gender;
      this.detail = true;
      this.getEmployeeOfMain(id);
      this.profileDetailImg();

      this.searchLevel();
      this.searchEmployeeType();
      this.getPositions();
      this.getBureau();
      this.getDepartment();

      if (data.affiliation != null) {
        this.service.searchByBureau(data.affiliation.bureau.id).subscribe(data => this.affiliation = data);
      }

      this.detailModel.patchValue({
        ...data,
        prefix: data?.prefix ? data?.prefix : '-',
        selectPrefix: data?.prefix ? this.checkPrefix(data?.prefix) : 0,
        fullName: data.firstName + ' ' + data.lastName,
        positionName: data.positionName ? data.positionName : '-',
        affiliationName: data.affiliationName ? data.affiliationName : '-',
        // **
        // bureauName: data.bureauName ? data.bureauName : '-',
        employeeTypeName: data.employeeTypeName ? data.employeeTypeName : '-',
        levelName: data.levelName ? data.levelName : '-',
        birthdayCalendar: data?.birthday ? this.pipeDateTHD(data?.birthday) : '-',
        birthday: data?.birthday ? new Date(data.birthday) : null,
        age: data.birthday ? this.transformAge(data.birthday) : '-',
        marital: data?.marital ? data?.marital : '-',
        selectMarital: data?.marital ? this.checkMaritalV2(data?.marital) : 0,

        // **
        employeeType: data.employeeType ? data.employeeType : null,
        employeeTypeId: data.employeeType ? data.employeeType.id : 0,

        level: data.level ? data.level : null,
        levelId: data.level ? data.level.id : 0,

        position: data.position ? data.position : null,
        positionId: data.position ? data.position.id : 0,

        affiliation: data.affiliation ? data.affiliation : null,
        affiliationId: data.affiliation ? data.affiliation.id : 0,

        bureau: data.affiliation?.bureau ? data.affiliation?.bureau : null,
        bureauId: data.affiliation?.bureau ? data.affiliation?.bureau.id : 0,
        bureauName: data.affiliation?.bureau ? data.affiliation?.bureau.name : null,

        department: data.department ? data.department : null,
        departmentId: data.department ? data.department.id : 0,

        user: data.user ? data.user : null,
        // loan: data.loan,
        // stock: data.stock,

        // contact
        tel: (data.contact?.tel != "NULL" && data.contact?.tel) ? data.contact?.tel : '-',
        officePhone: data.contact?.officePhone ? data.contact?.officePhone : '-',
        email: (data.contact?.email != "NULL" && data.contact?.email) ? data.contact?.email : '-',
        fax: (data.contact?.fax != "NULL" && data.contact?.fax) ? data.contact?.fax : '-',
        lineId: (data.contact?.lineId != "NULL" && data.contact?.lineId) ? data.contact?.lineId : '-',
        facebook: (data.contact?.facebook != "NULL" && data.contact?.facebook) ? data.contact?.facebook : '-',
        address: data.contact?.address ? data.contact?.address : '-',

        retirementDate: data?.birthday ? this.checkRetirementDate(data?.birthday) : '-',

        compensation: data.compensation ? this.checkDecimalPipeOfNull(data.compensation) : null,
        contractStart: data?.contractStartDate ? this.pipeDateTHD(data?.contractStartDate) : '-',
        contractStartDate: data?.contractStartDate ? new Date(data?.contractStartDate) : null,
        civilService: data?.civilServiceDate ? this.pipeDateTHD(data?.civilServiceDate) : '-',
        civilServiceDate: data?.civilServiceDate ? new Date(data?.civilServiceDate) : '',
        employeeStatus: data.employeeStatus ? data.employeeStatus : '-',
        billingStart: data?.billingStartDate ? this.pipeDateTHD(data?.billingStartDate) : '-',
        billingStartDate: data?.billingStartDate ? new Date(data?.billingStartDate) : null,
        monthlyStockMoney: data.monthlyStockMoney ? this.checkDecimalPipeOfNull(data.monthlyStockMoney) : null,
        salaryBankAccountNumber: data.salaryBankAccountNumber ? data.salaryBankAccountNumber : '-',
        salary: data.salary ? this.checkDecimalPipeOfNull(data.salary) : null,
        bankAccountReceivingNumber: data.bankAccountReceivingNumber ? data.bankAccountReceivingNumber : '-',
        profileFlag: data.profileFlag,
        textHidden: '-',

        beneficiarySize: data.beneficiaries.length > 0 ? true : false,
        departmentName: data.departmentName ? data.departmentName : '-'

      })
    });
  }

  checkDecimalPipeOfNull(compensation: any) {
    const decimalPipe = new DecimalPipe('en-US');
    if (compensation === ' ' || compensation === '-') {
      return decimalPipe.transform(0)
    } else {
      return decimalPipe.transform(compensation)
    }
  }
}
