import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Customer } from 'src/app/model/ccustomerTest';
import { MainService } from 'src/app/service/main.service';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import 'src/assets/fonts/Sarabun-Regular-normal.js';
import 'src/assets/fonts/Sarabun-Bold-bold.js';
import 'src/assets/fonts/Kanit-Thin-normal.js';
import 'src/assets/fonts/Kanit-Regular-normal.js';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationStrategy } from '@angular/common';
import { LocalStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'src/assets/custom-fonts.js'

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}


@Component({
  selector: 'app-share-component',
  templateUrl: './share-component.component.html',
  styleUrls: ['./share-component.component.scss']
})
export class ShareComponentComponent implements OnInit {
  [x: string]: any;

  @ViewChild('content', { static: false }) el!: ElementRef;
  customers!: Customer[];
  info: any[] = [];
  infoReceipt: any[] = [];
  infoReceiptTotal: any[] = [];
  loading!: boolean;
  totalRecords!: number;
  clonedProducts: { [s: number]: any } = {};
  formModel!: FormGroup;
  formModelStock!: FormGroup;
  displayModal: boolean = false;
  dataStock!: any[];
  dataStockDetail!: any[];
  userId: any;
  stockId: any;
  employeeByStock: any;
  dataValue: any;
  periodMonthDescOption: any = [];

  admin!: boolean

  constructor(private service: MainService, private messageService: MessageService, private locationStrategy: LocationStrategy,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.service.getCustomers().subscribe((res) => {
      console.log(res, "<==== res");
      this.customers = res.customers;
    })
    this.loading = true;
    this.initMainForm();
    this.initMainFormStock();

    this.userId = this.localStorageService.retrieve('empId');
    this.getEmployee(this.userId);
    this.searchStock();
    this.setperiodMonthDescOption();
  }

  initMainForm() {
    this.formModel = new FormGroup({
      fullName: new FormControl(null),
    });;
  }

  initMainFormStock() {
    this.formModelStock = new FormGroup({
      stockMonth: new FormControl(0),
      stockYear: new FormControl(null),
    });;
  }

  onSearchMember() {
    const data = this.formModel.getRawValue();
    // api search member
  }

