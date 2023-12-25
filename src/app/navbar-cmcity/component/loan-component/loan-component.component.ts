import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer } from 'src/app/model/ccustomerTest';
import { MainService } from 'src/app/service/main.service';
import 'jspdf-autotable';
import 'src/assets/fonts/Sarabun-Regular-normal.js'
import 'src/assets/fonts/Sarabun-Bold-bold.js'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'src/assets/custom-fonts.js'
import { LocalStorageService } from 'ngx-webstorage';
import { DecimalPipe } from '@angular/common';
import { Subject, debounceTime } from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-loan-component',
  templateUrl: './loan-component.component.html',
  styleUrls: ['./loan-component.component.scss']
})
export class LoanComponentComponent implements OnInit {
  menuItems!: MenuItem[];
  customers!: Customer[];
  info: any[] = [];
  loading!: boolean;
  totalRecords!: number;
  clonedProducts: { [s: number]: Customer } = {};
  formModel!: FormGroup;
  formModelLoan!: FormGroup;
  formModelLoanNew!: FormGroup;
  displayModal: boolean = false;
  dataLoanDetail!: any[];
  empDetail: any;
  loanId: any;
  userId: any;
  admin!: boolean;
  dataLoan!: any[];
  displayLoadingPdf: boolean = false;
  displayModalLoanNew: boolean = false;
  periodMonthDescOption: any = [];
  disabledCheck: boolean = true;
  inputSubject = new Subject<string>();
  inputGuaranteeStock = new Subject<string>();
  inputLoanTime = new Subject<string>();
  inputGuarantorUnique1 = new Subject<string>();
  inputGuarantorUnique2 = new Subject<string>();
  dataNewLoan: any;
  dataNewLoanFlag: boolean = false;
  dataLanTimeFlag: boolean = false;
  displayMessageError: boolean = false;
  guarantorUniqueFlag1: any = 'A';
  guarantorUniqueFlag2: any = 'A';
  messageError: any;
  guarantorUniqueName1: any;
  guarantorUniqueName2: any;

  constructor(private service: MainService, private messageService: MessageService, private confirmationService: ConfirmationService, private localStorageService: LocalStorageService,) { }

  ngOnInit() {
    this.loading = true;
    this.initMainForm();
    this.initMainFormStock();
    this.initMainFormLoanNew();

    this.userId = this.localStorageService.retrieve('empId');
    this.empDetail = this.localStorageService.retrieve('employeeofmain');
    this.loanId = this.localStorageService.retrieve('loanid');
    this.getLoanDetail(this.userId, this.loanId);

    // this.searchLoan();
    this.setperiodMonthDescOption();
    this.pipeDateTH();

    this.inputSubject.pipe(debounceTime(1000)).subscribe(value => {
      // Perform your action here based on the latest value
      if (value.length >= 5) {
        this.formModelLoanNew.get('guarantorOne').enable();
        this.formModelLoanNew.get('guarantorTwo').enable();
        const payload = {
          empCode: value,
          monthCurrent: this.month,
          yearCurrent: this.year
        }
        this.service.searchEmployeeLoanNew(payload).subscribe({
          next: (res) => {
            if (res !== null || res) {
              this.dataNewLoan = res;
              this.formModelLoanNew.patchValue({
                interestPercent: res.interestPercent ? res.interestPercent + '%' : '5%',
                stockValue: res.stockAccumulate ? this.formattedNumber2(Number(res.stockAccumulate)) : 0,
                fullName: res.fullName
              });
            } else {
              this.formModelLoanNew.reset();
            }
          },
          error: error => {
            this.formModelLoanNew.reset();
            // this.formModelLoanNew.get('employeeCode').setValue(null);
          },
        });
      } else {
        this.formModelLoanNew.reset();
      }

    });

    this.menuItems = [
      {
        label: 'ประวัติเงินกู้',
        command: () => {
          this.searchDocumentV1PDF('export');
        }
      },
      {
        label: 'ดาวน์โหลด',
        command: () => {
          this.searchDocumentV1PDF('download');
        }
      }
    ];

    this.inputGuaranteeStock.pipe(debounceTime(1000)).subscribe(value => {
      if (value.length > 0) {
        const data = this.dataNewLoan ? this.dataNewLoan.stockAccumulate : null;
        const valueParse = value.replace(',', '');
        if (data !== null && (Number(valueParse) <= data)) {
          this.formModelLoanNew.patchValue({
            guaranteeStock: 'ได้'
          });
          this.dataNewLoanFlag = true;
          this.formModelLoanNew.get('loanTime').enable();
          this.formModelLoanNew.get('guarantorOne').disable();
          this.formModelLoanNew.get('guarantorTwo').disable();
        } else {
          this.formModelLoanNew.patchValue({
            guaranteeStock: 'ไม่ได้'
          });
          this.dataNewLoanFlag = false;
          this.formModelLoanNew.get('loanTime').enable();
          this.formModelLoanNew.get('guarantorOne').enable();
          this.formModelLoanNew.get('guarantorTwo').enable();
        }
      } else {
        this.formModelLoanNew.get('guaranteeStock').setValue(null);
        this.formModelLoanNew.get('loanTime').disable();
        this.formModelLoanNew.get('guarantorOne').enable();
        this.formModelLoanNew.get('guarantorTwo').enable();
        this.dataNewLoanFlag = false;
      }
    });

    this.inputLoanTime.pipe(debounceTime(1000)).subscribe(value => {
      if (value.length > 0) {
        this.dataLanTimeFlag = true;
      } else {
        this.dataLanTimeFlag = false;
        this.formModelLoanNew.get('loanTime').setValue(null);
      }
    });

    this.inputGuarantorUnique1.pipe(debounceTime(1000)).subscribe(value => {
      if (value.length > 0) {
        const playload = {
          empCode: value
        }
        this.service.searchGuarantorUnique(playload).subscribe({
          next: (res) => {
            if (res !== null) {
              if (res.length >= 2) {
                this.guarantorUniqueFlag1 = 'N';
                setTimeout(() => { }, 800);
                this.formModelLoanNew.get('guarantorOne').setValue(null);
              } else {
                const data = this.formModelLoanNew.getRawValue();
                if (value === data.employeeCode) {
                  this.guarantorUniqueFlag1 = 'C';
                } else if (value !== data.guarantorTwo) {
                  this.guarantorUniqueFlag1 = 'Y';
                  const playload1 = {
                    empCode: data.guarantorOne
                  }
                  this.service.searchEmpCodeOfId(playload1).subscribe((resG1) => {
                    this.guarantorUniqueName1 = resG1 ? resG1.fullName : 'ใช้ได้';
                  });
                } else {
                  this.guarantorUniqueFlag1 = 'Q';
                  setTimeout(() => { }, 800);
                  this.formModelLoanNew.get('guarantorOne').setValue(null);
                }
              }
            } else {
              this.guarantorUniqueFlag1 = 'N';
              setTimeout(() => { }, 800);
              this.formModelLoanNew.get('guarantorOne').setValue(null);
            }
          },
          error: error => {
            this.guarantorUniqueFlag1 = 'N';
            setTimeout(() => { }, 800);
            this.formModelLoanNew.get('guarantorOne').setValue(null);
          }
        });
      } else {
        this.guarantorUniqueFlag1 = 'A';
        this.formModelLoanNew.get('guarantorOne').setValue(null);
      }
    });

    this.inputGuarantorUnique2.pipe(debounceTime(1000)).subscribe(value => {
      if (value.length > 0) {
        const playload = {
          empCode: value
        }
        this.service.searchGuarantorUnique(playload).subscribe({
          next: (res) => {
            if (res !== null) {
              if (res.length >= 2) {
                this.guarantorUniqueFlag2 = 'N';
                setTimeout(() => { }, 800);
                this.formModelLoanNew.get('guarantorTwo').setValue(null);
              } else {
                const data = this.formModelLoanNew.getRawValue();
                if (value === data.employeeCode) {
                  this.guarantorUniqueFlag2 = 'C';
                } else if (value !== data.guarantorOne) {
                  this.guarantorUniqueFlag2 = 'Y';
                  const playload2 = {
                    empCode: data.guarantorTwo
                  }
                  this.service.searchEmpCodeOfId(playload2).subscribe((resG2) => {
                    this.guarantorUniqueName2 = resG2 ? resG2.fullName : 'ใช้ได้';
                  });
                } else {
                  this.guarantorUniqueFlag2 = 'Q';
                  setTimeout(() => { }, 800);
                  this.formModelLoanNew.get('guarantorTwo').setValue(null);
                }
              }
            } else {
              this.guarantorUniqueFlag2 = 'N';
              setTimeout(() => { }, 800);
              this.formModelLoanNew.get('guarantorTwo').setValue(null);
            }
          },
          error: error => {
            this.guarantorUniqueFlag2 = 'N';
            setTimeout(() => { }, 800);
            this.formModelLoanNew.get('guarantorTwo').setValue(null);
          }
        });
      } else {
        this.guarantorUniqueFlag2 = 'A';
        this.formModelLoanNew.get('guarantorTwo').setValue(null);
      }
    });



  }

