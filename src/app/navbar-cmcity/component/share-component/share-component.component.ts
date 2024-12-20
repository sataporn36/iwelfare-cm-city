import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Customer } from 'src/app/model/ccustomerTest';
import { MainService } from 'src/app/service/main.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import 'src/assets/fonts/Sarabun-Regular-normal.js';
import 'src/assets/fonts/Sarabun-Bold-bold.js';
import 'src/assets/fonts/Kanit-Thin-normal.js';
import 'src/assets/fonts/Kanit-Regular-normal.js';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { LocalStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'src/assets/custom-fonts.js';
import { Department } from 'src/app/model/department';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { log } from 'console';

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

@Component({
  selector: 'app-share-component',
  templateUrl: './share-component.component.html',
  styleUrls: ['./share-component.component.scss'],
})
export class ShareComponentComponent implements OnInit {
  menuItems!: MenuItem[];
  @ViewChild('content', { static: false }) el!: ElementRef;
  customers!: Customer[];
  info: any[] = [];
  infoReceipt: any[] = [];
  infoReceiptTotal: any[] = [];
  loading!: boolean;
  totalRecords!: number;
  clonedProducts: { [s: number]: any } = {};
  formModel!: FormGroup;
  formModelStock!: FormGroup;
  displayModal: boolean = false;
  displayLoadingPdf: boolean = false;
  dataStock!: any[];
  dataStockDetail!: any[];
  userId: any;
  stockId: any;
  stockInfo: any;
  employeeByStock: any;
  dataValue: any;
  periodMonthDescOption: any = [];
  public dapartment: Observable<Department[]> | any;
  empDetail!: any;
  admin!: boolean;
  grandTotal!: any;
  stockAccumulate: any;
  displayStatusMember: boolean = false;
  employeeStatus: any;
  employeeStatusList: any[];
  empId: any;
  elementLoan: any;
  sumElementLoan: any;
  displayModalBill: boolean = false;
  formModelBill!: FormGroup;
  configAdmin: any;
  profileImgId: any;
  imageSrc: SafeUrl;
  imageBlob1: Blob;
  imageBlob2: Blob;
  imageSrc1: SafeUrl;
  imageSrc2: SafeUrl;
  fileImg1: any;
  fileImg2: any;
  imageSrc1Blob: any;
  imageSrc2Blob: any;
  yearCurrent: any;

  constructor(
    private service: MainService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    @Inject(LOCALE_ID) public locale: string,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // this.service.getCustomers().subscribe((res) => {
    //   console.log(res, "<==== res");
    //   this.customers = res.customers;
    // })
    this.loading = true;
    this.getconfigList();
    this.initMainForm();
    this.initMainFormStock();

    this.userId = this.localStorageService.retrieve('empId');
    this.stockId = this.localStorageService.retrieve('stockId');
    this.empDetail = this.localStorageService.retrieve('employeeofmain');

    if (this.stockId != null) {
      this.getStock(this.stockId);
      this.searchStockDetail(this.stockId);
    } else {
      this.loading = false;
    }

    // this.searchStock();
    this.initMainFormBill();
    this.setperiodMonthDescOption();
    // this.getDapartment();
    this.pipeDateTH();

    this.employeeStatusList = [
      { name: 'กรุณาเลือกสถานะ', value: 0 },
      //{ name: 'สมาชิกแรกเข้า', value: 1 },
      //{ name: 'ใช้งานปกติ', value: 2 },
      //{ name: 'ลาออก', value: 3 },
      //{ name: '', value: 4 },
      //{ name: 'รออนุมัติลาออก', value: 5 },
      { name: 'เสียชีวิต', value: 6 },
    ];
    // if (this.userId === 1 || this.userId === 631) {
    //   this.admin = true;
    // }
    this.menuItems = [
      {
        label: 'ใบเสร็จรับเงิน',
        command: () => {
          this.ondisplayModalMonth('ใบเสร็จรับเงิน');
        },
      },
      {
        label: 'ประวัติการส่งหุ้น',
        command: () => {
          this.searchDocumentV1PDF('export');
        },
      },
    ];
  }

  getconfigList() {
    this.service.getConfigByList().subscribe((res) => {
      if (res) {
        this.configAdmin = res;
        this.fileImg1 = res[3].configId;
        this.fileImg2 = res[4].configId;

        this.getImgSig1('signature1', this.fileImg1);
        this.getImgSig2('signature2', this.fileImg2);
      }
    });
  }

  getImgSig1(dataImg: any, id: any) {
    if (id !== null || id) {
      this.getImage(id, 1, dataImg);
    } else {
      this.imageSrc1Blob = this.profileImg(dataImg);
    }
  }

  getImgSig2(dataImg: any, id: any) {
    if (id !== null || id) {
      this.getImage(id, 2, dataImg);
    } else {
      this.imageSrc2Blob = this.profileImg(dataImg);
    }
  }

  profileImg(dataImg: any) {
    let textImg = '';
    switch (dataImg) {
      case 'signature1':
        textImg = '../../assets/images/text1.png';
        break;
      case 'signature2':
        textImg = '../../assets/images/text2.png';
        break;
      default:
        break;
    }
    return textImg;
  }

  getImage(id: any, imageSrc: any, dataImg: any) {
    if (id != 0 || id != null) {
      this.service.getImageConfig(id).subscribe(
        (imageBlob: Blob) => {
          if (imageSrc === 1) {
            this.imageSrc1Blob = URL.createObjectURL(imageBlob);
          } else {
            this.imageSrc2Blob = URL.createObjectURL(imageBlob);
          }
        },
        (error: any) => {
          if (imageSrc === 1) {
            this.imageSrc1Blob = this.profileImg(dataImg);
          } else {
            this.imageSrc2Blob = this.profileImg(dataImg);
          }
          console.error('Failed to fetch image:', error);
        }
      );
    }
  }

  onRowEditStatusEmp(data: any) {
    this.empId = data.id;
    this.displayStatusMember = true;
  }

  onChangeStatusEmp() {
    const payload = {
      id: this.empId,
      employeeStatus: this.employeeStatus.value,
    };
    this.service.updateEmployeeStatus(payload).subscribe((data) => {
      this.messageService.add({ severity: 'success', detail: 'แก้ไขสำเร็จ' });
      this.displayStatusMember = false;
      this.ngOnInit();
    });
  }

  onCancleStatusEmp() {
    this.displayStatusMember = false;
  }

  getDapartment(): void {
    this.service
      .searchDepartment()
      .subscribe((data) => (this.dapartment = data));
  }

  initMainForm() {
    this.formModel = new FormGroup({
      fullName: new FormControl(null),
    });
  }

  initMainFormBill() {
    this.formModelBill = new FormGroup({
      month: new FormControl(null),
      year: new FormControl(null),
    });
  }

  initMainFormStock() {
    this.formModelStock = new FormGroup({
      stockMonth: new FormControl(0),
      stockYear: new FormControl(null),
    });
  }

  onSearchMember() {
    const data = this.formModel.getRawValue();
    // api search member
  }

  loadCustomers(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
      this.service.searchStockDetail(this.stockId, 'asc').subscribe((res) => {
        //this.customers = res.customers;
        this.totalRecords = res.length;
        this.loading = false;
      });
    }, 1000);
  }

  getEmployeeByStock(id: any): void {
    this.service.getEmployee(id).subscribe((data) => {
      this.employeeByStock = data;
      this.loading = false;
    });
  }

  // searchStock(): void {
  //   this.service.searchStock().subscribe(data => {
  //     this.dataStock = data;
  //     this.loading = false;
  //   });
  // }

  getStock(id: any): void {
    this.service.getStock(id).subscribe({
      next: (data) => {
        if (data) {
          this.stockInfo = data;
          this.loading = false;
        } else {
          this.dataStockDetail = [];
          this.loading = false;
        }
      },
      error: (error) => {
        this.dataStockDetail = [];
        this.loading = false;
      },
    });
  }

  searchStockDetail(id: any): void {
    this.service.searchStockDetail(id, 'desc').subscribe({
      next: (data) => {
        // const key = 'installment';
        // const arrayUniqueByKey = [...new Map(data.map(item => [item[key], item])).values()];
        // this.dataStockDetail = arrayUniqueByKey.sort((a, b) => a.installment - b.installment);
        if (data) {
          this.dataStockDetail = data;
        } else {
          this.dataStockDetail = [];
          this.loading = false;
        }
        // this.stockAccumulate = data.stock.stockAccumulate
      },
      error: (error) => {
        this.dataStockDetail = [];
        this.loading = false;
      },
    });
  }

  onRowEditInit(stock: any) {
    this.clonedProducts[stock.id!] = { ...stock };
  }

  onRowEditSave(playload: any) {
    this.service.updateStock(playload).subscribe((data) => {
      this.messageService.add({ severity: 'success', detail: 'แก้ไขสำเร็จ' });
      this.ngOnInit();
      this.loading = false;
    });
  }

  month: any;
  year: any;
  time: any;
  pipeDateTH() {
    const format = new Date();
    const yearNew = format.getFullYear();
    this.yearCurrent = yearNew;
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;
    this.year = year;
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    const time = format.getHours() + ':' + format.getMinutes() + ' น.';
    this.time = time;
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

  onRowEditCancel(product: Customer, index: number) {
    this.customers[index] = this.clonedProducts[product.id!];
    delete this.clonedProducts[product.id!];
  }

  oldMonth: any;
  newMonth: any;
  newYear: any;
  updateStocktoMonth() {
    this.displayModal = true;

    const formatDate = new Date();
    const month = formatDate.getMonth();
    this.newYear = formatDate.getFullYear() + 543;

    this.newMonth = this.periodMonthDescOption[month];
    this.oldMonth = this.periodMonthDescOption[month - 1];

    this.formModelStock.patchValue({
      stockYear: this.newYear,
      stockMonth: this.newMonth.label,
    });

    this.formModelStock.get('stockMonth')?.disable();
    this.formModelStock.get('stockYear')?.disable();

    this.checkInsertStockDetailAll();
  }

  onupdateStockToMonth() {
    // api update stock to everyone
    const payload = {
      oldMonth: this.oldMonth.label,
      oldYear: this.newYear,
      newMonth: this.newMonth.label,
      newYear: this.newYear,
    };
    this.service.insertStockDetail(payload).subscribe((data) => {
      this.messageService.add({ severity: 'success', detail: 'เพิ่มสำเร็จ' });
      this.displayModal = false;
      this.ngOnInit();
    });
  }

  onCancle() {
    this.formModelStock.reset();
    this.displayModal = false;
    this.displayModalBill = false;
  }

  checkNull: boolean = true;
  checkValueOfNull(event: any) {
    if (!event.value) {
      this.checkNull = true;
    } else {
      this.checkNull = false;
    }
  }

  checkInsertStockDetailAll() {
    const stockDetail = this.dataStockDetail;
    const formatDate = new Date();
    const month = formatDate.getMonth();
    const monthSelect = this.periodMonthDescOption[month];

    if (stockDetail[stockDetail.length - 1].stockMonth === monthSelect.label) {
      this.checkNull = true;
    } else {
      this.checkNull = false;
    }
  }

  clear(table: Table) {
    table.clear();
  }

  departmentNames: any[] = [];
  checknullOfDepartment(name: any) {
    // หาข้อมูลสมาชิกตาม department ที่มีอยุ่ โดย query ข้อมูล มาตาม group เเละ ีข้อมูลย่อยสมาชิกอยู่ในนั้น
    //...
    const dName = this.dapartment;
    if (name) {
      // ชื่อ department ที่ใช้า ใน pdf
      this.departmentNames.push([name]);
    }
  }

  infogroup1: any[] = [];
  infogroup2: any[] = [];
  infogroup3: any[] = [];
  infogroup4: any[] = [];
  infogroup5: any[] = [];
  infogroup6: any[] = [];
  infogroup7: any[] = [];
  infogroup8: any[] = [];
  infogroup9: any[] = [];
  infogroup10: any[] = [];
  infogroup11: any[] = [];
  infogroup12: any[] = [];
  infogroup13: any[] = [];
  infogroup14: any[] = [];
  infogroup15: any[] = [];
  infogroup16: any[] = [];
  infogroup17: any[] = [];
  infogroup18: any[] = [];
  infogroup19: any[] = [];
  infogroup20: any[] = [];
  infogroup21: any[] = [];
  infogroup22: any[] = [];
  infogroup23: any[] = [];
  infogroup24: any[] = [];
  infogroup25: any[] = [];
  infogroup26: any[] = [];
  infogroup27: any[] = [];
  infogroup28: any[] = [];
  infogroup29: any[] = [];
  infogroup30: any[] = [];
  infogroup31: any[] = [];

  checkDepartment(listData: any[]) {
    this.infogroup1 = [];
    this.infogroup2 = [];
    this.infogroup3 = [];
    this.infogroup4 = [];
    this.infogroup5 = [];
    this.infogroup6 = [];
    this.infogroup7 = [];
    this.infogroup8 = [];
    this.infogroup9 = [];
    this.infogroup10 = [];
    this.infogroup11 = [];
    this.infogroup12 = [];
    this.infogroup13 = [];
    this.infogroup14 = [];
    this.infogroup15 = [];
    this.infogroup16 = [];
    this.infogroup17 = [];
    this.infogroup18 = [];
    this.infogroup19 = [];
    this.infogroup20 = [];
    this.infogroup21 = [];
    this.infogroup22 = [];
    this.infogroup23 = [];
    this.infogroup24 = [];
    this.infogroup25 = [];
    this.infogroup26 = [];
    this.infogroup27 = [];
    this.infogroup28 = [];
    this.infogroup29 = [];
    this.infogroup30 = [];
    this.infogroup31 = [];
    listData.forEach((element, index, array) => {
      if (element.departmentName === 'แขวงเม็งราย') {
        this.infogroup1.push(element);
      } else if (element.departmentName === 'แขวงกาวิละ') {
        this.infogroup2.push(element);
      } else if (element.departmentName === 'แผนงานบริหารทั่วไป') {
        this.infogroup3.push(element);
      } else if (element.departmentName === 'งานเทศกิจ') {
        this.infogroup4.push(element);
      } else if (element.departmentName === 'งานโรงพยาบาล') {
        this.infogroup5.push(element);
      } else if (element.departmentName === 'งานก่อสร้าง') {
        this.infogroup6.push(element);
      } else if (element.departmentName === 'งานบริหารงานคลัง') {
        this.infogroup7.push(element);
      } else if (element.departmentName === 'งานบริหารงานคลัง ฝ่ายประจำ') {
        this.infogroup8.push(element);
      } else if (element.departmentName === 'งานบริหารงานทั่วไป') {
        this.infogroup9.push(element);
      } else if (element.departmentName === 'งานบริหารทั่วไป') {
        this.infogroup10.push(element);
      } else if (element.departmentName === 'งานบริหารทั่วไป ฝ่ายประจำ') {
        this.infogroup11.push(element);
      } else if (
        element.departmentName === 'งานบริหารทั่วไปเกี่ยวกับเคหะและชุมชน'
      ) {
        this.infogroup12.push(element);
      } else if (
        element.departmentName === 'งานบริหารทั่วไปเกี่ยวกับการศึกษา'
      ) {
        this.infogroup13.push(element);
      } else if (
        element.departmentName === 'งานบริหารทั่วไปเกี่ยวกับสังคมสงเคราะห์'
      ) {
        this.infogroup14.push(element);
      } else if (
        element.departmentName === 'งานบริหารทั่วไปเกี่ยวกับสาธารณสุข'
      ) {
        this.infogroup15.push(element);
      } else if (
        element.departmentName ===
        'งานบริหารทั่วไปเกี่ยวกับอุตสาหกรรมและการโยธา'
      ) {
        this.infogroup16.push(element);
      } else if (element.departmentName === 'งานป้องกันและบรรเทาสาธารณภัย') {
        this.infogroup17.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลดอกเงิน'
      ) {
        this.infogroup18.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดเชียงยืน'
      ) {
        this.infogroup19.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดกู่คำ'
      ) {
        this.infogroup20.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดท่าสะต๋อย'
      ) {
        this.infogroup21.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดพวกช้าง'
      ) {
        this.infogroup22.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดศรีปิงเมือง'
      ) {
        this.infogroup23.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดศรีสุพรรณ'
      ) {
        this.infogroup24.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดหมื่นเงินกอง'
      ) {
        this.infogroup25.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนชุมชนเทศบาลวัดศรีดอนไชย'
      ) {
        this.infogroup26.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา งานการศึกษานอกระบบฯ'
      ) {
        this.infogroup27.push(element);
      } else if (element.departmentName === 'งานวางแผนสถิติและวิชาการ') {
        this.infogroup28.push(element);
      } else if (
        element.departmentName === 'งานวิชาการวางแผนและส่งเสริมการท่องเที่ยว'
      ) {
        this.infogroup29.push(element);
      } else if (element.departmentName === 'งานสุขาภิบาล') {
        this.infogroup30.push(element);
      } else if (
        element.departmentName === 'งานระดับก่อนวัยเรียนและประถมศึกษา'
      ) {
        this.infogroup31.push(element);
      } else {
        console.log('else error !!!');
      }
    });
  }

  checkListDataPDF(list: any[]) {
    const decimalPipe = new DecimalPipe('en-US');
    if (list.length > 0) {
      let datalListGroup = list.map(function (item) {
        return [
          { text: item.departmentName, alignment: 'left' },
          { text: item.employeeCode, alignment: 'center' },
          { text: item.fullName, alignment: 'left' },
          { text: item.stockInstallment, alignment: 'center' },
          { text: decimalPipe.transform(item.stockValue), alignment: 'right' },
          {
            text: decimalPipe.transform(item.loanInstallment),
            alignment: 'center',
          },
          {
            text: decimalPipe.transform(item.loanOrdinary),
            alignment: 'right',
          },
          { text: decimalPipe.transform(item.interest), alignment: 'right' },
          { text: decimalPipe.transform(item.sumMonth), alignment: 'right' },
          {
            text: decimalPipe.transform(item.stockAccumulate),
            alignment: 'right',
          },
        ];
      });
      return datalListGroup;
    } else {
      return '';
    }
  }

  checkListSumAllByDepartment(listSum: any[], nameDepartment: any) {
    if (listSum.length > 0) {
      let sumDepartment;
      listSum?.forEach((element, _index, _array) => {
        if (element.departmentName === nameDepartment) {
          sumDepartment = [
            {
              text: element.departmentName + ' Total',
              alignment: 'left',
              bold: true,
            },
            ' ',
            ' ',
            ' ',
            {
              text: this.formattedNumber2(element.stockValueTotal),
              alignment: 'right',
            },
            ' ',
            {
              text: this.formattedNumber2(element.loanDetailOrdinaryTotal),
              alignment: 'right',
            },
            {
              text: this.formattedNumber2(element.loanDetailInterestTotal),
              alignment: 'right',
            },
            {
              text: this.formattedNumber2(element.totalMonth),
              alignment: 'right',
            },
            {
              text: this.formattedNumber2(element.stockAccumulateTotal),
              alignment: 'right',
            },
          ];
        }
      });
      return sumDepartment;
    } else {
      return '';
    }
  }

  checkListSumGrandTotal(listSum: any[]) {
    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;
    let sum4 = 0;
    let sum5 = 0;

    let sumDepartment;

    listSum?.forEach((element, _index, _array) => {
      sum1 =
        sum1 + Number(element.stockValueTotal ? element.stockValueTotal : 0);
      sum2 =
        sum2 +
        Number(
          element.loanDetailOrdinaryTotal ? element.loanDetailOrdinaryTotal : 0
        );
      sum3 =
        sum3 +
        Number(
          element.loanDetailInterestTotal ? element.loanDetailInterestTotal : 0
        );
      sum4 = sum4 + Number(element.totalMonth ? element.totalMonth : 0);
      sum5 =
        sum5 +
        Number(element.stockAccumulateTotal ? element.stockAccumulateTotal : 0);
    });

    sumDepartment = [
      { text: 'Grand Total', alignment: 'left', bold: true },
      ' ',
      ' ',
      ' ',
      { text: this.formattedNumber2(sum1), alignment: 'right' },
      ' ',
      { text: this.formattedNumber2(sum2), alignment: 'right' },
      { text: this.formattedNumber2(sum3), alignment: 'right' },
      { text: this.formattedNumber2(sum4), alignment: 'right' },
      { text: this.formattedNumber2(sum5), alignment: 'right' },
    ];

    return sumDepartment;
  }

  showWarnNull() {
    this.messageService.add({
      severity: 'warn',
      summary: 'แจ้งเตือน',
      detail: 'ไม่พบข้อมูลหุ้น',
    });
  }

  list!: any[];
  sumStock: any;
  searchDocumentV1PDF(mode: any) {
    let stockInfo: any[] = [];
    const playload = {
      empId: this.userId,
      monthCurrent: null, //this.month
      yearCurrent: null,
    };

    this.service.searchDocumentV1(playload).subscribe((data) => {
      this.list = data;
      if (this.dataStockDetail.length < 0) {
        this.showWarnNull();
      } else {
        const listStock = this.dataStockDetail;
        // const key = 'stockInstallment';
        // const arrayUniqueByKey = [...new Map(data.map(item => [item[key], item])).values()];
        this.getSearchDocumentV2Sum(playload, listStock, mode);
      }
    });
  }

  getSearchDocumentV2Sum(playload: any, stockInfo: any[], mode: any) {
    this.service.searchDocumentV2Sum(playload).subscribe((data) => {
      this.sumStock = data[0];

      // const key = 'stockInstallment';
      // const arrayUniqueByKey = [...new Map(data.map(item => [item[key], item])).values()];
      // console.log(arrayUniqueByKey, '<---------- this.arrayUniqueByKey');

      this.exportMakePDF(mode, stockInfo, this.sumStock);
    });
  }

  exportMakePDF(mode: any, stockInfo: any[], sum: any) {
    const decimalPipe = new DecimalPipe('en-US');
    const fullName =
      this.empDetail.prefix +
      this.empDetail.firstName +
      ' ' +
      this.empDetail.lastName;
    const departmentName = this.empDetail.departmentName;
    const employeeCode = this.empDetail.employeeCode;
    let detailStock = stockInfo.map(function (item) {
      return [
        // { text: item.departmentName, alignment: 'left' },
        // { text: item.employeeCode, alignment: 'center' },
        // { text: item.fullName, alignment: 'left' },
        // { text: decimalPipe.transform(item.stockInstallment), alignment: 'center' },
        // { text: decimalPipe.transform(item.stockValue), alignment: 'right' },
        // { text: decimalPipe.transform(item.loanInstallment), alignment: 'center' },
        // { text: decimalPipe.transform(item.loanOrdinary), alignment: 'right' },
        // { text: decimalPipe.transform(item.interest), alignment: 'right' },
        // { text: decimalPipe.transform(item.sumMonth), alignment: 'right' },
        // { text: decimalPipe.transform(item.stockAccumulate), alignment: 'right' },

        { text: departmentName, alignment: 'left' },
        { text: employeeCode, alignment: 'center' },
        { text: fullName, alignment: 'left' },
        { text: item.stockMonth, alignment: 'center' },
        { text: item.stockYear, alignment: 'center' },
        { text: decimalPipe.transform(item.installment), alignment: 'center' },
        { text: decimalPipe.transform(item.stockValue), alignment: 'right' },
        {
          text: decimalPipe.transform(item.stockAccumulate - item.stockValue),
          alignment: 'right',
        },
      ];
    });

    pdfMake.vfs = pdfFonts.pdfMake.vfs; // 2. set vfs pdf font
    pdfMake.fonts = {
      // download default Roboto font from cdnjs.com
      Roboto: {
        normal:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
      // Kanit Font
      Sarabun: {
        // 3. set Kanit font
        normal: 'Sarabun-Regular.ttf',
        bold: 'Sarabun-Medium.ttf',
        italics: 'Sarabun-Italic.ttf ',
        bolditalics: 'Sarabun-MediumItalic.ttf ',
      },
    };
    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [15, 40, 20, 40],
      info: {
        title: 'ประวัติการส่งหุ้น',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        //{ text: 'รายงานเงินกู้และค่าหุ้น เดือน'+this.month+' พ.ศ.'+this.year, style: 'header' },
        { text: 'รายงานค่าหุ้น', style: 'header' },
        '\n',
        {
          style: 'tableExample',
          // alignment: 'right',

          table: {
            headerRows: 1,
            // widths: ['*', 65, '*', 70, 90, 85, 90, 85, 85, 85],
            widths: ['*', 65, '*', 70, 70, 85, 90, 85],
            body: [
              [
                { text: 'หน่วยงาน', style: 'tableHeader', alignment: 'center' },
                {
                  text: 'รหัสพนักงาน',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'ชื่อ-สกุล',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                { text: 'เดือน', style: 'tableHeader', alignment: 'center' },
                { text: 'ปี', style: 'tableHeader', alignment: 'center' },
                {
                  text: 'ค่าหุ้น(งวดที่)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'ค่าหุ้น(จํานวนเงิน)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                // { text: 'เงินกู้(งวดที่)', style: 'tableHeader', alignment: 'center' },
                // { text: 'เงินกู้สามัญเงินต้น', style: 'tableHeader', alignment: 'center' },
                // { text: 'ดอกเบี้ย', style: 'tableHeader', alignment: 'center' },
                // { text: 'รวมส่ง(เดือน)', style: 'tableHeader', alignment: 'center' },
                { text: 'หุ้นสะสม', style: 'tableHeader', alignment: 'center' },
              ],
              ...detailStock,
              // [{ text: sum.departmentName + ' Total', alignment: 'left', bold: true }, ' ', ' ', ' ',
              // { text: decimalPipe.transform(sum.stockValueTotal), alignment: 'right' }, ' ',
              // { text: decimalPipe.transform(sum.loanDetailOrdinaryTotal), alignment: 'right' },
              // { text: decimalPipe.transform(sum.loanDetailInterestTotal), alignment: 'right' },
              // { text: decimalPipe.transform(sum.totalMonth), alignment: 'right' },
              // { text: decimalPipe.transform(sum.stockAccumulateTotal), alignment: 'right' },
              // ],

              // [...stockInfo[0], empCode, fullName, { text: installment, alignment: 'center' },
              // { text: stockValue, alignment: 'right' }, { text: loanInstallment, alignment: 'center' },
              // { text: loanOrdinary, alignment: 'right' }, { text: interest, alignment: 'center' },
              // { text: Number(stockValue?? 0 + loanOrdinary ?? 0 + interest ?? 0), alignment: 'right' }, { text: stockAccumulate, alignment: 'right' },],
              // [sum.departmentName + ' Total', ' ', ' ', ' ', { text: sum.stockValueTotal, alignment: 'right' }, ' ', { text: sum.stockAccumulateTotal, alignment: 'right' },
              // { text: sum.totalMonth, alignment: 'right' }, { text: sum.loanDetailOrdinaryTotal , alignment: 'right' } , { text: sum.loanDetailInterestTotal, alignment: 'right' }],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
      ],
      styles: {
        header: {
          fontSize: 13,
          bold: 200,
          alignment: 'center',
        },
      },
      defaultStyle: {
        // 4. default style 'KANIT' font to test
        font: 'Sarabun',
      },
    };
    const pdf = pdfMake.createPdf(docDefinition);
    if (mode === 'export') {
      pdf.open();
    } else {
      pdf.download('ประวัติการส่งหุ้น.pdf');
    }
  }

  onSearchCalculateLoanOld(res: any, stockValue: any) {
    const payloadOld = {
      principal: res.loanValue,
      interestRate: Number(res.interestPercent),
      numOfPayments: res.loanTime,
      paymentStartDate: this.yearCurrent.toString() + '-01-01',
    };
    this.service.onCalculateLoanOld(payloadOld).subscribe((resL) => {
      const data = resL;
      data.forEach((element, index, array) => {
        if (element.installment === res.installment) {
          this.sumElementLoan =
            Number(stockValue) + element.totalDeduction + element.interest;
          this.elementLoan = element;
          this.onPrintReceiptMakePdf(element, this.sumElementLoan, res);
        }
      });
    });
  }

  onSearchCalculateLoanNew(res: any, stockValue: any) {
    if (res.installment < 1000) {
      this.searchDocumentV1PDFById(res, stockValue);
    } else {
      const payloadOld = {
        principal: res.loanValue,
        interestRate: Number(res.interestPercent),
        numOfPayments: res.loanTime,
        paymentStartDate: res.startDateLoan,
      };
      this.service.onCalculateLoanNew(payloadOld).subscribe((resL) => {
        const data = resL;
        data.forEach((element, index, array) => {
          if (element.installment === res.installment) {
            this.sumElementLoan =
              Number(stockValue) + element.principal + element.interest;
            this.elementLoan = element;
            this.onPrintReceiptMakePdf(element, this.sumElementLoan, res);
          }
        });
      });
    }
  }

  searchDocumentV1PDFById(res: any, stockValue: any) {
    // let loanInfo: any[] = [];
    const bill = this.formModelBill.getRawValue();
    this.billMonth = this.periodMonthDescOption[Number(bill.month) - 1].label;
    const playload = {
      loanId: res.loanId,
      monthCurrent: null, //this.month
      admin: true,
      empId: res.empId,
    };
    this.service.searchLoanById(playload).subscribe((data) => {
      const loanListData = data;
      loanListData.forEach((element, index, array) => {
        if (
          element.loanMonth == this.billMonth &&
          element.loanYear == bill.year
        ) {
          const loanData = {
            installment: element.installment,
            balanceLoan: element.loanValue,
            deductionDate: element.startLoanDate,
            amountDay: '01',
            interest: element.interest,
            principal:
              element.installment == element.loanTime
                ? Number(element.loanOrdinary)
                : Number(element.loanOrdinary - element.interest),
            principalBalance: element.loanBalance,
            totalDeduction: element.loanOrdinary,
          };
          this.sumElementLoan =
            Number(stockValue) + loanData.principal + loanData.interest;
          this.elementLoan = loanData;
          this.onPrintReceiptMakePdf(loanData, this.sumElementLoan, res);
        }
      });
    });
  }

  headerName: string;
  ondisplayModalMonth(headerName: string) {
    this.displayModalBill = true;
    this.headerName = headerName;

    const formatDate = new Date();
    const month = formatDate.getMonth();
    this.newYear = formatDate.getFullYear() + 543;

    this.newMonth = this.periodMonthDescOption[month];

    this.formModelBill.patchValue({
      year: this.newYear,
      month: this.newMonth.value,
    });

    this.formModelBill.get('year')?.disable();
  }

  onDisplay() {
    if (this.headerName == 'ใบเสร็จรับเงิน') {
      this.onupdateBill();
      this.displayModalBill = false;
    }
  }

  monthSelectNew: any;
  yearSelectNew: any;
  billMonth: any;
  onupdateBill() {
    const stock = this.stockInfo;
    const stockValue = stock?.stockDetails.slice(-1)[0].stockValue;

    const bill = this.formModelBill.getRawValue();
    this.billMonth = this.periodMonthDescOption[Number(bill.month) - 1].label;

    const payload = {
      empCode: this.empDetail.employeeCode,
      monthCurrent: this.billMonth,
      yearCurrent: bill.year,
    };
    this.monthSelectNew = this.billMonth;
    this.yearSelectNew = bill.year;
    this.service.searchEmployeeLoanNew(payload).subscribe({
      next: async (res) => {
        const dataRes = res;
        if (res == null) {
          this.showWarnNull();
        } else {
          this.dataResLoan = res;
          this.getImgSig1('signature1', this.fileImg1);
          this.getImgSig2('signature2', this.fileImg2);
          if (res.loanId) {
            if (res.newLoan) {
              await this.onSearchCalculateLoanNew(res, res.stockValue);
            } else {
              await this.onSearchCalculateLoanOld(res, res.stockValue);
            }
          } else {
            await this.onSearchCalculateLoanOld(res, res.stockValue);
            this.sumElementLoan = Number(res.stockValue) + 0 + 0; //  stockValue + totalDeduction + interest
            //this.elementLoan = null;
            this.onPrintReceiptMakePdf(null, this.sumElementLoan, res);
          }
        }
      },
      error: (error) => {},
    });
  }

  checkCalculatePrincipalBalanceBefore(elementLoan: any) {
    const yearSub = elementLoan.deductionDate.substring(0, 4);
    if (Number(yearSub) >= this.yearCurrent) {
      if (elementLoan.principalBalance > 0 && elementLoan.installment > 0) {
        return this.formattedNumber2(
          elementLoan.principalBalance +
            Math.round(elementLoan.totalDeduction - elementLoan.interest)
        );
      } else {
        return this.formattedNumber2(elementLoan.principalBalance);
      }
    } else {
      return this.formattedNumber2(elementLoan.principalBalance);
    }
  }

  dataResLoan: any;
  async onPrintReceiptMakePdf(
    elementLoan: any,
    sumElementLoan: any,
    resStock: any
  ) {
    console.log('<---- elementLoan', elementLoan);

    pdfMake.vfs = pdfFonts.pdfMake.vfs; // 2. set vfs pdf font
    pdfMake.fonts = {
      // download default Roboto font from cdnjs.com
      Roboto: {
        normal:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
      // Kanit Font
      Sarabun: {
        // 3. set Kanit font
        normal: 'Sarabun-Regular.ttf',
        bold: 'Sarabun-Medium.ttf',
        italics: 'Sarabun-Italic.ttf ',
        bolditalics: 'Sarabun-MediumItalic.ttf ',
      },
    };
    this.pipeDateTH();
    const data = this.empDetail;
    const fullName = data.prefix + data.firstName + ' ' + data.lastName;
    const empCode = data.employeeCode;
    const stockAccumulate = resStock.stockAccumulate
      ? resStock.stockAccumulate
      : ' ';
    const departMentName = data.departmentName ? data.departmentName : ' ';

    const stock = this.stockInfo;
    const installment = stock?.stockDetails.slice(-1)[0].installment;
    const stockValue = stock?.stockDetails.slice(-1)[0].stockValue;

    const docDefinition = {
      info: {
        title: 'ใบเสร็จรับเงิน',
      },
      content: [
        {
          image: await this.getBase64ImageFromURL(
            '../../assets/images/logo.png'
          ),
          width: 100,
          height: 100,
          margin: [0, 0, 0, 0],
          alignment: 'center',
        },
        { text: 'กองทุนสวัสดิการพนักงานเทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'ใบเสร็จรับเงิน', style: 'header' },
        '\n',
        '\n',
        {
          text: [
            'ประจําเดือน ',
            {
              text:
                ' ' +
                this.billMonth +
                ' ' +
                this.yearSelectNew +
                '               ',
              bold: true,
            },
            { text: 'เลขที่สมาชิก ' },
            { text: empCode, bold: true },
          ],
          margin: [0, 6, 0, 0],
          style: 'texts',
        },
        {
          text: ['ได้รับเงินจาก ', { text: ' ' + fullName, bold: true }],
          margin: [0, 6, 0, 0],
          style: 'texts',
        },
        {
          text: ['สังกัด ', { text: ' ' + departMentName, bold: true }],
          margin: [0, 6, 0, 0],
          style: 'texts',
        },
        // { text: ['เลขที่สมาชิก ', { text: ' ' + empCode, bold: true }], margin: [0, 6, 0, 0], style: 'texts' },
        {
          text: [
            'หุ้นสะสม ',
            {
              text: ' ' + this.formattedNumber2(stockAccumulate) + ' ',
              bold: true,
            },
            { text: '  บาท' },
          ],
          margin: [0, 6, 0, 0],
          style: 'texts',
        },
        '\n',
        {
          color: '#000',
          table: {
            widths: ['*', '*', '*', '*'],
            headerRows: 4,
            body: [
              [
                { text: 'รายการ', style: 'tableHeader' },
                { text: 'งวด', style: 'tableHeader' },
                { text: 'เป็นเงิน', style: 'tableHeader' },
                { text: 'เงินต้นเหลือ', style: 'tableHeader' },
              ],
              [
                'ค่าหุ้น',
                {
                  text: resStock
                    ? this.formattedNumber2(resStock.stockDetailInstallment)
                    : '',
                  alignment: 'right',
                },
                {
                  text: resStock
                    ? this.formattedNumber2(resStock.stockValue)
                    : '',
                  alignment: 'right',
                },
                ' ',
              ],
              [
                'เงินต้น',
                {
                  text: elementLoan
                    ? this.formattedNumber2(elementLoan.installment)
                    : '',
                  alignment: 'right',
                },
                {
                  text: elementLoan
                    ? resStock.installment == resStock.loanTime
                      ? this.formattedNumber2(elementLoan.totalDeduction)
                      : this.formattedNumber2(elementLoan.principal)
                    : '',
                  alignment: 'right',
                },
                {
                  text: elementLoan
                    ? this.formattedNumber2(
                        Math.round(
                          elementLoan.principalBalance - elementLoan.principal
                        )
                      )
                    : '',
                  alignment: 'right',
                },
              ],
              [
                'ดอกเบี้ย',
                ' ',
                {
                  text: elementLoan
                    ? this.formattedNumber2(elementLoan.interest)
                    : '',
                  alignment: 'right',
                },
                ' ',
              ],
              [
                {
                  text: 'รวมเงิน',
                  style: 'tableHeader',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
                {
                  text: sumElementLoan
                    ? this.formattedNumber2(sumElementLoan)
                    : '',
                  style: 'tableHeader',
                  alignment: 'right',
                },
                {},
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
        '\n',
        {
          text: '(' + this.transformPipeThai(sumElementLoan) + ')',
          style: 'header2',
          margin: [20, 0, 0, 0],
        },
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            headerRows: 2,
            body: [
              [
                {
                  image: await this.getBase64ImageFromURL(this.imageSrc1Blob),
                  style: 'tableHeader',
                  width: 150,
                  height: 80,
                  alignment: 'center',
                },
                {
                  image: await this.getBase64ImageFromURL(this.imageSrc2Blob),
                  style: 'tableHeader',
                  width: 150,
                  height: 80,
                  alignment: 'center',
                },
              ],
              [
                {
                  text: 'ประธานกองทุน',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                { text: 'เหรัญญิก', style: 'tableHeader', alignment: 'center' },
              ],
            ],
          },
          layout: 'noBorders',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
        },
        header2: {
          fontSize: 18,
          bold: true,
        },
        texts: {
          fontSize: 16,
          bold: false,
        },
      },
      defaultStyle: {
        fontSize: 16,
        font: 'Sarabun',
      },
    };
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  }

  transformPipeThai(value: number): string {
    const digits = [
      'ศูนย์',
      'หนึ่ง',
      'สอง',
      'สาม',
      'สี่',
      'ห้า',
      'หก',
      'เจ็ด',
      'แปด',
      'เก้า',
    ];
    const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

    let bahtText = '';
    const numString = value.toString();

    // Process each digit of the number
    for (let i = 0; i < numString.length; i++) {
      const digit = parseInt(numString.charAt(i));

      // Skip if the digit is zero
      if (digit === 0) {
        continue;
      }

      const position = positions[numString.length - i - 1];
      const digitText = digits[digit];

      // Append the digit and position to the Thai Baht text
      //bahtText += digitText + position;

      if (position === 'สิบ' && digit === 1) {
        bahtText += '' + position;
      } else if (position === 'สิบ' && digit === 2) {
        bahtText += 'ยี่' + position;
      } else if (position === '' && digit === 1) {
        bahtText += 'เอ็ด' + position;
      } else {
        bahtText += digitText + position;
      }
    }

    return bahtText + 'บาทถ้วน';
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  formattedNumber(number: any): any {
    const decimalPipe = new DecimalPipe('en-US');
    return decimalPipe.transform(number, '1.2-2');
  }

  formattedNumber2(number: any): any {
    const decimalPipe = new DecimalPipe('en-US');

    if (number > 0) {
      return number !== null ? decimalPipe.transform(number) : '';
    } else {
      return '-';
    }
  }

  // getGrandTotal() {
  //   this.service.getGrandTotal().subscribe(data => {
  //     this.grandTotal = data;
  //     console.log(this.grandTotal, '<---------------- this.grandTotal');
  //     this.onPrintTotal(this.grandTotal);
  //   });
  // }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: 'แจ้งเตือน',
      detail: 'โปรดรอสักครู่ PDF อาจใช้เวลาในการเเสดงข้อมูล ประมาณ 1-5 นาที',
    });
  }
}
