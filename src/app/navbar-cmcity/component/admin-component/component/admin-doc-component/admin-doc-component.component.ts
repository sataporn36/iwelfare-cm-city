import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-admin-doc-component',
  templateUrl: './admin-doc-component.component.html',
  styleUrls: ['./admin-doc-component.component.scss'],
})
export class AdminDocComponentComponent {
  docModel!: FormGroup;
  listDocs: any;
  loading!: boolean;
  dialogAddDoc: boolean = false;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private service: MainService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.setperiodMonthDescOption();
    this.searchDoc();
    this.initMainFormDoc();
  }

  initMainFormDoc() {
    this.docModel = new FormGroup({
      name: new FormControl(null),
    });
  }

  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  onAdd() {
    const name = this.docModel.get('name')?.value;
    console.log(name);

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('name', name);

      this.service.addDoc(formData).subscribe(
        () => {
          this.dialogAddDoc = false;
          this.docModel.reset();
          this.selectedFile = null;
          this.selectedFileName = null;
          this.ngOnInit();
          this.messageService.add({
            severity: 'success',
            detail: 'อัพโหลดไฟล์สำเร็จ',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            detail: 'กรุณาเลือกไฟล์ PDF ขนาดไม่เกิน 1 mb',
          });
        }
      );
    }
  }

  onCancel() {
    this.dialogAddDoc = false;
    this.docModel.reset();
    this.selectedFile = null;
    this.selectedFileName = null;
  }

  onDelete(id: any, name: string) {
    this.confirmationService.confirm({
      message: 'ต้องการลบเอกสาร "' + name + '" ใช่หรือไม่',
      header: 'ลบเอกสาร',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.deletedDoc(id).subscribe(
          (res) => {
            this.ngOnInit();
            this.messageService.add({
              severity: 'success',
              detail: 'ลบสำเร็จ',
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              detail: 'ลบไม่สำเร็จ เกิดข้อผิดพลาด',
            });
          }
        );
      },
      reject: () => {},
    });
  }

  getDoc(id: any) {
    this.service.getDoc(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        window.open(url);
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
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

  periodMonthDescOption: any = [];
  pipeDateTHD(date: any) {
    const format = new Date(date);
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;

    const monthSelect = this.periodMonthDescOption[month];
    return day + ' ' + monthSelect.label + ' ' + year;
  }

  onTime(date: any) {
    const format = new Date(date);
    const hours = format.getHours().toString().padStart(2, '0');
    const minutes = format.getMinutes().toString().padStart(2, '0');

    return hours + ':' + minutes + ' น.';
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

  searchDoc(): void {
    this.service.searchDoc().subscribe((data) => {
      this.listDocs = data;
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
