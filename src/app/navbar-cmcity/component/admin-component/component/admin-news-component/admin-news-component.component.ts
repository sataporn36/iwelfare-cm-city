import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-admin-news-component',
  templateUrl: './admin-news-component.component.html',
  styleUrls: ['./admin-news-component.component.scss']
})
export class AdminNewsComponentComponent {
  newsModel!: FormGroup;
  listEmp: any;
  loading!: boolean;

  constructor(private service: MainService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.setperiodMonthDescOption();
    this.initMainForm();
    this.initMainFormDetail();
    this.searchNews();
    if (this.imageCoverId != null) {
      this.getImageNews(this.imageCoverId);
    }

    if (this.imageCover == null) {
      this.imageCover = 'assets/images/image-default2.png';
    }
  }

  initMainForm() {
    this.newsModel = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
      description: new FormControl(null),
      coverImgId: new FormControl(null),
      createDate: new FormControl(null),
    });
  }

  initMainFormDetail() {
    this.detailModel = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
      description: new FormControl(null),
      coverImgId: new FormControl(null),
    });
  }

  displayBasicAddress: boolean | undefined;
  displayBasicIdCard: boolean | undefined;
  imageCover: SafeUrl;
  imageCoverId: any;
  getImageNews(id: any) {
    if (id != 0) {
      this.service.getImageNews(id).subscribe(
        (imageBlob: Blob) => {
          this.imageCover = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
        }
      );
    }
  }

  imageCoverDetail: any;
  getImageNewsDetail(id: any) {
    if (id != 0) {
      this.service.getImageNews(id).subscribe(
        (imageBlob: Blob) => {
          this.imageCoverDetail = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
        },
        (error: any) => {
          console.error('Failed to fetch image:', error);
        }
      );
    }
  }

  onNewsPicChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);

    this.service.uploadImageNews(formData).subscribe(
      (res) => {
        this.imageCoverId = res.data.id
        this.ngOnInit();
        this.messageService.add({ severity: 'success', detail: 'อัพโหลดรูปสำเร็จ' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb' });
      }
    );
  }

  searchNews(): void {
    this.service.searchNews().subscribe(data => {
      this.listEmp = data
    });
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

  createNews() {
    this.service.searchNews().subscribe(data => {
      this.listEmp = data;
    });
  }

  onAccept() {
    const news = this.newsModel.getRawValue();
    news.coverImgId = this.imageCoverId ? this.imageCoverId : 0;

    this.service.createNews(news).subscribe((res) => {
      this.imageCoverId = null;
      this.imageCover = null;
      this.ngOnInit();
      this.messageService.add({ severity: 'success', detail: 'บันทึกสำเร็จ' });
    },
      () => {
        this.messageService.add({ severity: 'error', detail: 'บันทึกไม่สำเร็จ เกิดข้อผิดพลาด' });
      });
  }

  detailModel!: FormGroup;
  detail: boolean;
  detailId: boolean;
  imageCoverDetailId: any;
  onEdit(id: any) {
    this.detail = true;
    this.detailId = id;
    this.service.getNews(id).subscribe(data => {
      this.imageCoverDetailId = data.coverImgId;
      this.getImageNewsDetail(data.coverImgId);

      this.detailModel.patchValue({
        ...data
      })
    });
  }

  onProfilePicChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('empId', this.detailId.toString());

    this.service.updateImageNews(formData).subscribe(
      () => {
        this.ngOnInit();
        this.onEdit(this.detailId);
        this.messageService.add({ severity: 'success', detail: 'อัพโหลดรูปสำเร็จ' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb' });
      }
    );
  }

  onDelete(id: any) {
    this.service.deleteNews(id).subscribe((res) => {
      this.ngOnInit();
      this.messageService.add({ severity: 'success', detail: 'ลบสำเร็จ' });
    },
      () => {
        this.messageService.add({ severity: 'error', detail: 'บันทึกไม่สำเร็จ เกิดข้อผิดพลาด' });
      });
  }

  clearDialog() {
  }

  onAcceptDetail() {
    const newsDetail = this.detailModel.getRawValue();
    newsDetail.id = this.detailId
    newsDetail.coverImgId = this.imageCoverDetailId ? this.imageCoverDetailId : 0;

    this.service.editNews(newsDetail).subscribe((res) => {
      this.detailId = null;
      this.imageCoverDetailId = null;
      this.imageCoverDetail = null;
      this.detail = false;
      this.ngOnInit();
      this.messageService.add({ severity: 'success', detail: 'บันทึกสำเร็จ' });
    },
      () => {
        this.messageService.add({ severity: 'error', detail: 'บันทึกไม่สำเร็จ เกิดข้อผิดพลาด' });
      });
  }

  onClearDetail() {
  }

}
