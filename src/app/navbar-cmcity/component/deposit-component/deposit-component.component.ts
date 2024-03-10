import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-deposit-component',
  templateUrl: './deposit-component.component.html',
  styleUrls: ['./deposit-component.component.scss']
})
export class DepositComponentComponent implements OnInit {
  @ViewChild('downloadLink') downloadLinkRef!: ElementRef;

  documents = [
    { label: 'คู่มือปฏิบัติงานกองทุนฯ', path: '/assets/pdf/คู่มือปฏิบัติงานกองทุนฯ.pdf' },
    { label: 'ใบสมัครเข้าเป็นสมาชิก', path: '/assets/pdf/ใบสมัครเข้าเป็นสมาชิก.pdf' },
    { label: 'หนังสือขอลาออก', path: '/assets/pdf/หนังสือขอลาออก.pdf' },
    { label: 'หนังสือสัญญากู้กองทุนสวัสดิการ', path: '/assets/pdf/หนังสือสัญญากู้กองทุนสวัสดิการ.pdf' },
    { label: 'หนังสือค้ำประกันเงินกู้กองทุนสวัสดิการ', path: '/assets/pdf/หนังสือค้ำประกันเงินกู้กองทุนสวัสดิการ.pdf' },
    { label: 'หนังสือขอเปลี่ยนแปลงการใช้หุ้นค้ำประกัน', path: '/assets/pdf/หนังสือขอเปลี่ยนแปลงการใช้หุ้นค้ำประกัน.pdf' },
    { label: 'หนังสือขอเปลี่ยนผู้ค้ำประกัน', path: '/assets/pdf/หนังสือขอเปลี่ยนผู้ค้ำประกัน.pdf' },
    { label: 'หนังสือขอรับเงินช่วยสมาชิกที่เกษียณv2', path: '/assets/pdf/หนังสือขอรับเงินช่วยสมาชิกที่เกษียณv2.pdf' },
    { label: 'ใบสำคัญรับเงิน', path: '/assets/pdf/ใบสำคัญรับเงิน.pdf' },
  ];

  constructor() { }

  ngOnInit(): void { }

  initiateDownload(index: number): void {
    const documentPath = this.documents[index].path;
    this.downloadLinkRef.nativeElement.href = documentPath;
    this.downloadLinkRef.nativeElement.click();
  }

  downloadPdf(index: number) {
    const documentPath = this.documents[index];
    const pdfPath = documentPath.path;
    const pdfName = documentPath.label;
    saveAs(pdfPath, pdfName);
  }

}

