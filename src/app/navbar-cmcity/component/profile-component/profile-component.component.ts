import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
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

  textString: string = 'form-control-plaintext';
  textSelect: string = 'form-control';

  textStringGf: string = 'form-control-plaintext';
  textStringGm: string = 'form-control-plaintext';
  textStringMom: string = 'form-control-plaintext';
  textStringDad: string = 'form-control-plaintext';
  textStringChild: string = 'form-control-plaintext';
  // textSelectGf: string = 'form-control';

  // beneficiary: Beneficiary | any;
  beneficiarys: Observable<Beneficiary[]> | any
  controls: any;
  wife!: Boolean;
  child!: Boolean;
  countChildDisplay!: any;
  beneficiarysCheck!: any;
  arrayChild: any = [];

  dadArray: any = [];
  momArray: any = [];
  // childArray: any = [];
  gfArray: any = [];
  gmArray: any = [];
  // childArray: any = [];
  valueDate!: any;
  isDisabled: Boolean = true;
  displayModal2: boolean = false;
  myDefaultDate = new Date();

  // Beneficiary
  // checked: boolean;
  userId: any;
  public marital: Observable<Marital[]> | any
  products: any;

  // checked: boolean = true;
  // checked1: boolean = false;

  // checked2: boolean = true;

  constructor(private primengConfig: PrimeNGConfig,
    private service: MainService,
    protected router: Router,
    private localStorageService: LocalStorageService,) 
  {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  }

  ngOnInit(): void {
    this.arrayChild = [];
    this.dadArray = [];
    this.momArray = [];
    this.gmArray = [];
    this.gfArray = [];

    this.userId = this.localStorageService.retrieve('empId');
    console.log("userId ------------------> ", this.userId);

    this.getEmployee(this.userId);

    this.initMainForm();
    this.formModel.disable();
    this.setperiodMonthDescOption();

    this.service.getProductsSmall().then(products => {
			this.products = products;
		});

    // var arr = Array.from(new Array(number), (x,i) => i+1)
    // this.getMarital();
  }

  
  onClickAddChild() {
    const data = this.formModel.getRawValue();
    // api
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
      // beneficiary
      // beneficiarys: new FormControl(null),
      // beneficiaryFirstName: new FormControl(null),
      // beneficiaryLastName: new FormControl(null),
      // beneficiaryGender: new FormControl(null),
      // beneficiaryBirthday: new FormControl(null),
      // beneficiaryRelationship: new FormControl(null),
      // beneficiaryMarital: new FormControl(null),
      // wife: new FormControl(null),

      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelGf = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),

      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl(null),
      beneficiaryMarital: new FormControl(null),

      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelGm = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),

      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl(null),
      beneficiaryMarital: new FormControl(null),

      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelMom = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),

      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl(null),
      beneficiaryMarital: new FormControl(null),

      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelDad = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),

      beneficiaryFirstName: new FormControl(null),
      beneficiaryLastName: new FormControl(null),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null),
      beneficiaryRelationship: new FormControl(null),
      beneficiaryMarital: new FormControl(null),

      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

    this.formModelChild = new FormGroup({
      id: new FormControl(null),
      textHidden: new FormControl(null),

      beneficiaryPrefix: new FormControl(0, Validators.required),
      beneficiaryFirstName: new FormControl(null, Validators.required),
      beneficiaryLastName: new FormControl(null, Validators.required),
      beneficiaryGender: new FormControl(null),
      beneficiaryBirthday: new FormControl(null, Validators.required),
      beneficiaryRelationship: new FormControl(null, Validators.required),
      beneficiaryMarital: new FormControl(null),

      countChild: new FormControl(null),
      beneficiarySize: new FormControl(null),
    });

  }

  getEmployee(id: any): void {
    console.log("id ------------------> ", id);
    this.service.getEmployee(id).subscribe(data => {
      this.formModel.patchValue({
        ...data,
        fullName: data.firstName + ' ' + data.lastName,
        positionName: data.position?.name ? data.position?.name : '-',
        affiliationName: data.affiliation?.name ? data.affiliation?.name : '-',
        bureauName: data.affiliation?.bureau?.name ? data.affiliation?.bureau?.name : '-',
        employeeTypeName: data.employeeType?.name ? data.employeeType?.name : '-',
        levelName: data.level?.name ? data.level?.name : '-',
        birthday: data?.birthday ? this.pipeDateTH(data?.birthday) : '-',
        birthdayCalendar: new Date(data.birthday),
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
        contractStartDate: data.contractStartDate ? data.contractStartDate : '-',
        civilServiceDate: data.civilServiceDate ? data.civilServiceDate : '-',
        employeeStatus: data.employeeStatus ? data.employeeStatus : '-',
        billingStartDate: data.billingStartDate ? data.billingStartDate : '-',
        monthlyStockMoney: data.monthlyStockMoney ? data.monthlyStockMoney : 0,
        salaryBankAccountNumber: data.salaryBankAccountNumber ? data.salaryBankAccountNumber : 0,
        bankAccountReceivingNumber: data.bankAccountReceivingNumber ? data.bankAccountReceivingNumber : '-',

        textHidden: '-',

        // // beneficiary: data.beneficiaries,
        // beneficiaryPrefix: data.beneficiaries?.prefix ? data.beneficiaries?.prefix: '-',
        // beneficiaryFirstName: data.beneficiaries?.firstName ? data.beneficiaries?.firstName: '-',
        // beneficiaryLastName: data.beneficiaries?.lastName ? data.beneficiaries?.lastName: '-',
        // // beneficiaryGender: data.beneficiary?.gender,
        // beneficiaryBirthday: data.beneficiaries?.birthday ? data.beneficiaries?.birthday: '-',
        // beneficiaryRelationship: data.beneficiaries?.relationship ? data.beneficiaries?.relationship: '-',
        // beneficiaryMarital: data.beneficiaries?.marital ? data.beneficiaries?.marital: '-',
        beneficiarySize: data.beneficiaries.length > 0 ? true : false

      })

      this.formModelGf.patchValue({
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

      this.formModelGm.patchValue({
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

      this.formModelMom.patchValue({
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

      this.formModelDad.patchValue({
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
    data.forEach((value: Beneficiary) => {

      if (value.relationship == 'บิดา') {
        this.gfArray.push(value);
      }
      if (value.relationship == 'มารดา') {
        this.gmArray.push(value);
      }
      if (value.relationship == 'สามี') {
        this.dadArray.push(value);
      }
      if (value.relationship == 'ภรรยา') {
        this.momArray.push(value);
      }
      if (value.relationship == 'ลูก') {
        this.arrayChild.push(value);
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


  onClickGf(data : any) {
    this.textStringGf = 'form-control';
    this.modeGf = false;
    this.formModelGf.get('beneficiaryBirthday')?.setValue(new Date(data.birthday));
  }

  onClickGm(data : any) {
    this.textStringGm = 'form-control';
    this.modeGm = false;
    this.formModelGm.get('beneficiaryBirthday')?.setValue(new Date(data.birthday));
  }

  onClickDad(data : any) {
    this.textStringDad = 'form-control';
    this.modeDad = false;
    this.formModelDad.get('beneficiaryBirthday')?.setValue(new Date(data.birthday));
  }

  onClickMom(data : any) {
    this.textStringMom = 'form-control';
    this.modeMom = false;
    this.formModelMom.get('beneficiaryBirthday')?.setValue(new Date(data.birthday));
  }

  onClickChild() {
    this.textStringChild = 'form-control';
    this.modeChild = false;
    const data = this.formModelChild.getRawValue();
    this.formModelChild.get('beneficiaryBirthday')?.setValue(new Date(data.birthday));


    console.log("const data -------------------- ",data);
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

  checkDate(data: any) : any {

    console.log("checkDate -------> ", data);
    
    // this.value = data
    return new Date(data);
  }

  checkPrefix(data: any) : any {
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

  checkRelationship(data: any) : any {
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

  checkMaritalV1(data: any) : any {
    switch (data) {
      case 'มีชีวิต':
        return 1
      case 'ไม่มีชีวิต':
        return 2
      default:
        break;
    }
  }

  checkMaritalV2(data: any) : any {
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
    playload.contact = {
      id:  playload.contact.id,
      tel: playload.tel
    }


    console.log("payload ----> " , playload);

    this.service.updateEmp(playload).subscribe((res) => {
      console.log("res ----> " , res);
// this.ngOnInit();
    });

    

  }


  reject() { }
}
