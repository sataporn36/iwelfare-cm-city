import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';
import { Beneficiary } from 'src/app/model/beneficiary';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { Marital } from 'src/app/model/marital';

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
    const payloadChild = this.formModel.getRawValue();
    if(this.modeChildstatus === 'ADD'){
        // add service child
    }else{
        // edit service child
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
      // address
      contact: new FormControl(null),
      dateOfDeath: new FormControl(null),
      resignationDate: new FormControl(null),
      approvedResignationDate: new FormControl(null),
      retirementDate: new FormControl(null),
      salaryBankAccountNumber: new FormControl(null),
      bankAccountReceivingNumber: new FormControl(null),
      reason: new FormControl(null),
      description: new FormControl(null),
      // user
      // stock
      // loan
      approveFlag: new FormControl(null),

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

      textHidden: new FormControl(null),

      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
      beneficiaryMarital: new FormControl(null),
    });

    this.formModelGf = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      prefix: new FormControl(null),
      beneficiaryPrefix: new FormControl(null),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl(null),
      beneficiaryMarital: new FormControl(null),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelGm = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      prefix: new FormControl(null),
      beneficiaryPrefix: new FormControl(null),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl(null),
      beneficiaryMarital: new FormControl(null),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelMom = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      prefix: new FormControl(null),
      beneficiaryPrefix: new FormControl(null),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl(null),
      beneficiaryMarital: new FormControl(null),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelDad = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      prefix: new FormControl(null),
      beneficiaryPrefix: new FormControl(null),
      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl(null),
      beneficiaryMarital: new FormControl(null),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelChild = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),
      marital: new FormControl(null),
      prefix: new FormControl(null),
      beneficiaryPrefix: new FormControl(0, Validators.required),
      beneficiaryFirstName: new FormControl(null, Validators.required),
      beneficiaryLastName: new FormControl(null, Validators.required),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null, Validators.required),
      beneficiaryRelationship: new FormControl(null, Validators.required),
      beneficiaryMarital: new FormControl(null),
      birthday: new FormControl(null),
      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

  }

  getEmployee(id: any): void {
    console.log("id ------------------> ", id);
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
        birthday: data?.birthday ? new Date(data.birthday): null,
        age: data.birthday ? this.transformAge(data.birthday) : '-',

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
        contractStartDate: data.contractStartDate ? new Date(data.contractStartDate) : null,
        civilServiceDate: data.civilServiceDate ? data.civilServiceDate : '-',
        employeeStatus: data.employeeStatus ? data.employeeStatus : '-',
        billingStartDate: data.billingStartDate ? data.billingStartDate : '-',
        monthlyStockMoney: data.monthlyStockMoney ? data.monthlyStockMoney : 0,
        salaryBankAccountNumber: data.salaryBankAccountNumber ? data.salaryBankAccountNumber : 0,
        bankAccountReceivingNumber: data.bankAccountReceivingNumber ? data.bankAccountReceivingNumber : '-',

        textHidden: '-',

        beneficiarySize: data.beneficiaries.length > 0 ? true : false

      })

      this.formModelChild.patchValue({
        ...data,
        textHidden: '-',

        // beneficiary: data.beneficiaries,
        beneficiaryPrefix: data.beneficiaries?.prefix ? data.beneficiaries?.prefix : '-',
        beneficiaryFirstName: data.beneficiaries?.firstName ? data.beneficiaries?.firstName : '-',
        beneficiaryLastName: data.beneficiaries?.lastName ? data.beneficiaries?.lastName : '-',
        // beneficiaryGender: data.beneficiary?.gender,
        beneficiaryBirthday: data.beneficiaries?.birthday ? new Date(data.beneficiaries?.birthday) : '-',
        beneficiaryRelationship: data.beneficiaries?.relationship ? data.beneficiaries?.relationship : '-',
        beneficiaryMarital: data.beneficiaries?.marital ? data.beneficiaries?.marital : '-',
        // beneficiarySize: data.beneficiaries.length > 0 ? true : false

      })

      console.log("data ------------------> ", data);
      this.beneficiarysCheck = data.beneficiaries.length;
      this.beneficiarys = data.beneficiaries
      console.log("beneficiary -----------------> ", data.beneficiaries.length);
      this.check(data.beneficiaries);
      console.log("data ------------------> ", data);
      // console.log("beneficiary -----------------> ", this.beneficiary);
    });
  }

  check(data: any) {
    data.forEach((data: Beneficiary) => {

      if (data.relationship == 'บิดา') {
        this.formModelGf.patchValue({
          ...data,
          textHidden: '-',
          beneficiaryPrefix: data?.prefix ? data?.prefix : '-',
          beneficiaryFirstName: data?.firstName ? data?.firstName : '-',
          beneficiaryLastName: data?.lastName ? data?.lastName : '-',
          birthday: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
          beneficiaryBirthday: data?.birthday ? new Date(data?.birthday) : null,
          beneficiaryRelationship: data?.relationship ? data?.relationship : '-',
          marital: data?.marital ? data?.marital : '-',
          beneficiaryMarital: data?.marital ? this.checkMaritalV1(data?.marital) : '-',
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
          marital: data?.marital ? data?.marital : '-',
          beneficiaryMarital: data?.marital ? this.checkMaritalV1(data?.marital) : '-',
        })
      }
      if (data.relationship == 'สามี') {
        this.formModelDad.patchValue({
          ...data,
          textHidden: '-',
          beneficiaryPrefix: data?.prefix ? data?.prefix : '-',
          beneficiaryFirstName: data?.firstName ? data?.firstName : '-',
          beneficiaryLastName: data?.lastName ? data?.lastName : '-',
          birthday: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
          beneficiaryBirthday: data?.birthday ? new Date(data?.birthday) : null,
          beneficiaryRelationship: data?.relationship ? data?.relationship : '-',
          marital: data?.marital ? data?.marital : '-',
          beneficiaryMarital: data?.marital ? this.checkMaritalV1(data?.marital) : '-',
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
          beneficiaryMarital: data?.marital ? this.checkMaritalV1(data?.marital) : '-',
        })
      }
      if (data.relationship == 'ลูก') {
        this.arrayChild.push(data);
      }


    });
    console.log("arrayChild -----------------> ", this.arrayChild);
    console.log("gfArray -----------------> ", this.gfArray);
    // for (let index = 0; index < data.length; index++) {
    //   this.arrayChild = Array[index];

    // }
    this.countChildDisplay = this.arrayChild.length;


  }

  pipeDateTH(date: any) {
    const format = new Date(date)
    const day = format.getDate()
    const month = format.getMonth()
    const year = format.getFullYear() + 543

    const monthSelect = this.periodMonthDescOption[month];


    // this.valueDate = new Date(date);
    // console.log("this.valueDate -------------> ", this.valueDate);

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

  onCheckAge(event: any){
    const data = event;
    this.formModel.get('age')?.setValue(this.transformAge(data) > 0 ? this.transformAge(data) : 0);
  }

  onClearAge(){
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
    this.formModel.get('selectPrefix')?.disable();
    this.formModel.get('age')?.disable();
    this.formModel.get('idCard')?.disable();
    this.formModel.get('levelName')?.disable();
    this.formModel.get('positionName')?.disable();
    this.formModel.get('affiliationName')?.disable();
    this.formModel.get('bureauName')?.disable();
    this.formModel.get('gender')?.disable();
    this.formModel.get('employeeTypeName')?.disable();

    // position: new FormControl(null),
    //   affiliation: new FormControl(null),
    //   employeeType: new FormControl(null),
    //   level: new FormControl(null),

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
    this.formModelGf.get('beneficiaryPrefix')?.disable();
    this.formModelGf.get('beneficiaryRelationship')?.disable();
  }

  onClickCancalGf() {
    this.modeGf = true;
    this.formModelGf.disable();
    this.textStringGf = 'form-control-plaintext';
    this.formModelGf.reset();

    this.getEmployee(this.userId);
  }

  // มารดา  
  onClickGm() {
    this.textStringGm = 'form-control';
    this.formModelGm.enable();
    this.modeGm = false;
    this.formModelGm.get('beneficiaryPrefix')?.disable();
    this.formModelGm.get('beneficiaryRelationship')?.disable();
  }

  onClickCancalGm() {
    this.modeGm = true;
    this.formModelGm.disable();
    this.textStringGm = 'form-control-plaintext';
    this.formModelGm.reset();

    this.getEmployee(this.userId);
  }

  // สามี    
  onClickDad() {
    this.textStringDad = 'form-control';
    this.formModelDad.enable();
    this.modeDad = false;
    this.formModelDad.get('beneficiaryPrefix')?.disable();
    this.formModelDad.get('beneficiaryRelationship')?.disable();
  }

  onClickCancalDad() {
    this.modeDad = true;
    this.formModelDad.disable();
    this.textStringDad = 'form-control-plaintext';
    this.formModelDad.reset();

    this.getEmployee(this.userId);
  }

  onClickMom() {
    this.textStringMom = 'form-control';
    this.modeMom = false;
    this.formModelMom.enable();
    this.formModelMom.get('beneficiaryPrefix')?.disable();
    this.formModelMom.get('beneficiaryRelationship')?.disable();
  }

  // ภรรยา
  onClickCancalMom() {
    this.modeMom = true;
    this.formModelMom.disable();
    this.textStringMom = 'form-control-plaintext';
    this.formModelMom.reset();

    this.getEmployee(this.userId);
  }

  // ลูก  
  onClickChild() {
    this.textStringChild = 'form-control';
    this.modeChild = false;
    const data = this.formModelChild.getRawValue();
    this.formModelChild.get('beneficiaryBirthday')?.setValue(new Date(data.birthday));


    console.log("const data -------------------- ", data);
    // console.log("data length -------------------- ",data.length);
    // this.formModelChild.get('countChild')?.setValue(data.length);
  }


  // onClickWife(event: any){
  //   this.wife = true;
  //   console.log("event-------------------- ", event.target.value);

  // }

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

  // child1Change(e: any) {
  //   if (e.checked) {
  //     this.child1 = true;
  //   }else{
  //     this.child1 = false;
  //   }
  // }

  // child2Change(e: any) {
  //   if (e.checked) {
  //     this.child2 = true;
  //   }else{
  //     this.child2 = false;
  //   }
  // }
  // getMarital(): void {
  //   this.service.searchMarital().subscribe(data => {this.marital = data
  //   // console.log(data);
  //   });


  // }

  checkDate(data: any): any {

    console.log("checkDate -------> ", data);

    // this.value = data
    return new Date(data);
  }

  checkPrefix(data: any): any {
    switch (data) {
      case 'นาย':
        return 1
      case 'นางสาว':
        return 2
      case 'นาง':
        return 3
      case 'ด.ช':
        return 4
      case 'ด.ญ':
        return 5
      default:
        break;
    }
  }

  checkRelationship(data: any): any {
    switch (data) {
      case 'บิดา':
        return 1
      case 'มารดา':
        return 2
      case 'สามี':
        return 3
      case 'ภรรยา':
        return 4
      case 'ลูก':
        return 5
      default:
        break;
    }
  }

  checkMaritalV1(data: any): any {
    switch (data) {
      case 'มีชีวิต':
        return 1
      case 'ไม่มีชีวิต':
        return 2
      default:
        break;
    }
  }

  checkMaritalV2(data: any): any {
    switch (data) {
      case 'โสด':
        return 1
      case 'แต่งงานแล้ว':
        return 2
      case 'เป็นหม้าย':
        return 3
      case 'หย่าร้าง':
        return 4
      case 'แยกกันอยู่':
        return 5
      default:
        break;
    }
  }

  accept() {
    const playload = this.formModel.getRawValue();

    console.log("playload", playload);
    

    playload.birthday = playload.birthday;
    playload.contact = {
      id: playload.contact.id,
      tel: playload.tel,
      email: playload.email,
      lineId: playload.lineId,
      address: playload.address,
      facebook: playload.facebook,
    }

    // playload.level = {
    //   id: playload.level.id,
    //   name: playload.level.name,
    // }

    // playload.position = {
    //   id: playload.position.id,
    //   name: playload.position.name,
    // }

    // playload.affiliation = {
    //   id: playload.affiliation.id,
    //   name: playload.affiliation.name,
    // }

    // playload.employeeType = {
    //   id: playload.employeeType.id,
    //   name: playload.employeeType.name,
    // }

    console.log("payload ----> ", playload.contact);

    console.log("payload ----> ", playload.level);

    this.service.updateEmp(playload).subscribe((res) => {
      console.log("res ----> ", res);
      this.getEmployee(this.userId);
      this.formModel.disable();
      this.initMainForm();
      this.textString= 'form-control-plaintext';
      this.mode = true;
    });



  }

  reject() { }

  acceptChild(){
    this.displayModal2 = true;
    this.modeChildstatus = 'EDIT';

    // get ข้แมูล ลูก ตาม id ...

    const payloadChild = this.formModelChild.getRawValue(); 
    // service edit child ...
  }

  onDeleteChild(){
    this.confirmationService.confirm({
      message: 'ท่านต้องการลบข้อมูลบุตร ' + '....',
      header: 'ลบข้อมูล',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        /// api delete
      },
      reject: () => { }
    });
  }
}
