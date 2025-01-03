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
import { Observable, Subject, debounceTime } from 'rxjs';
import * as XLSX from 'xlsx';
import { log } from 'console';
import { ListAdminStock } from './models/admin-stock-res';
import {
  AdminStockCriteria,
  AdminStockOrder,
  AdminStockReq,
} from './models/admin-stock-req';

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

@Component({
  selector: 'app-admin-component2',
  templateUrl: './admin-component2.component.html',
  styleUrls: ['./admin-component2.component.scss'],
})
export class AdminComponent2Component implements OnInit {
  menuItems!: MenuItem[];
  menuItemsAll!: MenuItem[];
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
  inputSubject = new Subject<string>();
  monthSelectNew: any;
  yearSelectNew: any;
  filePdfFlag: boolean = false;

  constructor(
    private service: MainService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  ngOnInit() {
    this.loading = true;
    this.initMainForm();
    this.initMainFormStock();
    console.log('----1----');

    this.userId = this.localStorageService.retrieve('empId');
    this.stockId = this.localStorageService.retrieve('stockId');
    this.empDetail = this.localStorageService.retrieve('employeeofmain');
    console.log('----2----');
    // this.getStock(this.stockId);

    // this.searchStock();
    // this.searchStockDetail(this.stockId);
    this.searchStockV2();
    this.initMainFormBill();
    this.setperiodMonthDescOption();
    this.pipeDateTH();
    this.getStockDetail();
    this.initSearchForm();

    this.employeeStatusList = [
      { name: 'ลาออก', value: 3 },
      { name: 'เสียชีวิต', value: 6 },
      { name: 'หนีหนี้', value: 7 },
      { name: 'เกษียณ', value: 8 },
    ];

    this.inputSubject.pipe(debounceTime(1000)).subscribe((value) => {
      // Perform your action here based on the latest value
      if (Number(value) <= this.year) {
        this.formModelBill.patchValue({
          year: value,
        });
      } else {
        this.formModelBill.get('year').setValue(null);
        this.messageService.add({
          severity: 'warn',
          summary: 'เเจ้งเตือน',
          detail: 'ระบุปีต้องไม่เกินปีปัจจุบัน',
          life: 10000,
        });
      }
    });

    this.menuItems = [
      {
        label: 'เรียกเก็บหุ้นรายเดือน',
        command: () => {
          this.updateStocktoMonth();
        },
      },
      {
        label: 'สรุปยอดรวม',
        command: () => {
          this.getGrandTotal('สรุปยอดรวม');
        },
      },
      {
        label: 'ข้อมูลสมาชิก',
        command: () => {
          this.documentInfoAll('ข้อมูลสมาชิก');
        },
      },
    ];

    this.menuItemsAll = [
      {
        label: 'เรียกเก็บหุ้นรายเดือน',
        command: () => {
          this.updateStocktoMonth();
        },
      },
      {
        label: 'สรุปยอดรวม',
        command: () => {
          this.getGrandTotal('สรุปยอดรวม');
        },
      },
      {
        label: 'ข้อมูลสมาชิก',
        command: () => {
          this.documentInfoAll('ข้อมูลสมาชิก');
        },
      },
      {
        label: 'ประวัติการส่งหุ้นของสมาชิก',
        command: () => {
          this.ondisplayModalMonth('ประวัติการส่งหุ้นของสมาชิกทั้งหมด');
        },
      },
      {
        label: 'ดาวน์โหลด PDF',
        command: () => {
          this.ondisplayModalMonth('downloadPdf');
        },
      },
      {
        label: 'ดาวน์โหลด EXCEL',
        command: () => {
          this.ondisplayModalMonth('downloadExcel');
        },
      },
    ];
  }

  onRowEditStatusEmp(data: any) {
    this.empId = data.employeeId;
    this.displayStatusMember = true;
  }

  onChangeStatusEmp() {
    const payload = {
      id: this.empId,
      type: this.employeeStatus.value,
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

  loadCustomers(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
      this.service.searchStockDetail(this.stockId, 'asc').subscribe((res) => {
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

  searchStock(): void {
    this.service.searchStock().subscribe((data) => {
      this.dataStock = data;
      this.loading = false;
    });
  }

  // function table full code.
  listEmp!: ListAdminStock[];
  selected!: ListAdminStock[];
  selectAll: boolean = false;
  select: boolean = false;
  selectLength!: number;

  page: number = 1;
  pageSize: number = 10;
  body!: AdminStockReq;

  criteria: AdminStockCriteria | undefined = {
    employeeCode: undefined,
    firstName: undefined,
    lastName: undefined,
    idCard: undefined,
  };

  order: AdminStockOrder | undefined = {
    id: 'ASC',
    createDate: undefined,
  };

  searchStockV2(): void {
    this.loading = true;

    const { page, pageSize, criteria, order } = this;
    this.body = {
      criteria: criteria,
      order: JSON.stringify(order) === '{}' ? undefined : order,
      pageReq: {
        page: page,
        pageSize: pageSize,
      },
    };

    this.service.searchStockV2(this.body).subscribe((res) => {
      this.dataStock = res.data?.contents!.filter(
        (content) => content.employeeCode !== '00000'
      );
      this.totalRecords = res.data?.totalElements!;
      this.loading = false;
    });
  }

  searchForm: FormGroup;
  initSearchForm() {
    this.searchForm = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      idCard: new FormControl(null),
      employeeCode: new FormControl(null),
    });
  }

  onAcceptSearch() {
    const searchAdmin: AdminStockCriteria = {};
    const firstName = this.searchForm.get('firstName')?.value;
    const lastName = this.searchForm.get('lastName')?.value;
    const idCard = this.searchForm.get('idCard')?.value;
    const employeeCode = this.searchForm.get('employeeCode')?.value;

    if (firstName) {
      searchAdmin.firstName = firstName;
    }
    if (lastName) {
      searchAdmin.lastName = lastName;
    }
    if (idCard) {
      searchAdmin.idCard = idCard;
    }
    if (employeeCode) {
      searchAdmin.employeeCode = employeeCode;
    }

    this.criteria = searchAdmin;
    this.searchStockV2();
  }

  onClearSearch(): void {
    this.searchForm.reset();
    this.criteria = {
      employeeCode: undefined,
      firstName: undefined,
      lastName: undefined,
      idCard: undefined,
    };
    this.searchStockV2();
  }

  onPage(event: any) {
    this.pageSize = event.rows;
    this.clearSelectedAll();
  }

  loadingAdminStock(e: any) {
    this.pageSize = e.rows!;
    this.page = e.first == 0 ? 1 : e.first! / e.rows! + 1;
    this.searchStockV2();
  }

  onSort(column: keyof AdminStockOrder) {
    if (this.order) {
      (Object.keys(this.order) as (keyof AdminStockOrder)[]).forEach((key) => {
        if (this.order && key !== column) {
          this.order[key] = undefined;
        }
      });

      this.order[column] = this.order[column] === 'ASC' ? 'DESC' : 'ASC';
      this.searchStockV2();
    }
  }

  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selected = value;
    this.selectLength = value.length;

    if (this.selectLength === 0) {
      this.select = false;
    } else {
      this.select = true;
    }
  }

  onSelectAllChange(event: any) {
    const checked = event.checked;

    if (checked) {
      this.selected = this.listEmp.filter(
        (content) => content.employeeCode !== '00000'
      );
      this.selectAll = true;
      this.selectLength = this.selected.length;
      this.select = true;
    } else {
      this.selected = [];
      this.selectAll = false;
      this.select = false;
    }
  }

  clearSelectedAll() {
    this.selected = [];
    this.selectAll = false;
    this.select = false;
  }

  // ============================================= //

  // getStock(id: any): void {
  //   this.service.getStock(id).subscribe(data => {
  //     this.stockInfo = data;
  //     this.loading = false;
  //   });
  // }

  // searchStockDetail(id: any): void {
  //   this.service.searchStockDetail(id, "asc").subscribe(data => {
  //     this.dataStockDetail = data;
  //   });
  // }

  checkStatusEmpColor(status: any): { [key: string]: string } {
    let color: string;

    switch (status) {
      case 'สมาชิกแรกเข้า':
        color = '#DE3163';
        break;
      case 'ใช้งานปกติ':
        color = '#6FAF00';
        break;
      case 'ลาออก':
        color = '#D92C2C';
        break;
      case 'รออนุมัติลาออก':
        color = '#DD9D0A';
        break;
      case 'เสียชีวิต':
        color = '#A17EEB';
        break;
      case 'หนีหนี้':
        color = '#FF6B00';
        break;
      case 'เกษียณ':
        color = '#0094FF';
        break;
      default:
        break;
    }

    return { color: color };
  }

  onRowEditInit(stock: any) {
    this.clonedProducts[stock.id] = { ...stock };
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
  monthValue: any;
  monthBefore: any;
  monthValueBefore: any;
  pipeDateTH() {
    const format = new Date();
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;
    this.year = year;
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    this.monthValue = monthSelect.value;

    const monthSelectBefore = this.periodMonthDescOption[month - 1];
    this.monthBefore = monthSelectBefore.label;
    this.monthValueBefore = monthSelectBefore.value;
    const time =
      this.addLeadingZero(format.getHours()) +
      ':' +
      this.addLeadingZero(format.getMinutes()) +
      ' น.';
    this.time = time;
    return day + ' ' + monthSelect.label + ' ' + year;
  }

  convertPipeDateTH(date: any) {
    const format = new Date(date);
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;
    this.year = year;
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    this.monthValue = monthSelect.value;
    const time =
      this.addLeadingZero(format.getHours()) +
      ':' +
      this.addLeadingZero(format.getMinutes()) +
      ' น.';
    this.time = time;
    return day + ' ' + monthSelect.label + ' ' + year;
  }

  addLeadingZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
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
  oldYear: any;
  newMonth: any;
  newYear: any;
  updateStocktoMonth() {
    this.displayModal = true;

    const formatDate = new Date();
    const month = formatDate.getMonth();
    this.newYear = formatDate.getFullYear() + 543;
    this.newMonth = this.periodMonthDescOption[month];

    if (month <= 0) {
      this.oldMonth = this.periodMonthDescOption[11];
      this.oldYear = this.newYear - 1;
    } else {
      this.oldMonth = this.periodMonthDescOption[month - 1];
      this.oldYear = this.newYear;
    }

    this.formModelStock.patchValue({
      stockYear: this.newYear,
      stockMonth: this.newMonth.label,
    });

    this.formModelStock.get('stockMonth')?.disable();
    this.formModelStock.get('stockYear')?.disable();

    this.checkInsertStockDetailAll();
  }

  showWarnAddStock() {
    this.messageService.add({
      severity: 'warn',
      summary: 'แจ้งเตือน',
      detail: 'โปรดรอสักครู่ อาจใช้เวลาในการประมวลผลข้อมูล ประมาณ 1-5 นาที',
      life: 10000,
    });
  }

  onupdateStockToMonth() {
    this.showWarnAddStock();
    this.addFilePdfInfoAll();
    const payload = {
      oldMonth: this.oldMonth.label,
      oldYear: this.oldYear,
      newMonth: this.newMonth.label,
      newYear: this.newYear,
    };
    this.service.insertStockDetail(payload).subscribe((data) => {
      this.messageService.add({ severity: 'success', detail: 'เพิ่มสำเร็จ' });
      this.displayModal = false;
      this.ngOnInit();
    });
  }

  addFilePdfInfoAll() {
    this.formModelBill.patchValue({
      year: this.year,
      month: this.monthValueBefore,
    });
    this.filePdfFlag = true;
    this.docInfoAll();
  }

  onCancleModalBill() {
    this.formModelBill.reset();
    this.formModelBill.patchValue({
      year: this.year,
      month: this.monthValue,
    });
    this.displayModalBill = false;
  }

  onCancle() {
    this.formModelStock.reset();
    this.displayModal = false;
  }

  checkNull: boolean = true;
  checkValueOfNull(event: any) {
    if (!event.value) {
      this.checkNull = true;
    } else {
      this.checkNull = false;
    }
  }

  stockDetail: any;
  getStockDetail(): void {
    const payload = {
      stockMonth: this.month,
      stockYear: this.year,
    };
    this.service.getStockDetail(payload).subscribe((data) => {
      this.stockDetail = data;
    });
  }

  checkInsertStockDetailAll() {
    const stockDetail = this.stockDetail;
    const formatDate = new Date();
    const month = formatDate.getMonth();
    const monthSelect = this.periodMonthDescOption[month];

    if (stockDetail != null) {
      if (stockDetail.stockMonth === monthSelect.label) {
        this.checkNull = true;
      } else {
        this.checkNull = false;
      }
    } else {
      this.checkNull = false;
    }
  }

  clear(table: Table) {
    table.clear();
  }

  departmentNames: any[] = [];
  checknullOfDepartment(name: any) {
    const dName = this.dapartment;
    if (name) {
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
  infogroup32: any[] = [];
  infogroup33: any[] = [];
  infogroup34: any[] = [];

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
    this.infogroup32 = [];
    this.infogroup33 = [];
    this.infogroup34 = [];

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
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดป่าแพ่ง'
      ) {
        this.infogroup32.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดเกตการาม'
      ) {
        this.infogroup33.push(element);
      } else if (
        element.departmentName ===
        'งานระดับก่อนวัยเรียนและประถมศึกษา ศูนย์พัฒนาเด็กเล็กเทศบาลนครเชียงใหม่'
      ) {
        this.infogroup34.push(element);
      } else {
        console.log('else error !!!');
      }
    });
  }

  checkListDataPDF(list: any[]) {
    const decimalPipe = new DecimalPipe('en-US');
    if (list.length > 0) {
      let datalListGroup = list.map(function (item) {
        let sum = 0;
        // sum = (item.stockValue + (item.loanOrdinary - item.interest)) + item.interest;
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
            text:
              Number(item.loanInstallment) === Number(item.loanTime)
                ? decimalPipe.transform(item.loanOrdinary)
                : decimalPipe.transform(item.loanOrdinary - item.interest),
            alignment: 'right',
          },
          { text: decimalPipe.transform(item.interest), alignment: 'right' },
          { text: decimalPipe.transform(item.sumMonth), alignment: 'right' }, //
          //{ text: decimalPipe.transform(item.stockAccumulate), alignment: 'right' },
          {
            text:
              Number(item.stockInstallment) <= 1
                ? Number(item.stockAccumulate) - Number(item.stockValue)
                : decimalPipe.transform(
                    Number(item.stockAccumulate) - Number(item.stockValue)
                  ),
            alignment: 'right',
          },
        ];
      });
      return datalListGroup;
    } else {
      return '';
    }
  }

