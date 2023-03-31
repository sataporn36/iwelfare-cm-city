import { Component } from '@angular/core';
import { Customer } from 'src/app/model/ccustomerTest';
import { MainService } from 'src/app/service/main.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import 'src/assets/fonts/Sarabun-Regular-normal.js'
import 'src/assets/fonts/Sarabun-Bold-bold.js'
import { LazyLoadEvent } from 'primeng/api';

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

  constructor(private customerService: MainService) {}

  ngOnInit() {
    this.customerService.getCustomers().subscribe((res) =>{
      console.log(res,"<==== res");
      this.customers = res.customers;
    })
    this.loading = true;
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
    pdf.output("dataurlnewwindow");
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
    pdf.save('ประวัติการส่งเงินกู้รายเดือน.pdf');

  }
}
