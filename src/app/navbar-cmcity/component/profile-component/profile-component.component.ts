import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';
import { Beneficiary } from 'src/app/model/beneficiary';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { Marital } from 'src/app/model/marital';
import { Level } from 'src/app/model/level';
import { EmployeeType } from 'src/app/model/employee-type';
import { Positions } from 'src/app/model/position';
import { Affiliation } from 'src/app/model/affiliation';
import { Bureau } from 'src/app/model/bureau';
import { Department } from 'src/app/model/department';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.scss']
})
export class ProfileComponentComponent implements OnInit {
  formModel!: FormGroup;
  formModelGf!: FormGroup;
  formModelGm!: FormGroup;
  formModelDad!: FormGroup;
  formModelMom!: FormGroup;
  formModelChild!: FormGroup;
  responsiveOptions: any;
  defaultDateline: Date = new Date("12/31/2003");

  periodMonthDescOption: any = [];
  date: Date | any;
  selected!: Date;
  isInline = true;

  mode: boolean = true;
  modeGf: boolean = true;
  modeGm: boolean = true;
  modeDad: boolean = true;
  modeMom: boolean = true;
  modeChild: boolean = true;

  // mode check
  modeSelect: boolean = true;
  modeGfSelect: boolean = true;
  modeGmSelect: boolean = true;
  modeDadSelect: boolean = true;
  modeMomSelect: boolean = true;
  modeChildSelect: boolean = true;

  modeChildstatus: string = 'ADD';
  blockedUi: boolean = true;

  textString: string = 'form-control-plaintext';
  textSelect: string = 'form-control';
  textStringGf: string = 'form-control-plaintext';
  textStringGm: string = 'form-control-plaintext';
  textStringMom: string = 'form-control-plaintext';
  textStringDad: string = 'form-control-plaintext';
  textStringChild: string = 'form-control-plaintext';

  beneficiarys: Observable<Beneficiary[]> | any
  controls: any;
  wife!: Boolean;
  child!: Boolean;
  countChildDisplay!: any;
  beneficiarysCheck!: any;

  arrayChild: any = [];
  dadArray: any = [];
  momArray: any = [];
  gfArray: any = [];
  gmArray: any = [];

  valueDate!: any;
  isDisabled: Boolean = true;
  displayModal2: boolean = false;
  myDefaultDate = new Date();

  userId: any;
  public marital: Observable<Marital[]> | any;
  products: any;
  emailCheck: any;
  emailValidation: boolean = false;
  pnumberCheck: any;
  pnumberValidation: boolean = false;

  formModelResign!: FormGroup;
  formModelStock!: FormGroup;
  displayModalResign: boolean = false;
  displayModalStock: boolean = false;

  resign: boolean = false;
  checkStockValueFlag: boolean = false;

  public position: Observable<Positions[]> | any;
  public affiliation: Observable<Affiliation[]> | any;
  public bureau: Observable<Bureau[]> | any;
  public dapartment: Observable<Department[]> | any;

  public level: Observable<Level[]> | any;
  public employeeType: Observable<EmployeeType[]> | any;

  gender: any;
  profileImgId: any;
  imageSrc: SafeUrl;
  imageSrcAddress: SafeUrl;
  imageSrcIdCard: SafeUrl;

  constructor(
    private service: MainService,
    protected router: Router,
    private localStorageService: LocalStorageService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload');
    //   history.go(0);
    // } else {
      // localStorage.removeItem('foo');
      this.arrayChild = [];
      this.dadArray = [];
      this.momArray = [];
      this.gmArray = [];
      this.gfArray = [];

      this.userId = this.localStorageService.retrieve('empId');
      this.profileImgId = this.localStorageService.retrieve('profileImgId');
      this.getEmployee(this.userId);
      this.getImage(this.profileImgId);

      this.initMainForm();
      this.formModel.disable();
      this.formModelGf.disable();
      this.formModelGm.disable();
      this.formModelDad.disable();
      this.formModelMom.disable();
      this.setperiodMonthDescOption();

      this.searchLevel();
      this.searchEmployeeType();
      this.getPositions();
      this.getBureau();
      this.getDapartment();
      this.checkDefaultImage();

      this.checkEditProfileInNotifyDisplay();
    // }
  }

