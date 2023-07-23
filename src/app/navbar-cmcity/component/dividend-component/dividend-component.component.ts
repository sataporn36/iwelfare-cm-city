import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'src/assets/custom-fonts.js'
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dividend-component',
  templateUrl: './dividend-component.component.html',
  styleUrls: ['./dividend-component.component.scss']
})
export class DividendComponentComponent implements OnInit {

  loading!: boolean;
  loadingAll!: boolean;
  periodMonthDescOption: any = [];
  dataDividendDetail!: any[];
  dataDividendDetailAll!: any[];
  userId: any;
  empDetail: any;
  admin!: boolean;
  displayModalDividend: boolean = false;
  formModelDividend!: FormGroup;
  inputSubject = new Subject<string>();
  stockDevidendPercent: any;
  interestDevidendPercent: any;
  configAdmin: any;
  profileImgId: any;
  imageSrc: SafeUrl;
  imageBlob1: Blob;
  imageBlob2: Blob;
  imageSrc1: SafeUrl;
  imageSrc2: SafeUrl;
  fileImg1: any;
  fileImg2: any;
  imageSrc1Blob: any;
  imageSrc2Blob: any;

  constructor(private service: MainService, private messageService: 
    MessageService, private localStorageService: LocalStorageService, 
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit() {
    this.getconfigList();
    this.initMainFormDividend();
    this.setperiodMonthDescOption();
    this.loading = true;
    this.loadingAll = true;
    this.pipeDateTH();
    this.userId = this.localStorageService.retrieve('empId');
    this.empDetail = this.localStorageService.retrieve('employeeofmain');
    if (this.userId === 1 || this.userId === 631) {
      this.admin = true;
    }
    this.inputSubject.pipe(debounceTime(1000)).subscribe(value => {
      // Perform your action here based on the latest value
      if(value.length >= 0){
        
      }else{
        this.formModelDividend.reset();
      }
    });

  }

  getconfigList(){
    this.service.getConfigByList().subscribe((res) =>{
      if(res){
        this.configAdmin = res;
        this.fileImg1 = res[3].configId;
        this.fileImg2 = res[4].configId;
        this.formModelDividend.patchValue({
          stockDevidend: Number(res[1].value),
          interestDevidend: Number(res[2].value)
        });
        this.stockDevidendPercent = Number(res[1].value);
        this.interestDevidendPercent = Number(res[2].value);
      }
      this.getDataDividendDetail();
      this.getDataDividendDetailAll();
    });
  }

  getImgSig1(dataImg: any, id: any){
    if(id !== null || id){
      this.getImage(id,1,dataImg);
    }else{
      this.imageSrc1Blob = this.profileImg(dataImg);
    }
  }

  getImgSig2(dataImg: any, id: any){
    if(id !== null || id){
      this.getImage(id,2,dataImg);
    }else{
      this.imageSrc2Blob = this.profileImg(dataImg);
    }
  }

  profileImg(dataImg: any) {
    let textImg = '';
    switch (dataImg) {
        case 'signature1':
          textImg = "../../assets/images/text1.png";
          break;
        case 'signature2':
          textImg = "../../assets/images/text2.png";
          break;
        default:
          break;
    }
    return textImg;
  }

  getImage(id: any,imageSrc: any,dataImg: any) {
    console.log(id,',---  this.imageSrc1   idididid');
    console.log(dataImg,',---  dataImg');
    if (id != 0 || id != null) {
      this.service.getImageConfig(id).subscribe(
        (imageBlob: Blob) => {
          if(imageSrc === 1){
            this.imageSrc1Blob = URL.createObjectURL(imageBlob);
            console.log(this.imageSrc1Blob,',---  this.imageSrc1');
          }else{
            this.imageSrc2Blob = URL.createObjectURL(imageBlob);
            console.log(this.imageSrc2Blob,',---  this.imageSrc2');
          }
        },
        (error: any) => {
          if(imageSrc === 1){
            this.imageSrc1Blob =  this.profileImg(dataImg);
          }else{
            this.imageSrc2Blob =  this.profileImg(dataImg);
          }
          console.error('Failed to fetch image:', error);
        }
      );
    }
  }

  checkSetDividend(res: any){
    const dividendDetail = res;
    const dataSplitAnnouncement = this.checkListDataPDFSplitAnnouncement(dividendDetail);
    const totalInterestDividends = this.totalInterestDividend;
    this.formModelDividend.get('allotmentAmount').disable();
    this.formModelDividend.get('balance').disable();
    this.formModelDividend.get('allotmentAmount').setValue(this.formattedNumber2(totalInterestDividends));
  }

  initMainFormDividend() {
    this.formModelDividend = new FormGroup({
      stockDevidend: new FormControl(null, Validators.required),
      interestDevidend: new FormControl(null, Validators.required),
      amountRequired: new FormControl(null, Validators.required),
      allotmentAmount: new FormControl(null),
      balance: new FormControl(null),
    });
    // this.formModelDividend.patchValue({
    //   stockDevidend: this.stockDevidendPercent,
    //   interestDevidend: this.interestDevidendPercent
    // });
  }

  checkSetValueEmp(event: any){
    this.inputSubject.next(event.target.value);
  }


  getDataDividendDetail(){
     const data = this.formModelDividend.getRawValue();
     const payload = {
      empCode: this.empDetail.employeeCode,
      yearCurrent: this.year,
      yearOld: this.year - 1,
      stockDividendPercent: data.stockDevidend ? data.stockDevidend : this.stockDevidendPercent,
      interestDividendPercent: data.interestDevidend ? data.interestDevidend :  this.interestDevidendPercent
     }
     this.service.calculateStockDividend(payload).subscribe((res) => {
        if(res){
           this.dataDividendDetail = res;
           this.loading = false;
        }
     });
  }

  getDataDividendDetailAll(){
    const data = this.formModelDividend.getRawValue();
    const payload = {
      empCode: null,
      yearCurrent: this.year,
      yearOld: this.year - 1,
      stockDividendPercent: data.stockDevidend ? data.stockDevidend : this.stockDevidendPercent,
      interestDividendPercent: data.interestDevidend ? data.interestDevidend :  this.interestDevidendPercent
     }
     this.service.calculateStockDividend(payload).subscribe((res) => {
        if(res){
           this.dataDividendDetailAll = res;
           this.loadingAll = false;
          //  this.checkSetDividend(res);
          //  this.displayModalDividend = true;
        }
     });
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
  dateTime: any;
  pipeDateTH() {
    const format = new Date();
    const day = format.getDate().toString().padStart(2, '0');
    const month = format.getMonth();
    const year = format.getFullYear() + 543;
    this.year = year;
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    const time = this.addLeadingZero(format.getHours()) + ':' + this.addLeadingZero(format.getMinutes()) + ' น.';
    this.time = time;
    this.dateTime = day + '/' + monthSelect.value + '/' + year + ' ' + this.time;
    return day + ' ' + monthSelect.label + ' ' + year
  }

  addLeadingZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  formattedNumber2(number: any): any {
    const decimalPipe = new DecimalPipe('en-US');
    return number !== null ? decimalPipe.transform(number) : '';
  }

  showWarnNull() {
    this.messageService.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'ไม่พบข้อมูลเงินปันผล' });
  }