  checkListSumAllByDepartment(
    listSum: any[],
    nameDepartment: any,
    infogroup: any[]
  ) {
    if (listSum.length > 0) {
      const dataSum = this.checkTotalListGroup(infogroup);
      let sumDepartment: (
        | string
        | { text: string; alignment: string; bold: boolean }
        | { text: any; alignment: string; bold?: undefined }
      )[];
      let stockValueTotal = 0;
      let loanDetailOrdinaryTotal = 0;
      let loanDetailInterestTotal = 0;
      let totalMonth = 0;
      let stockAccumulateTotal = 0;
      listSum?.forEach((element, _index, _array) => {
        if (element.departmentName === nameDepartment) {
          stockValueTotal += Number(element.stockValueTotal);
          loanDetailOrdinaryTotal += Number(element.loanDetailOrdinaryTotal);
          loanDetailInterestTotal += Number(element.loanDetailInterestTotal);
          totalMonth += Number(element.totalMonth);
          stockAccumulateTotal += Number(element.stockAccumulateTotal);
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
              text: this.formattedNumber2(dataSum.stockValueTotal),
              alignment: 'right',
            },
            ' ',
            {
              text:
                dataSum.loanDetailOrdinaryTotal >= 0
                  ? this.formattedNumber2(dataSum.loanDetailOrdinaryTotal)
                  : ' ',
              alignment: 'right',
            },
            {
              text:
                dataSum.loanDetailInterestTotal >= 0
                  ? this.formattedNumber2(dataSum.loanDetailInterestTotal)
                  : ' ',
              alignment: 'right',
            },
            {
              text:
                dataSum.totalMonth >= 0
                  ? this.formattedNumber2(dataSum.totalMonth)
                  : ' ',
              alignment: 'right',
            },
            {
              text:
                dataSum.stockAccumulateTotal >= 0
                  ? this.formattedNumber2(dataSum.stockAccumulateTotal)
                  : ' ',
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

  sumGrandTotal1: number = 0;
  sumGrandTotal2: number = 0;
  sumGrandTotal3: number = 0;
  sumGrandTotal4: number = 0;
  sumGrandTotal5: number = 0;

  checkTotalListGroup(listGroup: any[]) {
    let stockValueTotal = 0;
    let loanDetailOrdinaryTotal = 0;
    let loanDetailInterestTotal = 0;
    let totalMonth = 0;
    let stockAccumulateTotal = 0;

    listGroup?.forEach((element, _index, _array) => {
      stockValueTotal =
        stockValueTotal + Number(element.stockValue ? element.stockValue : 0);
      loanDetailOrdinaryTotal =
        loanDetailOrdinaryTotal +
        (Number(element.loanInstallment) === Number(element.loanTime)
          ? Number(element.loanOrdinary ? element.loanOrdinary : 0)
          : Number(element.loanOrdinary ? element.loanOrdinary : 0) -
            Number(element.interest ? element.interest : 0));
      loanDetailInterestTotal =
        loanDetailInterestTotal +
        Number(element.interest ? element.interest : 0);
      totalMonth = totalMonth + Number(element.sumMonth ? element.sumMonth : 0);
      stockAccumulateTotal =
        stockAccumulateTotal +
        (Number(element.stockInstallment) <= 1
          ? Number(element.stockAccumulate ? element.stockAccumulate : 0) -
            Number(element.stockValue ? element.stockValue : 0)
          : Number(element.stockAccumulate ? element.stockAccumulate : 0) -
            Number(element.stockValue ? element.stockValue : 0));
    });
    this.sumGrandTotal1 = this.sumGrandTotal1 + stockValueTotal;
    this.sumGrandTotal2 = this.sumGrandTotal2 + loanDetailOrdinaryTotal;
    this.sumGrandTotal3 = this.sumGrandTotal3 + loanDetailInterestTotal;
    this.sumGrandTotal4 = this.sumGrandTotal4 + totalMonth;
    this.sumGrandTotal5 = this.sumGrandTotal5 + stockAccumulateTotal;
    const playload = {
      stockValueTotal: stockValueTotal,
      loanDetailOrdinaryTotal: loanDetailOrdinaryTotal,
      loanDetailInterestTotal: loanDetailInterestTotal,
      totalMonth: totalMonth,
      stockAccumulateTotal: stockAccumulateTotal,
    };
    return playload;
  }

  checkListSumGrandTotal(listSum: any[]) {
    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;
    let sum4 = 0;
    let sum5 = 0;

    let sumDepartment: (
      | string
      | { text: string; alignment: string; bold: boolean }
      | { text: any; alignment: string; bold?: undefined }
    )[];

    listSum?.forEach((element, _index, _array) => {
      sum1 =
        sum1 +
        (Number(element.stockValueTotal) ? Number(element.stockValueTotal) : 0);
      sum2 =
        sum2 +
        (Number(element.loanDetailOrdinaryTotal)
          ? Number(element.loanDetailOrdinaryTotal)
          : 0);
      sum3 =
        sum3 +
        (Number(element.loanDetailInterestTotal)
          ? Number(element.loanDetailInterestTotal)
          : 0);
      sum4 =
        sum4 + (Number(element.totalMonth) ? Number(element.totalMonth) : 0);
      sum5 =
        sum5 +
        (Number(element.stockAccumulateTotal)
          ? Number(element.stockAccumulateTotal) -
            Number(element.stockValueTotal)
          : 0);
    });

    sumDepartment = [
      { text: 'Grand Total', alignment: 'left', bold: true },
      ' ',
      ' ',
      ' ',
      { text: this.formattedNumber2(this.sumGrandTotal1), alignment: 'right' },
      ' ',
      { text: this.formattedNumber2(this.sumGrandTotal2), alignment: 'right' },
      { text: this.formattedNumber2(this.sumGrandTotal3), alignment: 'right' },
      { text: this.formattedNumber2(this.sumGrandTotal4), alignment: 'right' },
      { text: this.formattedNumber2(this.sumGrandTotal5), alignment: 'right' },
    ];

    return sumDepartment;
  }

  list!: any[];
  sumStock: any;
  searchDocumentV1PDF(mode: any) {
    let stockInfo: any[] = [];
    const playload = {
      empId: this.userId,
    };

    this.service.searchDocumentV1(playload).subscribe((data) => {
      this.list = data;
      const key = 'stockInstallment';
      const arrayUniqueByKey = [
        ...new Map(data.map((item) => [item[key], item])).values(),
      ];
      this.getSearchDocumentV2Sum(playload, arrayUniqueByKey, mode);
    });
  }

  getSearchDocumentV2Sum(playload: any, stockInfo: any[], mode: any) {
    this.service.searchDocumentV2Sum(playload).subscribe((data) => {
      this.sumStock = data[0];
      this.exportMakePDF(mode, stockInfo, this.sumStock);
    });
  }

  exportMakePDF(mode: any, stockInfo: any[], sum: any) {
    const decimalPipe = new DecimalPipe('en-US');
    let detailStock = stockInfo.map(function (item) {
      return [
        { text: item.departmentName, alignment: 'left' },
        { text: item.employeeCode, alignment: 'center' },
        { text: item.fullName, alignment: 'left' },
        {
          text: decimalPipe.transform(item.stockInstallment),
          alignment: 'center',
        },
        { text: decimalPipe.transform(item.stockValue), alignment: 'right' },
        {
          text: decimalPipe.transform(item.loanInstallment),
          alignment: 'center',
        },
        { text: decimalPipe.transform(item.loanOrdinary), alignment: 'right' },
        { text: decimalPipe.transform(item.interest), alignment: 'right' },
        { text: decimalPipe.transform(item.sumMonth), alignment: 'right' },
        {
          text: decimalPipe.transform(item.stockAccumulate),
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
      pageSize: 'A3',
      pageOrientation: 'landscape',
      //pageMargins: [40, 80, 40, 60],
      info: {
        title: 'ประวัติการส่งหุ้น',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        //{ text: 'รายงานเงินกู้และค่าหุ้น เดือน'+this.month+' พ.ศ.'+this.year, style: 'header' },
        { text: 'รายงานเงินกู้และค่าหุ้น', style: 'header' },
        '\n',
        {
          style: 'tableExample',
          // alignment: 'right',

          table: {
            headerRows: 1,
            widths: ['*', 65, '*', 70, 90, 85, 90, 85, 85, 85],
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
                {
                  text: 'เงินกู้(งวดที่)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'เงินกู้สามัญเงินต้น',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                { text: 'ดอกเบี้ย', style: 'tableHeader', alignment: 'center' },
                {
                  text: 'รวมส่ง(เดือน)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                { text: 'หุ้นสะสม', style: 'tableHeader', alignment: 'center' },
              ],
              ...detailStock,
              [
                {
                  text: sum.departmentName + ' Total',
                  alignment: 'left',
                  bold: true,
                },
                ' ',
                ' ',
                ' ',
                {
                  text: decimalPipe.transform(sum.stockValueTotal),
                  alignment: 'right',
                },
                ' ',
                {
                  text: decimalPipe.transform(sum.loanDetailOrdinaryTotal),
                  alignment: 'right',
                },
                {
                  text: decimalPipe.transform(sum.loanDetailInterestTotal),
                  alignment: 'right',
                },
                {
                  text: decimalPipe.transform(sum.totalMonth),
                  alignment: 'right',
                },
                {
                  text: decimalPipe.transform(sum.stockAccumulateTotal),
                  alignment: 'right',
                },
              ],
            ],
          },
          layout: {
            fillColor: function (
              rowIndex: number,
              node: any,
              columnIndex: any
            ) {
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

  searchDocumentV1All(mode: any) {
    // this.displayLoadingPdf = true;
    if (mode === 'excel') {
      this.showWarnExcel();
    } else {
      this.showWarn();
    }
    this.sumGrandTotal1 = 0;
    this.sumGrandTotal2 = 0;
    this.sumGrandTotal3 = 0;
    this.sumGrandTotal4 = 0;
    this.sumGrandTotal5 = 0;

    const bill = this.formModelBill.getRawValue();
    const subMonth =
      bill.month.length > 1 ? bill.month : bill.month.substring(1, 2);
    this.billMonth = this.periodMonthDescOption[Number(subMonth) - 1].label;

    const playload = {
      monthCurrent: this.billMonth,
      yearCurrent: bill.year,
    };
    this.monthSelectNew = this.billMonth;
    this.yearSelectNew = bill.year;

    if (
      this.year == bill.year &&
      this.monthValue == Number(bill.month).toString()
    ) {
      this.service.searchDocumentV1(playload).subscribe((data) => {
        this.list = data;
        this.getSearchDocumentV2SumAll(playload, mode, data);
      });
    } else {
      this.service.searchDocumentV1DetailHistory(playload).subscribe((data) => {
        this.list = data;
        this.getSearchDocumentV2SumAllDetailHistory(playload, mode, data);
      });
    }
  }

  getSearchDocumentV2SumAll(playload: any, mode: any, listdata: any[]) {
    this.service.searchDocumentV2Sum(playload).subscribe((data) => {
      this.sumStock = data;
      this.checkDepartment(listdata);
      this.exportMakePDFALL(mode, data);
    });
  }

  getSearchDocumentV2SumAllDetailHistory(
    playload: any,
    mode: any,
    listdata: any[]
  ) {
    this.service
      .searchDocumentV2SumDetailHistory(playload)
      .subscribe((data) => {
        this.sumStock = data;
        this.checkDepartment(listdata);
        this.exportMakePDFALL(mode, data);
      });
  }

  exportMakePDFALL(mode: any, listSum: any[]) {
    const sections = [];

    // Push data sections with corresponding summary data if available
    const pushDataSection = (data: any[], sumData: any[]) => {
      if (data.length > 0) {
        sections.push(...data, sumData);
      }
    };

    let data1 = this.checkListDataPDF(this.infogroup1) || [];
    let dataSum1 =
      this.checkListSumAllByDepartment(
        listSum,
        'แขวงเม็งราย',
        this.infogroup1
      ) || [];
    let data2 = this.checkListDataPDF(this.infogroup2) || [];
    let dataSum2 =
      this.checkListSumAllByDepartment(
        listSum,
        'แขวงกาวิละ',
        this.infogroup2
      ) || [];
    let data3 = this.checkListDataPDF(this.infogroup3) || [];
    let dataSum3 =
      this.checkListSumAllByDepartment(
        listSum,
        'แผนงานบริหารทั่วไป',
        this.infogroup3
      ) || [];
    let data4 = this.checkListDataPDF(this.infogroup4) || [];
    let dataSum4 =
      this.checkListSumAllByDepartment(listSum, 'งานเทศกิจ', this.infogroup4) ||
      [];
    let data5 = this.checkListDataPDF(this.infogroup5) || [];
    let dataSum5 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานโรงพยาบาล',
        this.infogroup5
      ) || [];

    let data6 = this.checkListDataPDF(this.infogroup6) || [];
    let dataSum6 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานก่อสร้าง',
        this.infogroup6
      ) || [];
    let data7 = this.checkListDataPDF(this.infogroup7) || [];
    let dataSum7 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารงานคลัง',
        this.infogroup7
      ) || [];
    let data8 = this.checkListDataPDF(this.infogroup8) || [];
    let dataSum8 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารงานคลัง ฝ่ายประจำ',
        this.infogroup8
      ) || [];
    let data9 = this.checkListDataPDF(this.infogroup9) || [];
    let dataSum9 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารงานทั่วไป',
        this.infogroup9
      ) || [];
    let data10 = this.checkListDataPDF(this.infogroup10) || [];
    let dataSum10 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารทั่วไป',
        this.infogroup10
      ) || [];

    let data11 = this.checkListDataPDF(this.infogroup11) || [];
    let dataSum11 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารทั่วไป ฝ่ายประจำ',
        this.infogroup11
      ) || [];
    let data12 = this.checkListDataPDF(this.infogroup12) || [];
    let dataSum12 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารทั่วไปเกี่ยวกับเคหะและชุมชน',
        this.infogroup12
      ) || [];
    let data13 = this.checkListDataPDF(this.infogroup13) || [];
    let dataSum13 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารทั่วไปเกี่ยวกับการศึกษา',
        this.infogroup13
      ) || [];
    let data14 = this.checkListDataPDF(this.infogroup14) || [];
    let dataSum14 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารทั่วไปเกี่ยวกับสังคมสงเคราะห์',
        this.infogroup14
      ) || [];
    let data15 = this.checkListDataPDF(this.infogroup15) || [];
    let dataSum15 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารทั่วไปเกี่ยวกับสาธารณสุข',
        this.infogroup15
      ) || [];

    let data16 = this.checkListDataPDF(this.infogroup16) || [];
    let dataSum16 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานบริหารทั่วไปเกี่ยวกับอุตสาหกรรมและการโยธา',
        this.infogroup16
      ) || [];
    let data17 = this.checkListDataPDF(this.infogroup17) || [];
    let dataSum17 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานป้องกันและบรรเทาสาธารณภัย',
        this.infogroup17
      ) || [];
    let data18 = this.checkListDataPDF(this.infogroup18) || [];
    let dataSum18 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลดอกเงิน',
        this.infogroup18
      ) || [];
    let data19 = this.checkListDataPDF(this.infogroup19) || [];
    let dataSum19 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดเชียงยืน',
        this.infogroup19
      ) || [];
    let data20 = this.checkListDataPDF(this.infogroup20) || [];
    let dataSum20 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดกู่คำ',
        this.infogroup20
      ) || [];

    let data21 = this.checkListDataPDF(this.infogroup21) || [];
    let dataSum21 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดท่าสะต๋อย',
        this.infogroup21
      ) || [];
    let data22 = this.checkListDataPDF(this.infogroup22) || [];
    let dataSum22 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดพวกช้าง',
        this.infogroup22
      ) || [];
    let data23 = this.checkListDataPDF(this.infogroup23) || [];
    let dataSum23 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดศรีปิงเมือง',
        this.infogroup23
      ) || [];
    let data24 = this.checkListDataPDF(this.infogroup24) || [];
    let dataSum24 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดศรีสุพรรณ',
        this.infogroup24
      ) || [];
    let data25 = this.checkListDataPDF(this.infogroup25) || [];
    let dataSum25 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดหมื่นเงินกอง',
        this.infogroup25
      ) || [];

    let data26 = this.checkListDataPDF(this.infogroup26) || [];
    let dataSum26 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนชุมชนเทศบาลวัดศรีดอนไชย',
        this.infogroup26
      ) || [];
    let data27 = this.checkListDataPDF(this.infogroup27) || [];
    let dataSum27 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา งานการศึกษานอกระบบฯ',
        this.infogroup27
      ) || [];
    let data28 = this.checkListDataPDF(this.infogroup28) || [];
    let dataSum28 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานวางแผนสถิติและวิชาการ',
        this.infogroup28
      ) || [];
    let data29 = this.checkListDataPDF(this.infogroup29) || [];
    let dataSum29 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานวิชาการวางแผนและส่งเสริมการท่องเที่ยว',
        this.infogroup29
      ) || [];
    let data30 = this.checkListDataPDF(this.infogroup30) || [];
    let dataSum30 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานสุขาภิบาล',
        this.infogroup30
      ) || [];
    let data31 = this.checkListDataPDF(this.infogroup31) || [];
    let dataSum31 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา',
        this.infogroup31
      ) || [];
    let data32 = this.checkListDataPDF(this.infogroup32) || [];
    let dataSum32 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดป่าแพ่ง',
        this.infogroup32
      ) || [];
    let data33 = this.checkListDataPDF(this.infogroup33) || [];
    let dataSum33 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา โรงเรียนเทศบาลวัดเกตการาม',
        this.infogroup33
      ) || [];
    let data34 = this.checkListDataPDF(this.infogroup34) || [];
    let dataSum34 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและประถมศึกษา ศูนย์พัฒนาเด็กเล็กเทศบาลนครเชียงใหม่',
        this.infogroup34
      ) || [];

    let sunGrandTotal = this.checkListSumGrandTotal(listSum);

    // Push data sections along with their summaries if they have values
    pushDataSection(data1, dataSum1);
    pushDataSection(data2, dataSum2);
    pushDataSection(data3, dataSum3);
    pushDataSection(data4, dataSum4);
    pushDataSection(data5, dataSum5);
    pushDataSection(data6, dataSum6);
    pushDataSection(data7, dataSum7);
    pushDataSection(data8, dataSum8);
    pushDataSection(data9, dataSum9);
    pushDataSection(data10, dataSum10);
    pushDataSection(data11, dataSum11);
    pushDataSection(data12, dataSum12);
    pushDataSection(data13, dataSum13);
    pushDataSection(data14, dataSum14);
    pushDataSection(data15, dataSum15);
    pushDataSection(data16, dataSum16);
    pushDataSection(data17, dataSum17);
    pushDataSection(data18, dataSum18);
    pushDataSection(data19, dataSum19);
    pushDataSection(data20, dataSum20);
    pushDataSection(data21, dataSum21);
    pushDataSection(data22, dataSum22);
    pushDataSection(data23, dataSum23);
    pushDataSection(data24, dataSum24);
    pushDataSection(data25, dataSum25);
    pushDataSection(data26, dataSum26);
    pushDataSection(data27, dataSum27);
    pushDataSection(data28, dataSum28);
    pushDataSection(data29, dataSum29);
    pushDataSection(data30, dataSum30);
    pushDataSection(data31, dataSum31);
    pushDataSection(data32, dataSum32);
    pushDataSection(data33, dataSum33);
    pushDataSection(data34, dataSum34);

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
      pageSize: 'A3',
      pageOrientation: 'landscape',
      //pageMargins: [40, 80, 40, 60],
      info: {
        title: 'ประวัติการส่งหุ้น',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        {
          text:
            'รายงานเงินกู้และค่าหุ้น เดือน' +
            this.monthSelectNew +
            ' พ.ศ.' +
            this.yearSelectNew,
          style: 'header',
        },
        '\n',
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [225, 65, 150, 70, 90, 80, 90, 80, 85, 85],
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
                {
                  text: 'เงินกู้(งวดที่)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'เงินกู้สามัญเงินต้น',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                { text: 'ดอกเบี้ย', style: 'tableHeader', alignment: 'center' },
                {
                  text: 'รวมส่ง(เดือน)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                { text: 'หุ้นสะสม', style: 'tableHeader', alignment: 'center' },
              ],

              // group 1
              ...sections,
              // ...data1,
              // dataSum1,
              // ...data2,
              // dataSum2,
              // ...data3,
              // dataSum3,
              // ...data4,
              // dataSum4,
              // ...data5,
              // dataSum5,
              // ...data6,
              // dataSum6,
              // ...data7,
              // dataSum7,
              // ...data8,
              // dataSum8,
              // ...data9,
              // dataSum9,
              // ...data10,
              // dataSum10,

              // // group 2
              // ...data11,
              // dataSum11,
              // ...data12,
              // dataSum12,
              // ...data13,
              // dataSum13,
              // ...data14,
              // dataSum14,
              // ...data15,
              // dataSum15,
              // ...data16,
              // dataSum16,
              // ...data17,
              // dataSum17,
              // ...data18,
              // dataSum18,
              // ...data19,
              // dataSum19,
              // ...data20,
              // dataSum20,

              // // group 1
              // ...data21,
              // dataSum21,
              // ...data22,
              // dataSum22,
              // ...data23,
              // dataSum23,
              // ...data24,
              // dataSum24,
              // ...data25,
              // dataSum25,
              // ...data26,
              // dataSum26,
              // ...data27,
              // dataSum27,
              // ...data28,
              // dataSum28,
              // ...data29,
              // dataSum29,
              // ...data30,
              // dataSum30,
              // ...data31,
              // dataSum31,
              sunGrandTotal,
            ],
          },
          layout: {
            fillColor: function (
              rowIndex: number,
              node: any,
              columnIndex: any
            ) {
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
    } else if (mode === 'pdf') {
      pdf.download('ประวัติการส่งหุ้น.pdf');
    } else if (mode === 'excel') {
      this.exportDataToExcel(sections, sunGrandTotal);
    }
  }

  replaceTextInExcel(text: any) {
    const textRe = text ? text.replace(/,/g, '') : 0;
    return textRe ? Number(textRe) : 0;
  }

  exportDataToExcel(listDataStock: any[], sunGrandTotal: any[]) {
    const textTitle = 'เทศบาลนครเชียงใหม่';
    const textHeader =
      'รายงานเงินกู้และค่าหุ้น เดือน' +
      this.monthSelectNew +
      ' พ.ศ.' +
      this.yearSelectNew;
    let columnHeaders = [
      [textTitle, '', ''],
      [textHeader, '', ''],
      ['', '', ''],
      [
        'หน่วยงาน',
        'รหัสพนักงาน',
        'ชื่อ-สกุล',
        'ค่าหุ้น(งวดที่)',
        'ค่าหุ้น(จำนวนเงิน)',
        'เงินกู้(งวดที่)',
        'เงินกู้สามัญเงินต้น',
        'ดอกเบี้ย',
        'รวมส่ง(เดือน)',
        'หุ้นสะสม',
      ],
    ];

    for (let i = 0; i < listDataStock.length; i++) {
      columnHeaders.push([
        listDataStock[i][0].text,
        listDataStock[i][1].text,
        listDataStock[i][2].text,
        this.replaceTextInExcel(listDataStock[i][3].text),
        this.replaceTextInExcel(listDataStock[i][4].text),
        this.replaceTextInExcel(listDataStock[i][5].text),
        this.replaceTextInExcel(listDataStock[i][6].text),
        this.replaceTextInExcel(listDataStock[i][7].text),
        this.replaceTextInExcel(listDataStock[i][8].text),
        this.replaceTextInExcel(listDataStock[i][9].text),
      ]);
    }

    // last row sumTotal
    columnHeaders.push([
      sunGrandTotal[0].text,
      '',
      '',
      '',
      this.replaceTextInExcel(sunGrandTotal[4].text),
      '',
      this.replaceTextInExcel(sunGrandTotal[6].text),
      this.replaceTextInExcel(sunGrandTotal[7].text),
      this.replaceTextInExcel(sunGrandTotal[8].text),
      this.replaceTextInExcel(sunGrandTotal[9].text),
    ]);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(columnHeaders);
    ws['!cols'] = [
      { width: 50 },
      { width: 15 },
      { width: 30 },
      { width: 15 },
      { width: 20 },
      { width: 15 },
      { width: 20 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ประวัติการส่งหุ้น.xlsx');
  }

  onSearchCalculateLoanOld(res: any, stockValue: any) {
    const payloadOld = {
      principal: res.loanValue,
      interestRate: Number(res.interestPercent),
      numOfPayments: res.loanTime,
      paymentStartDate: '2023-01-31',
    };
    this.service.onCalculateLoanOld(payloadOld).subscribe((resL) => {
      const data = resL;
      data.forEach(
        (
          element: { installment: any; totalDeduction: number; interest: any },
          index: any,
          array: any
        ) => {
          if (element.installment === res.installment) {
            this.sumElementLoan =
              Number(stockValue) + element.totalDeduction + element.interest;
            this.elementLoan = element;
            this.onPrintReceiptMakePdf(element, this.sumElementLoan);
          }
        }
      );
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
    this.formModelBill.get('year').enable();
    //this.formModelBill.get('year')?.disable();
  }

  onDisplay() {
    if (this.headerName === 'ใบเสร็จรับเงิน') {
      this.onupdateBill();
      this.displayModalBill = false;
    } else if (this.headerName === 'ประวัติการส่งหุ้นของสมาชิกทั้งหมด') {
      this.searchDocumentV1All('export');
      this.displayModalBill = false;
    } else if (this.headerName === 'สรุปยอดรวม') {
      this.totalMemLoan();
      this.displayModalBill = false;
    } else if (this.headerName === 'ข้อมูลสมาชิก') {
      this.docInfoAll();
      this.displayModalBill = false;
    } else if (this.headerName === 'ดาวน์โหลด PDF') {
      this.searchDocumentV1All('pdf');
      this.displayModalBill = false;
    } else if (this.headerName === 'ดาวน์โหลด EXCEL') {
      this.searchDocumentV1All('excel');
      this.displayModalBill = false;
    }
  }

  docInfoAll() {
    if (!this.filePdfFlag) {
      this.showWarn();
    }
    const dataMY = this.formModelBill.getRawValue();
    const monthNew = this.periodMonthDescOption[Number(dataMY.month) - 1].label;
    const payload = {
      // monthCurrent: this.month,
      // yearCurrent: this.year.toString()
      monthCurrent: monthNew,
      yearCurrent: dataMY.year,
    };
    this.monthSelectNew = monthNew;
    this.yearSelectNew = dataMY.year;
    this.service.documentInfoAll(payload).subscribe((dataList) => {
      // dataList.forEach((element, index, array) => {
      // //   listInfo.push([element.departmentName, element.employeeCode, element.fullName,]);
      //   this.onPrintInfoMember(element)
      // })
      const recheckList = dataList.filter(
        (item) => item.employeeCode !== '00000'
      );
      if (this.filePdfFlag) {
        this.onPrintInfoMember(recheckList);
      } else {
        this.checkMonthOfYearCurrentToOpenPdf(payload, recheckList);
      }
    });
  }

  checkMonthOfYearCurrentToOpenPdf(payload: any, recheckList: any) {
    if (
      payload.monthCurrent == this.month &&
      payload.yearCurrent == this.year
    ) {
      this.onPrintInfoMember(recheckList);
    } else {
      const payloadFile = {
        month: payload.monthCurrent,
        year: payload.yearCurrent,
      };
      this.service.getFile(payloadFile).subscribe((response: Blob) => {
        // 'ข้อมูลสมาชิก-' + payload.monthCurrent + '-' + payload.monthCurrent

        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Open the PDF in a new tab
        window.open(url);

        // Clean up URL after use (optional, for memory management)
        window.URL.revokeObjectURL(url);
      });
    }
  }

  totalMemLoan() {
    this.showWarn();
    const dataMY = this.formModelBill.getRawValue();
    const dataMonth =
      this.periodMonthDescOption[Number(dataMY.month) - 1].label;

    this.monthSelectNew = dataMonth;
    this.yearSelectNew = dataMY.year;

    const format = new Date();
    const month = format.getMonth();
    const monthSelect = this.periodMonthDescOption[Number(month)].label;

    if (this.monthSelectNew != monthSelect) {
      const payload = {
        monthCurrent: this.monthSelectNew,
        yearCurrent: dataMY.year,
      };

      this.service.getSummary(payload).subscribe((data) => {
        this.grandTotal = data;
        this.onPrintTotal(this.grandTotal, true);
      });
    } else {
      const payload = {
        monthCurrent: this.monthSelectNew,
        yearCurrent: dataMY.year,
      };

      this.service.getGrandTotal(payload).subscribe((data) => {
        this.grandTotal = data;
        this.onPrintTotal(this.grandTotal, false);
      });
    }
  }

  billMonth: any;
  // stockAccumulateBill: any;
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
      next: (res) => {
        const dataRes = res;
        this.dataResLoan = res;
        this.onSearchCalculateLoanOld(res, stockValue);
        // this.stockAccumulateBill = res.stockAccumulate;
      },
      error: (error) => {},
    });
  }

  dataResLoan: any;
  async onPrintReceiptMakePdf(elementLoan: any, sumElementLoan: any) {
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
    const stockAccumulate = data.stockAccumulate ? data.stockAccumulate : ' ';
    const departMentName = data.departmentName ? data.departmentName : ' ';

    const stock = this.stockInfo;
    const installment = stock?.stockDetails.slice(-1)[0].installment;
    const stockValue = stock?.stockDetails.slice(-1)[0].stockValue;

    const docDefinition = {
      info: {
        title: 'ใบเสร็จรับเงิน',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
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
            // keepWithHeaderRows: 1, , alignment: 'right'
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
                  text: elementLoan
                    ? this.formattedNumber2(elementLoan.stockDetailInstallment)
                    : '',
                  alignment: 'right',
                },
                { text: this.formattedNumber2(stockValue), alignment: 'right' },
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
                    ? this.formattedNumber2(elementLoan.totalDeduction)
                    : '',
                  alignment: 'right',
                },
                {
                  text: elementLoan
                    ? this.formattedNumber2(elementLoan.principalBalance)
                    : '',
                  alignment: 'right',
                },
              ],
              [
                'ดอก',
                ' ',
                {
                  text: elementLoan
                    ? this.formattedNumber2(elementLoan.interest)
                    : '',
                  alignment: 'right',
                },
                ' ',
              ],
              //['รวมเงิน', {colSpan: 2, rowSpan: 2, text: '1000'}, ' '],
              //[{colSpan: 2, rowSpan: 2, text: 'รวมเงิน'}, '1000', '', ''],
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
            fillColor: function (
              rowIndex: number,
              node: any,
              columnIndex: any
            ) {
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
                  image: await this.getBase64ImageFromURL(
                    '../../assets/images/text1.png'
                  ),
                  style: 'tableHeader',
                  width: 150,
                  height: 80,
                  alignment: 'center',
                },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../assets/images/text2.png'
                  ),
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
    //pdf.download('ประวัติการส่งหุ้น.pdf');
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
      if (position === 'สิบ' && digit === 2) {
        bahtText += 'ยี่' + position;
      } else if (position === '' && digit === 1) {
        bahtText += 'เอ็ด' + position;
      } else {
        bahtText += digitText + position;
      }
    }

    return bahtText + 'บาทถ้วน';
  }

  getBase64ImageFromURL(url: string) {
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
    return number !== null ? decimalPipe.transform(number) : '';
  }

  getGrandTotal(headerName: any) {
    this.headerName = headerName;
    this.formModelBill.patchValue({
      year: this.year,
      month: this.monthValue,
    });
    this.formModelBill.get('year').enable();
    this.displayModalBill = true;
  }

  onPrintTotal(grandTotal: any, hasSummary: boolean) {
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

    let sumStockAccumulate: 0;

    if (hasSummary) {
      sumStockAccumulate = this.formattedNumber(grandTotal.sumStockAccumulate);
    } else {
      sumStockAccumulate = this.formattedNumber(
        grandTotal.sumStockAccumulate - grandTotal.sumStockValue
      );
    }

    const docDefinition = {
      info: {
        title: 'สรุปยอดรวมต่างๆ',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'กองทุนสวัสดิการพนักงานและลูกจ้างเทศบาล', style: 'header' },
        { text: 'สรุปยอดรวมต่างๆ', style: 'header' },
        '\n',
        {
          text: [
            'วันที่ปริ้นเอกสารฉบับนี้: ',
            {
              text:
                '                ' +
                this.pipeDateTH() +
                '                                                     ',
              bold: false,
            },
            { text: 'เดือน: ', bold: true },
            { text: ' ' + this.monthSelectNew + ' ', bold: false },
          ],
          bold: true,
          margin: [0, 6, 0, 0],
          style: 'texts',
        },
        {
          text: [
            'เวลาที่ปริ้นเอกสารฉบับนี้: ',
            {
              text:
                '             ' +
                this.time +
                '                                                                       ',
              bold: false,
            },
            { text: 'ปี: ', bold: true },
            { text: ' ' + this.yearSelectNew + '', bold: false },
          ],
          bold: true,
          margin: [0, 6, 0, 0],
          style: 'texts',
        },
        '\n',
        '\n',
        '\n',
        {
          style: 'tableExample',
          table: {
            headerRows: 2,
            widths: ['*', '*'],
            body: [
              [
                {
                  text:
                    'สรุปยอดรวมประจําเดือน ' +
                    this.monthSelectNew +
                    ' พ.ศ.' +
                    this.yearSelectNew,
                  style: 'tableHeader',
                  colSpan: 2,
                  alignment: 'center',
                },
                {},
              ],
              // [{ text: 'Name', style: 'tableHeader' }, { text: 'Country', style: 'tableHeader' }],
              [
                {
                  rowSpan: 1,
                  text: ' จํานวนสมาชิกทั้งหมด \n\nจํานวนสมาชิกกู้เงินสามัญ \n\nยอดเงินกู้สามัญคงค้าง \n\nค่าหุ้นสะสมรวม\n\n',
                },
                {
                  rowSpan: 1,
                  text:
                    grandTotal.sumEmp +
                    '     ราย \n\n' +
                    grandTotal.sumLoan +
                    '     ราย \n\n' +
                    this.formattedNumber(grandTotal.sumLoanBalance) +
                    '    บาท \n\n' +
                    sumStockAccumulate +
                    '    บาท\n\n',
                  alignment: 'right',
                },
              ],
              [
                {
                  rowSpan: 1,
                  text: ' มูลค่าหุ้นที่ส่งเดือนนี้ \n\nดอกเบี้ยจากเงินกู้สามัญ \n\nรวมส่งเงินต้นจากเงินกู้สามัญ \n\nรวมยอดเงินที่ได้รับทั้งหมด\n\n',
                },
                {
                  rowSpan: 1,
                  text:
                    this.formattedNumber(grandTotal.sumStockValue) +
                    '    บาท \n\n' +
                    this.formattedNumber(grandTotal.sumLoanInterest) +
                    '    บาท \n\n' +
                    this.formattedNumber(grandTotal.sumLoanOrdinary) +
                    '    บาท \n\n' +
                    this.formattedNumber(grandTotal.sumTotal) +
                    '    บาท \n\n',
                  alignment: 'right',
                },
              ],
              //[{ text: 'ประธานกองทุน', style: 'tableHeader', alignment: 'center' }, { text: 'เหรัญญิก', style: 'tableHeader', alignment: 'center' }],
            ],
          },
          layout: {
            fillColor: function (
              rowIndex: number,
              node: any,
              columnIndex: any
            ) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
          },
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
        },
        header2: {
          fontSize: 12,
          bold: true,
        },
        texts: {
          fontSize: 12,
          bold: false,
        },
      },
      defaultStyle: {
        // 4. default style 'KANIT' font to test
        fontSize: 12,
        font: 'Sarabun',
      },
    };

    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
  }

  // list!: any[];
  // sumStock: any;
  // searchDocumentV1(mode: any) {

  //   let stockInfo: any[] = [];
  //   const playload = {
  //     stockId: this.stockId
  //   }
  //   this.service.searchDocumentV1(playload).subscribe((data) => {
  //     this.list = data;
  //     console.log(data);

  //     this.list?.forEach((element, index, array) => {
  //       stockInfo.push([element.departmentName, element.employeeCode, element.fullName, element.stockInstallment,
  //       element.stockValue, element.loanInstallment, element.loanOrdinary, element.interest, element.sumMonth, element.stockAccumulate]);
  //     })
  //   });

  //   this.service.searchDocumentV2Sum(playload).subscribe((data) => {
  //     this.sumStock = data[0];
  //      (" this.sumStock", this.sumStock);
  //     this.exportMakePDF(mode, stockInfo, this.sumStock)
  //   });
  // }

  // list!: any[];
  documentInfoAll(headerName: any) {
    this.headerName = headerName;
    this.formModelBill.patchValue({
      year: this.year,
      month: this.monthValue,
    });
    this.formModelBill.get('year').enable();
    this.displayModalBill = true;
    // this.displayLoadingPdf = true;
  }

  checkNullOfGuarantee(data: any, num: any) {
    if (
      data.codeGuaranteeOne != null &&
      data.fullNameGuaranteeOne != null &&
      num == 1
    ) {
      return data.codeGuaranteeOne + ' ' + data.fullNameGuaranteeOne;
    } else if (
      data.codeGuaranteeTwo != null &&
      data.fullNameGuaranteeTwo &&
      num == 2
    ) {
      return data.codeGuaranteeTwo + ' ' + data.fullNameGuaranteeTwo;
    } else {
      return '';
    }
  }

  checkNullOfGuarantor(data: any, num: any) {
    if (
      data.codeGuarantorOne != null &&
      data.fullNameGuarantorOne != null &&
      num == 1
    ) {
      return data.codeGuarantorOne + ' ' + data.fullNameGuarantorOne;
    } else if (
      data.codeGuarantorTwo != null &&
      data.fullNameGuarantorTwo &&
      num == 2
    ) {
      return data.codeGuarantorTwo + ' ' + data.fullNameGuarantorTwo;
    } else {
      return ' ไม่มี ';
    }
  }

  textToDateFullThai(textDate: string) {
    const dateString = textDate;
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth();
    const year = dateObject.getFullYear() + 543;
    this.year = year;
    const monthSelect = this.periodMonthDescOption[month];
    const time =
      this.addLeadingZero(dateObject.getHours()) +
      ':' +
      this.addLeadingZero(dateObject.getMinutes()) +
      ' น.';
    this.time = time;
    return day + ' ' + monthSelect.label + ' ' + year;
  }

  onPrintInfoMember(dataList: any[]) {
    // this.service.documentInfoAll().subscribe((dataList) => {
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

    let listInfo: any[] = [];

    const docDefinition = {
      info: {
        title: 'ข้อมูลสมาชิก',
      },
      background: function (currentPage: any, pageSize: any) {
        return [
          {
            canvas: [
              { type: 'line', x1: 25, y1: 25, x2: 570, y2: 25, lineWidth: 1 }, //Up line
              { type: 'line', x1: 25, y1: 25, x2: 25, y2: 780, lineWidth: 1 }, //Left line
              { type: 'line', x1: 25, y1: 780, x2: 570, y2: 780, lineWidth: 1 }, //Bottom line
              { type: 'line', x1: 570, y1: 25, x2: 570, y2: 780, lineWidth: 1 }, //Rigth line
              {
                type: 'line',
                x1: 25,
                y1: 360,
                x2: 570,
                y2: 360,
                lineWidth: 1,
              }, //center
            ],
          },
        ];
      },
      content: dataList.map((element, index, array) => [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'ข้อมูลสมาชิก', style: 'header' },
        '\n',
        {
          text: [
            'หน้า 1                                                                                                    ',
            { text: '      เดือน ', bold: true },
            { text: this.monthSelectNew + '     ', style: 'texts' },
            { text: ' ปี ', bold: true },
            { text: this.yearSelectNew, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
        },
        {
          text: [
            'รหัสพนักงาน           ',
            { text: element.employeeCode, bold: false, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'ชื่อ-สกุล                   ',
            { text: element.fullName, bold: false, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'วันที่เป็นสมาชิก       ',
            {
              text: element.regisDate
                ? this.convertPipeDateTH(element.regisDate)
                : element.regisDate,
              bold: false,
              style: 'texts',
            },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'หน่วยงาน                ',
            { text: element.departmentName, bold: false, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'ประเภท                   ',
            { text: element.employeeTypeName, bold: false, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'ตําแหน่ง                   ',
            { text: element.positionsName, bold: false, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'อัตราเงินเดือน         ',
            {
              text: this.formattedNumber2(element.salary),
              bold: false,
              style: 'texts',
            },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'คํ้าประกันให้            ',
            {
              text: element.codeGuaranteeOne
                ? this.checkNullOfGuarantee(element, 1)
                : '1. ไม่มี',
              bold: false,
              style: 'texts',
            },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            ' ',
            {
              text: element.codeGuaranteeTwo
                ? this.checkNullOfGuarantee(element, 2)
                : '2. ไม่มี',
              bold: false,
              style: 'texts',
            },
          ],
          margin: [95, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'ส่งค่าหุ้น\t\t\t\t  ',
            {
              text: this.formattedNumber2(element.stockValue) + '\tบาท',
              bold: false,
              style: 'texts',
            },
            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tงวดที่ ',
              bold: false,
            },
            {
              text:
                '\t\t' +
                (element.installment <= 1
                  ? element.installment
                  : Number(element.installment - 1)),
              bold: false,
              style: 'texts',
            },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'หุ้นสะสม\t\t\t\t ',
            {
              text:
                this.formattedNumber2(
                  element.stockAccumulate - element.stockValue
                ) + '\tบาท',
              bold: false,
              style: 'texts',
            },
            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tได้ปันผล ',
              bold: false,
            },
            { text: '\t - ' + '    บาท', bold: false, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        //<--------------------------------- center --------------------------------->
        '\n',
        '\n',
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        { text: 'ข้อมูลสมาชิก', style: 'header' },
        '\n',
        {
          text: [
            'หน้า 2                                                                                                    ',
            { text: '      เดือน ', bold: true },
            { text: this.monthSelectNew + '     ', style: 'texts' },
            { text: ' ปี ', bold: true },
            { text: this.yearSelectNew, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
        },
        {
          text: [
            'รหัสพนักงาน           ',
            { text: element.employeeCode, bold: false, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'ชื่อ-สกุล                   ',
            { text: element.fullName, bold: false, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        { text: 'ข้อมูลการกู้เงินสามัญ', style: 'header' },
        {
          text: [
            'กู้เงินจํานวน             ',
            {
              text: this.formattedNumber2(element.loanValue),
              bold: false,
              style: 'texts',
            },
            { text: '                     บาท ', bold: false, style: 'texts' },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'ระยะเวลากู้              ',
            { text: element.loanTime, bold: false, style: 'texts' },
            {
              text: '                     เดือน ',
              bold: false,
              style: 'texts',
            },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        {
          text: [
            'อัตราดอกเบี้ย          ',
            { text: element.interestPercent, bold: false, style: 'texts' },
            {
              text: '                     เปอร์เซ็นต์ต่อปี ',
              bold: false,
              style: 'texts',
            },
          ],
          margin: [0, 6, 0, 0],
          bold: false,
        },
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: [90, 150, 80, 150],
            body: [
              [
                { text: ' วันที่เริ่มกู้ ', color: 'black' },
                { text: ' - ', color: 'gray', fillColor: '#fff' },
                { text: ' วันที่ทําสัญญา ', color: 'black' },
                {
                  text: element.startLoanDate
                    ? this.textToDateFullThai(element.startLoanDate)
                    : ' - ',
                  color: 'gray',
                },
              ],
              [
                { text: ' เหตุผลการกู้ ', color: 'black' },
                { text: ' - ', color: 'gray', fillColor: '#fff' },
                { text: ' ', color: 'black' },
                { text: ' ', color: 'gray' },
              ],
              [
                { text: ' ผู้คํ้าประกัน 1 ', color: 'black' },
                {
                  text: element.codeGuarantorOne
                    ? this.checkNullOfGuarantor(element, 1)
                    : ' ไม่มี',
                  color: 'gray',
                  fillColor: '#fff',
                },
                { text: ' ', color: 'black' },
                { text: ' ', color: 'gray' },
              ],
              [
                { text: ' ผู้คํ้าประกัน 2 ', color: 'black' },
                {
                  text: element.codeGuarantorTwo
                    ? this.checkNullOfGuarantor(element, 2)
                    : ' ไม่มี',
                  color: 'gray',
                  fillColor: '#fff',
                },
                { text: ' ', color: 'black' },
                { text: ' ', color: 'gray' },
              ],
              [
                { text: ' ดอกเดือนนี้ ', color: 'black' },
                {
                  text:
                    this.formattedNumber2(element.interestMonth) +
                    '          บาท',
                  color: 'gray',
                  fillColor: '#fff',
                },
                { text: ' ต้นเดือนนี้ ', color: 'black', width: 150 },
                {
                  text:
                    this.formattedNumber2(
                      element.earlyMonth - element.interestMonth
                    ) + '          บาท',
                  color: 'gray',
                },
              ],
              [
                { text: ' เดือนสุดท้าย ', color: 'black' },
                {
                  text:
                    this.formattedNumber2(element.interestMonthLast) +
                    '          บาท',
                  color: 'gray',
                  fillColor: '#fff',
                },
                { text: ' เดือนสุดท้าย ', color: 'black', width: 150 },
                {
                  text:
                    this.formattedNumber2(element.earlyMonthLast) +
                    '          บาท',
                  color: 'gray',
                },
              ],
              [
                { text: ' ส่งงวดที่ ', color: 'black' },
                {
                  text: this.formattedNumber2(element.installmentLoan),
                  color: 'gray',
                  fillColor: '#fff',
                },
                { text: '  ', color: 'black' },
                { text: '  ', color: 'gray' },
              ],
              [
                { text: ' ดอกรวมส่ง ', color: 'black' },
                {
                  text: this.formattedNumber2(0) + '          บาท',
                  color: 'gray',
                  fillColor: '#fff',
                }, //element.totalValueInterest
                { text: ' ดอกคงค้าง ', color: 'black', width: 150 },
                {
                  text:
                    this.formattedNumber2(element.outStandInterest) +
                    '          บาท',
                  color: 'gray',
                },
              ],
              [
                { text: ' ต้นรวมส่ง ', color: 'black' },
                {
                  text: this.formattedNumber2(0) + '          บาท',
                  color: 'gray',
                  fillColor: '#fff',
                }, //element.totalValuePrinciple
                { text: ' ต้นคงค้าง ', color: 'black', width: 150 },
                {
                  text:
                    this.formattedNumber2(element.outStandPrinciple) +
                    '          บาท',
                  color: 'gray',
                },
              ],
            ],
          },
          layout: 'noBorders',
          pageBreak: 'after',
        },
      ]),

      defaultStyle: {
        font: 'Sarabun',
      },
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
        },
        header2: {
          fontSize: 12,
          bold: true,
        },
        texts: {
          fontSize: 12,
          bold: false,
          color: '#555',
        },
      },
    };

    const pdf = pdfMake.createPdf(docDefinition);
    if (this.filePdfFlag) {
      pdf.getBlob((blob: Blob) => {
        const formData = new FormData();
        const pdfName =
          ' ข้อมูลสมาชิก (' + this.monthBefore + ' ' + this.year + ')';
        formData.append('file', blob, pdfName + '.pdf');
        formData.append('month', this.monthBefore);
        formData.append('year', this.year);

        this.service.addFile(formData).subscribe((data) => {
          this.filePdfFlag = false;
          console.log(data);

          console.log(' massge-add-file : ', data);
        });
      });
    } else {
      pdf.open();
    }
  }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: 'แจ้งเตือน',
      detail: 'โปรดรอสักครู่ PDF อาจใช้เวลาในการเเสดงข้อมูล ประมาณ 1-5 นาที',
      life: 10000,
    });
  }

  showWarnExcel() {
    this.messageService.add({
      severity: 'warn',
      summary: 'แจ้งเตือน',
      detail: 'โปรดรอสักครู่ Excel อาจใช้เวลาในการเเสดงข้อมูล ประมาณ 1-5 นาที',
      life: 10000,
    });
  }

  checkSetValueBill(event: any) {
    this.inputSubject.next(event.target.value);
  }
}