  checkDefaultImage(){
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

  getDapartment(): void {
    this.service.searchDepartment().subscribe(data => this.dapartment = data);
  }

  searchLevel(): void {
    this.service.searchLevel().subscribe(data => this.level = data);
  }

  searchEmployeeType(): void {
    this.service.searchEmployeeType().subscribe(data => this.employeeType = data);
  }

  checkPhoneNumber() {
    this.pnumberCheck = this.formModel.get('tel')?.value;
    if (this.pnumberCheck?.match("^[0-9]{10}$")) {
      this.pnumberValidation = false;
    } else {
      this.pnumberValidation = true;
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

  onClickAddChild() {
    if (this.modeChildstatus === 'ADD') {
      const playload = this.formModelChild.getRawValue();

      playload.prefix = this.checkPrefix_text(playload.beneficiaryPrefix);
      playload.firstName = playload.beneficiaryFirstName;
      playload.lastName = playload.beneficiaryLastName;
      playload.id = 0;
      playload.gender = this.checkPrefix_Gender(playload.prefix);
      playload.relationship = this.checkRelationship_text(playload.beneficiaryRelationship);
      playload.marital = this.checkMaritalV2_text(playload.beneficiaryMarital);
      playload.lifeStatus = this.checkMaritalV1_text(playload.beneficiaryLifeStatus);
      playload.birthday = playload.beneficiaryBirthday;
      playload.employee = {
        id: this.userId,
      }

      this.service.updateBeneficiary(playload).subscribe((res) => {
        this.getEmployee(this.userId);
        this.formModelChild.disable();
        this.initMainForm();
        this.textStringChild = 'form-control-plaintext';
        this.modeChild = true;
        this.displayModal2 = false;
        this.arrayChild = [];
      });
      // add service child
    } else {
      // edit service child
      const playload = this.formModelChild.getRawValue();

      playload.prefix = this.checkPrefix_text(playload.beneficiaryPrefix);
      playload.firstName = playload.beneficiaryFirstName;
      playload.lastName = playload.beneficiaryLastName;
      playload.gender = this.checkPrefix_Gender(playload.prefix);
      playload.relationship = this.checkRelationship_text(playload.beneficiaryRelationship);
      playload.marital = this.checkMaritalV2_text(playload.beneficiaryMarital);
      playload.lifeStatus = this.checkMaritalV1_text(playload.beneficiaryLifeStatus);
      playload.birthday = playload.beneficiaryBirthday;
      playload.employee = {
        id: this.userId,
      }

      this.service.updateBeneficiary(playload).subscribe((res) => {
        this.getEmployee(this.userId);
        this.formModelChild.disable();
        this.initMainForm();
        this.textStringChild = 'form-control-plaintext';
        this.modeChild = true;
        this.displayModal2 = false;
        this.arrayChild = [];
      });
    }
  }

  onCancleAddChild() {
    this.formModelChild.reset();
    this.formModelChild.get('beneficiaryRelationship')?.setValue(0);
    this.formModelChild.get('beneficiaryPrefix')?.setValue(0);
    this.displayModal2 = false;
    this.ngOnInit();
  }

  showModalDialog() {
    this.displayModal2 = true;
  }

  initMainForm() {
    this.formModel = new FormGroup({
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
      reason: new FormControl(null),
      description: new FormControl(null),
      user: new FormControl(null),
      stock: new FormControl(null),
      loan: new FormControl(null),
      approveFlag: new FormControl(null),
      profileFlag: new FormControl(null),
      passwordFlag: new FormControl(null),

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
      checkState: new FormControl(true),
      contractStart: new FormControl(null),
      civilService: new FormControl(null),
      billingStart: new FormControl(null),
      textHidden: new FormControl(null),
      selectMarital: new FormControl(null),
      levelId: new FormControl(0, Validators.required),
      employeeTypeId: new FormControl('0', Validators.required),

      positionId: new FormControl('0', Validators.required),
      bureauId: new FormControl('0', Validators.required),
      affiliationId: new FormControl('0', Validators.required),
      dapartmentId: new FormControl('0', Validators.required),

      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
      beneficiaryMarital: new FormControl(null),
      department: new FormControl(null),
      departmentName: new FormControl(null),
    });

    this.formModelGf = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      lifeStatus: new FormControl(null),
      prefix: new FormControl(null),
      beneficiaryPrefix: new FormControl(0),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl('บิดา'),
      beneficiaryMarital: new FormControl(null),
      beneficiaryLifeStatus: new FormControl(null),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelGm = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      lifeStatus: new FormControl(null),
      prefix: new FormControl(null),
      beneficiaryPrefix: new FormControl(0),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl('มารดา'),
      beneficiaryMarital: new FormControl(null),
      beneficiaryLifeStatus: new FormControl(0),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelMom = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      lifeStatus: new FormControl(null),
      prefix: new FormControl(null),
      beneficiaryPrefix: new FormControl(0),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl('ภรรยา'),
      beneficiaryMarital: new FormControl(0),
      beneficiaryLifeStatus: new FormControl(0),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelDad = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      lifeStatus: new FormControl(null),
      prefix: new FormControl(null),
      beneficiaryPrefix: new FormControl(0),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl('สามี'),
      beneficiaryMarital: new FormControl(0),
      beneficiaryLifeStatus: new FormControl(0),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelChild = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      prefix: new FormControl(null),
      lifeStatus: new FormControl(null),
      beneficiaryPrefix: new FormControl(0),
      beneficiaryFirstName: new FormControl(null, Validators.required),
      beneficiaryLastName: new FormControl(null, Validators.required),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null, Validators.required),
      beneficiaryRelationship: new FormControl(0),
      beneficiaryMarital: new FormControl(0),
      beneficiaryLifeStatus: new FormControl(0),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelResign = new FormGroup({
      reason: new FormControl(null, Validators.required),
    });

    this.formModelStock = new FormGroup({
      monthlyStockMoney: new FormControl(null, Validators.required),
    });

  }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      const decimalPipe = new DecimalPipe('en-US');
      this.gender = data.gender;
      this.checkStockValueFlag = data.checkStockValueFlag;

      if (data.employeeStatus === 5) {
        this.resign = true;
      }

      this.formModel.patchValue({
        ...data,
        prefix: data?.prefix ? data?.prefix : '-',
        selectPrefix: data?.prefix ? this.checkPrefix(data?.prefix) : 0,
        fullName: data.firstName + ' ' + data.lastName,
        positionName: data.positionName ? data.positionName : '-',
        affiliationName: data.affiliationName ? data.affiliationName : '-',
        // **
        bureauName: data.bureauName ? data.bureauName : '-',
        employeeTypeName: data.employeeTypeName ? data.employeeTypeName : '-',
        levelName: data.levelName ? data.levelName : '-',
        birthdayCalendar: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
        birthday: data?.birthday ? new Date(data.birthday) : null,
        age: data.birthday ? this.transformAge(data.birthday) : '-',
        marital: data?.marital ? data?.marital : '-',
        selectMarital: data?.marital ? this.checkMaritalV2(data?.marital) : 0,

        // **
        employeeType: data.employeeType,
        level: data.level,
        position: data.position,
        affiliation: data.affiliation,
        department: data.department,
        user: data.user,
        loan: data.loan,
        stock: data.stock,

        // contact
        tel: (data.contact?.tel != "NULL" && data.contact?.tel) ? data.contact?.tel : '-',
        officePhone: data.contact?.officePhone ? data.contact?.officePhone : '-',
        email: (data.contact?.email != "NULL" && data.contact?.email) ? data.contact?.email : '-',
        fax: (data.contact?.fax != "NULL" && data.contact?.fax ) ? data.contact?.fax : '-',
        lineId: (data.contact?.lineId != "NULL" && data.contact?.lineId) ? data.contact?.lineId : '-',
        facebook: (data.contact?.facebook != "NULL" && data.contact?.facebook) ? data.contact?.facebook : '-',
        address: data.contact?.address ? data.contact?.address : '-',

        retirementDate: data?.birthday ? this.checkRetirementDate(data?.birthday) : '-',

        compensation: data.compensation ? decimalPipe.transform(data.compensation) : null,
        contractStart: data?.contractStartDate ? this.pipeDateTH(data?.contractStartDate) : '-',
        contractStartDate: data?.contractStartDate ? new Date(data?.contractStartDate) : null,
        civilService: data?.civilServiceDate ? this.pipeDateTH(data?.civilServiceDate) : '-',
        civilServiceDate: data?.civilServiceDate ? new Date(data?.civilServiceDate) : '',
        employeeStatus: data.employeeStatus ? data.employeeStatus : '-',
        billingStart: data?.billingStartDate ? this.pipeDateTH(data?.billingStartDate) : '-',
        billingStartDate: data?.billingStartDate ? new Date(data?.billingStartDate) : null,
        monthlyStockMoney: data.monthlyStockMoney ? decimalPipe.transform(data.monthlyStockMoney) : null,
        salaryBankAccountNumber: data.salaryBankAccountNumber ? data.salaryBankAccountNumber : '-',
        salary: data.salary ? decimalPipe.transform(data.salary) : null,
        bankAccountReceivingNumber: data.bankAccountReceivingNumber ? data.bankAccountReceivingNumber : '-',
        profileFlag: data.profileFlag,
        textHidden: '-',

        beneficiarySize: data.beneficiaries.length > 0 ? true : false,
        departmentName: data.departmentName ? data.departmentName : '-'

      })

      this.formModelChild.patchValue({
        ...data,
        textHidden: '-',

        beneficiaryPrefix: data.beneficiaries?.prefix ? data.beneficiaries?.prefix : '0',
        beneficiaryFirstName: data.beneficiaries?.firstName ? data.beneficiaries?.firstName : '',
        beneficiaryLastName: data.beneficiaries?.lastName ? data.beneficiaries?.lastName : '',
        beneficiaryBirthday: data.beneficiaries?.birthday ? new Date(data.beneficiaries?.birthday) : '',
        beneficiaryRelationship: data.beneficiaries?.relationship ? data.beneficiaries?.relationship : '0',
        beneficiaryMarital: data.beneficiaries?.marital ? data.beneficiaries?.marital : '0',
      })

      this.beneficiarysCheck = data.beneficiaries.length;
      this.beneficiarys = data.beneficiaries;
      this.check(data.beneficiaries);
    });
  }

  check(data: any) {
    data.forEach((data: Beneficiary) => {

      if (data.relationship == 'บิดา') {
        this.formModelGf.patchValue({
          ...data,
          textHidden: '-',
          beneficiaryPrefix: data?.prefix ? this.checkPrefix(data?.prefix) : '-',
          prefix: data?.prefix ? data?.prefix : '-',
          beneficiaryFirstName: data?.firstName ? data?.firstName : '-',
          beneficiaryLastName: data?.lastName ? data?.lastName : '-',
          birthday: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
          beneficiaryBirthday: data?.birthday ? new Date(data?.birthday) : null,
          beneficiaryRelationship: data?.relationship ? data?.relationship : '-',
          lifeStatus: data?.lifeStatus ? data?.lifeStatus : '-',
          beneficiaryLifeStatus: data?.lifeStatus ? this.checkMaritalV1(data?.lifeStatus) : '-',
        })
      }
      if (data.relationship == 'มารดา') {
        this.formModelGm.patchValue({
          ...data,
          textHidden: '-',
          beneficiaryPrefix: data?.prefix ? this.checkPrefix(data?.prefix) : '-',
          prefix: data?.prefix ? data?.prefix : '-',
          beneficiaryFirstName: data?.firstName ? data?.firstName : '-',
          beneficiaryLastName: data?.lastName ? data?.lastName : '-',
          birthday: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
          beneficiaryBirthday: data?.birthday ? new Date(data?.birthday) : null,
          beneficiaryRelationship: data?.relationship ? data?.relationship : '-',
          lifeStatus: data?.lifeStatus ? data?.lifeStatus : '-',
          beneficiaryLifeStatus: data?.lifeStatus ? this.checkMaritalV1(data?.lifeStatus) : '-',
        })
      }
      if (data.relationship == 'สามี') {
        this.formModelDad.patchValue({
          ...data,
          textHidden: '-',
          beneficiaryPrefix: data?.prefix ? this.checkPrefix(data?.prefix) : '-',
          prefix: data?.prefix ? data?.prefix : '-',
          beneficiaryFirstName: data?.firstName ? data?.firstName : '-',
          beneficiaryLastName: data?.lastName ? data?.lastName : '-',
          birthday: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
          beneficiaryBirthday: data?.birthday ? new Date(data?.birthday) : null,
          beneficiaryRelationship: data?.relationship ? data?.relationship : '-',
          marital: data?.marital ? data?.marital : '-',
          beneficiaryMarital: data?.marital ? this.checkMaritalV2(data?.marital) : '-',
          lifeStatus: data?.lifeStatus ? data?.lifeStatus : '-',
          beneficiaryLifeStatus: data?.lifeStatus ? this.checkMaritalV1(data?.lifeStatus) : '-',
        })
      }
      if (data.relationship == 'ภรรยา') {
        this.formModelMom.patchValue({
          ...data,
          textHidden: '-',
          beneficiaryPrefix: data?.prefix ? this.checkPrefix(data?.prefix) : '-',
          prefix: data?.prefix ? data?.prefix : '-',
          beneficiaryFirstName: data?.firstName ? data?.firstName : '-',
          beneficiaryLastName: data?.lastName ? data?.lastName : '-',
          birthday: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
          beneficiaryBirthday: data?.birthday ? new Date(data?.birthday) : null,
          beneficiaryRelationship: data?.relationship ? data?.relationship : '-',
          marital: data?.marital ? data?.marital : '-',
          beneficiaryMarital: data?.marital ? this.checkMaritalV2(data?.marital) : '-',
          lifeStatus: data?.lifeStatus ? data?.lifeStatus : '-',
          beneficiaryLifeStatus: data?.lifeStatus ? this.checkMaritalV1(data?.lifeStatus) : '-',
        })
      }
      if (data.relationship == 'บุตร' || data.relationship == 'บุตรบุญธรรม') {
        this.arrayChild.push(data);
      }
    });

    this.countChildDisplay = this.arrayChild.length;
  }

  pipeDateTH(date: any) {
    const format = new Date(date);
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;

    const monthSelect = this.periodMonthDescOption[month];
    return day + ' ' + monthSelect.label + ' ' + year;
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

  onCheckAge(event: any) {
    const data = event;
    this.formModel.get('age')?.setValue(this.transformAge(data) > 0 ? this.transformAge(data) : 0);
  }

  onClearAge() {
    this.formModel.get('age')?.setValue(null);
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

  onClickEdit() {
    this.textString = 'form-control';
    this.mode = false;;
    this.formModel.enable();

    // check disable
    if (this.formModel.get('positionName')?.value != null || this.formModel.get('positionName')?.value != '-') {
      this.formModel.get('positionName')?.disable();
    } else {
      this.formModel.get('positionName')?.enable();
    }

    if (this.formModel.get('affiliationName')?.value != null || this.formModel.get('affiliationName')?.value != '-') {
      this.formModel.get('affiliationName')?.disable();
    } else {
      this.formModel.get('affiliationName')?.enable();
    }

    if (this.formModel.get('bureauName')?.value != null || this.formModel.get('bureauName')?.value != '-') {
      this.formModel.get('bureauName')?.disable();
    } else {
      this.formModel.get('bureauName')?.enable();
    }

    if (this.formModel.get('employeeTypeName')?.value != null || this.formModel.get('employeeTypeName')?.value != '-') {
      this.formModel.get('employeeTypeName')?.disable();
    } else {
      this.formModel.get('employeeTypeName')?.enable();
    }

    if (this.formModel.get('levelName')?.value != null || this.formModel.get('levelName')?.value != '-') {
      this.formModel.get('levelName')?.disable();
    } else {
      this.formModel.get('levelName')?.enable();
    }

    if (this.formModel.get('departmentName')?.value != null || this.formModel.get('departmentName')?.value != '-') {
      this.formModel.get('departmentName')?.disable();
    } else {
      this.formModel.get('departmentName')?.enable();
    }

    this.formModel.get('prefix')?.disable();
    this.formModel.get('age')?.disable();
    this.formModel.get('idCard')?.disable();
    this.formModel.get('gender')?.disable();
    this.formModel.get('retirementDate')?.disable();
    this.formModel.get('monthlyStockMoney')?.disable();
    this.formModel.get('salary')?.disable();
    this.formModel.get('compensation')?.disable();
    // this.formModel.get('contractStartDate')?.disable();
    // this.formModel.get('civilServiceDate')?.disable();

    this.arrayChild = [];
    this.dadArray = [];
    this.momArray = [];
    this.gmArray = [];
    this.gfArray = [];
    this.getEmployee(this.userId);
  }

  onClickCancal() {
    this.mode = true;
    this.formModel.disable();
    this.textString = 'form-control-plaintext';
    this.formModel.reset();
    this.countChildDisplay = null;
    this.wife = false;
    this.child = false;
    this.ngOnInit();
  }

  // บิดา
  onClickGf() {
    this.textStringGf = 'form-control';
    this.formModelGf.enable();
    this.modeGf = false;
    this.formModelGf.get('beneficiaryRelationship')?.disable();
  }

  onClickCancalGf() {
    this.modeGf = true;
    this.formModelGf.disable();
    this.textStringGf = 'form-control-plaintext';
    // this.ngOnInit()
  }

  // มารดา  
  onClickGm() {
    this.textStringGm = 'form-control';
    this.formModelGm.enable();
    this.modeGm = false;
    this.formModelGm.get('beneficiaryRelationship')?.disable();
  }

  onClickCancalGm() {
    this.modeGm = true;
    this.formModelGm.disable();
    this.textStringGm = 'form-control-plaintext';
    // this.ngOnInit()
  }

  // สามี    
  onClickDad() {
    this.textStringDad = 'form-control';
    this.formModelDad.enable();
    this.modeDad = false;
    this.formModelDad.get('beneficiaryRelationship')?.disable();
  }

  onClickCancalDad() {
    this.modeDad = true;
    this.formModelDad.disable();
    this.textStringDad = 'form-control-plaintext';
    // this.ngOnInit()
  }

  onClickMom() {
    this.textStringMom = 'form-control';
    this.modeMom = false;
    this.formModelMom.enable();
    this.formModelMom.get('beneficiaryRelationship')?.disable();
  }

  // ภรรยา
  onClickCancalMom() {
    this.modeMom = true;
    this.formModelMom.disable();
    this.textStringMom = 'form-control-plaintext';
    // this.ngOnInit()
  }

  // ลูก  
  onClickChild() {
    this.textStringChild = 'form-control';
    this.modeChild = false;
    const data = this.formModelChild.getRawValue();
    this.formModelChild.get('beneficiaryBirthday')?.setValue(new Date(data.birthday));
  }

  wifeChange(e: any) {
    if (e.checked) {
      this.wife = true;
    } else {
      this.wife = false;
    }
  }

  childChange(e: any) {
    if (e.checked) {
      this.child = true;
      this.countChildDisplay = Array.from(new Array(this.formModel.get('countChild')?.value), (x, i) => i + 1);
    } else {
      this.child = false;
    }
  }

  checkDate(data: any): any {
    return new Date(data);
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

  checkPrefix_Gender(data: any): any {
    switch (data) {
      case 'นาย':
        return 'ชาย'
      case 'นางสาว':
        return 'หญิง'
      case 'นาง':
        return 'หญิง'
      case 'ด.ช':
        return 'ชาย'
      case 'ด.ญ':
        return 'หญิง'
      case 'ว่าที่ร้อยตรี':
        return 'ชาย'
      case 'ว่าที่ร้อยตรีหญิง':
        return 'หญิง'
      case 'ว่าที่ร้อยโท':
        return 'ชาย'
      case 'ว่าที่ร้อยโทหญิง':
        return 'หญิง'
      case 'ว่าที่ร้อยเอก':
        return 'ชาย'
      case 'ว่าที่ร้อยเอกหญิง':
        return 'หญิง'
      case 'สิบตรี':
        return 'ชาย'
      case 'สิบตรีหญิง':
        return 'หญิง'
      case 'สิบโท':
        return 'ชาย'
      case 'สิบโทหญิง':
        return 'หญิง'
      case 'สิบเอก':
        return 'ชาย'
      case 'สิบเอกหญิง':
        return 'หญิง'
      case 'จ่าสิบตรี':
        return 'ชาย'
      case 'จ่าสิบตรีหญิง':
        return 'หญิง'
      case 'จ่าสิบโท':
        return 'ชาย'
      case 'จ่าสิบโทหญิง':
        return 'หญิง'
      case 'จ่าสิบเอก':
        return 'ชาย'
      case 'จ่าสิบเอกหญิง':
        return 'หญิง'
      default:
        break;
    }
  }

  checkPrefix_text(data: any): any {
    switch (data) {
      case '1':
        return 'นาย'
      case '2':
        return 'นางสาว'
      case '3':
        return 'นาง'
      case '4':
        return 'ด.ช'
      case '5':
        return 'ด.ญ'
      case '6':
        return 'ว่าที่ร้อยตรี'
      case '7':
        return 'ว่าที่ร้อยตรีหญิง'
      case '8':
        return 'ว่าที่ร้อยโท'
      case '9':
        return 'ว่าที่ร้อยโทหญิง'
      case '10':
        return 'ว่าที่ร้อยเอก'
      case '11':
        return 'ว่าที่ร้อยเอกหญิง'
      case '12':
        return 'สิบตรี'
      case '13':
        return 'สิบตรีหญิง'
      case '14':
        return 'สิบโท'
      case '15':
        return 'สิบโทหญิง'
      case '16':
        return 'สิบเอก'
      case '17':
        return 'สิบเอกหญิง'
      case '18':
        return 'จ่าสิบตรี'
      case '19':
        return 'จ่าสิบตรีหญิง'
      case '20':
        return 'จ่าสิบโท'
      case '21':
        return 'จ่าสิบโทหญิง'
      case '22':
        return 'จ่าสิบเอก'
      case '23':
        return 'จ่าสิบเอกหญิง'
      default:
        break;
    }
  }

  checkRelationship(data: any): any {
    switch (data) {
      case 'บิดา':
        return '1'
      case 'มารดา':
        return '2'
      case 'สามี':
        return '3'
      case 'ภรรยา':
        return '4'
      case 'บุตร':
        return '5'
      case 'บุตรบุญธรรม':
        return '6'
      default:
        break;
    }
  }

  checkRelationship_text(data: any): any {
    switch (data) {
      case '1':
        return 'บิดา'
      case '2':
        return 'มารดา'
      case '3':
        return 'สามี'
      case '4':
        return 'ภรรยา'
      case '5':
        return 'บุตร'
      case '6':
        return 'บุตรบุญธรรม'
      default:
        break;
    }
  }

  checkMaritalV1(data: any): any {
    switch (data) {
      case 'มีชีวิต':
        return '1'
      case 'เสียชีวิต':
        return '2'
      default:
        break;
    }
  }

  checkMaritalV1_text(data: any): any {
    switch (data) {
      case '1':
        return 'มีชีวิต'
      case '2':
        return 'เสียชีวิต'
      default:
        break;
    }
  }

  checkMaritalV2(data: any): any {
    switch (data) {
      case 'โสด':
        return '1'
      case 'แต่งงานแล้ว':
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

  checkMaritalV2_text(data: any): any {
    switch (data) {
      case '1':
        return 'โสด'
      case '2':
        return 'แต่งงานแล้ว'
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

  checkReqInfo:boolean = false;
  daiaInfoUser: any[] = [];
  checkEditProfileInNotifyDisplay(){
    this.daiaInfoUser = [];
    const userInfo = this.localStorageService.retrieve('employeeofmain');
    this.service.getNotifyByEmpId({ 'employeeId': userInfo.id }).subscribe((res) =>{
        if(res != null && res.length > 0){
          this.daiaInfoUser = res;
          this.checkReqInfo = true;
        }else{
          this.checkReqInfo = false;
        }
    });
  }

  checkDataInfoOfNull(value: any){
    const dataInfo = this.daiaInfoUser.filter((item: any) =>
    item.status === value
    );
    if(dataInfo.length > 0){
      return true;
    }else{
      return false;
    }

  }

  checkEditProfileInNotify(){
      const data = this.daiaInfoUser;
      if(data.length > 0){
          const dataInfo = data.filter((item: any) =>
            item.status === 5
          );
          this.checkUserInfoList(dataInfo);
      }else {
          this.acceptUserInfo();
      }
  }

  checkUserInfoList(dataInfo: any[]){
    if(dataInfo.length > 0){
      this.messageService.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'คุณได้ร้องขอการเเก้ไขข้อมูลส่วนตัวเเล้ว โปรดรอการอนุมัติจากเจ้าหน้าที่', life: 10000 });
    }else {
      this.acceptUserInfo();
    }
  }

  displayShowReqInfo: boolean = false;
  onClickShowReqInfo() {
     this.displayShowReqInfo = true;
  }

  acceptUserInfo() {
    const emp = this.formModel.getRawValue();
    const playload = {
      id: this.userId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      birthday: emp.birthday,
      tel: emp.tel,
      lineId: emp.lineId,
      facebook: emp.facebook,
      email: emp.email,
      address: emp.address,
      marital: this.checkMaritalV2_text(emp.selectMarital),
      contractStartDate: emp.contractStartDate,
      civilServiceDate: emp.civilServiceDate,
      billingStartDate: emp.billingStartDate,
      salaryBankAccountNumber: emp.salaryBankAccountNumber,
      bankAccountReceivingNumber: emp.bankAccountReceivingNumber
    }

    this.service.updateByUser(playload).subscribe((res) => {
      this.getEmployee(this.userId);
      this.formModel.disable();
      this.initMainForm();
      this.textString = 'form-control-plaintext';
      this.mode = true;

      if (res.data === "UPDATE") {
          this.messageService.add({ severity: 'success', detail: 'บันทึกสำเร็จ' });
      }else{
          this.messageService.add({ severity: 'success', detail: 'รอการอนุมัติ' });
      }

      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    });
  }

  acceptGf() {
    const playload = this.formModelGf.getRawValue();

    if (playload.id == null) {
      playload.id = 0;
    }

    playload.prefix = this.checkPrefix_text(playload.beneficiaryPrefix);
    playload.firstName = playload.beneficiaryFirstName;
    playload.lastName = playload.beneficiaryLastName;
    playload.gender = 'ชาย';
    playload.relationship = playload.beneficiaryRelationship;
    playload.marital = playload.beneficiaryMarital;
    playload.lifeStatus = this.checkMaritalV1_text(playload.beneficiaryLifeStatus);
    playload.birthday = playload.beneficiaryBirthday;
    playload.employee = {
      id: this.userId,
    }

    this.service.updateBeneficiary(playload).subscribe((res) => {
      this.ngOnInit();
      this.textStringGf = 'form-control-plaintext';
      this.modeGf = true;
    });
  }

  acceptGm() {
    const playload = this.formModelGm.getRawValue();

    if (playload.id == null) {
      playload.id = 0;
    }

    playload.prefix = this.checkPrefix_text(playload.beneficiaryPrefix);
    playload.firstName = playload.beneficiaryFirstName;
    playload.lastName = playload.beneficiaryLastName;
    playload.gender = 'หญิง';
    playload.relationship = playload.beneficiaryRelationship;
    playload.marital = playload.beneficiaryMarital;
    playload.lifeStatus = this.checkMaritalV1_text(playload.beneficiaryLifeStatus);
    playload.birthday = playload.beneficiaryBirthday;
    playload.employee = {
      id: this.userId,
    }

    this.service.updateBeneficiary(playload).subscribe((res) => {
      // this.formModelGm.disable();
      // this.initMainForm();
      this.textStringGm = 'form-control-plaintext';
      this.modeGm = true;
      this.ngOnInit();
    });
  }

  acceptDad() {
    const playload = this.formModelDad.getRawValue();

    if (playload.id == null) {
      playload.id = 0;
    }

    playload.prefix = this.checkPrefix_text(playload.beneficiaryPrefix);
    playload.firstName = playload.beneficiaryFirstName;
    playload.lastName = playload.beneficiaryLastName;
    playload.gender = 'ชาย';
    playload.relationship = playload.beneficiaryRelationship;
    playload.marital = this.checkMaritalV2_text(playload.beneficiaryMarital);
    playload.lifeStatus = this.checkMaritalV1_text(playload.beneficiaryLifeStatus);
    playload.birthday = playload.beneficiaryBirthday;
    playload.employee = {
      id: this.userId,
    }

    this.service.updateBeneficiary(playload).subscribe((res) => {
      // this.formModelDad.disable();
      // this.initMainForm();
      this.textStringDad = 'form-control-plaintext';
      this.modeDad = true;
      this.ngOnInit();
    });
  }

  acceptMom() {
    const playload = this.formModelMom.getRawValue();

    if (playload.id == null) {
      playload.id = 0;
    }

    playload.prefix = this.checkPrefix_text(playload.beneficiaryPrefix);
    playload.firstName = playload.beneficiaryFirstName;
    playload.lastName = playload.beneficiaryLastName;
    playload.gender = 'หญิง';
    playload.relationship = playload.beneficiaryRelationship;
    playload.marital = this.checkMaritalV2_text(playload.beneficiaryMarital);
    playload.lifeStatus = this.checkMaritalV1_text(playload.beneficiaryLifeStatus);
    playload.birthday = playload.beneficiaryBirthday;
    playload.employee = {
      id: this.userId,
    }

    this.service.updateBeneficiary(playload).subscribe((res) => {
      // this.formModelMom.disable();
      // this.initMainForm();
      this.textStringMom = 'form-control-plaintext';
      this.modeMom = true;
      this.ngOnInit();
    });
  }

  reject() { }

  acceptChild(id: any) {
    this.displayModal2 = true;
    this.modeChildstatus = 'EDIT';

    // get ข้แมูล ลูก ตาม id ...
    this.service.getBeneficiary(id).subscribe((data) => {
      this.formModelChild.patchValue({
        ...data,
        beneficiaryPrefix: data?.prefix ? this.checkPrefix(data?.prefix) : '-',
        prefix: data?.prefix ? data?.prefix : '-',
        beneficiaryFirstName: data?.firstName ? data?.firstName : '-',
        beneficiaryLastName: data?.lastName ? data?.lastName : '-',
        birthday: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
        beneficiaryBirthday: data?.birthday ? new Date(data?.birthday) : null,
        beneficiaryRelationship: data?.relationship ? this.checkRelationship(data?.relationship) : '-',
        marital: data?.marital ? data?.marital : '-',
        beneficiaryMarital: data?.marital ? this.checkMaritalV2(data?.marital) : '-',
        lifeStatus: data?.lifeStatus ? data?.lifeStatus : '-',
        beneficiaryLifeStatus: data?.lifeStatus ? this.checkMaritalV1(data?.lifeStatus) : '-',
      })
    });

    const payloadChild = this.formModelChild.getRawValue();
  }

  onDeleteChild(child: any,) {
    this.confirmationService.confirm({
      message: 'ท่านต้องการลบข้อมูลบุตร ' + child.firstName + ' ' + child.lastName,
      header: 'ลบข้อมูล',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deleteBeneficiary(child.id).subscribe((data) => {
          this.ngOnInit();
        })
      },
      reject: () => { }
    });
  }

  sortFn = (a: any, b: any): any => {
    if (a.slug < b.slug) return -1;
    if (a.slug === b.slug) return 0;
    if (a.slug > b.slug) return 1;
  }

  checkBureau(id: any) {
    this.service.searchByBureau(id.target.value).subscribe(data => this.affiliation = data);
  }

  displayResign() {
    this.displayModalResign = true;
  }

  displayChangeStockToMonth() {
    this.displayModalStock = true;
  }

  onSubmitResign() {
    const playloadResign = {
      id: this.userId,
      reason: this.formModelResign.get('reason')?.value
    }

    this.service.updateResign(playloadResign).subscribe((data) => {
      this.messageService.add({ severity: 'success', detail: 'รอการอนุมัติ' });
      this.displayModalResign = false;
      window.location.reload();
      this.ngOnInit();
    });
  }

  onCancleResign() {
    this.formModelResign.reset();
    this.displayModalResign = false;
  }

  onUpdateStockToMonth() {
    const dataStock = this.formModelStock.getRawValue();
    const data = this.formModel.getRawValue();
    const monthlyStockMoneyReplace = data.monthlyStockMoney.replace(',','');

    if (dataStock.monthlyStockMoney === data.monthlyStockMoney) {
      this.messageService.add({ severity: 'error', summary: '', detail: 'เงินหุ้นรายเดือนใหม่ยังไม่มีการเปลี่ยนเเปลง' });
    } else {
      // api
      const playload = {
        id: this.userId,
        stockValue: dataStock.monthlyStockMoney,
        stockOldValue: Number(monthlyStockMoneyReplace)
      }

      this.service.updateStockValue(playload).subscribe((data) => {
        this.messageService.add({ severity: 'success', detail: 'รอการอนุมัติ' });
        this.displayModalStock = false;
        window.location.reload();
        this.ngOnInit();
      });
    }
  }

  onCancleStock() {
    this.formModelStock.reset();
    this.displayModalStock = false;
  }

  checkNull: boolean = true;
  checkValueOfNull(event: any) {
    if (!event.value) {
      this.checkNull = true;
    } else {
      this.checkNull = false;
    }
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

  displayBasicAddress: boolean | undefined;
  displayBasicIdCard: boolean | undefined;
  imagesAddress: any[] = [];
  imagesIdCard: any[] = [];

  getImage(id: any) {
    if (id != 0) {
      this.service.getImage(id).subscribe(
        (imageBlob: Blob) => {
          this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
        }
      );

      this.service.getImageAddress(id).subscribe(
        (imageBlob: Blob) => {
          this.imageSrcAddress = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
          this.imagesAddress.push({
            itemImageSrc : this.imageSrcAddress
          })
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
        }
      );

      this.service.getImageIdCard(id).subscribe(
        (imageBlob: Blob) => {
          this.imageSrcIdCard = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
          this.imagesIdCard.push({
            itemImageSrc : this.imageSrcIdCard
          })
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
        }
      );
    }
  }

  onProfilePicChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('empId', this.userId.toString());

    this.service.uploadImage(formData).subscribe(
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

  onProfilePicChangeDocAddress(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('empId', this.userId.toString());

    this.service.uploadImageAddress(formData).subscribe(
      () => {
        this.ngOnInit();
        this.ngOnInit();
        this.messageService.add({ severity: 'success', detail: 'อัพโหลดรูปทะเบียนบ้านสำเร็จ' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb' });
      }
    );
  }

  onProfilePicChangeDocIdCard(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('empId', this.userId.toString());

    this.service.uploadImageIdCard(formData).subscribe(
      () => {
        this.ngOnInit();
        this.ngOnInit();
        this.messageService.add({ severity: 'success', detail: 'อัพโหลดรูปบัตรประชาชนสำเร็จ' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb' });
      }
    );
  }

  childFlag:boolean = true;
  onSelectValue(event: any){
    const value = event.target.value;
    if(value === '0'){
      this.childFlag = true;
    }else{
      this.childFlag = false;
    }
  }

  childFlag1:boolean = true;
  onSelectValue2(event: any){
    const value = event.target.value;
    if(value === '0'){
      this.childFlag1 = true;
    }else{
      this.childFlag1 = false;
    }
  }

  childFlag2:boolean = true;
  onSelectValue3(event: any){
    const value = event.target.value;
    if(value === '0'){
      this.childFlag2 = true;
    }else{
      this.childFlag2 = false;
    }
  }

  clearDialog() {
    this.formModelChild.reset();
    this.formModelChild.get('beneficiaryPrefix')?.setValue(0);
    this.formModelChild.get('beneficiaryMarital')?.setValue(0);
    this.formModelChild.get('beneficiaryLifeStatus')?.setValue(0);
    this.formModelChild.get('beneficiaryRelationship')?.setValue(0);
  }
}