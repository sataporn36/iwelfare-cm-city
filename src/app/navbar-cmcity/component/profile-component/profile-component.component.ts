import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';
import { Beneficiary } from 'src/app/model/beneficiary';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { Marital } from 'src/app/model/marital';
import { Level } from 'src/app/model/level';
import { EmployeeType } from 'src/app/model/employee-type';

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
  public marital: Observable<Marital[]> | any
  products: any;

  emailCheck: any;
  emailValidation: boolean = false;
  pnumberCheck: any;
  pnumberValidation: boolean = false;

  public level: Observable<Level[]> | any
  public employeeType: Observable<EmployeeType[]> | any

  constructor(private primengConfig: PrimeNGConfig,
    private service: MainService,
    protected router: Router,
    private localStorageService: LocalStorageService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.arrayChild = [];
    this.dadArray = [];
    this.momArray = [];
    this.gmArray = [];
    this.gfArray = [];

    this.userId = this.localStorageService.retrieve('empId');

    this.getEmployee(this.userId);

    this.initMainForm();
    this.formModel.disable();
    this.formModelGf.disable();
    this.formModelGm.disable();
    this.formModelDad.disable();
    this.formModelMom.disable();
    this.setperiodMonthDescOption();

    this.searchLevel();
    this.searchEmployeeType();
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
    // const payloadChild = this.formModel.getRawValue();
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
      // stock
      // loan
      approveFlag: new FormControl(null),
      profileFlag: new FormControl(null),

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

      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
      beneficiaryMarital: new FormControl(null),
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
      beneficiaryPrefix: new FormControl(null),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl('มารดา'),
      beneficiaryMarital: new FormControl(null),
      beneficiaryLifeStatus: new FormControl(null),
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
      beneficiaryMarital: new FormControl(null),
      beneficiaryLifeStatus: new FormControl(null),
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
      beneficiaryMarital: new FormControl(null),
      beneficiaryLifeStatus: new FormControl(null),
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
      beneficiaryPrefix: new FormControl(0, Validators.required),
      beneficiaryFirstName: new FormControl(null, Validators.required),
      beneficiaryLastName: new FormControl(null, Validators.required),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null, Validators.required),
      beneficiaryRelationship: new FormControl(null, Validators.required),
      beneficiaryMarital: new FormControl(0),
      beneficiaryLifeStatus: new FormControl(null),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

  }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      this.formModel.patchValue({
        ...data,
        prefix: data?.prefix ? data?.prefix : '-',
        selectPrefix: data?.prefix ? this.checkPrefix(data?.prefix) : 0,
        fullName: data.firstName + ' ' + data.lastName,
        positionName: data.position?.name ? data.position?.name : '-',
        affiliationName: data.affiliation?.name ? data.affiliation?.name : '-',
        bureauName: data.affiliation?.bureau?.name ? data.affiliation?.bureau?.name : '-',
        employeeTypeName: data.employeeType?.name ? data.employeeType?.name : '-',
        levelName: data.level?.name ? data.level?.name : '-',
        birthdayCalendar: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
        birthday: data?.birthday ? new Date(data.birthday) : null,
        age: data.birthday ? this.transformAge(data.birthday) : '-',
        marital: data?.marital ? data?.marital : '-',
        selectMarital: data?.marital ? this.checkMaritalV2(data?.marital) : 0,

        // contact
        tel: data.contact?.tel ? data.contact?.tel : '-',
        officePhone: data.contact?.officePhone ? data.contact?.officePhone : '-',
        email: data.contact?.email ? data.contact?.email : '-',
        fax: data.contact?.fax ? data.contact?.fax : '-',
        lineId: data.contact?.lineId ? data.contact?.lineId : '-',
        facebook: data.contact?.facebook ? data.contact?.facebook : '-',
        address: data.contact?.address ? data.contact?.address : '-',

        retirementDate: data?.birthday ? this.checkRetirementDate(data?.birthday) : '-',

        compensation: data.compensation ? data.compensation : '-',
        contractStart: data?.contractStartDate ? this.pipeDateTH(data?.contractStartDate) : '-',
        contractStartDate: data?.contractStartDate ? new Date(data?.contractStartDate) : null,
        civilService: data?.civilServiceDate ? this.pipeDateTH(data?.civilServiceDate) : '-',
        civilServiceDate: data?.civilServiceDate ? new Date(data?.civilServiceDate) : null,
        employeeStatus: data.employeeStatus ? data.employeeStatus : '-',
        billingStart: data?.billingStartDate ? this.pipeDateTH(data?.billingStartDate) : '-',
        billingStartDate: data?.billingStartDate ? new Date(data?.billingStartDate) : null,
        monthlyStockMoney: data.monthlyStockMoney ? data.monthlyStockMoney : 0,
        salaryBankAccountNumber: data.salaryBankAccountNumber ? data.salaryBankAccountNumber : '-',
        bankAccountReceivingNumber: data.bankAccountReceivingNumber ? data.bankAccountReceivingNumber : '-',
        profileFlag: data.profileFlag,
        textHidden: '-',

        beneficiarySize: data.beneficiaries.length > 0 ? true : false

      })

      this.formModelChild.patchValue({
        ...data,
        textHidden: '-',

        beneficiaryPrefix: data.beneficiaries?.prefix ? data.beneficiaries?.prefix : '-',
        beneficiaryFirstName: data.beneficiaries?.firstName ? data.beneficiaries?.firstName : '-',
        beneficiaryLastName: data.beneficiaries?.lastName ? data.beneficiaries?.lastName : '-',
        beneficiaryBirthday: data.beneficiaries?.birthday ? new Date(data.beneficiaries?.birthday) : '-',
        beneficiaryRelationship: data.beneficiaries?.relationship ? data.beneficiaries?.relationship : '-',
        beneficiaryMarital: data.beneficiaries?.marital ? data.beneficiaries?.marital : '-',
      })

      this.beneficiarysCheck = data.beneficiaries.length;
      this.beneficiarys = data.beneficiaries
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
    const formatDate = new Date(dateOfBirth)
    const day = formatDate.getDate()
    const month = formatDate.getMonth() + 1
    const year = formatDate.getFullYear() + 543

    const monthSelect = this.periodMonthDescOption[9 - 1];
    if (month > 9) {
      return 30 + ' ' + monthSelect.label + ' ' + (year + 61)
    } else {
      return 30 + ' ' + monthSelect.label + ' ' + (year + 60)
    }
  }

  checkImgProfile(gender: any) {
    let textGender = ""
    switch (gender) {
      case 'ชาย':
        textGender = "assets/images/boy.png"
        break;
      case 'หญิง':
        textGender = "assets/images/girlV2.png"
        break;
      default:
        break;
    }
    return textGender
  }

  onClickEdit() {
    this.textString = 'form-control';
    this.mode = false;
    this.formModel.enable();

    // check disable
    this.formModel.get('prefix')?.disable();
    this.formModel.get('age')?.disable();
    this.formModel.get('idCard')?.disable();
    this.formModel.get('levelName')?.disable();
    this.formModel.get('positionName')?.disable();
    this.formModel.get('affiliationName')?.disable();
    this.formModel.get('bureauName')?.disable();
    this.formModel.get('gender')?.disable();
    this.formModel.get('employeeTypeName')?.disable();
    this.formModel.get('retirementDate')?.disable();

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
    this.ngOnInit()
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
    this.ngOnInit()
  }

  // สามี    
  onClickDad() {
    this.textStringDad = 'form-control';
    this.formModelDad.enable();
    this.modeDad = false;
    this.formModelDad.get('beneficiaryRelationship')?.disable();
    // if (this.formModelDad.get('id')?.value != null) {
    //   this.formModelDad.get('beneficiaryPrefix')?.disable();
    //   this.modeDadSelect = false;
    // }
  }

  onClickCancalDad() {
    this.modeDad = true;
    this.formModelDad.disable();
    this.textStringDad = 'form-control-plaintext';
    this.ngOnInit()
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
    this.ngOnInit()
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
      this.countChildDisplay = Array.from(new Array(this.formModel.get('countChild')?.value), (x, i) => i + 1)
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
      case 'ว่าที่ร้อยตรี (ชาย)':
        return '6'
      case 'ว่าที่ร้อยตรี (หญิง)':
        return '7'
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
      case 'ว่าที่ร้อยตรี (ชาย)':
        return 'ชาย'
      case 'ว่าที่ร้อยตรี (หญิง)':
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
        return 'ว่าที่ร้อยตรี (ชาย)'
      case '7':
        return 'ว่าที่ร้อยตรี (หญิง)'
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
      case 'ไม่มีชีวิต':
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
        return 'ไม่มีชีวิต'
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

  accept() {
    const playload = this.formModel.getRawValue();

    playload.birthday = playload.birthday;
    playload.contact = {
      id: playload.contact.id,
      tel: playload.tel,
      email: playload.email,
      lineId: playload.lineId,
      address: playload.address,
      facebook: playload.facebook,
    }

    playload.marital = this.checkMaritalV2_text(playload.selectMarital)

    this.service.updateEmp(playload).subscribe((res) => {
      this.getEmployee(this.userId);
      this.formModel.disable();
      this.initMainForm();
      this.textString = 'form-control-plaintext';
      this.mode = true;
      this.ngOnInit();
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
      this.getEmployee(this.userId);
      this.formModelGf.disable();
      this.initMainForm();
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
      this.getEmployee(this.userId);
      this.formModelGm.disable();
      this.initMainForm();
      this.textStringGm = 'form-control-plaintext';
      this.modeGm = true;
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
      this.getEmployee(this.userId);
      this.formModelDad.disable();
      this.initMainForm();
      this.textStringDad = 'form-control-plaintext';
      this.modeDad = true;
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
      this.getEmployee(this.userId);
      this.formModelMom.disable();
      this.initMainForm();
      this.textStringMom = 'form-control-plaintext';
      this.modeMom = true;
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
}


