import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-beneficiary-component',
  templateUrl: './beneficiary-component.component.html',
  styleUrls: ['./beneficiary-component.component.scss']
})
export class BeneficiaryComponentComponent implements OnInit {

  userId: any;
  sumLoan: any;
  totalLoan: any;
  loanValueNull: any;
  arrayBeneficiary: any = [];
  mode: boolean = true;
  displayModal: boolean = false;
  selectedProducts!: any;
  beneficiaryInfo: any = [];

  constructor(
    private service: MainService,
    private messageService: MessageService,
    protected router: Router,
    protected route: ActivatedRoute,
    private locationStrategy: LocationStrategy,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.userId = this.localStorageService.retrieve('empId');
    this.getBeneficiaryByEmpId(this.userId);
    this.searchBeneficiary(this.userId);

  }

  getBeneficiaryByEmpId(id: any) {
    this.service.getBeneficiaryByEmpId(id).subscribe(data => {
      this.arrayBeneficiary = data;
    });
  }

  searchBeneficiary(id: any) {
    this.service.searchBeneficiary(id).subscribe(data => {
      this.beneficiaryInfo = data;
    });
  }

  checkUpdate() {
    for (const product of this.selectedProducts) {
      const beneficiary = this.beneficiaryInfo.find(info => info.id === product.id);
      if (beneficiary) {
        beneficiary.active = true;
      }
    }

    for (const beneficiary of this.beneficiaryInfo) {
      if (!this.selectedProducts.some(product => product.id === beneficiary.id)) {
        beneficiary.active = false;
      }
    }

    console.log("beneficiaryInfo", this.beneficiaryInfo);
    this.service.updateBeneficiaryLogic(this.beneficiaryInfo).subscribe(data => {
      this.showSuccess();
      this.displayModal = false;
      this.ngOnInit();
    });
  }


  displayDialog() {
    this.displayModal = true;
  }

  checkImgProfile(gender: any) {
    let textGender = ""
    switch (gender) {
      case 'ชาย':
        textGender = "assets/images/boy.png"
        break;
      case 'หญิง':
        textGender = "assets/images/girl.png"
        break;
      default:
        break;
    }
    return textGender
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'แก้ไขสำเร็จ', detail: 'แก้ไขผู้รับผลประโยชน์' });
  }
}