  month: any;
  year: any;
  time: any;
  pipeDateTH() {
    const format = new Date()
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;
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

  initMainForm() {
    this.formModel = new FormGroup({
      fullName: new FormControl(null),
    });;
  }

  initMainFormStock() {
    this.formModelLoan = new FormGroup({
      monthlyLoanMoney: new FormControl(null, Validators.required),
      loanYear: new FormControl(null),
      loanMonth: new FormControl(null),
    });;
  }

  initMainFormLoanNew() {
    this.formModelLoanNew = new FormGroup({
      employeeCode: new FormControl(null, Validators.required),
      fullName: new FormControl(null, Validators.required),
      loanValue: new FormControl(null, Validators.required),
      interestPercent: new FormControl(null, Validators.required),
      loanTime: new FormControl(null, Validators.required),
      startDateLoan: new FormControl(null, Validators.required),
      stockValue: new FormControl(null, Validators.required),
      guaranteeStock: new FormControl(null, Validators.required),
      guarantorOne: new FormControl(null, Validators.required),
      guarantorTwo: new FormControl(null, Validators.required),
      loanOrdinary: new FormControl(null, Validators.required),
      interestLoan: new FormControl(null),
      loanBalance: new FormControl(null),
      interestLoanLastMonth: new FormControl(null),
      loanYear: new FormControl(null),
      loanMonth: new FormControl(null),
    });;
  }

  onSearchMember() {
    const data = this.formModel.getRawValue();
    // api search member
  }

  getLoanDetail(userId: any, loanId: any): void {
    this.searchLoanDetail(loanId);

    if (userId === 1 || userId === 631) {
      this.admin = true;
    }
  }

  searchLoanDetail(id: any): void {
    const payload = {
      loanId: id,
      empId: this.userId
    }
    this.service.searchLoanDetail(payload).subscribe(data => {
      this.dataLoanDetail = data
      this.loading = false;
    });
  }

  // searchLoan(): void {
  //   this.service.searchLoan().subscribe(data => {
  //     this.dataLoan = data;
  //     this.loading = false;
  //   });
  // }

  // exportPDF(){
  //   this.customers?.forEach((element,index,array) =>{
  //     this.info.push([element.name,element.country?.name,element.company,element.representative?.name]);
  //   })

  //   const pdf = new jsPDF('p', 'mm', 'a4') as jsPDFCustom;
  //   pdf.setProperties({
  //     title: 'ประวัติการส่งเงินกู้รายเดือน'
  //   });
  //   pdf.setFont('Sarabun-Regular');
  //   pdf.setFontSize(14);
  //   pdf.text("ประวัติการส่งเงินกู้รายเดือน ( Loan History)",60,10);
  //   //autoTable(pdf, { html: '#contentTable' });
  //   pdf.autoTable({ 
  //     //styles : { halign : 'center'},
  //     headStyles:{fillColor : [160, 160, 160]},
  //     theme: 'grid',
  //     head: [['Name','Country','Company','Representative']],
  //     body: this.info,
  //   })
  //   pdf.output("dataurlnewwindow",{filename: "ประวัติการส่งเงินกู้รายเดือน"});
  //   //pdf.save('test.pdf');

  // }

  // downloadPDF(){
  //   this.customers?.forEach((element,index,array) =>{
  //     this.info.push([element.name,element.country?.name,element.company,element.representative?.name]);
  //   })

  //   const pdf = new jsPDF() as jsPDFCustom;
  //   pdf.setFont('Sarabun-Regular');
  //   pdf.setFontSize(14);
  //   pdf.text(" ประวัติการส่งเงินกู้รายเดือน ( Stock History) ",70,10);
  //   //autoTable(pdf, { html: '#contentTable' });
  //   pdf.autoTable({ 
  //     //styles : { halign : 'center'},
  //     headStyles:{fillColor : [160, 160, 160]},
  //     theme: 'grid',
  //     head: [['Name','Country','Company','Representative']],
  //     body: this.info,
  //   })
  //   //pdf.output("dataurlnewwindow");
  //   pdf.save('ประวัติการส่งเงินกู้รายเดือน.pdf');

  // }

  list!: any[];
  sumLoan: any;
  searchDocumentV1PDF(mode: any) {

    // let loanInfo: any[] = [];
    const playload = {
      loanId: this.loanId,
      monthCurrent: null,  //this.month
      admin: true,
      empId: this.userId
    }
    this.service.searchDocumentV1Loan(playload).subscribe((data) => {
      this.list = data;
      if (data == null) {
        this.showWarnNull();
      } else {
        this.showWarn();

        const key = 'installment';
        const arrayUniqueByKey = [...new Map(data.map(item => [item[key], item])).values()];
        let sumLoan = 0;
        // arrayUniqueByKey.forEach((element, index, array) => {
        //   sumLoan = sumLoan + Number(element.loanValue);
        // });
        sumLoan = arrayUniqueByKey[0].loanValue;
        this.getSearchDocumentV2Sum(playload, arrayUniqueByKey, mode, sumLoan);
      }
    });
  }

  getSearchDocumentV2Sum(playload: any, loanInfo: any[], mode: any, sumLoanObj: any) {
    this.service.searchDocumentV2SumLoan(playload).subscribe((data) => {
      this.sumLoan = data[0];
      this.exportMakePDF(mode, loanInfo, this.sumLoan, sumLoanObj)
    });
  }

 async searchIdOfEmpCodeValue1(id) {
    const payload = {
      empId: id
    };
  
    try {
      const res = await this.service.searchIdOfEmpCode(payload).toPromise();
      return res ? res.empCode : ' ';
    } catch (error) {
      console.error(error);
      return ' ';
    }
  }
  

  async searchIdOfEmpCodeValue2(id) {
    const payload = {
      empId: id
    };
  
    try {
      const res = await this.service.searchIdOfEmpCode(payload).toPromise();
      return res ? res.empCode : ' ';
    } catch (error) {
      console.error(error);
      return ' ';
    }
  }

  exportMakePDF(mode: any, loanInfo: any[], sum: any, sumLoanObj: any) {
    const decimalPipe = new DecimalPipe('en-US');
    // let guarantor1Id = await this.searchIdOfEmpCodeValue1(item.guarantor1);
    // let guarantor2Id = await this.searchIdOfEmpCodeValue2(item.guarantor2);

    let detailLoan = loanInfo.map(function (item) {
      return [
        { text: item.departmentName, alignment: 'left' },
        { text: item.employeeCode, alignment: 'center' },
        { text: item.fullName, alignment: 'left' },
        { text: decimalPipe.transform(item.loanValue), alignment: 'right' },
        { text: decimalPipe.transform(item.loanTime), alignment: 'center' },
        { text: decimalPipe.transform(item.interestPercent), alignment: 'right' },
        { text: item.guarantorCode1 ? item.guarantorCode1 : ' ', alignment: 'center' },
        { text: item.guarantorCode2 ? item.guarantorCode2 : ' ' , alignment: 'center' },
        { text: decimalPipe.transform(item.monthInterest), alignment: 'right' },
        { text: decimalPipe.transform(item.monthPrinciple), alignment: 'right' },
        { text: decimalPipe.transform(item.lastMonthInterest), alignment: 'right' },
        { text: decimalPipe.transform(item.lastMonthPrinciple), alignment: 'right' },
        { text: decimalPipe.transform(item.installment), alignment: 'center' },
        { text: decimalPipe.transform(item.totalValueInterest), alignment: 'right' },
        { text: decimalPipe.transform(item.outStandInterest), alignment: 'right' },
        { text: decimalPipe.transform(item.totalValuePrinciple), alignment: 'right' },
        { text: decimalPipe.transform(item.outStandPrinciple), alignment: 'right' },
      ]
    });

    const dataSum = this.checkTotalListGroup(loanInfo);

    pdfMake.vfs = pdfFonts.pdfMake.vfs // 2. set vfs pdf font
    pdfMake.fonts = {
      // download default Roboto font from cdnjs.com
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      },
      // Kanit Font
      Sarabun: { // 3. set Kanit font
        normal: 'Sarabun-Regular.ttf',
        bold: 'Sarabun-Medium.ttf',
        italics: 'Sarabun-Italic.ttf ',
        bolditalics: 'Sarabun-MediumItalic.ttf '
      }
    }
    const docDefinition = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      info: {
        title: 'ประวัติการส่งเงินกู้รายเดือน',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'รายงานเงินกู้', style: 'header' },
        // { text: 'รายงานเงินกู้ เดือน' + this.month + ' พ.ศ.' + this.year, style: 'header' },
        //{ text: 'รายงานเงินกู้และค่า หุ้น เดือนมีนาคม พ.ศ.2566', style: 'header'},
        '\n',
        {
          style: 'tableExample',
          table: {
            alignment: "center",
            headerRows: 1,
            widths: [150, 48, 95, 65, 30, 19, 44, 44, 60, 60, 60, 60, 30, 60, 60, 60, 60],
            body: [
              [{ text: 'หน่วยงาน', style: 'tableHeader', alignment: 'center' }, { text: 'รหัสพนักงาน', style: 'tableHeader', alignment: 'center' },
              { text: 'ชื่อ-สกุล', style: 'tableHeader', alignment: 'center' }, { text: 'เงินกู้', style: 'tableHeader', alignment: 'center' },
              { text: 'เวลากู้', style: 'tableHeader', alignment: 'center' }, { text: 'ดอกเบี้ย', style: 'tableHeader', alignment: 'center' },
              { text: 'ผู้คํ้า 1', style: 'tableHeader', alignment: 'center' }, { text: 'ผู้คํ้า 2', style: 'tableHeader', alignment: 'center' },
              { text: 'เดือนนี้ \n(ดอก)', style: 'tableHeader', alignment: 'center' }, { text: 'เดือนนี้ \n(ต้น)', style: 'tableHeader', alignment: 'center' },
              { text: 'สุดท้าย \n(ดอก)', style: 'tableHeader', alignment: 'center' }, { text: 'สุดท้าย \n(ต้น)', style: 'tableHeader', alignment: 'center' },
              { text: 'ส่งงวดที่', style: 'tableHeader', alignment: 'center' }, { text: 'รวมส่ง \n(ดอก)', style: 'tableHeader', alignment: 'center' },
              { text: 'คงค้าง \n(ดอก)', style: 'tableHeader', alignment: 'center' }, { text: 'รวมส่ง \n(ต้น)', style: 'tableHeader', alignment: 'center' },
              { text: 'คงค้าง \n(ต้น)', style: 'tableHeader', alignment: 'center' },
              ],
              ...detailLoan,
              [{ text: sum.departmentName + ' Total', alignment: 'left', bold: true }, ' ', ' ',
              //{ text: decimalPipe.transform(sumLoanObj), alignment: 'right' }, ' ', ' ', ' ', ' ',
              { text: ' ', alignment: 'right' }, ' ', ' ', ' ', ' ',
              { text: decimalPipe.transform(dataSum.monthInterestSum), alignment: 'right' }, 
              { text: decimalPipe.transform(dataSum.monthPrincipleSum), alignment: 'right' },
              { text: ' ', alignment: 'right' }, //decimalPipe.transform(dataSum.lastMonthInterestSum)
              { text: decimalPipe.transform(dataSum.lastMonthPrincipleSum), alignment: 'right' }, ' ',
              { text: ' ', alignment: 'right' }, //decimalPipe.transform(dataSum.totalValueInterestSum)
              { text: ' ', alignment: 'right' }, //decimalPipe.transform(dataSum.outStandInterestSum)
              { text: ' ', alignment: 'right' }, //decimalPipe.transform(dataSum.totalValuePrincipleSum)
              { text: ' ', alignment: 'right' },  //decimalPipe.transform(dataSum.outStandPrincipleSum)
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            }
          }
        },
      ],
      styles: {
        header: {
          fontSize: 13,
          bold: true,
          alignment: 'center'
        },
      },
      defaultStyle: { // 4. default style 'KANIT' font to test
        font: 'Sarabun',
      }
    }
    const pdf = pdfMake.createPdf(docDefinition);
    if (mode === 'export') {
      pdf.open();
    } else {
      pdf.download('ประวัติการส่งเงินกู้รายเดือน.pdf');
    }
  }

  infogroup1: any[] = [];
  infogroup2: any[] = [];
  infogroup3: any[] = [];
  infogroup4: any[] = [];
  infogroup5: any[] = [];
  infogroup6: any[] = [];
  infogroup7: any[] = [];
  infogroup8: any[] = [];
  infogroup9: any[] = [];
  infogroup10: any[] = [];
  infogroup11: any[] = [];
  infogroup12: any[] = [];
  infogroup13: any[] = [];
  infogroup14: any[] = [];
  infogroup15: any[] = [];
  infogroup16: any[] = [];
  infogroup17: any[] = [];
  infogroup18: any[] = [];
  infogroup19: any[] = [];
  infogroup20: any[] = [];
  infogroup21: any[] = [];
  infogroup22: any[] = [];
  infogroup23: any[] = [];
  infogroup24: any[] = [];
  infogroup25: any[] = [];
  infogroup26: any[] = [];
  infogroup27: any[] = [];
  infogroup28: any[] = [];
  infogroup29: any[] = [];
  infogroup30: any[] = [];
  infogroup31: any[] = [];

  checkDepartment(listData: any[]) {

    this.infogroup1 = [];
    this.infogroup2 = [];
    this.infogroup3 = [];
    this.infogroup4 = [];
    this.infogroup5 = [];
    this.infogroup6 = [];
    this.infogroup7 = [];
    this.infogroup8 = [];
    this.infogroup9 = [];
    this.infogroup10 = [];
    this.infogroup11 = [];
    this.infogroup12 = [];
    this.infogroup13 = [];
    this.infogroup14 = [];
    this.infogroup15 = [];
    this.infogroup16 = [];
    this.infogroup17 = [];
    this.infogroup18 = [];
    this.infogroup19 = [];
    this.infogroup20 = [];
    this.infogroup21 = [];
    this.infogroup22 = [];
    this.infogroup23 = [];
    this.infogroup24 = [];
    this.infogroup25 = [];
    this.infogroup26 = [];
    this.infogroup27 = [];
    this.infogroup28 = [];
    this.infogroup29 = [];
    this.infogroup30 = [];
    this.infogroup31 = [];
    listData.forEach((element, index, array) => {

      if (element.departmentName === 'แขวงเม็งราย') {
        this.infogroup1.push(element);
      } else if (element.departmentName === 'แขวงกาวิละ') {
        this.infogroup2.push(element);
      } else if (element.departmentName === 'แผนงานบริหารทั่วไป') {
        this.infogroup3.push(element);
      } else if (element.departmentName === 'งานเทศกิจ') {
        this.infogroup4.push(element);
      } else if (element.departmentName === 'งานโรงพยาบาล') {
        this.infogroup5.push(element);
      } else if (element.departmentName === 'งานก่อสร้าง') {
        this.infogroup6.push(element);
      } else if (element.departmentName === 'งานบริหารงานคลัง') {
        this.infogroup7.push(element);
      } else if (element.departmentName === 'งานบริหารงานคลัง ฝ่ายประจำ') {
        this.infogroup8.push(element);
      } else if (element.departmentName === 'งานบริหารงานทั่วไป') {
        this.infogroup9.push(element);
      } else if (element.departmentName === 'งานบริหารทั่วไป') {
        this.infogroup10.push(element);
      } else if (element.departmentName === 'งานบริหารทั่วไป ฝ่ายประจำ') {
        this.infogroup11.push(element);
      } else if (element.departmentName === 'งานบริหารทั่วไปเกี่ยวกับเคหะและชุมชน') {
        this.infogroup12.push(element);
      } else if (element.departmentName === 'งานบริหารทั่วไปเกี่ยวกับการศึกษา') {
        this.infogroup13.push(element);
      } else if (element.departmentName === 'งานบริหารทั่วไปเกี่ยวกับสังคมสงเคราะห์') {
        this.infogroup14.push(element);
      } else if (element.departmentName === 'งานบริหารทั่วไปเกี่ยวกับสาธารณสุข') {
        this.infogroup15.push(element);
      } else if (element.departmentName === 'งานบริหารทั่วไปเกี่ยวกับอุตสาหกรรมและการโยธา') {
        this.infogroup16.push(element);
      } else if (element.departmentName === 'งานป้องกันและบรรเทาสาธารณภัย') {
        this.infogroup17.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลดอกเงิน') {
        this.infogroup18.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดเชียงยืน') {
        this.infogroup19.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดกู่คำ') {
        this.infogroup20.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดท่าสะต๋อย') {
        this.infogroup21.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดพวกช้าง') {
        this.infogroup22.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดศรีปิงเมือง') {
        this.infogroup23.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดศรีสุพรรณ') {
        this.infogroup24.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดหมื่นเงินกอง') {
        this.infogroup25.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนชุมชนเทศบาลวัดศรีดอนไชย') {
        this.infogroup26.push(element);
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา งานการศึกษานอกระบบฯ') {
        this.infogroup27.push(element);
      } else if (element.departmentName === 'งานวางแผนสถิติและวิชาการ') {
        this.infogroup28.push(element);
      } else if (element.departmentName === 'งานวิชาการวางแผนและส่งเสริมการท่องเที่ยว') {
        this.infogroup29.push(element);
      } else if (element.departmentName === 'งานสุขาภิบาล') {
        this.infogroup30.push(element);
      } else if (element.departmentName === 'ระดับก่อนวัยเรียนและประถมศึกษา') {
        this.infogroup31.push(element);
      } else {
        console.log("else error !!!");
      }
    })
  }

  checkListDataPDF(list: any[]) {
    const decimalPipe = new DecimalPipe('en-US');
    if (list.length > 0) {
      let datalListGroup = list.map(function (item) {
        return [
          { text: item.departmentName, alignment: 'left' },
          { text: item.employeeCode, alignment: 'center' },
          { text: item.fullName, alignment: 'left' },
          { text: decimalPipe.transform(item.loanValue), alignment: 'right' },
          { text: decimalPipe.transform(item.loanTime), alignment: 'center' },
          { text: decimalPipe.transform(item.interestPercent), alignment: 'center' },
          { text: decimalPipe.transform(item.guarantor1), alignment: 'center' },
          { text: decimalPipe.transform(item.guarantor2), alignment: 'center' },
          { text: decimalPipe.transform(item.monthInterest), alignment: 'right' },
          { text: decimalPipe.transform(item.monthPrinciple), alignment: 'right' },
          { text: decimalPipe.transform(item.lastMonthInterest), alignment: 'right' },
          { text: decimalPipe.transform(item.lastMonthPrinciple), alignment: 'right' },
          { text: decimalPipe.transform(item.installment), alignment: 'center' },
          { text: decimalPipe.transform(item.totalValueInterest), alignment: 'right' },
          { text: decimalPipe.transform(item.outStandInterest), alignment: 'right' },
          { text: decimalPipe.transform(item.totalValuePrinciple), alignment: 'right' },
          { text: decimalPipe.transform(item.outStandPrinciple), alignment: 'right' },
        ]
      });
      return datalListGroup;
    } else {
      return '';
    }
  }

  checkListSumAllByDepartment(listSum: any[], nameDepartment: any, listGroup: any[]) {
    if (listSum.length > 0) {
      const dataSum = this.checkTotalListGroup(listGroup);
      let sumDepartment;
      listSum?.forEach((element, _index, _array) => {
        if (element.departmentName === nameDepartment) {
          sumDepartment = [{ text: element.departmentName + ' Total', alignment: 'left', bold: true }, ' ', ' ',
          { text: this.formattedNumber2(element.loanValueTotal), alignment: 'right' }, ' ', ' ', ' ', ' ',
          { text: this.formattedNumber2(dataSum.monthInterestSum), alignment: 'right' },
          { text: this.formattedNumber2(dataSum.monthPrincipleSum), alignment: 'right' },
          { text: this.formattedNumber2(dataSum.lastMonthInterestSum), alignment: 'right' },
          { text: this.formattedNumber2(dataSum.lastMonthPrincipleSum), alignment: 'right' }, ' ',
          { text: this.formattedNumber2(dataSum.totalValueInterestSum), alignment: 'right' },
          { text: this.formattedNumber2(dataSum.outStandInterestSum), alignment: 'right' },
          { text: this.formattedNumber2(dataSum.totalValuePrincipleSum), alignment: 'right' },
          { text: this.formattedNumber2(dataSum.outStandPrincipleSum), alignment: 'right' },
          ];
        }
      })
      return sumDepartment;
    } else {
      return '';
    }
  }

  sumGrandTotal1: any = 0;
  sumGrandTotal2: any = 0;
  sumGrandTotal3: any = 0;
  sumGrandTotal4: any = 0;
  sumGrandTotal5: any = 0;
  sumGrandTotal6: any = 0;
  sumGrandTotal7: any = 0;
  sumGrandTotal8: any = 0;
  checkTotalListGroup(listGroup: any[]) {
    let monthInterestSum = 0
    let monthPrincipleSum = 0
    let lastMonthInterestSum = 0
    let lastMonthPrincipleSum = 0
    let totalValueInterestSum = 0
    let outStandInterestSum = 0
    let totalValuePrincipleSum = 0
    let outStandPrincipleSum = 0
    listGroup?.forEach((element, _index, _array) => {
      monthInterestSum = monthInterestSum + Number(element.monthInterest ? element.monthInterest : 0);
      monthPrincipleSum = monthPrincipleSum + Number(element.monthPrinciple ? element.monthPrinciple : 0);
      lastMonthInterestSum = lastMonthInterestSum + Number(element.lastMonthInterest ? element.lastMonthInterest : 0);
      lastMonthPrincipleSum = lastMonthPrincipleSum + Number(element.lastMonthPrinciple ? element.lastMonthPrinciple : 0);
      totalValueInterestSum = totalValueInterestSum + Number(element.totalValueInterest ? element.totalValueInterest : 0);
      outStandInterestSum = outStandInterestSum + Number(element.outStandInterest ? element.outStandInterest : 0);
      totalValuePrincipleSum = totalValuePrincipleSum + Number(element.totalValuePrinciple ? element.totalValuePrinciple : 0);
      outStandPrincipleSum = outStandPrincipleSum + Number(element.outStandPrinciple ? element.outStandPrinciple : 0);
    });
    this.sumGrandTotal1 = Number(this.sumGrandTotal1) + monthInterestSum;
    this.sumGrandTotal2 = Number(this.sumGrandTotal2) + monthPrincipleSum;
    this.sumGrandTotal3 = Number(this.sumGrandTotal3) + lastMonthInterestSum;
    this.sumGrandTotal4 = Number(this.sumGrandTotal4) + lastMonthPrincipleSum;
    this.sumGrandTotal5 = Number(this.sumGrandTotal5) + totalValueInterestSum;
    this.sumGrandTotal6 = Number(this.sumGrandTotal6) + outStandInterestSum;
    this.sumGrandTotal7 = Number(this.sumGrandTotal7) + totalValuePrincipleSum;
    this.sumGrandTotal8 = Number(this.sumGrandTotal8) + outStandPrincipleSum;
    const playload = {
      monthInterestSum: monthInterestSum,
      monthPrincipleSum: monthPrincipleSum,
      lastMonthInterestSum: lastMonthInterestSum,
      lastMonthPrincipleSum: lastMonthPrincipleSum,
      totalValueInterestSum: totalValueInterestSum,
      outStandInterestSum: outStandInterestSum,
      totalValuePrincipleSum: totalValuePrincipleSum,
      outStandPrincipleSum: outStandPrincipleSum,
    }
    return playload;
  }

  checkListSumGrandTotal(listSum: any[]) {

    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;
    let sum4 = 0;
    let sum5 = 0;
    let sum6 = 0;
    let sum7 = 0;
    let sum8 = 0;
    let sum9 = 0;

    let sumDepartment;

    listSum?.forEach((element, _index, _array) => {
      sum1 = sum1 + Number(element.loanValueTotal ? element.loanValueTotal : 0);
      sum2 = sum2 + Number(element.monthInterestTotal ? element.monthInterestTotal : 0);
      sum3 = sum3 + Number(element.monthPrincipleTotal ? element.monthPrincipleTotal : 0);
      sum4 = sum4 + Number(element.lastMonthInterestTotal ? element.lastMonthInterestTotal : 0);
      sum5 = sum5 + Number(element.lastMonthPrincipleTotal ? element.lastMonthPrincipleTotal : 0);
      sum6 = sum6 + Number(element.totalValueInterestTotal ? element.totalValueInterestTotal : 0);
      sum7 = sum7 + Number(element.outStandInterestTotal ? element.outStandInterestTotal : 0);
      sum8 = sum8 + Number(element.totalValuePrincipleTotal ? element.totalValuePrincipleTotal : 0);
      sum9 = sum9 + Number(element.outStandPrincipleTotal ? element.outStandPrincipleTotal : 0);
    })

    sumDepartment = [{ text: 'Grand Total', alignment: 'left', bold: true }, ' ', ' ',
    { text: this.formattedNumber2(sum1), alignment: 'right' }, ' ', ' ', ' ', ' ',
    { text: this.formattedNumber2(this.sumGrandTotal1), alignment: 'right' },
    { text: this.formattedNumber2(this.sumGrandTotal2), alignment: 'right' },
    { text: this.formattedNumber2(this.sumGrandTotal3), alignment: 'right' },
    { text: this.formattedNumber2(this.sumGrandTotal4), alignment: 'right' }, ' ',
    { text: this.formattedNumber2(this.sumGrandTotal5), alignment: 'right' },
    { text: this.formattedNumber2(this.sumGrandTotal6), alignment: 'right' },
    { text: this.formattedNumber2(this.sumGrandTotal7), alignment: 'right' },
    { text: this.formattedNumber2(this.sumGrandTotal8), alignment: 'right' },
    ];

    return sumDepartment;
  }


  formattedNumber2(number: any): any {
    const decimalPipe = new DecimalPipe('en-US');
    return number !== null ? decimalPipe.transform(number) : '';
  }

  searchDocumentV1All(mode: any) {
    // this.displayLoadingPdf = true;
    this.showWarn();

    // let stockInfo: any[] = [];
    const playload = {
      loanId: null,
      monthCurrent: this.month
    }

    this.service.searchDocumentV1Loan(playload).subscribe((data) => {
      this.list = data;
      const key = 'installment';
      const arrayUniqueByKey = [...new Map(data.map(item => [item[key], item])).values()];
      this.getSearchDocumentV2SumAll(playload, mode, data);
    });
  }

  getSearchDocumentV2SumAll(playload: any, mode: any, listdata: any[]) {
    this.service.searchDocumentV2SumLoan(playload).subscribe((data) => {
      this.sumLoan = data;
      this.checkDepartment(listdata);
      this.exportMakePDFAll(mode, data)
    });
  }

  exportMakePDFAll(mode: any, listSum: any[]) {

    let data1 = this.checkListDataPDF(this.infogroup1);
    let dataSum1 = this.checkListSumAllByDepartment(listSum, 'แขวงเม็งราย', this.infogroup1);
    let data2 = this.checkListDataPDF(this.infogroup2);
    let dataSum2 = this.checkListSumAllByDepartment(listSum, 'แขวงกาวิละ', this.infogroup2);
    let data3 = this.checkListDataPDF(this.infogroup3);
    let dataSum3 = this.checkListSumAllByDepartment(listSum, 'แผนงานบริหารทั่วไป', this.infogroup3);
    let data4 = this.checkListDataPDF(this.infogroup4);
    let dataSum4 = this.checkListSumAllByDepartment(listSum, 'งานเทศกิจ', this.infogroup4);
    let data5 = this.checkListDataPDF(this.infogroup5);
    let dataSum5 = this.checkListSumAllByDepartment(listSum, 'งานโรงพยาบาล', this.infogroup5);

    let data6 = this.checkListDataPDF(this.infogroup6);
    let dataSum6 = this.checkListSumAllByDepartment(listSum, 'งานก่อสร้าง', this.infogroup6);
    let data7 = this.checkListDataPDF(this.infogroup7)
    let dataSum7 = this.checkListSumAllByDepartment(listSum, 'งานบริหารงานคลัง', this.infogroup7);
    let data8 = this.checkListDataPDF(this.infogroup8);
    let dataSum8 = this.checkListSumAllByDepartment(listSum, 'งานบริหารงานคลัง ฝ่ายประจำ', this.infogroup8);
    let data9 = this.checkListDataPDF(this.infogroup9);
    let dataSum9 = this.checkListSumAllByDepartment(listSum, 'งานบริหารงานทั่วไป', this.infogroup9);
    let data10 = this.checkListDataPDF(this.infogroup10);
    let dataSum10 = this.checkListSumAllByDepartment(listSum, 'งานบริหารทั่วไป', this.infogroup10);

    let data11 = this.checkListDataPDF(this.infogroup11);
    let dataSum11 = this.checkListSumAllByDepartment(listSum, 'งานบริหารทั่วไป ฝ่ายประจำ', this.infogroup11);
    let data12 = this.checkListDataPDF(this.infogroup12)
    let dataSum12 = this.checkListSumAllByDepartment(listSum, 'งานบริหารทั่วไปเกี่ยวกับเคหะและชุมชน', this.infogroup12);
    let data13 = this.checkListDataPDF(this.infogroup13);
    let dataSum13 = this.checkListSumAllByDepartment(listSum, 'งานบริหารทั่วไปเกี่ยวกับการศึกษา', this.infogroup13);
    let data14 = this.checkListDataPDF(this.infogroup14);
    let dataSum14 = this.checkListSumAllByDepartment(listSum, 'งานบริหารทั่วไปเกี่ยวกับสังคมสงเคราะห์', this.infogroup14);
    let data15 = this.checkListDataPDF(this.infogroup15);
    let dataSum15 = this.checkListSumAllByDepartment(listSum, 'งานบริหารทั่วไปเกี่ยวกับสาธารณสุข', this.infogroup15);

    let data16 = this.checkListDataPDF(this.infogroup16);
    let dataSum16 = this.checkListSumAllByDepartment(listSum, 'งานบริหารทั่วไปเกี่ยวกับอุตสาหกรรมและการโยธา', this.infogroup16);
    let data17 = this.checkListDataPDF(this.infogroup17);
    let dataSum17 = this.checkListSumAllByDepartment(listSum, 'งานป้องกันและบรรเทาสาธารณภัย', this.infogroup17);
    let data18 = this.checkListDataPDF(this.infogroup18)
    let dataSum18 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลดอกเงิน', this.infogroup18);
    let data19 = this.checkListDataPDF(this.infogroup19);
    let dataSum19 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดเชียงยืน', this.infogroup19);
    let data20 = this.checkListDataPDF(this.infogroup20);
    let dataSum20 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดกู่คำ', this.infogroup20);

    let data21 = this.checkListDataPDF(this.infogroup21);
    let dataSum21 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดท่าสะต๋อย', this.infogroup21);
    let data22 = this.checkListDataPDF(this.infogroup22)
    let dataSum22 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดพวกช้าง', this.infogroup22);
    let data23 = this.checkListDataPDF(this.infogroup23);
    let dataSum23 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดศรีปิงเมือง', this.infogroup23);
    let data24 = this.checkListDataPDF(this.infogroup24);
    let dataSum24 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดศรีสุพรรณ', this.infogroup24);
    let data25 = this.checkListDataPDF(this.infogroup25);
    let dataSum25 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดหมื่นเงินกอง', this.infogroup25);

    let data26 = this.checkListDataPDF(this.infogroup26);
    let dataSum26 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนชุมชนเทศบาลวัดศรีดอนไชย', this.infogroup26);
    let data27 = this.checkListDataPDF(this.infogroup27)
    let dataSum27 = this.checkListSumAllByDepartment(listSum, 'งานระดับก่อนวัยเรียนและประถมศึกษา งานการศึกษานอกระบบฯ', this.infogroup27);
    let data28 = this.checkListDataPDF(this.infogroup28);
    let dataSum28 = this.checkListSumAllByDepartment(listSum, 'งานวางแผนสถิติและวิชาการ', this.infogroup28);
    let data29 = this.checkListDataPDF(this.infogroup29);
    let dataSum29 = this.checkListSumAllByDepartment(listSum, 'งานวิชาการวางแผนและส่งเสริมการท่องเที่ยว', this.infogroup29);
    let data30 = this.checkListDataPDF(this.infogroup30);
    let dataSum30 = this.checkListSumAllByDepartment(listSum, 'งานสุขาภิบาล', this.infogroup30);
    let data31 = this.checkListDataPDF(this.infogroup31);
    let dataSum31 = this.checkListSumAllByDepartment(listSum, 'ระดับก่อนวัยเรียนและประถมศึกษา', this.infogroup31);

    let sunGrandTotal = this.checkListSumGrandTotal(listSum);


    pdfMake.vfs = pdfFonts.pdfMake.vfs // 2. set vfs pdf font
    pdfMake.fonts = {
      // download default Roboto font from cdnjs.com
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      },
      // Kanit Font
      Sarabun: { // 3. set Kanit font
        normal: 'Sarabun-Regular.ttf',
        bold: 'Sarabun-Medium.ttf',
        italics: 'Sarabun-Italic.ttf ',
        bolditalics: 'Sarabun-MediumItalic.ttf '
      }
    }
    const docDefinition = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      info: {
        title: 'ประวัติการส่งเงินกู้รายเดือน',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'รายงานเงินกู้และค่าหุ้น เดือน' + this.month + ' พ.ศ.' + this.year, style: 'header' },
        // text: 'รายงานเงินกู้และค่า หุ้น เดือนมีนาคม พ.ศ.2566', style: 'header'},
        '\n',
        {
          style: 'tableExample',
          table: {
            alignment: "center",
            headerRows: 1,
            widths: [150, 48, 95, 65, 30, 19, 44, 44, 60, 60, 60, 60, 30, 60, 60, 60, 60],
            body: [
              [{ text: 'หน่วยงาน', style: 'tableHeader', alignment: 'center' }, { text: 'รหัส\nพนักงาน', style: 'tableHeader', alignment: 'center' },
              { text: 'ชื่อ-สกุล', style: 'tableHeader', alignment: 'center' }, { text: 'เงินกู้', style: 'tableHeader', alignment: 'center' },
              { text: 'เวลากู้', style: 'tableHeader', alignment: 'center' }, { text: 'ดอกเบี้ย', style: 'tableHeader', alignment: 'center' },
              { text: 'ผู้คํ้า 1', style: 'tableHeader', alignment: 'center' }, { text: 'ผู้คํ้า 2', style: 'tableHeader', alignment: 'center' },
              { text: 'เดือนนี้ \n(ดอก)', style: 'tableHeader', alignment: 'center' }, { text: 'เดือนนี้ \n(ต้น)', style: 'tableHeader', alignment: 'center' },
              { text: 'สุดท้าย \n(ดอก)', style: 'tableHeader', alignment: 'center' }, { text: 'สุดท้าย \n(ต้น)', style: 'tableHeader', alignment: 'center' },
              { text: 'ส่ง\nงวดที่', style: 'tableHeader', alignment: 'center' }, { text: 'รวมส่ง \n(ดอก)', style: 'tableHeader', alignment: 'center' },
              { text: 'คงค้าง \n(ดอก)', style: 'tableHeader', alignment: 'center' }, { text: 'รวมส่ง \n(ต้น)', style: 'tableHeader', alignment: 'center' },
              { text: 'คงค้าง \n(ต้น)', style: 'tableHeader', alignment: 'center' },
              ],
              // group 1
              ...data1,
              dataSum1,
              ...data2,
              dataSum2,
              ...data3,
              dataSum3,
              ...data4,
              dataSum4,
              ...data5,
              dataSum5,
              ...data6,
              dataSum6,
              ...data7,
              dataSum7,
              ...data8,
              dataSum8,
              ...data9,
              dataSum9,
              ...data10,
              dataSum10,

              // group 2
              ...data11,
              dataSum11,
              ...data12,
              dataSum12,
              ...data13,
              dataSum13,
              ...data14,
              dataSum14,
              ...data15,
              dataSum15,
              ...data16,
              dataSum16,
              ...data17,
              dataSum17,
              ...data18,
              dataSum18,
              ...data19,
              dataSum19,
              ...data20,
              dataSum20,

              // group 1
              ...data21,
              dataSum21,
              ...data22,
              dataSum22,
              ...data23,
              dataSum23,
              ...data24,
              dataSum24,
              ...data25,
              dataSum25,
              ...data26,
              dataSum26,
              ...data27,
              dataSum27,
              ...data28,
              dataSum28,
              ...data29,
              dataSum29,
              ...data30,
              dataSum30,
              ...data31,
              dataSum31,
              sunGrandTotal,
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            }
          }
        },
      ],
      styles: {
        header: {
          fontSize: 13,
          bold: true,
          alignment: 'center'
        },
      },
      defaultStyle: { // 4. default style 'KANIT' font to test
        font: 'Sarabun',
      }
    }
    const pdf = pdfMake.createPdf(docDefinition);
    if (mode === 'export') {
      pdf.open();
    } else {
      pdf.download('ประวัติการส่งเงินกู้รายเดือน.pdf');
    }
  }

  onEditLoan(data: any) {
    /// api
  }

  // updateLoantoMonth() {
  //   this.displayModal = true;
  // }

  // onupdateLoanToMonth() {
  //   // api update stock to everyone 
  // }

  onCancle() {
    this.formModelLoan.reset();
    this.displayModal = false;
  }

  onShowLoanAddNew() {
    this.displayModalLoanNew = true;
    this.formModelLoanNew.get('interestPercent').disable();
    this.formModelLoanNew.get('startDateLoan').disable();
    this.formModelLoanNew.get('loanOrdinary').disable();
    this.formModelLoanNew.get('guaranteeStock').disable();
    this.formModelLoanNew.get('stockValue').disable();
    this.formModelLoanNew.get('loanTime').disable();
    this.formModelLoanNew.get('guarantorOne').disable();
    this.formModelLoanNew.get('guarantorTwo').disable();
  }

  checkValidFormLoan() {
    const data = this.formModelLoanNew.getRawValue();
    const flagStock = data.guaranteeStock === 'ได้' ? 'Y' : 'N';
    if (flagStock === 'Y') {
      if (data.loanOrdinary === null || !data.loanOrdinary) {
        this.messageError = 'กรุณาคำนวนยอดที่ต้องชำระต่อเดือน'
        this.displayMessageError = true;
        return false;
      } else {
        return true;
      }
    } else {
      if (this.guarantorUniqueFlag1 !== 'Y' || this.guarantorUniqueFlag2 !== 'Y') {
        this.messageError = 'ตรวจสอบรหัสพนักงานค้ำให้ถูกต้อง'
        this.displayMessageError = true;
        return false;
      } else if (data.loanOrdinary === null || !data.loanOrdinary) {
        this.messageError = 'กรุณาคำนวนยอดที่ต้องชำระต่อเดือน'
        this.displayMessageError = true;
        return false;
      } else {
        return true;
      }
    }
  }


  insertLoanDetail() {
    const data = this.formModelLoanNew.getRawValue();
    if (this.dataNewLoan) {
      const loanBalance = this.dataNewLoan.loanBalance ? this.dataNewLoan.loanBalance : 0;
      if (!this.dataNewLoan.loanActive) {
        if (this.checkValidFormLoan()) {
          // api
          const flagStock = data.guaranteeStock === 'ได้' ? 'Y' : 'N';
          data.guaranteeStock = flagStock;
          const interestRE = data.interestPercent.replace('%', '');
          data.interestPercent = interestRE;
          const loanOrdinaryRE = data.loanOrdinary ? data.loanOrdinary.replace(',', '') : 0;
          data.loanOrdinary = loanOrdinaryRE;
          const stockValueRE = data.stockValue ? data.stockValue.replace(',', '') : 0;
          data.stockValue = stockValueRE;
          this.service.insertLoanNew(data).subscribe((res) => {
            if (res) {
              this.messageService.add({ severity: 'success', detail: 'ทำสัญญาเงินกู้สำเร็จ' });
            } else {
              this.messageService.add({ severity: 'error', detail: 'ทำสัญญาเงินกู้ไม่สำเร็จ' });
            }

            this.displayModalLoanNew = false;
          });
        }
      } else {
        if (this.checkValidFormLoan()) {
          // const flagStock = data.guaranteeStock === 'ได้' ? 'Y': 'N';
          // data.guaranteeStock = flagStock;
          // const interestRE = data.interestPercent.replace('%','');
          // data.interestPercent = interestRE;
          // const loanOrdinaryRE = data.loanOrdinary.replace(',','');
          // data.loanOrdinary = loanOrdinaryRE;
          const loanBalance = this.dataNewLoan.loanBalance ? this.dataNewLoan.loanBalance : 0;
          this.messageError = this.dataNewLoan.fullName + ' ไม่สามารถทำการกู้ได้ ยังมีหนี้คงค้างอยู่ '
            + this.formattedNumber2(loanBalance) + '  บาท';
          this.displayMessageError = true;
        }
      }
    }

  }

  onCancleLoan() {
    this.formModelLoanNew.reset();
    this.dataLanTimeFlag = false;
    this.formModelLoanNew.get('loanTime').disable();
    this.formModelLoanNew.get('guarantorOne').enable();
    this.formModelLoanNew.get('guarantorTwo').enable();
    this.guarantorUniqueFlag1 = 'A';
    this.guarantorUniqueFlag2 = 'A';
    //this.displayModalLoanNew = false;
  }

  checkNull: boolean = true;
  checkValueOfNull(event: any) {
    if (!event.value) {
      this.checkNull = true;
    } else {
      this.checkNull = false;
    }
  }

  checkSetValueEmp(event: any) {
    this.inputSubject.next(event.target.value);
  }

  checkGuaranteeStock(event: any) {
    this.inputGuaranteeStock.next(event.target.value);
  }

  checkLoanTime(event: any) {
    this.inputLoanTime.next(event.target.value);
  }

  checkGuarantorUnique1(event: any) {
    this.inputGuarantorUnique1.next(event.target.value);
  }

  checkGuarantorUnique2(event: any) {
    this.inputGuarantorUnique2.next(event.target.value);
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
    this.year = year;
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    const time = format.getHours() + ':' + format.getMinutes() + ' น.';
    this.time = time;

    this.formModelLoanNew.get('loanYear').setValue(Number(year + 543));
    this.formModelLoanNew.get('loanMonth').setValue(monthSelect.label);

    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1).getDate();
    return year + '-' + monthSelect.value + '-' + lastDayOfMonth;
  }

  onCalculateLoanOld() {
    const datePayLoanNew = this.pipeDateTHNewLan();
    const data = this.formModelLoanNew.getRawValue();
    const payload = {
      principal: data.loanValue,
      interestRate: this.dataNewLoan.interestPercent,
      numOfPayments: data.loanTime,
      paymentStartDate: datePayLoanNew
    }
    this.service.onCalculateLoanOld(payload).subscribe((res) => {
      const data = res[0];
      this.formModelLoanNew.patchValue({
        loanOrdinary: this.formattedNumber2(Number(data.totalDeduction)),
        startDateLoan: datePayLoanNew,
        interestLoan: 0, //interest
        loanBalance: 0, //principalBalance
        interestLoanLastMonth: 0 // interestLastMonth
      });
    });
  }

  onCalculateLoanNew() {
    const datePayLoanNew = this.pipeDateTHNewLan();
    const data = this.formModelLoanNew.getRawValue();
    const payload = {
      principal: data.loanValue,
      interestRate: this.dataNewLoan.interestPercent,
      numOfPayments: data.loanTime,
      paymentStartDate: datePayLoanNew
    }
    this.service.onCalculateLoanNew(payload).subscribe((res) => {
      const data = res[0];
      this.formModelLoanNew.patchValue({
        loanOrdinary: this.formattedNumber2(Number(data.totalDeduction)),
        startDateLoan: datePayLoanNew,
        interestLoan: 0, //interest
        loanBalance: 0, //principalBalance
        interestLoanLastMonth: 0 // interestLastMonth
      });
    });
  }

  onCloseLoan(data: any) {
    this.confirmationService.confirm({
      message: 'ต้องการปิดหนี้ให้ <br/> คุณ ' + data.firstName + ' ' + data.lastName,
      header: 'ปิดหนี้สมาชิก',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //api

        this.service.closeLoan(data.id).subscribe((res) => {
          this.messageService.add({ severity: 'success', detail: 'ปิดหนี้สำเร็จ' });
          this.ngOnInit();
        })
      },
      reject: () => { }
    });
  }

  requestLoanAgreement() {
    //
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'โปรดรอสักครู่ PDF อาจใช้เวลาในการเเสดงข้อมูล ประมาณ 1-5 นาที' });
  }

  showWarnNull() {
    this.messageService.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ไม่พบข้อมูลเงินกู้' });
  }

  oldMonth: any;
  newMonth: any;
  newYear: any;
  updateLoantoMonth() {
    this.displayModal = true;

    const formatDate = new Date()
    const month = formatDate.getMonth()
    this.newYear = formatDate.getFullYear() + 543

    this.newMonth = this.periodMonthDescOption[month];
    this.oldMonth = this.periodMonthDescOption[month - 1];

    this.formModelLoan.patchValue({
      loanYear: this.newYear,
      loanMonth: this.newMonth.label,
    })

    this.formModelLoan.get('loanMonth')?.disable();
    this.formModelLoan.get('loanYear')?.disable();

    this.checkInsertLoanDetailAll();
  }

  checkInsertLoanDetailAll() {

    const loanDetail = this.dataLoanDetail
    const formatDate = new Date()
    const month = formatDate.getMonth()
    const monthSelect = this.periodMonthDescOption[month];

    if (loanDetail[loanDetail.length - 1].loanMonth === monthSelect.label) {
      this.checkNull = true;
    } else {
      this.checkNull = false;
    }
  }

  onupdateLoanToMonth() {
    // api update stock to everyone 
    const payload = {
      oldMonth: this.oldMonth.label,
      oldYear: this.newYear,
      newMonth: this.newMonth.label,
      newYear: this.newYear
    }
    this.service.insertLoanDetail(payload).subscribe(data => {
      this.messageService.add({ severity: 'success', detail: 'เพิ่มสำเร็จ' });
      this.displayModal = false;
      this.ngOnInit();
    });
  }

}