  loadCustomers(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
      this.service.searchStockDetail(this.stockId).subscribe((res) => {
        console.log(res, "<==== res");
        //this.customers = res.customers;
        this.totalRecords = res.length;
        this.loading = false;
      })
    }, 1000);
  }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      this.stockId = data.stock.id;
      this.searchStockDetail(this.stockId);

      if (data.id === 1 || data.id === 631) {
        this.admin = true;
      }
    });
  }

  getEmployeeByStock(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      this.employeeByStock = data;
      this.loading = false;
    });
  }

  searchStock(): void {
    this.service.searchStock().subscribe(data => {
      this.dataStock = data;
      this.loading = false;
    });
  }

  searchStockDetail(id: any): void {
    this.service.searchStockDetail(id).subscribe(data => this.dataStockDetail = data);
  }

  // generatePDF() {
  //   let pdf = new jsPDF('p', 'pt', 'a4');
  //   pdf.html(this.el.nativeElement, {
  //     callback: (pdf) => {
  //       pdf.output("dataurlnewwindow");
  //     },
  //   })
  // }

  // convertToPDF() {
  //   html2canvas(document.getElementById("contentTable")!).then(canvas => {
  //     // Few necessary setting options
  //     const contentDataURL = canvas.toDataURL('image/png')
  //     let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
  //     var width = pdf.internal.pageSize.getWidth();
  //     var height = canvas.height * width / canvas.width;
  //     pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)
  //     pdf.save('output.pdf'); // Generated PDF
  //   });
  // }

  // exportPDF() {
  //   this.dataStockDetail?.forEach((element, index, array) => {
  //     this.info.push([index+1, element.stockMonth, element.stockYear, 'ชำระหนี้ประจำเดือน', element.installment, element.stockValue, element.stock.stockAccumulate]);
  //   })

  //   const pdf = new jsPDF() as jsPDFCustom;
  //   pdf.setProperties({
  //     title: 'ประวัติการส่งหุ้น'
  //   });
  //   pdf.setFont('Sarabun-Regular');
  //   pdf.setFontSize(14);
  //   pdf.text(" ประวัติการส่งหุ้น ( Stock History) ", 70, 10);
  //   //autoTable(pdf, { html: '#contentTable' });
  //   pdf.autoTable({
  //     //styles : { halign : 'center'},
  //     // startY: 100,
  //     styles: { font: 'Kanit-Regular', fontSize: 10 },
  //     headStyles: { fillColor: [160, 160, 160] },
  //     theme: 'grid',
  //     head: [['เลขที่', 'เดือนที่ทำรายการ', 'ปีที่ทำรายการ', 'ชื้อรายการ', 'งวดที่', 'ยอดทำรายการ', 'หุ้นสะสม']],
  //     body: this.info,
  //   })
  //   pdf.output("dataurlnewwindow",{filename: "ประวัติการส่งหุ้น"});
  //   //pdf.save('test.pdf');

  // }

  // downloadPDF() {
  //   this.customers?.forEach((element, index, array) => {
  //     this.info.push([element.name, element.country?.name, element.company, element.representative?.name]);
  //   })

  //   const pdf = new jsPDF() as jsPDFCustom;
  //   pdf.setFont('Sarabun-Regular');
  //   pdf.setFontSize(14);
  //   pdf.text(" ประวัติการส่งหุ้น ( Stock History) ", 70, 10);
  //   //autoTable(pdf, { html: '#contentTable' });
  //   pdf.autoTable({
  //     //styles : { halign : 'center'},
  //     styles: { font: 'Sarabun-Regular', fontSize: 14 },
  //     headStyles: { fillColor: [160, 160, 160] },
  //     theme: 'grid',
  //     head: [['Name', 'Country', 'Company', 'Representative']],
  //     body: this.info,
  //   })
  //   //pdf.output("dataurlnewwindow");
  //   pdf.save('ประวัติการส่งหุ้น.pdf');

  // }

  onRowEditInit(stock: any) {
    this.clonedProducts[stock.id!] = { ...stock };
  }


  // onPrintReceipt() {
  //   this.infoReceipt.push(['ค่าหุ้น', '3', '1,000.00', ' ']);
  //   this.infoReceipt.push(['เงินต้น', ' ', ' ', ' ']);
  //   this.infoReceipt.push(['ดอก', ' ', ' ', ' ']);
  //   this.infoReceipt.push(['', 'รวมเงิน', '1,000.00', ' ']);
  //   var img = new Image();
  //   img.src = 'assets/images/logo.png';

  //   var img1 = new Image();
  //   img1.src = 'assets/images/text1.png';

  //   var img2 = new Image();
  //   img2.src = 'assets/images/text2.png';

  //   //const textin1 = "ประจําเดือน " + " มีนาคม 2566 " + "            เลขที่่ " + " 00001";
  //   const textin2 = "ได้รับเงินจาก " + " นายฉัตรชัย ตาเบอะ";
  //   const textin3 = "สังกัด " + " แขวงกาวิละ";
  //   const textin4 = "เลขที่สมาชิก " + " 05355";
  //   const textin5 = "หุ้นสะสม " + " 3,000.00 " + " บาท";

  //   const pdf = new jsPDF() as jsPDFCustom;
  //   pdf.setProperties({
  //     title: 'ใบเสร็จรับเงิน'
  //   });
  //   // let width = pdf.internal.pageSize.getWidth();
  //   //let height = pdf.internal.pageSize.getHeight();
  //   //pdf.setLineHeightFactor(50);
  //   pdf.getTextWidth("20");
  //   pdf.addImage(img,'png', 83, 10, 40, 40);
  //   pdf.setFont('Sarabun-Regular');
  //   pdf.setFontSize(16);
  //   pdf.text(" กองทุนสวัสดิการพนักงานเทศบาลนครเชียงใหม่ ",52,60,{renderingMode:'fillThenStroke'}); 
  //   pdf.text(" ใบเสร็จรับเงิน \n ",86,70,{renderingMode:'fillThenStroke'});
  //   pdf.setFont('Sarabun-Regular');
  //   pdf.setFontSize(14);
  //   pdf.text("ประจําเดือน",15,90); 
  //   pdf.text("มีนาคม 2566",45,90,{renderingMode:'fillThenStroke'}); 
  //   pdf.text("เลขที่",85,90); 
  //   pdf.text("00001",100,90,{renderingMode:'fillThenStroke'}); 
  //   pdf.text("ได้รับเงินจาก",15,100); 
  //   pdf.text("นายฉัตรชัย ตาเบอะ",45,100,{renderingMode:'fillThenStroke'}); 
  //   pdf.text("สังกัด",15,110); 
  //   pdf.text("แขวงกาวิละ",30,110,{renderingMode:'fillThenStroke'}); 
  //   pdf.text("เลขที่สมาชิก",15,120); 
  //   pdf.text("05355",45,120,{renderingMode:'fillThenStroke'}); 
  //   pdf.text("หุ้นสะสม",15,130); 
  //   pdf.text("3,000.00",38,130,{renderingMode:'fillThenStroke'}); 
  //   pdf.text("บาท",63,130); 
  //   //pdf.text(" \n\n\n\n ",0,0);
  //   pdf.autoTable({
  //     styles: { font: 'Sarabun-Regular', fontSize: 14 },
  //     margin: { top: 135, bottom: 0 },
  //     headStyles: { fillColor: [160, 160, 160] },
  //     theme: 'grid',
  //     head: [['รายการ', 'งวด', 'เป็นเงิน', 'เงินต้นเหลือ']],
  //     body: this.infoReceipt,
  //   });
  //   pdf.text(" (หนึ่งพันบาทถ้วน) ",20,190); 
  //   pdf.text(" \n\n\n\n\n\n\n\n ",0,0);
  //   pdf.addImage(img1,'png', 36, 200, 40, 40);
  //   pdf.addImage(img1,'png', 132, 200, 40, 40);
  //   pdf.text(" ประธานกองทุน " + "                                                        " + " เหรัญญิก ",40,245); 
  //   // pdf.setLanguage('th');

  //   // var fontSize = 16;
  //   // var offsetY = 10.797777777777778;
  //   // var lineHeight = 15.49111111111111;

  //   // pdf.setFontSize(fontSize);

  //   // pdf.text('วันที่ 1',10, 10 + lineHeight * 0 + offsetY);
  //   // pdf.text('วันที่ 3',10, 10 + lineHeight * 1 + offsetY);
  //   // pdf.text('วันที่ 2',10, 10 + lineHeight * 2 + offsetY);

  //   // var dim = pdf.getTextDimensions('Text');
  //   // console.log(dim); 


  //   pdf.output("dataurlnewwindow",{filename: "ใบเสร็จรับเงิน"});
  //   this.infoReceipt = [];

  // }


  onRowEditSave(playload: any) {
    this.service.updateStock(playload).subscribe((data) => {
      this.messageService.add({ severity: 'success', detail: 'แก้ไขสำเร็จ' });
      this.ngOnInit();
      this.loading = false;
    });
  }

  month: any;
  year: any;
  time: any;
  pipeDateTH() {
    const format = new Date()
    const day = format.getDate()
    const month = format.getMonth()
    const year = format.getFullYear() + 543
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

  onRowEditCancel(product: Customer, index: number) {
    this.customers[index] = this.clonedProducts[product.id!];
    delete this.clonedProducts[product.id!];
  }

  updateStocktoMonth() {
    this.displayModal = true;

    const formatDate = new Date()
    const month = formatDate.getMonth()
    const year = formatDate.getFullYear() + 543

    const monthSelect = this.periodMonthDescOption[month];

    this.formModelStock.patchValue({
      stockYear: year,
      stockMonth: monthSelect.label,
    })

    this.formModelStock.get('stockMonth')?.disable();
    this.formModelStock.get('stockYear')?.disable();

    this.checkInsertStockDetailAll();
  }

  onupdateStockToMonth() {
    // api update stock to everyone 
  }

  onCancle() {
    this.formModelStock.reset();
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

  checkInsertStockDetailAll() {

    const stockDetail = this.dataStockDetail
    const formatDate = new Date()
    const month = formatDate.getMonth()
    const monthSelect = this.periodMonthDescOption[month];

    if (stockDetail[stockDetail.length - 1].stockMonth === monthSelect.label) {
      this.checkNull = true;
    } else {
      this.checkNull = false;
    }
  }

  clear(table: Table) {
    table.clear();
  }

  exportMakePDF(mode: any) {
    this.customers?.forEach((element, index, array) => {
      this.info.push([element.name, element.country?.name, element.company, element.representative?.name]);
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
      pageSize: 'A3',
      pageOrientation: 'landscape',
      //pageMargins: [40, 80, 40, 60],
      info: {
        title: 'ประวัติการส่งหุ้น',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'รายงานเงินกู้และค่า หุ้น เดือนมีนาคม พ.ศ.2566', style: 'header' },
        '\n',
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
            body: [
              [{ text: 'หน่วยงาน', style: 'tableHeader', alignment: 'center' }, { text: 'รหัสพนักงาน', style: 'tableHeader', alignment: 'center' },
              { text: 'ชื่อ-สกุล', style: 'tableHeader', alignment: 'center' }, { text: 'ค่าหุ้น(งวดที่)', style: 'tableHeader', alignment: 'center' },
              { text: 'ค่าหุ้น(จํานวนเงิน)', style: 'tableHeader', alignment: 'center' }, { text: 'เงินกู้(งวดที่)', style: 'tableHeader', alignment: 'center' },
              { text: 'เงินกู้สามัญเงินต้น', style: 'tableHeader', alignment: 'center' }, { text: 'ดอกเบี้ย', style: 'tableHeader', alignment: 'center' },
              { text: 'รวมส่ง(เดือน)', style: 'tableHeader', alignment: 'center' }, { text: 'หุ้นสะสม', style: 'tableHeader', alignment: 'center' },
              ],
              ['klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk',],
              ['klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk',],
              ['klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk',],
              ['klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk', 'klk;lk',],
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
    if (mode === 'export') {
      pdf.open();
    } else {
      pdf.download('ประวัติการส่งหุ้น.pdf');
    }
  }

  async onPrintReceiptMakePdf() {
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
      info: {
        title: 'ใบเสร็จรับเงิน',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        {
          image: await this.getBase64ImageFromURL("../../assets/images/logo.png"),
          width: 100,
          height: 100,
          margin: [0, 0, 0, 0],
          alignment: 'center',

        },
        { text: 'กองทุนสวัสดิการพนักงานเทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'ใบเสร็จรับเงิน', style: 'header' },
        '\n',
        '\n',
        { text: ['ประจําเดือน ', { text: ' มีนาคม 2566               ', bold: true }, { text: 'เลขที่ ' }, { text: ' 00001 ', bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        { text: ['ได้รับเงินจาก ', { text: ' นายฉัตรชัย ตาเบอะ', bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        { text: ['สังกัด ', { text: ' แขวงกาวิละ', bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        { text: ['เลขที่สมาชิก ', { text: ' 05355', bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        { text: ['หุ้นสะสม ', { text: ' 3,000.00 ', bold: true }, { text: '  บาท' }], margin: [0, 6, 0, 0], style: 'texts' },
        '\n',
        {
          color: '#000',
          table: {
            widths: ['*', '*', '*', '*'],
            headerRows: 4,
            // keepWithHeaderRows: 1,
            body: [
              [{ text: 'รายการ', style: 'tableHeader' }, { text: 'งวด', style: 'tableHeader' }, { text: 'เป็นเงิน', style: 'tableHeader' }, { text: 'เงินต้นเหลือ', style: 'tableHeader' }],
              ['ค่าหุ้น', '3', '1000', ' '],
              ['เงินต้น', ' ', ' ', ' '],
              ['ดอก', ' ', ' ', ' '],
              //['รวมเงิน', {colSpan: 2, rowSpan: 2, text: '1000'}, ' '],
              //[{colSpan: 2, rowSpan: 2, text: 'รวมเงิน'}, '1000', '', ''],
              [{ text: 'รวมเงิน', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}, { text: '1000', style: 'tableHeader', alignment: 'left' }, {}],
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            }
          }
        },
        '\n',
        { text: '(หนึ่งพันบาทถ้วน)', style: 'header2', margin: [20, 0, 0, 0] },
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            headerRows: 2,
            body: [
              [{
                image: await this.getBase64ImageFromURL("../../assets/images/text1.png"), style: 'tableHeader',
                width: 150,
                height: 80,
                alignment: 'center'
              },
              {
                image: await this.getBase64ImageFromURL("../../assets/images/text2.png"), style: 'tableHeader',
                width: 150,
                height: 80,
                alignment: 'center'
              }],
              [{ text: 'ประธานกองทุน', style: 'tableHeader', alignment: 'center' }, { text: 'เหรัญญิก', style: 'tableHeader', alignment: 'center' }],
            ]
          },
          layout: 'noBorders'
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        header2: {
          fontSize: 18,
          bold: true,
        },
        texts: {
          fontSize: 16,
          bold: false,
        },
      },
      defaultStyle: {
        fontSize: 16,
        font: 'Sarabun',
      }
    }
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
    //pdf.download('ประวัติการส่งหุ้น.pdf');
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  onPrintTotal() {
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
      info: {
        title: 'สรุปยอดรวมต่างๆ',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'กองทุนสวัสดิการพนักงานและลูกจ้างเทศบาล', style: 'header' },
        { text: 'สรุปยอดรวมต่างๆ', style: 'header' },
        '\n',
        {
          text: ['วันที่ปริ้นเอกสารฉบับนี้: ', { text: '                ' + this.pipeDateTH() + '                                                          ', bold: false },
            { text: 'เดือน: ', bold: true }, { text: ' ' + this.month + ' ', bold: false }], bold: true, margin: [0, 6, 0, 0], style: 'texts'
        },
        {
          text: ['เวลาที่ปริ้นเอกสารฉบับนี้: ', { text: '             ' + this.time + '                                                                              ', bold: false },
            { text: 'ปี: ', bold: true }, { text: ' ' + this.year + ' ', bold: false }], bold: true, margin: [0, 6, 0, 0], style: 'texts'
        },
        '\n',
        '\n',
        '\n',
        {
          style: 'tableExample',
          table: {
            headerRows: 2,
            widths: ['*', '*'],
            body: [
              [{ text: 'สรุปยอดรวมประจําเดือน มีนาคม พ.ศ.2566', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
              // [{ text: 'Name', style: 'tableHeader' }, { text: 'Country', style: 'tableHeader' }],
              [{
                rowSpan: 1,
                text: ' จํานวนสมาชิกทั้งหมด \n\nจํานวนสมาชิกกู้เงินสามัญ \n\nยอดเงินกู้สามัญคงค้าง \n\nค่าหุ้นสะสมรวม\n\n'
              },
              {
                rowSpan: 1,
                text: ' 630     ราย \n\n462     ราย \n\n68,280,859.00    บาท \n\n110,207,860.00    บาท\n\n', alignment: 'right'
              }],
              [{
                rowSpan: 1,
                text: ' มูลค่าหุ้นที่ส่งเดือนนี้ \n\nดอกเบี้ยจากเงนิกู้สามัญ \n\nรวมส่งเงินต้นจากเงินกู้สามัญ \n\nรวมส่งเงินต้นจากเงินกู้สามัญ \n\n'
              },
              {
                rowSpan: 1,
                text: ' 1,332,030.00    บาท \n\n284,515.00    บาท \n\n1,378,989.00    บาท \n\n2,995,534.00    บาท \n\n', alignment: 'right'
              }],
              //[{ text: 'ประธานกองทุน', style: 'tableHeader', alignment: 'center' }, { text: 'เหรัญญิก', style: 'tableHeader', alignment: 'center' }],

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
          fontSize: 12,
          bold: true,
          alignment: 'center'
        },
        header2: {
          fontSize: 12,
          bold: true,
        },
        texts: {
          fontSize: 12,
          bold: false,
        },
      },
      defaultStyle: { // 4. default style 'KANIT' font to test
        fontSize: 12,
        font: 'Sarabun',
      }
    }
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();

  }

  onPrintInfoMember() {
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
      info: {
        title: 'ข้อมูลสมาชิก',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      background: function (currentPage, pageSize) {
        return [
          {
            canvas: [
              { type: 'line', x1: 25, y1: 25, x2: 570, y2: 25, lineWidth: 1 }, //Up line
              { type: 'line', x1: 25, y1: 25, x2: 25, y2: 780, lineWidth: 1 }, //Left line
              { type: 'line', x1: 25, y1: 780, x2: 570, y2: 780, lineWidth: 1 }, //Bottom line
              { type: 'line', x1: 570, y1: 25, x2: 570, y2: 780, lineWidth: 1 }, //Rigth line
              {
                type: 'line',
                x1: 25, y1: 360,
                x2: 570, y2: 360,
                lineWidth: 1
              }, //center
            ]

          }
        ]
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'ข้อมูลสมาชิก', style: 'header' },
        '\n',
        {
          text: ['หน้า 1                                                                                                    ',
            { text: ' เดือน        ', bold: true, },
            { text: ' มีนาคม       ', style: 'texts' }, { text: ' ปี         ', bold: true },
            { text: ' 2566        ', style: 'texts' }], margin: [0, 6, 0, 0]
        },
        { text: ['รหัสพนักงาน           ', { text: ' 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: ['ชื่อ-สกุล                   ', { text: ' 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: ['วันที่เป็นสมาชิก       ', { text: ' 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: ['หน่วยงาน                ', { text: ' 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: ['ประเภท                   ', { text: ' 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: ['ตําแหน่ง                   ', { text: ' 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: ['อัตราเงินเดือน         ', { text: ' 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: ['คํ้าประกันให้            ', { text: ' 1. ไม่มี ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: [' ', { text: ' 2. ไม่มี ', bold: false, style: 'texts' }], margin: [95, 6, 0, 0], bold: false },
        {
          text: ['ส่งค่าหุ้น\t\t\t\t  ', { text: ' 00000 ', bold: false, style: 'texts' },
            { text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tงวดที่ ', bold: false }, { text: '\t\t 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false
        },
        {
          text: ['หุ้นสะสม\t\t\t\t ', { text: ' 00000 ', bold: false, style: 'texts' },
            { text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tได้ปันผล ', bold: false }, { text: '\t00000 ' + '    บาท', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false
        },
        //<--------------------------------- center ---------------------------------> 
        '\n', '\n',
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'ข้อมูลสมาชิก', style: 'header' },
        '\n',
        {
          text: ['หน้า 2                                                                                                    ',
            { text: ' เดือน        ', bold: true, },
            { text: ' มีนาคม       ', style: 'texts' }, { text: ' ปี         ', bold: true },
            { text: ' 2566        ', style: 'texts' }], margin: [0, 6, 0, 0]
        },
        { text: ['รหัสพนักงาน           ', { text: ' 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: ['ชื่อ-สกุล                   ', { text: ' 00000 ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false },
        { text: 'ข้อมูลการกู้เงินสามัญ', style: 'header' },
        {
          text: ['กู้เงินจํานวน             ', { text: ' 00000 ', bold: false, style: 'texts' },
            { text: '                     บาท ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false
        },
        {
          text: ['ระยะเวลากู้              ', { text: ' 00000 ', bold: false, style: 'texts' },
            { text: '                     เดือน ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false
        },
        {
          text: ['อัตราดอกเบี้ย          ', { text: ' 00000 ', bold: false, style: 'texts' },
            { text: '                     เปอร์เซ็นต์ต่อปี ', bold: false, style: 'texts' }], margin: [0, 6, 0, 0], bold: false
        },
        // { text: ['วันที่เริ่มกู้          ', { text: ' - ', bold: false, style: 'texts'}, 
        // { text: '                     วันที่ทําสัญญา          ', bold: false}, { text: ' - ', bold: false, style: 'texts'}], margin: [0, 6, 0, 0], bold: false}, 
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: [90, 120, 80, 150],
            body: [
              [{ text: ' วันที่เริ่มกู้ ', color: 'black', }, { text: ' - ', color: 'gray', fillColor: '#fff' }, { text: ' วันที่ทําสัญญา ', color: 'black' }, { text: ' - ', color: 'gray' }],
              [{ text: ' เหตุผลการกู้ ', color: 'black', }, { text: ' - ', color: 'gray', fillColor: '#fff' }, { text: ' ', color: 'black' }, { text: ' ', color: 'gray' }],
              [{ text: ' ผู้คํ้าประกัน 1 ', color: 'black', }, { text: ' ไม่มี ', color: 'gray', fillColor: '#fff' }, { text: ' ', color: 'black' }, { text: ' ', color: 'gray' }],
              [{ text: ' ผู้คํ้าประกัน 2 ', color: 'black', }, { text: ' ไม่มี ', color: 'gray', fillColor: '#fff' }, { text: ' ', color: 'black' }, { text: ' ', color: 'gray' }],
              [{ text: ' ดอกเดือนนี้ ', color: 'black', }, { text: '  ' + '          บาท', color: 'gray', fillColor: '#fff' },
              { text: ' ต้นเดือนนี้ ', color: 'black', width: 150 }, { text: ' ' + '          บาท', color: 'gray' }],
              [{ text: ' เดือนสุดท้าย ', color: 'black', }, { text: '  ' + '          บาท', color: 'gray', fillColor: '#fff' },
              { text: ' เดือนสุดท้าย ', color: 'black', width: 150, }, { text: ' ' + '          บาท', color: 'gray' }],
              [{ text: ' ส่งงวดที่ ', color: 'black', }, { text: '  ', color: 'gray', fillColor: '#fff' }, { text: '  ', color: 'black' }, { text: '  ', color: 'gray' }],
              [{ text: ' ดอกรวมส่ง ', color: 'black', }, { text: '  ' + '          บาท', color: 'gray', fillColor: '#fff' },
              { text: ' ดอกคงค้าง ', color: 'black', width: 150 }, { text: ' ' + '          บาท', color: 'gray' }],
              [{ text: ' ต้นรวมส่ง ', color: 'black', }, { text: '  ' + '          บาท', color: 'gray', fillColor: '#fff' },
              { text: ' ต้นคงค้าง ', color: 'black', width: 150, }, { text: ' ' + '          บาท', color: 'gray' }],
            ]
          },
          layout: 'noBorders'
        },

      ],
      defaultStyle: {
        font: 'Sarabun',
      },
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
        },
        header2: {
          fontSize: 12,
          bold: true,
        },
        texts: {
          fontSize: 12,
          bold: false,
          color: '#555',
        },
      },
    }
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  }

}