  async checkLoadImg() {
      await Promise.all([
        this.getImgSig1('signature1', this.fileImg1),
        await new Promise((resolve) => setTimeout(resolve, 500)),
        this.getImgSig2('signature2', this.fileImg2)
      ]);
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.onMemberDividend();
  }

  // ปันผลสมาชิก
  async onMemberDividend(){
    const data = this.dataDividendDetail[0];
    if (data == null) {
      this.showWarnNull();
    }

    const fullName = data.fullName;
    const empCode = data.employeeCode;
    const stockAccumulate = data.stockAccumulate ? data.stockAccumulate : ' ';
    const departmentName = data.departmentName ? data.departmentName : ' ';
    const stockDividend = data.stockDividend ? data.stockDividend : ' ';
    const cumulativeInterest = data.cumulativeInterest ? data.cumulativeInterest : ' ';
    const interestDividend = data.interestDividend ? data.interestDividend : ' ';
    const totalDividend = data.totalDividend ? data.totalDividend : ' ';

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
        title: 'ใบเสร็จปันผลสมาชิกทั่วไป',
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
        '\n',
        { text: 'กองทุนสวัสดิการพนักงานเทศบาลนครเชียงใหม่ ประจำปี ' + this.year, style: 'header' },
        '\n',
        { text: ['ชื่อ-สกุล ', { text: fullName + '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'}, { text: 'รหัสพนักงาน '}, { text: empCode , bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        { text: ['สังกัด ', { text: departmentName , bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        '\n',
        {
          color: '#000',
          table: {
            widths: ['*', '*', '*'],
            headerRows: 3,
            // keepWithHeaderRows: 1, , alignment: 'right'
            body: [
              [ { text:'อัตราเงินปันผล ร้อยละ 4.40', alignment: 'left' , margin: [4, 6, 6, 6]}, { text: 'ทุนเรือนหุ้น  ' + this.formattedNumber2(stockAccumulate) + '  บาท', alignment: 'left' , margin: [4, 6, 6, 6]}, 
              { text: 'เงินปันผล  ' + this.formattedNumber2(stockDividend) + '  บาท', alignment: 'left' , margin: [4, 6, 6, 6]}],
              [ { text:'อัตราเงินเฉลี่ยคืน ร้อยละ 14.24', alignment: 'left' , margin: [4, 6, 6, 6]}, { text: 'ดอกเบี้ยสะสม  ' + this.formattedNumber2(cumulativeInterest) + '  บาท' , alignment: 'left' , margin: [4, 6, 6, 6]}, 
              { text: 'เงินเฉลี่ยคืน  ' + this.formattedNumber2(interestDividend) + '  บาท', alignment: 'left' , margin: [4, 6, 6, 6]}],
              [{ text: 'รวมเงิน', bold: true , style: 'tableHeader', colSpan: 2, alignment: 'center' , margin: [4, 6, 6, 6]},{},
              { text: this.formattedNumber2(totalDividend) + '  บาท', style: 'tableHeader', alignment: 'left' , margin: [4, 6, 6, 6]}],
              [{ text: "("+ this.transformPipeThai(totalDividend) +")", bold: true , style: 'tableHeader', colSpan: 3, alignment: 'center' , margin: [4, 6, 6, 6]},{},{}],
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#FFFFFF' : null;
            }
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            headerRows: 2,
            body: [
              [{
                image: await this.getBase64ImageFromURL(this.imageSrc1Blob), style: 'tableHeader',
                width: 150,
                height: 80,
                alignment: 'center'
              },
              {
                image: await this.getBase64ImageFromURL(this.imageSrc2Blob), style: 'tableHeader',
                width: 150,
                height: 80,
                alignment: 'center'
              }],
              [{ text: 'ประธานกองทุน', style: 'tableHeader', alignment: 'center' }, { text: 'เหรัญญิก', style: 'tableHeader', alignment: 'center' }],
            ]
          },
          layout: 'noBorders'
        },
        '\n',
        { text: ['พิมพ์เมื่อวันที่ ' + this.dateTime], margin: [0, 0, 0, 0], style: 'texts2' , alignment: 'right'},
      ],
      styles: {
        header: {
          fontSize: 20,
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
        texts2: {
          fontSize: 14,
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

  totalDividendMerge: any;
  checkListDataPDFMergeAnnouncement(list: any[]) {
    const decimalPipe = new DecimalPipe('en-US');
    let sumdivident = 0;
    if (list.length > 0) {
      // let datalListGroup;
      let datalListGroup = list.map(function (item,index) {
        sumdivident += item.stockDividend ? Number(item.stockDividend) : 0;
        return [
          { text: index + 1, alignment: 'center' },
          { text: item.departmentName, alignment: 'left' },
          { text: item.employeeCode, alignment: 'center' },
          { text: item.fullName, alignment: 'left' },
          { text: item.bankAccountReceivingNumber, alignment: 'center' },
          { text: decimalPipe.transform(item.stockDividend ? Number(item.stockDividend) : 0), alignment: 'right' },
        ]
      });
      this.totalDividendMerge = sumdivident;
      return datalListGroup;
    } else {
      return '';
    }
  }

  // ประกาศรวม
  chackReportMergeAnnouncement(mode: any){
     const data =this.formModelDividend.getRawValue();
     if(data.stockDevidend && data.interestDevidend){
        this.getReportMergeAnnouncement(mode,data);
     }else{
        this.showWarn1();
     }
  }

  getReportMergeAnnouncement(mode: any,data: any){
    this.getDataDividendDetailAll();
    this.showWarn();
    this.pipeDateTH();
    const dividendDetail = this.dataDividendDetailAll;
    const dataMergeAnnouncemen = this.checkListDataPDFMergeAnnouncement(dividendDetail);
    const totalDividendMerges = this.totalDividendMerge;
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
      pageSize: 'A4',
      //pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      info: {
        title: 'รายงาน(ประกาศรวม)',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        //{ text: 'รายงานเงินกู้และค่าหุ้น เดือน'+this.month+' พ.ศ.'+this.year, style: 'header' },
        { text: 'รายงานเงินปันผล พ.ศ. ' + this.year, style: 'header' },
        '\n',
        {
          style: 'tableExample',
          // alignment: 'right',
          fontSize: 10,
          table: {
            headerRows: 1,
            widths: [50,110,70,120,80,70],
            body: [
              [{ text: 'ลําดับ', style: 'tableHeader', alignment: 'center' }, { text: 'หน่วยงาน', style: 'tableHeader', alignment: 'center' },
              { text: 'รหัสพนักงาน', style: 'tableHeader', alignment: 'center' }, { text: 'ชื่อพนักงาน', style: 'tableHeader', alignment: 'center' },
              { text: 'เลขบัญชีธนาคาร', style: 'tableHeader', alignment: 'center' }, { text: 'รวมปันผล', style: 'tableHeader', alignment: 'center' },
              ],
              ...dataMergeAnnouncemen,
              [{ text:' รวม ', colSpan: 4, alignment: 'center', bold: true }, {}, {}, {},{},
              { text: this.formattedNumber2(totalDividendMerges), alignment: 'right' },
              ],
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
          fontSize: 10,
          bold: 200,
          alignment: 'center'
        },
      },
      defaultStyle: { // 4. default style 'KANIT' font to test
        fontSize: 10,
        font: 'Sarabun',
      }
    }
    const pdf = pdfMake.createPdf(docDefinition);
    if (mode === 'export') {
      pdf.open();
    } else {
      pdf.download('รายงาน(ประกาศรวม).pdf');
    }
  }

  totalStockAccumulate: any;
  totalStockDividend: any;
  totalCumulativeInterest: any;
  totalInterestDividend: any;
  totalDividendSplit: any;
  checkListDataPDFSplitAnnouncement(list: any[]) {
    const decimalPipe = new DecimalPipe('en-US');
    let sumStockAccumulate = 0;
    let sumStockDividend = 0;
    let sumCumulativeInterest = 0;
    let sumInterestDividend = 0;
    let sumTotalDividend = 0;
    if (list.length > 0) {
      // let datalListGroup;
      let datalListGroup = list.map(function (item,index) {
        sumStockAccumulate += item.stockAccumulate ? Number(item.stockAccumulate) : 0;
        sumStockDividend += item.stockDividend ? Number(item.stockDividend) : 0;
        sumCumulativeInterest += item.cumulativeInterest ? Number(item.cumulativeInterest) : 0;
        sumInterestDividend += item.interestDividend ? Number(item.interestDividend) : 0;
        sumTotalDividend += item.totalDividend ? Number(item.totalDividend) : 0;
        return [
          { text: index + 1, alignment: 'center' },
          { text: item.departmentName, alignment: 'left' },
          { text: item.employeeCode, alignment: 'center' },
          { text: item.fullName, alignment: 'left' },
          { text: item.bankAccountReceivingNumber, alignment: 'center' },
          { text: decimalPipe.transform(item.stockAccumulate ? Number(item.stockAccumulate) : 0), alignment: 'right' },
          { text: decimalPipe.transform(item.stockDividend ? Number(item.stockDividend) : 0), alignment: 'right' },
          { text: decimalPipe.transform(item.cumulativeInterest ? Number(item.cumulativeInterest) : 0), alignment: 'right' },
          { text: decimalPipe.transform(item.interestDividend ? Number(item.interestDividend) : 0), alignment: 'right' },
          { text: decimalPipe.transform(item.totalDividend ? Number(item.totalDividend) : 0), alignment: 'right' },
          { text: ' ', alignment: 'right' },
        ]
      });
      this.totalStockAccumulate = sumStockAccumulate;
      this.totalStockDividend = sumStockDividend;
      this.totalCumulativeInterest = sumCumulativeInterest;
      this.totalInterestDividend = sumInterestDividend;
      this.totalDividendSplit = sumTotalDividend;
      return datalListGroup;
    } else {
      return '';
    }
  }

  // ประกาศแยก
  chackReportSplitAnnouncement(mode: any){
    const data =this.formModelDividend.getRawValue();
    if(data.stockDevidend && data.interestDevidend){
       this.getReportSplitAnnouncement(mode);
    }else{
       this.showWarn1();
    }
  }

  getReportSplitAnnouncement(mode: any){
    this.getDataDividendDetailAll();
    this.showWarn();
    this.pipeDateTH();
    const dividendDetail = this.dataDividendDetailAll;
    const dataSplitAnnouncement = this.checkListDataPDFSplitAnnouncement(dividendDetail);
    const totalStockAccumulates = this.totalStockAccumulate;
    const totalStockDividends = this.totalStockDividend;
    const totalCumulativeInterests = this.totalCumulativeInterest;
    const totalInterestDividends = this.totalInterestDividend;
    const totalDividendSplits = this.totalDividendSplit;

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
        title: 'รายงาน(ประกาศแยก)',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        //{ text: 'รายงานเงินกู้และค่าหุ้น เดือน'+this.month+' พ.ศ.'+this.year, style: 'header' },
        { text: 'รายงานเงินปันผล พ.ศ. ' + this.year, style: 'header' },
        '\n',
        {
          style: 'tableExample',
          // alignment: 'right',
          fontSize: 12,
          table: {
            headerRows: 1,
            widths: [60,160,80,120,100,100,85,85,85,85,85],
            body: [
               [{ text: 'ลําดับ', style: 'tableHeader', alignment: 'center',margin: [0, 3, 0, 0] }, { text: 'หน่วยงาน', style: 'tableHeader', alignment: 'center',margin: [0, 3, 0, 0] },
              { text: 'รหัสพนักงาน', style: 'tableHeader', alignment: 'center',margin: [0, 3, 0, 0] }, { text: 'ชื่อพนักงาน', style: 'tableHeader', alignment: 'center',margin: [0, 3, 0, 0] },
              { text: 'เลขบัญชีธนาคาร', style: 'tableHeader', alignment: 'center',margin: [0, 3, 0, 0] }, { text: 'ค่าหุ้นสะสม', style: 'tableHeader', alignment: 'center',margin: [0, 3, 0, 0] },
              { text: 'ปันผลหุ้น \n ' + this.stockDevidendPercent + '%', style: 'tableHeader', alignment: 'center' }, { text: 'ดอกเบี้ยสะสม', style: 'tableHeader', alignment: 'center',margin: [0, 3, 0, 0] },
              { text: 'ปันผลดอกเบี้ย \n ' + this.interestDevidendPercent + '%', style: 'tableHeader', alignment: 'center' }, { text: 'รวมปันผล', style: 'tableHeader', alignment: 'center',margin: [0, 3, 0, 0] },
              { text: 'ผู้รับเงิน', style: 'tableHeader', alignment: 'center',margin: [0, 3, 0, 0] },
              ],
              // [{ text: 'ลําดับ', style: 'tableHeader', alignment: 'center',rowSpan: 2,margin: [0, 3, 0, 0] }, { text: 'หน่วยงาน', style: 'tableHeader', alignment: 'center',rowSpan: 2,margin: [0, 3, 0, 0] },
              // { text: 'รหัสพนักงาน', style: 'tableHeader', alignment: 'center',rowSpan: 2,margin: [0, 3, 0, 0] }, { text: 'ชื่อพนักงาน', style: 'tableHeader', alignment: 'center',rowSpan: 2,margin: [0, 3, 0, 0] },
              // { text: 'เลขบัญชีธนาคาร', style: 'tableHeader', alignment: 'center',rowSpan: 2,margin: [0, 3, 0, 0] }, { text: 'ค่าหุ้นสะสม', style: 'tableHeader', alignment: 'center',rowSpan: 2,margin: [0, 3, 0, 0] },
              // { text: 'ปันผลหุ้น', style: 'tableHeader', alignment: 'center' }, { text: 'ดอกเบี้ยสะสม', style: 'tableHeader', alignment: 'center',rowSpan: 2,margin: [0, 3, 0, 0] },
              // { text: 'ปันผลดอกเบี้ย', style: 'tableHeader', alignment: 'center' }, { text: 'รวมปันผล', style: 'tableHeader', alignment: 'center',rowSpan: 2,margin: [0, 3, 0, 0] },
              // { text: 'ผู้รับเงิน', style: 'tableHeader', alignment: 'center',rowSpan: 2,margin: [0, 3, 0, 0] },
              // ],
              // [{ text: ' ', style: 'tableHeader', alignment: 'center' }, { text: ' ', style: 'tableHeader', alignment: 'center' },
              // { text: ' ', style: 'tableHeader', alignment: 'center' }, { text: ' ', style: 'tableHeader', alignment: 'center' },
              // { text: ' ', style: 'tableHeader', alignment: 'center' }, { text: ' ', style: 'tableHeader', alignment: 'center' },
              // { text: this.stockDevidendPercent + '%', style: 'tableHeader', alignment: 'right' }, { text: ' ', style: 'tableHeader', alignment: 'center' },
              // { text: this.interestDevidendPercent+ '%', style: 'tableHeader', alignment: 'right' }, { text: ' ', style: 'tableHeader', alignment: 'center' },
              // { text: ' ', style: 'tableHeader', alignment: 'center' },
              // ],
              ...dataSplitAnnouncement,
              [{ text:' รวม ', colSpan: 4, alignment: 'center', bold: true }, {}, {}, {},{},
              { text: this.formattedNumber2(totalStockAccumulates), alignment: 'right' },
              { text: this.formattedNumber2(totalStockDividends), alignment: 'right' },
              { text: this.formattedNumber2(totalCumulativeInterests), alignment: 'right' },
              { text: this.formattedNumber2(totalInterestDividends), alignment: 'right' },
              { text: this.formattedNumber2(totalDividendSplits), alignment: 'right' },
              { text: '', alignment: 'right' },
              ],
            ]
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              // if(rowIndex === 0 || rowIndex === 1){
              //   return '#CCCCCC';
              // }else{
              //   return null;
              // }
              return (rowIndex === 0) ? '#CCCCCC' : null
            }
          }
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: 200,
          alignment: 'center'
        },
      },
      defaultStyle: { // 4. default style 'KANIT' font to test
        fontSize: 12,
        font: 'Sarabun',
      }
    }
    const pdf = pdfMake.createPdf(docDefinition);
    if (mode === 'export') {
      pdf.open();
    } else {
      pdf.download('รายงาน(ประกาศแยก).pdf');
    }
  }

  calculateDividend(){
     const data = this.formModelDividend.getRawValue();
     const valueParse = data.allotmentAmount.replace(',','');
     const sumPaymentDividend = data.amountRequired - Number(valueParse);
     this.formModelDividend.get('balance').setValue(this.formattedNumber2(sumPaymentDividend));
  }

  onCancleDividend(){
     this.displayModalDividend = false;
  }

  setDividend(){
    const dividendDetail = this.dataDividendDetailAll;
    const dataSplitAnnouncement = this.checkListDataPDFSplitAnnouncement(dividendDetail);
    const totalInterestDividends = this.totalInterestDividend;
    this.formModelDividend.get('allotmentAmount').disable();
    this.formModelDividend.get('balance').disable();
    this.formModelDividend.get('allotmentAmount').setValue(this.formattedNumber2(totalInterestDividends));
    this.formModelDividend.get('stockDevidend').setValue(this.stockDevidendPercent);
    this.formModelDividend.get('interestDevidend').setValue(this. interestDevidendPercent);
    this.displayModalDividend = true;
  }

  clearDividend(){
    this.formModelDividend.reset();
    const dividendDetail = this.dataDividendDetailAll;
    const dataSplitAnnouncement = this.checkListDataPDFSplitAnnouncement(dividendDetail);
    const totalInterestDividends = this.totalInterestDividend;
    this.formModelDividend.get('allotmentAmount').disable();
    this.formModelDividend.get('balance').disable();
    this.formModelDividend.get('allotmentAmount').setValue(this.formattedNumber2(totalInterestDividends));
    this.formModelDividend.get('stockDevidend').setValue(this.stockDevidendPercent);
    this.formModelDividend.get('interestDevidend').setValue(this. interestDevidendPercent);
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'โปรดรอสักครู่ PDF อาจใช้เวลาในการเเสดงข้อมูล ประมาณ 1-5 นาที' });
  }

  showWarn1() {
    this.messageService.add({ severity: 'warn', summary: 'แจ้งเตือน', detail: 'กรุณากำหนดอัตราปันผลหุ้น' });
  }
  

}
