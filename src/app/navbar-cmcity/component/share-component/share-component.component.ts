import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Customer } from 'src/app/model/ccustomerTest';
import { MainService } from 'src/app/service/main.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
// import autoTable from 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import 'src/assets/fonts/Sarabun-Regular-normal.js';
import 'src/assets/fonts/Sarabun-Bold-bold.js';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface jsPDFCustom extends jsPDF {
    // lineHeightProportion: number;
    // unit: string;
    // orientation: string;
    // lineHeight: number;
    // format: 'a4';
    //orientation: 'portrait', unit: 'in', lineHeight: 2 
    autoTable: (options: UserOptions) => void;
}


@Component({
  selector: 'app-share-component',
  templateUrl: './share-component.component.html',
  styleUrls: ['./share-component.component.scss']
})
export class ShareComponentComponent implements OnInit{

  @ViewChild('content', {static:false}) el!:ElementRef;
  customers!: Customer[];
  info: any[] = [];
  infoReceipt: any[] = [];
  infoReceiptTotal: any[] = [];
  loading!: boolean;
  totalRecords!: number;
  clonedProducts: { [s: number]: Customer } = {};
  formModel!: FormGroup;
  formModelStock!: FormGroup;
  displayModal: boolean = false;

  constructor(private customerService: MainService, private messageService: MessageService) {}

  ngOnInit() {
      this.customerService.getCustomers().subscribe((res) =>{
        console.log(res,"<==== res");
        this.customers = res.customers;
      })
      this.loading = true;
      this.initMainForm();
      this.initMainFormStock();
  }

  initMainForm() {
    this.formModel = new FormGroup({
      fullName: new FormControl(null),
    });;
  }

  initMainFormStock() {
    this.formModelStock = new FormGroup({
      monthlyStockMoney: new FormControl(null, Validators.required),
    });;
  }

  onSearchMember(){
    const data = this.formModel.getRawValue();
    // api search member
  }

