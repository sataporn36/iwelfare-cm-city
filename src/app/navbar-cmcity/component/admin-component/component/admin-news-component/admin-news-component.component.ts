import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-admin-news-component',
  templateUrl: './admin-news-component.component.html',
  styleUrls: ['./admin-news-component.component.scss'],
})
export class AdminNewsComponentComponent {
  newsModel!: FormGroup;
  listEmp: any;
  loading!: boolean;
  addNews: boolean;
  arrayImages: any = [];
  imageDefault: boolean = false;

  constructor(
    private service: MainService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.setperiodMonthDescOption();
    this.initMainForm();
    this.initMainFormDetail();
    this.searchNews();
    this.arrayImages = [];
    if (this.imageCoverId != null) {
      this.getImageNews(this.imageCoverId);
    }

    if (this.imageCover == null) {
      this.imageCover = 'assets/images/image-default2.png';
      this.imageDefault = true;
    }
  }

  getNewsFileDetail(id: any) {
    this.service.getNewsDetail(id).subscribe((data) => {
      this.arrayImages = data;
    });
  }

  imageBase(data: any) {
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/jpeg;base64,${data.image}`
    );
  }

  initMainForm() {
    this.newsModel = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      description: new FormControl(null),
      coverImgId: new FormControl(null),
      createDate: new FormControl(null),
    });
  }

  initMainFormDetail() {
    this.detailModel = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
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
      console.log(id, 'imageCover');

      this.service.getImageNews(id).subscribe(
        (imageBlob: Blob) => {
          this.imageCover =
            imageBlob.size != 0
              ? this.sanitizer.bypassSecurityTrustUrl(
                  URL.createObjectURL(imageBlob)
                )
              : null;

          this.checkDefaultImage();
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
          this.imageCoverDetail =
            imageBlob.size != 0
              ? this.sanitizer.bypassSecurityTrustUrl(
                  URL.createObjectURL(imageBlob)
                )
              : null;

          this.checkDefaultImage();
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
    formData.append('empId', this.newsId);
    formData.append('image', file);

    this.service.uploadImageNews(formData).subscribe(
      (res) => {
        // this.imageCoverId = res.data.id;
        // this.ngOnInit();
        this.getImageNews(res.data.id);
        this.messageService.add({
          severity: 'success',
          detail: 'อัพโหลดรูปสำเร็จ',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb',
        });
      }
    );
  }

  onNewsPicChangeDetail(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('empId', this.newsId);
    formData.append('image', file);

    this.service.uploadImageNewsDetail(formData).subscribe(
      (res) => {
        // this.ngOnInit();
        this.getNewsFileDetail(this.newsId);
        this.messageService.add({
          severity: 'success',
          detail: 'อัพโหลดรูปสำเร็จ',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb',
        });
      }
    );
  }

  searchNews(): void {
    this.service.searchNews().subscribe((data) => {
      this.listEmp = data;
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
    this.service.searchNews().subscribe((data) => {
      this.listEmp = data;
    });
  }

  onAccept() {
    const news = this.newsModel.getRawValue();
    news.coverImgId = this.imageCoverId ? this.imageCoverId : 0;
    news.newsId = this.newsId;

    if (news.name == null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'เเจ้งเตือน',
        detail: 'กรุณากรอกข้อมูลให้ครบ',
        life: 10000,
      });
    } else {
      this.service.createNewsUp(news).subscribe(
        (res) => {
          this.imageCoverId = null;
          this.imageCover = null;
          this.addNews = false;
          this.ngOnInit();
          this.messageService.add({
            severity: 'success',
            detail: 'บันทึกสำเร็จ',
          });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            detail: 'บันทึกไม่สำเร็จ เกิดข้อผิดพลาด',
          });
        }
      );
    }
  }

  newsId: any;
  onAdd() {
    this.addNews = true;
    this.service.createNews().subscribe((res) => {
      this.newsId = res.data.id;
    });
  }

  detailModel!: FormGroup;
  detail: boolean;
  detailId: boolean;
  imageCoverDetailId: any;
  onEdit(id: any) {
    this.detail = true;
    this.detailId = id;
    this.service.getNews(id).subscribe((data) => {
      this.imageCoverDetailId =
        data.coverImgId != null ? data.coverImgId : null;
      this.newsId = id;

      if (this.imageCoverDetailId != null) {
        this.getImageNewsDetail(data.coverImgId);
      } else {
        this.checkDefaultImage();
      }

      this.detailModel.patchValue({
        ...data,
      });

      this.getNewsFileDetail(id);
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
        this.messageService.add({
          severity: 'success',
          detail: 'อัพโหลดรูปสำเร็จ',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb',
        });
      }
    );
  }

  onDelete(id: any, flex: boolean) {
    this.service.deleteNews(id).subscribe(
      (res) => {
        this.ngOnInit();
        if (!flex) {
          this.messageService.add({ severity: 'success', detail: 'ลบสำเร็จ' });
        }
      },
      () => {
        this.messageService.add({
          severity: 'error',
          detail: 'ลบไม่สำเร็จ เกิดข้อผิดพลาด',
        });
      }
    );
  }

  onDeleteImageDetail(id: any) {
    this.service.deleteImageDetail(id).subscribe(
      (res) => {
        this.getNewsFileDetail(this.newsId);
        this.messageService.add({ severity: 'success', detail: 'ลบสำเร็จ' });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          detail: 'ลบไม่สำเร็จ เกิดข้อผิดพลาด',
        });
      }
    );
  }

  clearDialog() {
    this.onDelete(this.newsId, true);
    this.addNews = false;
    this.ngOnInit();
  }

  onAcceptDetail() {
    const newsDetail = this.detailModel.getRawValue();
    newsDetail.id = this.detailId;
    newsDetail.coverImgId = this.imageCoverDetailId
      ? this.imageCoverDetailId
      : 0;

    this.service.editNews(newsDetail).subscribe(
      (res) => {
        this.detailId = null;
        this.imageCoverDetailId = null;
        this.imageCoverDetail = null;
        this.detail = false;
        this.ngOnInit();
        this.messageService.add({
          severity: 'success',
          detail: 'บันทึกสำเร็จ',
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          detail: 'บันทึกไม่สำเร็จ เกิดข้อผิดพลาด',
        });
      }
    );
  }

  checkDefaultImage() {
    if (this.imageCover == null) {
      this.imageCover = 'assets/images/image-default2.png';
    }

    if (this.imageCoverDetail == null) {
      this.imageCoverDetail = 'assets/images/image-default2.png';
    }
  }
}
