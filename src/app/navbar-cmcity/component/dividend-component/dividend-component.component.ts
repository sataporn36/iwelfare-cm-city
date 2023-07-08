import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'src/assets/custom-fonts.js'
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dividend-component',
  templateUrl: './dividend-component.component.html',
  styleUrls: ['./dividend-component.component.scss']
})
export class DividendComponentComponent implements OnInit {

  periodMonthDescOption: any = [];

  constructor(private service: MainService, private messageService: 
    MessageService, private localStorageService: LocalStorageService, 
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit() {
    this.setperiodMonthDescOption();
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

  formattedNumber2(number: any): any {
    const decimalPipe = new DecimalPipe('en-US');
    return number !== null ? decimalPipe.transform(number) : '';
  }


  // ปันผลสมาชิก
  async onMemberDividend(){
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
    this.pipeDateTH();

    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      info: {
        title: 'ใบเสร็จรับเงิน',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        {
          image: await this.getBase64ImageFromURL("../../assets/images/logo.png"),
          width: 80,
          height: 80,
          margin: [0, 0, 0, 0],
          alignment: 'left',

        },
        { text: 'รายการเงินปันผล และเงินเฉลี่ยคืน', style: 'header' },
        { text: 'กองทุนสวัสดิการพนักงานเทศบาลนครเชียงใหม่ ประจำปี ' + this.year, style: 'header' },
        '\n',
        '\n',
        { text: ['ประจําเดือน ', { text: ' ' + this.month + ' ' + this.year + '               ', bold: true }, { text: 'เลขที่ ' }, { text: ' 00001 ', bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        { text: ['ได้รับเงินจาก ', { text: ' ' + '', bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        { text: ['สังกัด ', { text: ' ' + '', bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        { text: ['เลขที่สมาชิก ', { text: ' ' + '', bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        { text: ['หุ้นสะสม ', { text: ' ' + '' + ' ', bold: true }, { text: '  บาท' }], margin: [0, 6, 0, 0], style: 'texts' },
        '\n',
        {
          color: '#000',
          table: {
            widths: ['*', '*', '*', '*'],
            headerRows: 4,
            // keepWithHeaderRows: 1, , alignment: 'right'
            body: [
              [{ text: 'รายการ', style: 'tableHeader' }, { text: 'งวด', style: 'tableHeader' }, { text: 'เป็นเงิน', style: 'tableHeader' }, { text: 'เงินต้นเหลือ', style: 'tableHeader' }],
              ['ค่าหุ้น', { text: '', alignment: 'right' }, { text: '', alignment: 'right' }, ' '],
              ['เงินต้น', { text: '' , alignment: 'right' }, { text: '', alignment: 'right' }
              , { text: '', alignment: 'right' }],
              ['ดอก', ' ', { text: '', alignment: 'right' }, ' '],
              //['รวมเงิน', {colSpan: 2, rowSpan: 2, text: '1000'}, ' '],
              //[{colSpan: 2, rowSpan: 2, text: 'รวมเงิน'}, '1000', '', ''],
              [{ text: 'รวมเงิน', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}, { text: '', style: 'tableHeader', alignment: 'right' }, {}],
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            }
          }
        },
        '\n',
        { text: "("+ this.transformPipeThai(10000) +")", style: 'header2', margin: [20, 0, 0, 0] },
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

  transformPipeThai(value: number): string {
    const digits = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
    
    let bahtText = '';
    const numString = value.toString();

    // Process each digit of the number
    for (let i = 0; i < numString.length; i++) {
      const digit = parseInt(numString.charAt(i));

      // Skip if the digit is zero
      if (digit === 0) {
        continue;
      }

      const position = positions[numString.length - i - 1];
      const digitText = digits[digit];

      // Append the digit and position to the Thai Baht text
      bahtText += digitText + position;
    }

    return bahtText + 'บาทถ้วน';
  }

  // ประกาศรวม
  getReportMergeAnnouncement(type: any){

  }

  // ประกาศแยก
  getReportSplitAnnouncement(type: any){
    
  }

}