  loadCustomers(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
      this.customerService.getCustomers({ lazyEvent: JSON.stringify(event) }).subscribe((res) =>{
        console.log(res,"<==== res");
        //this.customers = res.customers;
        this.totalRecords = res.totalRecords;
        this.loading = false;
      })
    }, 1000);
 }

  generatePDF(){
       let pdf = new jsPDF('p','pt','a4');
       pdf.html(this.el.nativeElement, {
          callback: (pdf) => {
              pdf.output("dataurlnewwindow");
          },
       })
  }

  convertToPDF(){
    html2canvas(document.getElementById("contentTable")!).then(canvas => {
    // Few necessary setting options
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    var width = pdf.internal.pageSize.getWidth();
    var height = canvas.height * width / canvas.width;
    pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)
    pdf.save('output.pdf'); // Generated PDF
    });
  }

  exportPDF(){
    this.customers?.forEach((element,index,array) =>{
      this.info.push([element.name,element.country?.name,element.company,element.representative?.name]);
    })
    
    const pdf = new jsPDF() as jsPDFCustom;
    pdf.setProperties({
      title: 'ประวัติการส่งหุ้น'
    });
    pdf.setFont('Sarabun-Regular');
    pdf.setFontSize(14);
    pdf.text(" ประวัติการส่งหุ้น ( Stock History) ",70,10);
    //autoTable(pdf, { html: '#contentTable' });
    pdf.autoTable({ 
      //styles : { halign : 'center'},
      headStyles:{fillColor : [160, 160, 160]},
      theme: 'grid',
      head: [['Name','Country','Company','Representative']],
      body: this.info,
    })
    pdf.output("dataurlnewwindow",{filename: "ประวัติการส่งหุ้น"});
    //pdf.save('test.pdf');

  }

  downloadPDF(){
    this.customers?.forEach((element,index,array) =>{
      this.info.push([element.name,element.country?.name,element.company,element.representative?.name]);
    })
    
    const pdf = new jsPDF() as jsPDFCustom;
    pdf.setFont('Sarabun-Regular');
    pdf.setFontSize(14);
    pdf.text(" ประวัติการส่งหุ้น ( Stock History) ",70,10);
    //autoTable(pdf, { html: '#contentTable' });
    pdf.autoTable({ 
      //styles : { halign : 'center'},
      headStyles:{fillColor : [160, 160, 160]},
      theme: 'grid',
      head: [['Name','Country','Company','Representative']],
      body: this.info,
    })
    //pdf.output("dataurlnewwindow");
    pdf.save('ประวัติการส่งหุ้น.pdf');

  }

  onRowEditInit(product: Customer) {
    this.clonedProducts[product.id!] = { ...product };
  }
  

  onPrintReceipt(){
    this.infoReceipt.push(['ค่าหุ้น','3','1,000.00',' ']);
    this.infoReceipt.push(['เงินต้น',' ',' ',' ']);
    this.infoReceipt.push(['ดอก',' ',' ',' ']);
    this.infoReceipt.push(['','รวมเงิน','1,000.00',' ']);
    var img = new Image();
    img.src = 'assets/images/logo.png';

    var img1 = new Image();
    img1.src = 'assets/images/text1.png';

    var img2 = new Image();
    img2.src = 'assets/images/text2.png';

    //const textin1 = "ประจําเดือน " + " มีนาคม 2566 " + "            เลขที่่ " + " 00001";
    const textin2 = "ได้รับเงินจาก " + " นายฉัตรชัย ตาเบอะ";
    const textin3 = "สังกัด " + " แขวงกาวิละ";
    const textin4 = "เลขที่สมาชิก " + " 05355";
    const textin5 = "หุ้นสะสม " + " 3,000.00 " + " บาท";

    const pdf = new jsPDF() as jsPDFCustom;
    pdf.setProperties({
      title: 'ใบเสร็จรับเงิน'
    });
    // let width = pdf.internal.pageSize.getWidth();
    //let height = pdf.internal.pageSize.getHeight();
    //pdf.setLineHeightFactor(50);
    pdf.getTextWidth("20");
    pdf.addImage(img,'png', 83, 10, 40, 40);
    pdf.setFont('Sarabun-Regular');
    pdf.setFontSize(16);
    pdf.text(" กองทุนสวัสดิการพนักงานเทศบาลนครเชียงใหม่ ",52,60,{renderingMode:'fillThenStroke'}); 
    pdf.text(" ใบเสร็จรับเงิน \n ",86,70,{renderingMode:'fillThenStroke'});
    pdf.setFont('Sarabun-Regular');
    pdf.setFontSize(14);
    pdf.text("ประจําเดือน",15,90); 
    pdf.text("มีนาคม 2566",45,90,{renderingMode:'fillThenStroke'}); 
    pdf.text("เลขที่",85,90); 
    pdf.text("00001",100,90,{renderingMode:'fillThenStroke'}); 
    pdf.text("ได้รับเงินจาก",15,100); 
    pdf.text("นายฉัตรชัย ตาเบอะ",45,100,{renderingMode:'fillThenStroke'}); 
    pdf.text("สังกัด",15,110); 
    pdf.text("แขวงกาวิละ",30,110,{renderingMode:'fillThenStroke'}); 
    pdf.text("เลขที่สมาชิก",15,120); 
    pdf.text("05355",45,120,{renderingMode:'fillThenStroke'}); 
    pdf.text("หุ้นสะสม",15,130); 
    pdf.text("3,000.00",38,130,{renderingMode:'fillThenStroke'}); 
    pdf.text("บาท",63,130); 
    //pdf.text(" \n\n\n\n ",0,0);
    pdf.autoTable({ 
      styles : {font : 'Sarabun-Regular', fontSize : 14},
      margin: {top: 135, bottom: 0},
      headStyles:{fillColor : [160, 160, 160]},
      theme: 'grid',   
      head: [['รายการ','งวด','เป็นเงิน','เงินต้นเหลือ']],
      body: this.infoReceipt,
    });
    pdf.text(" (หนึ่งพันบาทถ้วน) ",20,190); 
    pdf.text(" \n\n\n\n\n\n\n\n ",0,0);
    pdf.addImage(img1,'png', 36, 200, 40, 40);
    pdf.addImage(img1,'png', 132, 200, 40, 40);
    pdf.text(" ประธานกองทุน " + "                                                        " + " เหรัญญิก ",40,245); 
    // pdf.setLanguage('th');

    // var fontSize = 16;
    // var offsetY = 10.797777777777778;
    // var lineHeight = 15.49111111111111;
    
    // pdf.setFontSize(fontSize);
    
    // pdf.text('วันที่ 1',10, 10 + lineHeight * 0 + offsetY);
    // pdf.text('วันที่ 3',10, 10 + lineHeight * 1 + offsetY);
    // pdf.text('วันที่ 2',10, 10 + lineHeight * 2 + offsetY);

    // var dim = pdf.getTextDimensions('Text');
    // console.log(dim); 
  

    pdf.output("dataurlnewwindow",{filename: "ใบเสร็จรับเงิน"});
    this.infoReceipt = [];
    
  }

  onRowEditSave(product: Customer) {
      if (product.name === 'hello') {
          delete this.clonedProducts[product.id!];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
      } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
      }
  }

  onRowEditCancel(product: Customer, index: number) {
      this.customers[index] = this.clonedProducts[product.id!];
      delete this.clonedProducts[product.id!];
  }

  updateStocktoMonth(){
    this.displayModal = true;
  }

  onupdateStockToMonth(){
        // api update stock to everyone 
  }

  onCancle(){
    this.formModelStock.reset();
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

}

