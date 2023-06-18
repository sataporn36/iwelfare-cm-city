import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/model/ccustomerTest';
import { MainService } from 'src/app/service/main.service';
import 'jspdf-autotable';
import 'src/assets/fonts/Sarabun-Regular-normal.js'
import 'src/assets/fonts/Sarabun-Bold-bold.js'
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'src/assets/custom-fonts.js'
import { LocalStorageService } from 'ngx-webstorage';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-loan-component',
  templateUrl: './loan-component.component.html',
  styleUrls: ['./loan-component.component.scss']
})
export class LoanComponentComponent implements OnInit {
  customers!: Customer[];
  info: any[] = [];
  loading!: boolean;
  totalRecords!: number;
  clonedProducts: { [s: number]: Customer } = {};
  formModel!: FormGroup;
  formModelLoan!: FormGroup;
  displayModal: boolean = false;
  dataLoanDetail!: any[];
  empDetail: any;
  loanId: any;
  userId: any;
  admin!: boolean;
  dataLoan!: any[];
  displayLoadingPdf: boolean = false;
  periodMonthDescOption: any = [];

  constructor(private service: MainService, private messageService: MessageService, private confirmationService: ConfirmationService, private localStorageService: LocalStorageService,) { }

  ngOnInit() {
    this.loading = true;
    this.initMainForm();
    this.initMainFormStock();

    this.userId = this.localStorageService.retrieve('empId');
    this.empDetail = this.localStorageService.retrieve('employeeofmain');
    this.loanId = this.localStorageService.retrieve('loanid');
    this.getLoanDetail(this.userId, this.loanId);

    this.searchLoan();
    this.setperiodMonthDescOption();
    this.pipeDateTH();
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
    this.service.searchLoanDetail(id).subscribe(data => {
      this.dataLoanDetail = data
      this.loading = false;
    });
  }

  searchLoan(): void {
    this.service.searchLoan().subscribe(data => {
      this.dataLoan = data;
      this.loading = false;
    });
  }

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

    let loanInfo: any[] = [];
    const playload = {
      loanId: this.loanId,
      monthCurrent: this.month
    }
    this.service.searchDocumentV1Loan(playload).subscribe((data) => {
      this.list = data;
      const key = 'installment';
      const arrayUniqueByKey = [...new Map(data.map(item => [item[key], item])).values()];
      console.log(arrayUniqueByKey, '<---------- this.arrayUniqueByKey');
      let sumLoan = 0;
      arrayUniqueByKey.forEach((element, index, array) => {
        sumLoan = sumLoan + Number(element.loanValue);
      })
      this.getSearchDocumentV2Sum(playload, arrayUniqueByKey, mode, sumLoan);
    });
  }

  getSearchDocumentV2Sum(playload: any, loanInfo: any[], mode: any, sumLoanObj: any) {
    this.service.searchDocumentV2SumLoan(playload).subscribe((data) => {
      this.sumLoan = data[0];
      console.log(" this.sumLoan", sumLoanObj);
      this.exportMakePDF(mode, loanInfo, this.sumLoan, sumLoanObj)
    });
  }

  exportMakePDF(mode: any, loanInfo: any[], sum: any, sumLoanObj: any) {
    const decimalPipe = new DecimalPipe('en-US');
   
    let detailLoan = loanInfo.map(function (item) {
      return [
        { text: item.departmentName, alignment: 'left' },
        { text: item.employeeCode, alignment: 'center' },
        { text: item.fullName, alignment: 'left' },
        { text: decimalPipe.transform(item.loanValue), alignment: 'right' },
        { text: decimalPipe.transform(item.loanTime), alignment: 'center' },
        { text: decimalPipe.transform(item.interestPercent), alignment: 'right' },
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

    const dataSum = this.checkTotalListGroup(loanInfo);

    console.log(detailLoan, 'detailLoan');
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
              { text: decimalPipe.transform(sumLoanObj), alignment: 'right' }, ' ',' ', ' ',' ',
              { text: decimalPipe.transform(dataSum.monthInterestSum), alignment: 'right' }, 
              { text: decimalPipe.transform(dataSum.monthPrincipleSum), alignment: 'right' },
              { text: decimalPipe.transform(dataSum.lastMonthInterestSum), alignment: 'right' }, 
              { text: decimalPipe.transform(dataSum.lastMonthPrincipleSum), alignment: 'right' }, ' ',
              { text: decimalPipe.transform(dataSum.totalValueInterestSum), alignment: 'right' },
              { text: decimalPipe.transform(dataSum.outStandInterestSum), alignment: 'right' },
              { text: decimalPipe.transform(dataSum.totalValuePrincipleSum), alignment: 'right' },
              { text: decimalPipe.transform(dataSum.outStandPrincipleSum), alignment: 'right' },
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

    let stockInfo: any[] = [];
    const playload = {
      loanId: null,
      monthCurrent: this.month
    }

    console.log(playload, '<----------- playload');
    this.service.searchDocumentV1Loan(playload).subscribe((data) => {
      this.list = data;
      console.log(data, '<-----------  sum data');
      const key = 'installment';
      const arrayUniqueByKey = [...new Map(data.map(item => [item[key], item])).values()];
      this.getSearchDocumentV2SumAll(playload, mode, data);
    });
  }

  getSearchDocumentV2SumAll(playload: any, mode: any, listdata: any[]) {
    this.service.searchDocumentV2SumLoan(playload).subscribe((data) => {
      this.sumLoan = data;
      console.log(this.sumLoan, '<-----------  sum sumStock');
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

  updateLoantoMonth() {
    this.displayModal = true;
  }

  onupdateLoanToMonth() {
    // api update stock to everyone 
  }

  onCancle() {
    this.formModelLoan.reset();
    this.displayModal = false;
  }

  checkNull: boolean = true;
  checkValueOfNull(event: any) {
    if (!event.value) {
      this.checkNull = true;
    } else {
      this.checkNull = false;
    }
  }

  onCloseLoan(data: any) {
    this.confirmationService.confirm({
      message: 'ต้องการปิดหนี้ให้ <br/> คุณ ' + data.firstName + ' ' + data.lastName,
      header: 'ปิดหนี้สมาชิก',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //api
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

}
