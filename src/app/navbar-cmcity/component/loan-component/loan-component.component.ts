import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/model/ccustomerTest';
import { MainService } from 'src/app/service/main.service';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import 'src/assets/fonts/Sarabun-Regular-normal.js'
import 'src/assets/fonts/Sarabun-Bold-bold.js'
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'src/assets/custom-fonts.js'
import { LocalStorageService } from 'ngx-webstorage';

interface jsPDFCustom extends jsPDF {
    autoTable: (options: UserOptions) => void;
}

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
  userId: any;
  loanId: any;
  admin!: boolean;
  dataLoan!: any[];

  constructor(private service: MainService, private messageService: MessageService,  private confirmationService: ConfirmationService,private localStorageService: LocalStorageService,) {}

  ngOnInit() {
      this.service.getCustomers().subscribe((res) =>{
        console.log(res,"<==== res");
        this.customers = res.customers;
      })
      this.loading = true;
      this.initMainForm();
      this.initMainFormStock();

      
    this.userId = this.localStorageService.retrieve('empId');
    this.getEmployee(this.userId);
    this.searchLoan();
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

  onSearchMember(){
    const data = this.formModel.getRawValue();
    // api search member
  }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      this.loanId = data.loan.id;
      console.log("loanId", this.loanId);
      
      this.searchLoanDetail(this.loanId);

      if (data.id === 1 || data.id === 631){
        this.admin = true;
      }
    });
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

  loadCustomers(event: LazyLoadEvent) {
    this.loading = true; 

    setTimeout(() => {
      this.service.getCustomers({ lazyEvent: JSON.stringify(event) }).subscribe((res) =>{
        console.log(res,"<==== res");
        //this.customers = res.customers;
        this.totalRecords = res.totalRecords;
        this.loading = false;
      })
    }, 1000);
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

  exportMakePDF(mode: any){
    this.customers?.forEach((element,index,array) =>{
      this.info.push([element.name,element.country?.name,element.company,element.representative?.name]);
    })
    
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
      pageSize: 'A2',
      pageOrientation: 'landscape',
      //pageMargins: [40, 80, 40, 60],
      info: {
        title: 'ประวัติการส่งเงินกู้รายเดือน',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header'},
        { text: 'รายงานเงินกู้และค่า หุ้น เดือนมีนาคม พ.ศ.2566', style: 'header'},
        '\n',
        {
          style: 'tableExample',
          table: {
            alignment: "center",
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
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
           ['klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk',],
           ['klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk',],
           ['klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk',],
           ['klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk',],
           ['klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk','klk;lk',],
              // ...this.info,
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
    if(mode === 'export'){
      pdf.open();
    }else{
      pdf.download('ประวัติการส่งเงินกู้รายเดือน.pdf');
    }
  }

  onEditLoan(data: any){
    /// api
  }

  updateLoantoMonth(){
    this.displayModal = true;
  }

  onupdateLoanToMonth(){
        // api update stock to everyone 
  }

  onCancle(){
    this.formModelLoan.reset();
    this.displayModal = false;
  }

  checkNull: boolean = true;
  checkValueOfNull(event: any){
    if(!event.value){
      this.checkNull = true;
    }else{
      this.checkNull = false;
    }
  }

  onCloseLoan(data: any){
    this.confirmationService.confirm({
      message: 'ต้องการปิดหนี้ให้ <br/> คุณ ' + data.firstName + ' ' + data.lastName,
      header: 'ปิดหนี้สมาชิก',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //api
      },
      reject: () => {}
    });
  }

  requestLoanAgreement(){
     //
  }

}
