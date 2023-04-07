import { Component } from '@angular/core';
import { Customer } from 'src/app/model/ccustomerTest';
import { MainService } from 'src/app/service/main.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import 'src/assets/fonts/Sarabun-Regular-normal.js'
import 'src/assets/fonts/Sarabun-Bold-bold.js'
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface jsPDFCustom extends jsPDF {
    autoTable: (options: UserOptions) => void;
}

@Component({
  selector: 'app-loan-component',
  templateUrl: './loan-component.component.html',
  styleUrls: ['./loan-component.component.scss']
})
export class LoanComponentComponent {
  customers!: Customer[];
  info: any[] = [];
  loading!: boolean;
  totalRecords!: number;
  clonedProducts: { [s: number]: Customer } = {};
  formModel!: FormGroup;
  formModelLoan!: FormGroup;
  displayModal: boolean = false;

  constructor(private customerService: MainService, private messageService: MessageService,  private confirmationService: ConfirmationService,) {}

  ngOnInit() {
      this.customerService.getCustomers().subscribe((res) =>{
        console.log(res,"<==== res");
        this.customers = res.customers;
      })
      this.loading = true;
      this.initMainFormStock();
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

  exportPDF(){
    this.customers?.forEach((element,index,array) =>{
      this.info.push([element.name,element.country?.name,element.company,element.representative?.name]);
    })

    const pdf = new jsPDF('p', 'mm', 'a4') as jsPDFCustom;
    pdf.setProperties({
      title: 'ประวัติการส่งเงินกู้รายเดือน'
    });
    pdf.setFont('Sarabun-Regular');
    pdf.setFontSize(14);
    pdf.text("ประวัติการส่งเงินกู้รายเดือน ( Loan History)",60,10);
    //autoTable(pdf, { html: '#contentTable' });
    pdf.autoTable({ 
      //styles : { halign : 'center'},
      headStyles:{fillColor : [160, 160, 160]},
      theme: 'grid',
      head: [['Name','Country','Company','Representative']],
      body: this.info,
    })
    pdf.output("dataurlnewwindow",{filename: "ประวัติการส่งเงินกู้รายเดือน"});
    //pdf.save('test.pdf');

  }

  downloadPDF(){
    this.customers?.forEach((element,index,array) =>{
      this.info.push([element.name,element.country?.name,element.company,element.representative?.name]);
    })
    
    const pdf = new jsPDF() as jsPDFCustom;
    pdf.setFont('Sarabun-Regular');
    pdf.setFontSize(14);
    pdf.text(" ประวัติการส่งเงินกู้รายเดือน ( Stock History) ",70,10);
    //autoTable(pdf, { html: '#contentTable' });
    pdf.autoTable({ 
      //styles : { halign : 'center'},
      headStyles:{fillColor : [160, 160, 160]},
      theme: 'grid',
      head: [['Name','Country','Company','Representative']],
      body: this.info,
    })
    //pdf.output("dataurlnewwindow");
    pdf.save('ประวัติการส่งเงินกู้รายเดือน.pdf');

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
      message: 'ต้องการปิดหนี้ให้คุณ ' + '.......' + ' ' + '.......',
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
