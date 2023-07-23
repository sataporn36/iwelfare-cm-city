import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/constans/Product';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-admin-component1',
  templateUrl: './admin-component1.component.html',
  styleUrls: ['./admin-component1.component.scss']
})
export class AdminComponent1Component {

  formModelInterest!: FormGroup;
  formModelSignature!: FormGroup;
  configAdmin: any;
  profileImgId: any;
  imageSrc: SafeUrl;
  imageBlob1: Blob;
  imageBlob2: Blob;
  imageSrc1: SafeUrl;
  imageSrc2: SafeUrl;
  fileImg1: any;
  fileImg2: any;
  interestId: any;

  displayBasic1: boolean | undefined;
  images1: any[] = [];
  displayBasic2: boolean | undefined;
  images2: any[] = [];

    responsiveOptions: any[] = [
        {
            breakpoint: '1500px',
            numVisible: 5
        },
        {
            breakpoint: '1024px',
            numVisible: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    sourceProducts: Product[];
    targetProducts: Product[];

  constructor(private service: MainService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer) 
    { 
     
    }

  ngOnInit() {
    this.getconfigList();
    this.initMainFormInterest();
    this.initMainFormSignature();

    this.service.getProductsSmall().then((products) => (this.sourceProducts = products));
    this.targetProducts = [];
  }

  getconfigList(){
    this.service.getConfigByList().subscribe((res) =>{
      if(res){
        this.configAdmin = res;
        this.fileImg1 = res[3].configId;
        this.fileImg2 = res[4].configId;
        this.interestId = res[0].configId;
        this.formModelInterest.patchValue({
          interest: res[0].value
        });

        this.getImgSig1('signature1',this.fileImg1);
        this.getImgSig2('signature2',this.fileImg2);
      }
    });
  }

  initMainFormInterest() {
    this.formModelInterest = new FormGroup({
      id: new FormControl(null),
      interest: new FormControl(null),
    });
  }

  initMainFormSignature() {
    this.formModelSignature = new FormGroup({
      id: new FormControl(null),
      Signature1: new FormControl(null),
      Signature2: new FormControl(null),
    });
  }

  getImgSig1(dataImg: any, id: any){
    if(id !== null || id){
      this.getImage(id,1,dataImg);
    }else{
      this.imageSrc1 = this.profileImg(dataImg);
    }
  }

  getImgSig2(dataImg: any, id: any){
    if(id !== null || id){
      this.getImage(id,2,dataImg);
    }else{
      this.imageSrc2 = this.profileImg(dataImg);
    }
  }

  profileImg(dataImg: any) {
    let textImg = '';
    switch (dataImg) {
        case 'signature1':
          textImg = 'assets/images/text1.png';
          break;
        case 'signature2':
          textImg = 'assets/images/text2.png';
          break;
        default:
          break;
    }
    return textImg;
  }

  getImage(id: any,imageSrc: any,dataImg: any) {
    if (id != 0 || id != null) {
      this.service.getImageConfig(id).subscribe(
        (imageBlob: Blob) => {
          if(imageSrc === 1){
            this.imageSrc1 = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
            this.images1.push({
              itemImageSrc: this.imageSrc1,
              thumbnailImageSrc: this.imageSrc1,
            });
          }else{
            this.imageSrc2 = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
            this.images2.push({
              itemImageSrc: this.imageSrc2,
              thumbnailImageSrc: this.imageSrc2,
            });
          }
        },
        (error: any) => {
          if(imageSrc === 1){
            this.imageSrc1 =  this.profileImg(dataImg);
          }else{
            this.imageSrc2 =  this.profileImg(dataImg);
          }
          console.error('Failed to fetch image:', error);
        }
      );
    }
  }

  onConfigPicChange(event: Event,signature: any) {
    const file = (event.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('empId', this.checkIndexSignature(signature));

    this.service.uploadImageConfig(formData).subscribe(
      () => {
        console.log('Image uploaded successfully.');
        this.ngOnInit();
        this.ngOnInit();
        this.messageService.add({ severity: 'success', detail: 'อัพโหลดรูปสำเร็จ' });
      },
      (error) => {
        console.log('Error uploading image:', error);
        this.messageService.add({ severity: 'error', detail: 'กรุณาเลือกขนาดไฟล์รูปไม่เกิน 1 mb' });
      }
    );
  }

  checkIndexSignature(signature: any){
      if(signature === 'signature1'){
          return this.fileImg1.toString();
      }else{
          return this.fileImg2.toString();
      }
  }

  updateIntereat(){
    const data = this.formModelInterest.getRawValue();
    const payload = {
      configId: this.interestId,
      value: data.interest
    }
     this.service.editConfig(payload).subscribe((res) => {
         if(res.data !== null || res.data){
          console.log();
          this.messageService.add({ severity: 'success', detail: 'แก้ไขข้อมูลสำเร็จ' });
         }
     });
  }

  resetInterst(){
    this.formModelInterest.reset();
    this.ngOnInit();
  }

  
}
