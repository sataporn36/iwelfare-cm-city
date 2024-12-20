import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-deposit-component',
  templateUrl: './deposit-component.component.html',
  styleUrls: ['./deposit-component.component.scss'],
})
export class DepositComponentComponent implements OnInit {
  @ViewChild('downloadLink') downloadLinkRef!: ElementRef;
  documents: any;

  constructor(
    private service: MainService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.searchDoc();
  }

  searchDoc(): void {
    this.service.searchDoc().subscribe((data) => {
      this.documents = data;
    });
  }

  downloadPdf(document: any) {
    this.service.getDoc(document.id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        saveAs(url, document.name);
      },
      (error) => {
        if (error.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const errorMessage = reader.result as string;
            this.messageService.add({
              severity: 'error',
              detail: 'เกิดข้อผิดพลาดในการเปิดไฟล์ PDF: ' + errorMessage,
            });
          };
          reader.readAsText(error.error);
        } else {
          this.messageService.add({
            severity: 'error',
            detail: 'เกิดข้อผิดพลาดในการเปิดไฟล์ PDF',
          });
        }
      }
    );
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
