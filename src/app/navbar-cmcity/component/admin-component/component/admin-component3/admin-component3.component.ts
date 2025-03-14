import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/model/ccustomerTest';
import { MainService } from 'src/app/service/main.service';
import 'jspdf-autotable';
import 'src/assets/fonts/Sarabun-Regular-normal.js';
import 'src/assets/fonts/Sarabun-Bold-bold.js';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'src/assets/custom-fonts.js';
import { LocalStorageService } from 'ngx-webstorage';
import { DecimalPipe } from '@angular/common';
import { Subject, debounceTime } from 'rxjs';
import * as XLSX from 'xlsx';
import { ListAdminLoan } from './models/admin-loan-res';
import {
  AdminLoanCriteria,
  AdminLoanOrder,
  AdminLoanReq,
} from './models/admin-loan-req';
import fontsBase64 from 'src/assets/fontsBase64.json';

@Component({
  selector: 'app-admin-component3',
  templateUrl: './admin-component3.component.html',
  styleUrls: ['./admin-component3.component.scss'],
})
export class AdminComponent3Component implements OnInit {
  menuItems!: MenuItem[];
  menuItemsAll!: MenuItem[];
  customers!: Customer[];
  info: any[] = [];
  loading!: boolean;
  totalRecords!: number;
  clonedProducts: { [s: number]: Customer } = {};
  formModel!: FormGroup;
  formModelLoan!: FormGroup;
  formModelLoanNew!: FormGroup;
  displayModal: boolean = false;
  dataLoanDetail!: any[];
  empDetail: any;
  loanId: any;
  userId: any;
  admin!: boolean;
  dataLoan!: any[];
  displayLoadingPdf: boolean = false;
  displayModalLoanNew: boolean = false;
  periodMonthDescOption: any = [];
  disabledCheck: boolean = true;
  inputSubject = new Subject<string>();
  inputGuaranteeStock = new Subject<string>();
  inputLoanTime = new Subject<string>();
  inputGuarantorUnique1 = new Subject<string>();
  inputGuarantorUnique2 = new Subject<string>();
  dataNewLoan: any;
  dataNewLoanFlag: boolean = false;
  dataLanTimeFlag: boolean = false;
  displayMessageError: boolean = false;
  guarantorUniqueFlag1: any = 'A';
  guarantorUniqueFlag2: any = 'A';
  messageError: any;
  guarantorUniqueName1: any;
  guarantorUniqueName2: any;
  displayModalBill: boolean = false;
  formModelBill!: FormGroup;
  inputSubjectBill = new Subject<string>();
  headerName: any;
  displayLoanNewQuagmire: boolean = false;
  messageQuagmire: any;
  modeLoan: any = 'ADD';

  sumGrandTotal1: number = 0;
  sumGrandTotal2: number = 0;
  sumGrandTotal3: number = 0;
  sumGrandTotal4: number = 0;
  sumGrandTotal5: number = 0;
  sumGrandTotal6: number = 0;
  sumGrandTotal7: number = 0;
  sumGrandTotal8: number = 0;

  constructor(
    private service: MainService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userId = this.localStorageService.retrieve('empId');
    this.empDetail = this.localStorageService.retrieve('employeeofmain');
    this.loanId = this.localStorageService.retrieve('loanid');
    this.initMainForm();
    this.initMainFormStock();
    this.initMainFormLoanNew();
    this.initMainFormBill();
    this.getLoanDetail(this.userId, this.loanId, this.empDetail);
    this.setperiodMonthDescOption();
    this.pipeDateTH();
    // this.searchLoan();
    this.getLoanDetailListOfLastValue();
    this.initSearchForm();
    this.searchLoanV2();

    this.inputSubject.pipe(debounceTime(1000)).subscribe((value) => {
      // Perform your action here based on the latest value
      if (value.length >= 5) {
        this.formModelLoanNew.get('guarantorOne').enable();
        this.formModelLoanNew.get('guarantorTwo').enable();

        const format = new Date();
        const month = format.getMonth();
        const monthSelect = this.periodMonthDescOption[month];
        const year = format.getFullYear() + 543;

        const payload = {
          empCode: value,
          monthCurrent: monthSelect.label,
          yearCurrent: year,
        };
        this.service.searchEmployeeLoanNew(payload).subscribe({
          next: (res) => {
            if (res !== null || res) {
              this.dataNewLoan = res;
              this.setInterestPercentOnLoan();
              this.formModelLoanNew.patchValue({
                //interestPercent: res.interestPercent ? res.interestPercent + '%' : '5%',
                stockValue: res.stockAccumulate
                  ? this.formattedNumber2(Number(res.stockAccumulate))
                  : 0,
                fullName: res.fullName,
                empId: res.empId,
                loanId: res.loanId ? res.loanId : 0,
              });
            } else {
              this.formModelLoanNew.reset();
              this.onCancleLoan();
            }
          },
          error: (error) => {
            this.formModelLoanNew.reset();
            // this.formModelLoanNew.get('employeeCode').setValue(null);
          },
        });
      } else {
        this.formModelLoanNew.reset();
      }
    });

    this.inputGuaranteeStock.pipe(debounceTime(1000)).subscribe((value) => {
      if (value.length > 0) {
        const data = this.dataNewLoan ? this.dataNewLoan.stockAccumulate : null;
        const valueParse = value.replace(/,/g, '');
        if (data !== null && Number(valueParse) <= data) {
          this.formModelLoanNew.patchValue({
            guaranteeStock: 'ได้',
          });
          this.dataNewLoanFlag = true;
          this.formModelLoanNew.get('loanTime').enable();
          // this.formModelLoanNew.get('guarantorOne').disable();
          // this.formModelLoanNew.get('guarantorTwo').disable();
        } else {
          this.formModelLoanNew.patchValue({
            guaranteeStock: 'ไม่ได้',
          });
          this.dataNewLoanFlag = false;
          this.formModelLoanNew.get('loanTime').enable();
          this.formModelLoanNew.get('guarantorOne').enable();
          this.formModelLoanNew.get('guarantorTwo').enable();
        }
      } else {
        this.formModelLoanNew.get('guaranteeStock').setValue(null);
        this.formModelLoanNew.get('loanTime').disable();
        this.formModelLoanNew.get('guarantorOne').enable();
        this.formModelLoanNew.get('guarantorTwo').enable();
        this.dataNewLoanFlag = false;
      }
    });

    this.inputLoanTime.pipe(debounceTime(1000)).subscribe((value) => {
      if (value.length > 0) {
        this.dataLanTimeFlag = true;
      } else {
        this.dataLanTimeFlag = false;
        this.formModelLoanNew.get('loanTime').setValue(null);
      }
    });

    this.inputGuarantorUnique1.pipe(debounceTime(1000)).subscribe((value) => {
      if (value.length > 0) {
        const playload = {
          empCode: value,
        };
        this.service.searchGuarantorUnique(playload).subscribe({
          next: (res) => {
            if (res !== null) {
              if (res.length >= 2) {
                this.guarantorUniqueFlag1 = 'N';
                setTimeout(() => {}, 800);
                this.formModelLoanNew.get('guarantorOne').setValue(null);
              } else {
                const data = this.formModelLoanNew.getRawValue();
                if (value === data.employeeCode) {
                  this.guarantorUniqueFlag1 = 'C';
                  this.formModelLoanNew.get('guarantorOne').setValue(null);
                } else if (value !== data.guarantorTwo) {
                  this.guarantorUniqueFlag1 = 'Y';
                  const playload1 = {
                    empCode: data.guarantorOne,
                  };
                  this.service
                    .searchEmpCodeOfId(playload1)
                    .subscribe((resG1) => {
                      this.guarantorUniqueName1 = resG1
                        ? resG1.fullName
                        : 'ใช้ได้';
                    });
                } else {
                  this.guarantorUniqueFlag1 = 'Q';
                  setTimeout(() => {}, 800);
                  this.formModelLoanNew.get('guarantorOne').setValue(null);
                }
              }
            } else {
              this.guarantorUniqueFlag1 = 'N';
              setTimeout(() => {}, 800);
              this.formModelLoanNew.get('guarantorOne').setValue(null);
            }
          },
          error: (error) => {
            this.guarantorUniqueFlag1 = 'N';
            setTimeout(() => {}, 800);
            this.formModelLoanNew.get('guarantorOne').setValue(null);
          },
        });
      } else {
        this.guarantorUniqueFlag1 = 'A';
        this.formModelLoanNew.get('guarantorOne').setValue(null);
      }
    });

    this.inputGuarantorUnique2.pipe(debounceTime(1000)).subscribe((value) => {
      if (value.length > 0) {
        const playload = {
          empCode: value,
        };
        this.service.searchGuarantorUnique(playload).subscribe({
          next: (res) => {
            if (res !== null) {
              if (res.length >= 2) {
                this.guarantorUniqueFlag2 = 'N';
                setTimeout(() => {}, 800);
                this.formModelLoanNew.get('guarantorTwo').setValue(null);
              } else {
                const data = this.formModelLoanNew.getRawValue();
                if (value === data.employeeCode) {
                  this.guarantorUniqueFlag2 = 'C';
                  this.formModelLoanNew.get('guarantorTwo').setValue(null);
                } else if (value !== data.guarantorOne) {
                  this.guarantorUniqueFlag2 = 'Y';
                  const playload2 = {
                    empCode: data.guarantorTwo,
                  };
                  this.service
                    .searchEmpCodeOfId(playload2)
                    .subscribe((resG2) => {
                      this.guarantorUniqueName2 = resG2
                        ? resG2.fullName
                        : 'ใช้ได้';
                    });
                } else {
                  this.guarantorUniqueFlag2 = 'Q';
                  setTimeout(() => {}, 800);
                  this.formModelLoanNew.get('guarantorTwo').setValue(null);
                }
              }
            } else {
              this.guarantorUniqueFlag2 = 'N';
              setTimeout(() => {}, 800);
              this.formModelLoanNew.get('guarantorTwo').setValue(null);
            }
          },
          error: (error) => {
            this.guarantorUniqueFlag2 = 'N';
            setTimeout(() => {}, 800);
            this.formModelLoanNew.get('guarantorTwo').setValue(null);
          },
        });
      } else {
        this.guarantorUniqueFlag2 = 'A';
        this.formModelLoanNew.get('guarantorTwo').setValue(null);
      }
    });

    this.inputSubjectBill.pipe(debounceTime(1000)).subscribe((value) => {
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
        label: 'เรียกเก็บชำระเงินกู้รายเดือน',
        command: () => {
          this.updateLoantoMonth();
        },
      },
      {
        label: 'สร้างสัญญาเงินกู้ใหม่',
        command: () => {
          this.onShowLoanAddNew();
        },
      },
      {
        label: 'ประวัติเงินกู้ของสมาชิกทั้งหมด',
        command: () => {
          this.searchDocumentV1All('export');
        },
      },
      // {
      //   label: 'ดาวน์โหลด',
      //   command: () => {
      //     this.searchDocumentV1All('download');
      //   }
      // }
    ];

    this.menuItemsAll = [
      {
        label: 'เรียกเก็บชำระเงินกู้รายเดือน',
        command: () => {
          this.updateLoantoMonth();
        },
      },
      {
        label: 'สร้างสัญญาเงินกู้ใหม่',
        command: () => {
          this.onShowLoanAddNew();
        },
      },
      {
        label: 'ประวัติเงินกู้ของสมาชิกทั้งหมด',
        command: () => {
          this.searchDocumentV1All('export');
        },
      },
      {
        label: 'ดาวน์โหลด PDF',
        command: () => {
          this.searchDocumentV1All('downloadPdf');
        },
      },
      {
        label: 'ดาวน์โหลด EXCEL',
        command: () => {
          this.searchDocumentV1All('downloadExcel');
        },
      },
      // {
      //   label: 'ดาวน์โหลด',
      //   command: () => {
      //     this.searchDocumentV1All('download');
      //   }
      // }
    ];
  }

  setInterestPercentOnLoan() {
    this.service.getConfigByList().subscribe((res) => {
      if (res) {
        this.formModelLoanNew.patchValue({
          interestPercent: res[0] ? res[0].value + '%' : '5%',
        });
      }
    });
  }

  month: any;
  year: any;
  time: any;
  monthValue: any;
  pipeDateTH() {
    const format = new Date();
    const day = format.getDate();
    const month = format.getMonth();
    const year = format.getFullYear() + 543;
    this.year = year;
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    this.monthValue = monthSelect.value;
    const time = format.getHours() + ':' + format.getMinutes() + ' น.';
    this.time = time;

    if (this.criteria) {
      this.criteria.newMonth = this.month;
      this.criteria.newYear = this.year;
    }

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
    this.formModelLoan = new FormGroup({
      monthlyLoanMoney: new FormControl(null, Validators.required),
      loanYear: new FormControl(null),
      loanMonth: new FormControl(null),
    });
  }

  initMainFormLoanNew() {
    this.formModelLoanNew = new FormGroup({
      empId: new FormControl(null),
      employeeCode: new FormControl(null, Validators.required),
      fullName: new FormControl(null, Validators.required),
      loanValue: new FormControl(null, Validators.required),
      interestPercent: new FormControl(null, Validators.required),
      loanTime: new FormControl(null, Validators.required),
      startDateLoan: new FormControl(null, Validators.required),
      stockValue: new FormControl(null, Validators.required),
      guaranteeStock: new FormControl(null, Validators.required),
      guarantorOne: new FormControl(null),
      guarantorTwo: new FormControl(null),
      loanOrdinary: new FormControl(null),
      interestLoan: new FormControl(null),
      loanBalance: new FormControl(null),
      interestLoanLastMonth: new FormControl(null),
      loanYear: new FormControl(null),
      loanMonth: new FormControl(null),
      loanValueQuagmire: new FormControl(0),
      loanId: new FormControl(null),
      guaranteeStockFlag: new FormControl(false),
      installment: new FormControl(0),
    });
  }

  stcokFlag: boolean = false;
  checkStockFlag(event: any) {
    if (event.checked) {
      this.stcokFlag = event.checked;
      this.formModelLoanNew.get('guarantorOne').disable();
      this.formModelLoanNew.get('guarantorTwo').disable();
      this.formModelLoanNew.get('guarantorOne').setValue(null);
      this.formModelLoanNew.get('guarantorTwo').setValue(null);
      this.guarantorUniqueFlag1 = 'A';
      this.guarantorUniqueFlag2 = 'A';
    } else {
      this.stcokFlag = event.checked;
      this.formModelLoanNew.get('guarantorOne').enable();
      this.formModelLoanNew.get('guarantorTwo').enable();
    }
  }

  onSearchMember() {
    const data = this.formModel.getRawValue();
    // api search member
  }

  getLoanDetail(userId: any, loanId: any, empDetail: any): void {
    this.searchLoanDetail(loanId);

    if (empDetail.adminFlag) {
      this.admin = true;
    }
  }

  searchLoanDetail(id: any): void {
    const payload = {
      loanId: id,
    };
    this.service.searchLoanDetail(payload).subscribe((data) => {
      this.dataLoanDetail = data;
      this.loading = false;
    });
  }

  searchLoan() {
    const payload = {
      newMonth: this.month,
      newYear: this.year,
    };
    this.service.searchLoan(payload).subscribe((data) => {
      if (data) {
        this.dataLoan = data;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }

  // function table full code.
  listEmp!: ListAdminLoan[];
  selected!: ListAdminLoan[];
  selectAll: boolean = false;
  select: boolean = false;
  selectLength!: number;

  page: number = 1;
  pageSize: number = 10;
  body!: AdminLoanReq;

  criteria: AdminLoanCriteria | undefined = {
    employeeCode: undefined,
    firstName: undefined,
    lastName: undefined,
    idCard: undefined,
    loanNo: undefined,
    newMonth: undefined,
    newYear: undefined,
  };

  order: AdminLoanOrder | undefined = {
    id: 'ASC',
    createDate: undefined,
  };

  searchLoanV2(): void {
    // this.loading = true;

    const { page, pageSize, criteria, order } = this;

    this.body = {
      criteria: criteria,
      order: JSON.stringify(order) === '{}' ? undefined : order,
      pageReq: {
        page: page,
        pageSize: pageSize,
      },
    };

    this.service.searchLoanV2(this.body).subscribe((res) => {
      this.dataLoan = res.data?.contents!.filter(
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
      loanNo: new FormControl(null),
      newMonth: new FormControl(null),
      newYear: new FormControl(null),
    });
  }

  onAcceptSearch() {
    const searchAdmin: AdminLoanCriteria = {};
    const firstName = this.searchForm.get('firstName')?.value;
    const lastName = this.searchForm.get('lastName')?.value;
    const idCard = this.searchForm.get('idCard')?.value;
    const employeeCode = this.searchForm.get('employeeCode')?.value;
    const loanNo = this.searchForm.get('loanNo')?.value;

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
    if (loanNo) {
      searchAdmin.loanNo = loanNo;
    }

    searchAdmin.newMonth = this.month;
    searchAdmin.newYear = this.year;

    this.criteria = searchAdmin;
    this.searchLoanV2();
  }

  onClearSearch(): void {
    this.searchForm.reset();
    this.criteria = {
      employeeCode: undefined,
      firstName: undefined,
      lastName: undefined,
      idCard: undefined,
      loanNo: undefined,
      newMonth: this.month,
      newYear: this.year,
    };
    this.searchLoanV2();
  }

  onPage(event: any) {
    this.pageSize = event.rows;
    this.clearSelectedAll();
  }

  loadingAdminLoan(e: any) {
    this.pageSize = e.rows!;
    this.page = e.first == 0 ? 1 : e.first! / e.rows! + 1;
    this.searchLoanV2();
  }

  onSort(column: keyof AdminLoanOrder) {
    if (this.order) {
      (Object.keys(this.order) as (keyof AdminLoanOrder)[]).forEach((key) => {
        if (this.order && key !== column) {
          this.order[key] = undefined;
        }
      });

      this.order[column] = this.order[column] === 'ASC' ? 'DESC' : 'ASC';
      this.searchLoanV2();
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

  // exportPDF(){
  //   this.customers?.forEach((element,index,array) =>{
  //     this.info.push([element.name,element.country?.name,element.company,element.representative?.name]);
  //   })

  //   const pdf = new jsPDF('p', 'mm', 'a4') as jsPDFCustom;
  //   pdf.setProperties({
  //     title: 'ประวัติการส่งเงินกู้รายเดือน'
  //   });
  //   pdf.setFont('Sarabun-Regular');
  //   pdf.setFontSize(14);
  //   pdf.text("ประวัติการส่งเงินกู้รายเดือน ( Loan History)",60,10);
  //   //autoTable(pdf, { html: '#contentTable' });
  //   pdf.autoTable({
  //     //styles : { halign : 'center'},
  //     headStyles:{fillColor : [160, 160, 160]},
  //     theme: 'grid',
  //     head: [['Name','Country','Company','Representative']],
  //     body: this.info,
  //   })
  //   pdf.output("dataurlnewwindow",{filename: "ประวัติการส่งเงินกู้รายเดือน"});
  //   //pdf.save('test.pdf');

  // }

  // downloadPDF(){
  //   this.customers?.forEach((element,index,array) =>{
  //     this.info.push([element.name,element.country?.name,element.company,element.representative?.name]);
  //   })

  //   const pdf = new jsPDF() as jsPDFCustom;
  //   pdf.setFont('Sarabun-Regular');
  //   pdf.setFontSize(14);
  //   pdf.text(" ประวัติการส่งเงินกู้รายเดือน ( Stock History) ",70,10);
  //   //autoTable(pdf, { html: '#contentTable' });
  //   pdf.autoTable({
  //     //styles : { halign : 'center'},
  //     headStyles:{fillColor : [160, 160, 160]},
  //     theme: 'grid',
  //     head: [['Name','Country','Company','Representative']],
  //     body: this.info,
  //   })
  //   //pdf.output("dataurlnewwindow");
  //   pdf.save('ประวัติการส่งเงินกู้รายเดือน.pdf');

  // }

  list!: any[];
  sumLoan: any;
  searchDocumentV1PDF(mode: any) {
    this.showWarn();
    // let loanInfo: any[] = [];
    const playload = {
      loanId: this.loanId,
      monthCurrent: this.month,
    };
    this.service.searchDocumentV1Loan(playload).subscribe((data) => {
      this.list = data;
      const key = 'installment';
      const arrayUniqueByKey = [
        ...new Map(data.map((item) => [item[key], item])).values(),
      ];
      let sumLoan = 0;
      arrayUniqueByKey.forEach((element, index, array) => {
        sumLoan = sumLoan + Number(element.loanValue);
      });
      this.getSearchDocumentV2Sum(playload, arrayUniqueByKey, mode, sumLoan);
    });
  }

  getSearchDocumentV2Sum(
    playload: any,
    loanInfo: any[],
    mode: any,
    sumLoanObj: any
  ) {
    this.service.searchDocumentV2SumLoan(playload).subscribe((data) => {
      this.sumLoan = data[0];
      this.exportMakePDF(mode, loanInfo, this.sumLoan, sumLoanObj);
    });
  }

  exportMakePDF(mode: any, loanInfo: any[], sum: any, sumLoanObj: any) {
    const decimalPipe = new DecimalPipe('en-US');

    let detailLoan = loanInfo.map(function (item) {
      return [
        { text: item.departmentName, alignment: 'left' },
        { text: item.employeeCode, alignment: 'center' },
        { text: item.fullName, alignment: 'left' },
        {
          text: decimalPipe.transform(item.loanValue),
          alignment: 'right',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.loanTime),
          alignment: 'center',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.interestPercent),
          alignment: 'right',
          style: 'tableHeader',
        },
        {
          text: item.guarantorCode1 ? item.guarantorCode1 : ' ',
          alignment: 'center',
          style: 'tableHeader',
        },
        {
          text: item.guarantorCode2 ? item.guarantorCode2 : ' ',
          alignment: 'center',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.monthInterest),
          alignment: 'right',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.monthPrinciple),
          alignment: 'right',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.lastMonthInterest),
          alignment: 'right',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.lastMonthPrinciple),
          alignment: 'right',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.installment),
          alignment: 'center',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.totalValueInterest),
          alignment: 'right',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.outStandInterest),
          alignment: 'right',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.totalValuePrinciple),
          alignment: 'right',
          style: 'tableHeader',
        },
        {
          text: decimalPipe.transform(item.outStandPrinciple),
          alignment: 'right',
          style: 'tableHeader',
        },
      ];
    });

    const dataSum = this.checkTotalListGroup(loanInfo);

    // pdfMake.vfs = pdfFonts.pdfMake.vfs; // 2. set vfs pdf font
    // pdfMake.vfs['THSarabun-Regular.ttf'] = fontBase64['THSarabun-Regular.ttf'];
    // pdfMake.vfs['THSarabun-Bold.ttf'] = fontBase64['THSarabun-Bold.ttf'];
    // pdfMake.vfs['THSarabun-Italic.ttf'] = fontBase64['THSarabun-Italic.ttf'];
    // pdfMake.vfs['THSarabun-BoldItalic.ttf'] = fontBase64['THSarabun-BoldItalic.ttf'];
    // pdfMake.vfs = {
    //   ...pdfFonts.pdfMake.vfs, // Ensure built-in fonts are included
    //   "THSarabun-Regular.ttf": fontBase64["THSarabun-Regular.ttf"],
    //   "THSarabun-Bold.ttf": fontBase64["THSarabun-Bold.ttf"],
    //   "THSarabun-Italic.ttf": fontBase64["THSarabun-Italic.ttf"],
    //   "THSarabun-BoldItalic.ttf": fontBase64["THSarabun-BoldItalic.ttf"]
    // };

    pdfMake.vfs = pdfFonts.pdfMake.vfs; // Ensure default fonts are set
    pdfMake.vfs['THSarabun-Regular.ttf'] = fontsBase64['THSarabun-Regular.ttf'];
    pdfMake.vfs['THSarabun-Bold.ttf'] = fontsBase64['THSarabun-Bold.ttf'];
    pdfMake.vfs['THSarabun-Italic.ttf'] = fontsBase64['THSarabun-Italic.ttf'];
    pdfMake.vfs['THSarabun-BoldItalic.ttf'] =
      fontsBase64['THSarabun-BoldItalic.ttf'];

    // this.http.get('/assets/fontsBase64.json').subscribe((fontBase64: any) => {
    //   pdfMake.vfs['THSarabun-Regular.ttf'] =
    //     fontBase64['THSarabun-Regular.ttf'];
    //   pdfMake.vfs['THSarabun-Bold.ttf'] = fontBase64['THSarabun-Bold.ttf'];
    //   pdfMake.vfs['THSarabun-Italic.ttf'] = fontBase64['THSarabun-Italic.ttf'];
    //   pdfMake.vfs['THSarabun-BoldItalic.ttf'] =
    //     fontBase64['THSarabun-BoldItalic.ttf'];

    //   pdfMake.fonts = {
    //     THSarabun: {
    //       normal: 'THSarabun-Regular.ttf',
    //       bold: 'THSarabun-Bold.ttf',
    //       italics: 'THSarabun-Italic.ttf',
    //       bolditalics: 'THSarabun-BoldItalic.ttf',
    //     },
    //   };
    // });

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
      THSarabun: {
        normal: 'THSarabun-Regular.ttf',
        bold: 'THSarabun-Bold.ttf',
        italics: 'THSarabun-Italic.ttf',
        bolditalics: 'THSarabun-BoldItalic.ttf',
      },
    };
    const docDefinition = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      info: {
        title: 'ประวัติการส่งเงินกู้รายเดือน',
        // author: 'john doe',
        // subject: 'subject of document',
        // keywords: 'keywords for document',
      },
      content: [
        { text: 'เทศบาลนครเชียงใหม่', style: 'header' },
        {
          text:
            'รายงานเงินกู้และค่าหุ้น เดือน' + this.month + ' พ.ศ.' + this.year,
          style: 'header',
        },
        //{ text: 'รายงานเงินกู้และค่า หุ้น เดือนมีนาคม พ.ศ.2566', style: 'header'},
        '\n',
        {
          style: 'tableExample',
          table: {
            alignment: 'center',
            headerRows: 1,
            widths: [
              200, 48, 120, 60, 30, 20, 44, 44, 50, 50, 50, 50, 30, 50, 50, 60,
              60,
            ],
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
                { text: 'เงินกู้', style: 'tableHeader', alignment: 'center' },
                { text: 'เวลากู้', style: 'tableHeader', alignment: 'center' },
                {
                  text: 'ดอก\nเบี้ย',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'ผู้คํ้า 1',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'ผู้คํ้า 2',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'เดือนนี้ \n(ดอก)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'เดือนนี้ \n(ต้น)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'สุดท้าย \n(ดอก)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'สุดท้าย \n(ต้น)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'ส่งงวดที่',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'รวมส่ง \n(ดอก)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'คงค้าง \n(ดอก)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'รวมส่ง \n(ต้น)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'คงค้าง \n(ต้น)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
              ],
              ...detailLoan,
              [
                {
                  text: sum.departmentName + ' Total',
                  alignment: 'left',
                  bold: true,
                },
                ' ',
                ' ',
                { text: decimalPipe.transform(sumLoanObj), alignment: 'right' },
                ' ',
                ' ',
                ' ',
                ' ',
                {
                  text: decimalPipe.transform(dataSum.monthInterestSum),
                  alignment: 'right',
                },
                {
                  text: decimalPipe.transform(dataSum.monthPrincipleSum),
                  alignment: 'right',
                },
                {
                  text: decimalPipe.transform(dataSum.lastMonthInterestSum),
                  alignment: 'right',
                },
                {
                  text: decimalPipe.transform(dataSum.lastMonthPrincipleSum),
                  alignment: 'right',
                },
                ' ',
                {
                  text: decimalPipe.transform(dataSum.totalValueInterestSum),
                  alignment: 'right',
                },
                {
                  text: decimalPipe.transform(dataSum.outStandInterestSum),
                  alignment: 'right',
                },
                {
                  text: decimalPipe.transform(dataSum.totalValuePrincipleSum),
                  alignment: 'right',
                },
                {
                  text: decimalPipe.transform(dataSum.outStandPrincipleSum),
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
          font: 'THSarabun',
          fontSize: 16,
          bold: true,
          alignment: 'center',
        },
        tableHeader: {
          font: 'THSarabun',
          fontSize: 14,
          alignment: 'center',
          bold: true,
        },
      },
      defaultStyle: {
        // 4. default style 'KANIT' font to test
        font: 'THSarabun',
        fontSize: 14,
      },
    };
    const pdf = pdfMake.createPdf(docDefinition);
    if (mode === 'export') {
      pdf.open();
    } else {
      pdf.download('ประวัติการส่งเงินกู้รายเดือน.pdf');
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
  infogroup35: any[] = [];

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
    this.infogroup35 = [];

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
      } else if (element.departmentName === 'งานระดับก่อนวัยเรียนและปฐมศึกษา') {
        this.infogroup35.push(element);
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
          { text: decimalPipe.transform(item.loanValue), alignment: 'right' },
          { text: decimalPipe.transform(item.loanTime), alignment: 'center' },
          {
            text: decimalPipe.transform(item.interestPercent),
            alignment: 'center',
          },
          {
            text: item.guarantorCode1 ? item.guarantorCode1 : ' ',
            alignment: 'center',
          },
          {
            text: item.guarantorCode2 ? item.guarantorCode2 : ' ',
            alignment: 'center',
          },
          {
            text: decimalPipe.transform(item.monthInterest),
            alignment: 'right',
          },
          {
            text: decimalPipe.transform(
              Number(item.outStandPrinciple) <= Number(item.monthPrinciple)
                ? Number(item.monthPrinciple)
                : Number(item.monthPrinciple) - Number(item.monthInterest)
            ),
            // text: decimalPipe.transform(item.monthPrinciple),
            alignment: 'right',
          },
          {
            text: decimalPipe.transform(item.lastMonthInterest),
            alignment: 'right',
          },
          {
            text: decimalPipe.transform(item.lastMonthPrinciple),
            alignment: 'right',
          },
          {
            text:
              Number(item.installment) <= 0
                ? 0
                : item.installment - 1 <= 0
                ? 0
                : decimalPipe.transform(Number(item.installment - 1)),
            alignment: 'center',
          }, //decimalPipe.transform(Number(item.installment) === 0 ? (Number(item.installment) + 1) : item.installment)
          {
            text:
              Number(item.installment) <= 0
                ? 0
                : // : item.installment - 1 <= 0
                  // ? 0
                  decimalPipe.transform(item.totalValueInterest),
            alignment: 'right',
          }, //decimalPipe.transform(item.totalValueInterest)
          {
            text: decimalPipe.transform(Number(item.outStandInterest)),
            alignment: 'right',
          },
          //{ text: decimalPipe.transform(Number(item.outStandInterest) + Number(item.monthInterest)), alignment: 'right' },
          {
            text:
              Number(item.installment) <= 0
                ? 0
                : // : item.installment - 1 <= 0
                  // ? 0
                  decimalPipe.transform(item.totalValuePrinciple),
            alignment: 'right',
          }, // decimalPipe.transform(item.totalValuePrinciple)
          {
            text: decimalPipe.transform(Number(item.outStandPrinciple)),
            alignment: 'right',
          },
          // { text: decimalPipe.transform( Number(item.outStandPrinciple) > 0 ? Number(item.outStandPrinciple) + (Number(item.monthPrinciple) - Number(item.monthInterest))
          //   : Number(item.lastMonthPrinciple)), alignment: 'right' },
        ];
      });
      return datalListGroup;
    } else {
      return '';
    }
  }

  checkListSumAllByDepartment(
    listSum: any[],
    nameDepartment: string,
    listGroup: any[]
  ) {
    if (listSum.length > 0) {
      const dataSum = this.checkTotalListGroup(listGroup);
      let sumDepartment: (
        | string
        | { text: string; alignment: string; bold: boolean }
        | { text: any; alignment: string; bold?: undefined }
      )[];
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
            {
              text: this.formattedNumber2(element.loanValueTotal),
              alignment: 'right',
            },
            ' ',
            ' ',
            ' ',
            ' ',
            {
              text: this.formattedNumber2(dataSum.monthInterestSum),
              alignment: 'right',
            },
            {
              text: this.formattedNumber2(dataSum.monthPrincipleSum),
              alignment: 'right',
            },
            {
              text: this.formattedNumber2(dataSum.lastMonthInterestSum),
              alignment: 'right',
            },
            {
              text: this.formattedNumber2(dataSum.lastMonthPrincipleSum),
              alignment: 'right',
            },
            ' ',
            {
              text: this.formattedNumber2(dataSum.totalValueInterestSum),
              alignment: 'right',
            }, //{text:'-' , alignment: 'right'},
            {
              text: this.formattedNumber2(dataSum.outStandInterestSum),
              alignment: 'right',
            },
            {
              text: this.formattedNumber2(dataSum.totalValuePrincipleSum),
              alignment: 'right',
            }, //{text:'-' , alignment: 'right'},
            {
              text: this.formattedNumber2(dataSum.outStandPrincipleSum),
              alignment: 'right',
            },
          ];
        }
        // else{
        //   sumDepartment = [{ text: '' + ' Total', alignment: 'left', bold: true }, ' ', ' ',
        //   { text: 0, alignment: 'right' }, ' ', ' ', ' ', ' ',
        //   { text: 0, alignment: 'right' },
        //   { text: 0, alignment: 'right' },
        //   { text: 0, alignment: 'right' },
        //   { text: 0, alignment: 'right' }, ' ',
        //   { text: 0, alignment: 'right' },
        //   { text: 0, alignment: 'right' },
        //   { text: 0, alignment: 'right' },
        //   { text: 0, alignment: 'right' },
        //   ];
        //   // sumDepartment = [{ text: '' + ' ', alignment: 'left', bold: true }, ' ', ' ',
        //   // { text: '', alignment: 'right' }, ' ', ' ', ' ', ' ',
        //   // { text: '', alignment: 'right' },
        //   // { text: '', alignment: 'right' },
        //   // { text: '', alignment: 'right' },
        //   // { text: '', alignment: 'right' }, ' ',
        //   // { text: '', alignment: 'right' },
        //   // { text: '', alignment: 'right' },
        //   // { text: '', alignment: 'right' },
        //   // { text: '', alignment: 'right' },
        //   // ];
        // }
      });
      return sumDepartment;
    } else {
      return [];
    }
  }

  checkTotalListGroup(listGroup: any[]) {
    let monthInterestSum = 0;
    let monthPrincipleSum = 0;
    let lastMonthInterestSum = 0;
    let lastMonthPrincipleSum = 0;
    let totalValueInterestSum = 0;
    let outStandInterestSum = 0;
    let totalValuePrincipleSum = 0;
    let outStandPrincipleSum = 0;

    listGroup?.forEach((element, _index, _array) => {
      monthInterestSum =
        monthInterestSum +
        Number(element.monthInterest ? element.monthInterest : 0);
      // monthPrincipleSum = monthPrincipleSum + (Number(element.outStandPrinciple) > 0 ?
      // Number(element.monthPrinciple ? element.monthPrinciple : 0) - Number(element.monthInterest) : Number(element.monthPrinciple ? element.monthPrinciple : 0));
      monthPrincipleSum =
        monthPrincipleSum +
        (Number(element.outStandPrinciple) <= Number(element.monthPrinciple)
          ? Number(element.monthPrinciple ? element.monthPrinciple : 0)
          : Number(element.monthPrinciple ? element.monthPrinciple : 0) -
            Number(element.monthInterest));
      lastMonthInterestSum =
        lastMonthInterestSum +
        Number(element.lastMonthInterest ? element.lastMonthInterest : 0);
      lastMonthPrincipleSum =
        lastMonthPrincipleSum +
        Number(element.lastMonthPrinciple ? element.lastMonthPrinciple : 0);
      totalValueInterestSum =
        totalValueInterestSum +
        (Number(element.installment) <= 0
          ? 0
          : // : element.installment - 1 <= 0
            // ? 0
            Number(
              element.totalValueInterest ? element.totalValueInterest : 0
            ));
      // outStandInterestSum = outStandInterestSum + Number(element.outStandInterest ? element.outStandInterest : 0) + Number(element.monthInterest);
      outStandInterestSum =
        outStandInterestSum +
        Number(element.outStandInterest ? element.outStandInterest : 0);
      totalValuePrincipleSum =
        totalValuePrincipleSum +
        (Number(element.installment) <= 0
          ? 0
          : // : element.installment - 1 <= 0
            // ? 0
            Number(
              element.totalValuePrinciple ? element.totalValuePrinciple : 0
            ));
      // outStandPrincipleSum = outStandPrincipleSum + (Number(element.outStandPrinciple) > 0 ?
      // Number(element.outStandPrinciple ? element.outStandPrinciple : 0) + Number(element.monthPrinciple - element.monthInterest)
      // : Number(element.lastMonthPrinciple ? element.lastMonthPrinciple : 0));
      outStandPrincipleSum =
        outStandPrincipleSum + Number(element.outStandPrinciple);
    });
    this.sumGrandTotal1 = this.sumGrandTotal1 + monthInterestSum;
    this.sumGrandTotal2 = this.sumGrandTotal2 + monthPrincipleSum;
    this.sumGrandTotal3 = this.sumGrandTotal3 + lastMonthInterestSum;
    this.sumGrandTotal4 = this.sumGrandTotal4 + lastMonthPrincipleSum;
    this.sumGrandTotal5 = this.sumGrandTotal5 + totalValueInterestSum;
    this.sumGrandTotal6 = this.sumGrandTotal6 + outStandInterestSum;
    this.sumGrandTotal7 = this.sumGrandTotal7 + totalValuePrincipleSum;
    this.sumGrandTotal8 = this.sumGrandTotal8 + outStandPrincipleSum;
    const playload = {
      monthInterestSum: monthInterestSum,
      monthPrincipleSum: monthPrincipleSum,
      lastMonthInterestSum: lastMonthInterestSum,
      lastMonthPrincipleSum: lastMonthPrincipleSum,
      totalValueInterestSum: totalValueInterestSum,
      outStandInterestSum: outStandInterestSum,
      totalValuePrincipleSum: totalValuePrincipleSum,
      outStandPrincipleSum: outStandPrincipleSum,
    };
    return playload;
  }

  checkListSumGrandTotal(listSum: any[]) {
    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;
    let sum4 = 0;
    let sum5 = 0;
    let sum6 = 0;
    let sum7 = 0;
    let sum8 = 0;
    let sum9 = 0;

    let sumDepartment: (
      | string
      | { text: string; alignment: string; bold: boolean }
      | { text: any; alignment: string; bold?: undefined }
    )[];

    listSum?.forEach((element, _index, _array) => {
      sum1 = sum1 + Number(element.loanValueTotal ? element.loanValueTotal : 0);
      sum2 =
        sum2 +
        Number(element.monthInterestTotal ? element.monthInterestTotal : 0);
      sum3 =
        sum3 +
        Number(element.monthPrincipleTotal ? element.monthPrincipleTotal : 0);
      sum4 =
        sum4 +
        Number(
          element.lastMonthInterestTotal ? element.lastMonthInterestTotal : 0
        );
      sum5 =
        sum5 +
        Number(
          element.lastMonthPrincipleTotal ? element.lastMonthPrincipleTotal : 0
        );
      sum6 =
        sum6 +
        Number(
          element.totalValueInterestTotal ? element.totalValueInterestTotal : 0
        );
      sum7 =
        sum7 +
        Number(
          element.outStandInterestTotal ? element.outStandInterestTotal : 0
        );
      sum8 =
        sum8 +
        Number(
          element.totalValuePrincipleTotal
            ? element.totalValuePrincipleTotal
            : 0
        );
      sum9 =
        sum9 +
        Number(
          element.outStandPrincipleTotal ? element.outStandPrincipleTotal : 0
        );
    });

    // TODO: hotfix code
    console.log(this.monthSelectNew);
    console.log(this.yearSelectNew);

    if (this.monthSelectNew === 'กุมภาพันธ์' && this.yearSelectNew === 2568) {
      console.log('------ 123');
      sumDepartment = [
        { text: 'Grand Total', alignment: 'left', bold: true },
        ' ',
        ' ',
        { text: this.formattedNumber2(sum1), alignment: 'right' },
        ' ',
        ' ',
        ' ',
        ' ',
        {
          text: this.formattedNumber2(this.sumGrandTotal1),
          alignment: 'right',
        },
        {
          text: this.formattedNumber2(this.sumGrandTotal2),
          alignment: 'right',
        },
        { text: this.formattedNumber2(5818), alignment: 'right' },
        {
          text: this.formattedNumber2(this.sumGrandTotal4),
          alignment: 'right',
        },
        ' ',
        {
          text: this.formattedNumber2(this.sumGrandTotal5),
          alignment: 'right',
        }, //{ text:'-' , alignment: 'right'}, //
        {
          text: this.formattedNumber2(this.sumGrandTotal6),
          alignment: 'right',
        },
        {
          text: this.formattedNumber2(this.sumGrandTotal7),
          alignment: 'right',
        }, // { text:'-' , alignment: 'right'},
        {
          text: this.formattedNumber2(this.sumGrandTotal8),
          alignment: 'right',
        },
      ];
    } else {
      console.log('------ 456');

      sumDepartment = [
        { text: 'Grand Total', alignment: 'left', bold: true },
        ' ',
        ' ',
        { text: this.formattedNumber2(sum1), alignment: 'right' },
        ' ',
        ' ',
        ' ',
        ' ',
        {
          text: this.formattedNumber2(this.sumGrandTotal1),
          alignment: 'right',
        },
        {
          text: this.formattedNumber2(this.sumGrandTotal2),
          alignment: 'right',
        },
        {
          text: this.formattedNumber2(this.sumGrandTotal3),
          alignment: 'right',
        },
        {
          text: this.formattedNumber2(this.sumGrandTotal4),
          alignment: 'right',
        },
        ' ',
        {
          text: this.formattedNumber2(this.sumGrandTotal5),
          alignment: 'right',
        }, //{ text:'-' , alignment: 'right'}, //
        {
          text: this.formattedNumber2(this.sumGrandTotal6),
          alignment: 'right',
        },
        {
          text: this.formattedNumber2(this.sumGrandTotal7),
          alignment: 'right',
        }, // { text:'-' , alignment: 'right'},
        {
          text: this.formattedNumber2(this.sumGrandTotal8),
          alignment: 'right',
        },
      ];
    }

    return sumDepartment;
  }

  formattedNumber2(number: any): any {
    const decimalPipe = new DecimalPipe('en-US');
    return number !== null ? decimalPipe.transform(number) : '';
  }

  mode: any;
  searchDocumentV1All(mode: any) {
    this.sumGrandTotal1 = 0;
    this.sumGrandTotal2 = 0;
    this.sumGrandTotal3 = 0;
    this.sumGrandTotal4 = 0;
    this.sumGrandTotal5 = 0;
    this.sumGrandTotal6 = 0;
    this.sumGrandTotal7 = 0;
    this.sumGrandTotal8 = 0;
    // this.displayLoadingPdf = true;
    this.headerName = 'ประวัติเงินกู้ของสมาชิกทั้งหมด';
    this.mode = mode;
    this.formModelBill.patchValue({
      year: this.year,
      month: this.monthValue,
    });
    this.formModelBill.get('year').enable();
    this.displayModalBill = true;
  }

  getSearchDocumentV2SumAll(playload: any, mode: any, listdata: any[]) {
    this.service.searchDocumentV2SumLoan(playload).subscribe((data) => {
      this.sumLoan = data;
      this.checkDepartment(listdata);
      this.exportMakePDFAll(mode, data);
    });
  }

  exportMakePDFAll(mode: any, listSum: any[]) {
    const sections = [];

    // Helper function to check if an array contains values
    const hasValues = (arr: any[]): boolean => {
      return arr.some(
        (item) => item !== null && item !== undefined && item !== ''
      );
    };

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
    let data35 = this.checkListDataPDF(this.infogroup35) || [];
    let dataSum35 =
      this.checkListSumAllByDepartment(
        listSum,
        'งานระดับก่อนวัยเรียนและปฐมศึกษา',
        this.infogroup35
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
    pushDataSection(data35, dataSum35);

    pdfMake.vfs = pdfFonts.pdfMake.vfs; // 2. set vfs pdf font
    pdfMake.vfs['THSarabun-Regular.ttf'] = fontsBase64['THSarabun-Regular.ttf'];
    pdfMake.vfs['THSarabun-Bold.ttf'] = fontsBase64['THSarabun-Bold.ttf'];
    pdfMake.vfs['THSarabun-Italic.ttf'] = fontsBase64['THSarabun-Italic.ttf'];
    pdfMake.vfs['THSarabun-BoldItalic.ttf'] =
      fontsBase64['THSarabun-BoldItalic.ttf'];

    // this.http.get('/assets/fontsBase64.json').subscribe((fontBase64: any) => {
    //   pdfMake.vfs['THSarabun-Regular.ttf'] =
    //     fontBase64['THSarabun-Regular.ttf'];
    //   pdfMake.vfs['THSarabun-Bold.ttf'] = fontBase64['THSarabun-Bold.ttf'];
    //   pdfMake.vfs['THSarabun-Italic.ttf'] = fontBase64['THSarabun-Italic.ttf'];
    //   pdfMake.vfs['THSarabun-BoldItalic.ttf'] =
    //     fontBase64['THSarabun-BoldItalic.ttf'];

    //   pdfMake.fonts = {
    //     THSarabun: {
    //       normal: 'THSarabun-Regular.ttf',
    //       bold: 'THSarabun-Bold.ttf',
    //       italics: 'THSarabun-Italic.ttf',
    //       bolditalics: 'THSarabun-BoldItalic.ttf',
    //     },
    //   };
    // });

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
      THSarabun: {
        normal: 'THSarabun-Regular.ttf',
        bold: 'THSarabun-Bold.ttf',
        italics: 'THSarabun-Italic.ttf',
        bolditalics: 'THSarabun-BoldItalic.ttf',
      },
    };
    const docDefinition = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      pageMargins: [10, 20, 20, 20],
      info: {
        title: 'ประวัติการส่งเงินกู้รายเดือน',
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
        // text: 'รายงานเงินกู้และค่า หุ้น เดือนมีนาคม พ.ศ.2566', style: 'header'},
        '\n',
        {
          style: 'tableExample',
          table: {
            alignment: 'center',
            headerRows: 1,
            widths: [
              200, 48, 120, 60, 30, 20, 44, 44, 50, 50, 50, 50, 30, 50, 50, 60,
              60,
            ],
            body: [
              [
                { text: 'หน่วยงาน', style: 'tableHeader', alignment: 'center' },
                {
                  text: 'รหัส\nพนักงาน',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'ชื่อ-สกุล',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                { text: 'เงินกู้', style: 'tableHeader', alignment: 'center' },
                { text: 'เวลากู้', style: 'tableHeader', alignment: 'center' },
                {
                  text: 'ดอก\nเบี้ย',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'ผู้คํ้า 1',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'ผู้คํ้า 2',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'เดือนนี้ \n(ดอก)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'เดือนนี้ \n(ต้น)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'สุดท้าย \n(ดอก)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'สุดท้าย \n(ต้น)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'ส่ง\nงวดที่',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'รวมส่ง \n(ดอก)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'คงค้าง \n(ดอก)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'รวมส่ง \n(ต้น)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
                {
                  text: 'คงค้าง \n(ต้น)',
                  style: 'tableHeader',
                  alignment: 'center',
                },
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

              // group 2
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

              // group 3
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
          font: 'THSarabun',
          fontSize: 16,
          bold: true,
          alignment: 'center',
        },
        tableHeader: {
          font: 'THSarabun',
          fontSize: 14,
          alignment: 'center',
          bold: true,
        },
      },
      defaultStyle: {
        // 4. default style 'KANIT' font to test
        font: 'THSarabun',
        fontSize: 14,
      },
    };

    const pdf = pdfMake.createPdf(docDefinition);
    if (mode === 'export') {
      pdf.open();
    } else if (mode === 'pdf') {
      pdf.download('ประวัติการส่งเงินกู้รายเดือน.pdf');
    } else if (mode === 'excel') {
      this.exportDataToExcel(sections, sunGrandTotal);
    }
  }

  replaceTextInExcel(text: any) {
    const textRe = text ? text.replace(/,/g, '') : 0;
    return textRe ? Number(textRe) : '';
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
        'เงินกู้',
        'เวลากู้',
        'ดอกเบี้ย',
        'ผู้ค้ำ 1',
        'ผู้ค้ำ 2',
        'เดือนนี้ (ดอก)',
        'เดือนนี้ (ต้น)',
        'สุดท้าย (ดอก)',
        'สุดท้าย (ต้น)',
        'ส่งงวดที่',
        'รวมส่ง (ดอก)',
        'คงค้าง (ดอก)',
        'รวมส่ง (ต้น)',
        'คงค้าง (ต้น)',
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
        listDataStock[i][6].text,
        listDataStock[i][7].text,
        this.replaceTextInExcel(listDataStock[i][8].text),
        this.replaceTextInExcel(listDataStock[i][9].text),
        this.replaceTextInExcel(listDataStock[i][10].text),
        this.replaceTextInExcel(listDataStock[i][11].text),
        this.replaceTextInExcel(listDataStock[i][12].text), //listDataStock[i][12].text
        this.replaceTextInExcel(listDataStock[i][13].text), //listDataStock[i][13].text
        this.replaceTextInExcel(listDataStock[i][14].text),
        this.replaceTextInExcel(listDataStock[i][15].text), //listDataStock[i][15].text
        this.replaceTextInExcel(listDataStock[i][16].text),
      ]);
    }

    // last row sumTotal
    columnHeaders.push([
      sunGrandTotal[0].text,
      '',
      '',
      this.replaceTextInExcel(sunGrandTotal[3].text),
      '',
      '',
      '',
      '',
      this.replaceTextInExcel(sunGrandTotal[8].text),
      this.replaceTextInExcel(sunGrandTotal[9].text),
      this.replaceTextInExcel(sunGrandTotal[10].text),
      this.replaceTextInExcel(sunGrandTotal[11].text),
      '',
      '', //this.replaceTextInExcel(sunGrandTotal[13].text)
      this.replaceTextInExcel(sunGrandTotal[14].text),
      '', //this.replaceTextInExcel(sunGrandTotal[15].text)
      this.replaceTextInExcel(sunGrandTotal[16].text),
    ]);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(columnHeaders);
    ws['!cols'] = [
      { width: 50 },
      { width: 15 },
      { width: 30 },
      { width: 20 },
      { width: 10 },
      { width: 10 },
      { width: 15 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 10 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ประวัติการส่งเงินกู้รายเดือน.xlsx');
  }

  onEditLoan(data: any) {
    /// api
  }

  // updateLoantoMonth() {
  //   this.displayModal = true;
  // }

  // onupdateLoanToMonth() {
  //   // api update stock to everyone
  // }

  onCancle() {
    this.formModelLoan.reset();
    this.displayModal = false;
  }

  onCheckToAddBeforeAddLoan() {
    this.modeLoan = 'ADD';
    this.onShowLoanAddNew();
    this.guarantorUniqueFlag1 = 'A';
    this.guarantorUniqueFlag2 = 'A';
  }

  onShowLoanAddNew() {
    this.initMainFormLoanNew();
    this.displayModalLoanNew = true;
    this.dataNewLoanFlag = false;
    this.formModelLoanNew.get('interestPercent').disable();
    this.formModelLoanNew.get('startDateLoan').disable();
    this.formModelLoanNew.get('loanOrdinary').disable();
    this.formModelLoanNew.get('guaranteeStock').disable();
    this.formModelLoanNew.get('stockValue').disable();
    this.formModelLoanNew.get('loanTime').disable();
    this.formModelLoanNew.get('guarantorOne').disable();
    this.formModelLoanNew.get('guarantorTwo').disable();
  }

  checkValidFormLoan() {
    const data = this.formModelLoanNew.getRawValue();
    const flagStock = data.guaranteeStock === 'ได้' ? 'Y' : 'N';
    if (flagStock === 'Y') {
      if (!this.stcokFlag) {
        if (data.guarantorTwo !== null && data.guarantorOne !== null) {
          if (data.loanOrdinary === null || !data.loanOrdinary) {
            this.messageError = 'กรุณาคำนวนยอดที่ต้องชำระต่อเดือน';
            this.statusQuagmire = false;
            this.displayMessageError = true;
            return false;
          } else {
            return true;
          }
        } else {
          this.messageError = 'กรุณาระบุพนักงานค้ำ';
          this.statusQuagmire = false;
          this.displayMessageError = true;
          return false;
        }
      } else {
        if (data.loanOrdinary === null || !data.loanOrdinary) {
          this.messageError = 'กรุณาคำนวนยอดที่ต้องชำระต่อเดือน';
          this.statusQuagmire = false;
          this.displayMessageError = true;
          return false;
        } else {
          return true;
        }
      }
    } else {
      if (
        this.guarantorUniqueFlag1 !== 'Y' ||
        this.guarantorUniqueFlag2 !== 'Y'
      ) {
        this.messageError = 'ตรวจสอบรหัสพนักงานค้ำให้ถูกต้อง';
        this.statusQuagmire = false;
        this.displayMessageError = true;
        return false;
      } else if (data.loanOrdinary === null || !data.loanOrdinary) {
        this.messageError = 'กรุณาคำนวนยอดที่ต้องชำระต่อเดือน';
        this.statusQuagmire = false;
        this.displayMessageError = true;
        return false;
      } else {
        return true;
      }
    }
  }

  closeLoanOld(data: { loanId: number }) {
    this.service.closeLoan(data.loanId).subscribe((res) => {
      // this.messageService.add({ severity: 'success', detail: 'ปิดหนี้สำเร็จ' });
      // this.ngOnInit();
    });
  }

  statusQuagmire: boolean = false;
  insertLoanDetail() {
    const data = this.formModelLoanNew.getRawValue();
    data.installment = this.checkNull ? 1 : 0;

    const format = new Date();
    const yearTest = this.checkYearOfLoanDate(format.getFullYear());
    data.loanYear = yearTest + 543;

    if (this.dataNewLoan) {
      const loanBalance = this.dataNewLoan.loanBalance
        ? this.dataNewLoan.loanBalance
        : 0;
      const loanActive = this.dataNewLoan.loanActive
        ? this.dataNewLoan.loanBalance
        : true;
      this.checkStatusQuagmire(loanBalance);
      if (loanActive && loanBalance <= 0) {
        if (this.checkValidFormLoan()) {
          // api
          const flagStock = data.guaranteeStock === 'ได้' ? 'Y' : 'N';
          data.guaranteeStock = flagStock;
          const interestRE = data.interestPercent.replace('%', '');
          data.interestPercent = interestRE;
          const loanOrdinaryRE = data.loanOrdinary
            ? data.loanOrdinary.replace(/,/g, '')
            : 0;
          data.loanOrdinary = loanOrdinaryRE;
          const stockValueRE = data.stockValue
            ? data.stockValue.replace(/,/g, '')
            : 0;
          data.stockValue = stockValueRE;
          this.service.insertLoanNew(data).subscribe(async (res) => {
            if (res) {
              //this.closeLoanOld(data);
              this.localStorageService.clear('employeeofmain');
              this.getEmployeeOfMain(this.userId);
              this.localStorageService.clear('loanId');
              this.localStorageService.store('loanId', res.data.id);
              await new Promise((resolve) => setTimeout(resolve, 500)),
                this.ngOnInit();
              this.messageService.add({
                severity: 'success',
                detail: 'ทำสัญญาเงินกู้สำเร็จ',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                detail: 'ทำสัญญาเงินกู้ไม่สำเร็จ',
              });
            }
            this.displayModalLoanNew = false;
            this.displayMessageError = false;
          });
        }
      } else {
        if (this.checkValidFormLoan()) {
          const loanOrdinaryNotinterest = this.dataNewLoan.loanBalance
            ? Number(
                this.dataNewLoan.loanOrdinary -
                  this.dataNewLoan.interestLoanLastMonth
              )
            : 0;
          const loanBalance = this.dataNewLoan.loanBalance
            ? Number(this.dataNewLoan.loanBalance) + loanOrdinaryNotinterest
            : 0;
          if (loanBalance !== 0) {
            this.statusQuagmire = true;
            this.messageError =
              this.dataNewLoan.fullName +
              ' ไม่สามารถทำการกู้ได้ ยังมีหนี้คงค้างอยู่ ' +
              this.formattedNumber2(loanBalance) +
              '  บาท';
            //this.messageError = 'ไม่สามารถสร้างสัญญาเงินกู้ใหม่ได้';
            this.displayMessageError = true;
          } else {
            this.statusQuagmire = false;
            this.messageError = 'ไม่สามารถสร้างสัญญาเงินกู้ใหม่ได้';
            this.displayMessageError = true;
          }
        }
      }
    }
  }

  checkStatusQuagmire(loanBalance: any) {
    if (loanBalance > 0) {
      this.statusQuagmire = true;
    } else {
      this.statusQuagmire = false;
    }
  }

  getEmployeeOfMain(id: any): void {
    this.service.getEmployeeOfMain(id).subscribe((data) => {
      if (data) {
        this.localStorageService.store('employeeofmain', data);
        //this.localStorageService.store('profileImgId', data.profileImgId);
      }
    });
  }

  onCancleLoan() {
    this.formModelLoanNew.reset();
    this.dataLanTimeFlag = false;
    this.dataNewLoanFlag = false;
    this.pipeDateTH();
    this.onShowLoanAddNew();
    // this.formModelLoanNew.get('loanTime').disable();
    // this.formModelLoanNew.get('guarantorOne').disable();
    // this.formModelLoanNew.get('guarantorTwo').disable();
    this.guarantorUniqueFlag1 = 'A';
    this.guarantorUniqueFlag2 = 'A';
    this.displayModalLoanNew = false;
    // this.displayModalLoanNew = false;
    //this.displayModalLoanNew = false;
  }

  guarantorOneValue: any;
  guarantorTwoValue: any;
  isInputDisabled: boolean = true;
  async editLoanEmp(data: any) {
    this.modeLoan = 'EDIT';
    this.initMainFormLoanNew();
    this.dataLanTimeFlag = false;
    this.dataNewLoanFlag = false;
    this.formModelLoanNew.get('interestPercent').disable();
    this.formModelLoanNew.get('startDateLoan').disable();
    this.formModelLoanNew.get('loanOrdinary').disable();
    this.formModelLoanNew.get('guaranteeStock').disable();
    this.formModelLoanNew.get('stockValue').disable();
    //  this.formModelLoanNew.get('guarantorOne').disable();
    //  this.formModelLoanNew.get('guarantorTwo').disable();
    this.formModelLoanNew.get('employeeCode').disable();
    this.formModelLoanNew.get('fullName').disable();
    this.formModelLoanNew.get('loanValue').disable();
    this.formModelLoanNew.get('loanTime').disable();
    this.formModelLoanNew.get('loanBalance').disable();
    const dataStockAccumulate = this.empDetail
      ? this.empDetail.stockAccumulate
      : null;
    if (
      data !== null &&
      Number(data.loanBalance) <= Number(data.stockAccumulate)
    ) {
      this.formModelLoanNew.patchValue({
        guaranteeStock: 'ได้',
      });
      this.dataNewLoanFlag = true;
    } else {
      this.formModelLoanNew.patchValue({
        guaranteeStock: 'ไม่ได้',
      });
      this.dataNewLoanFlag = false;
    }

    this.formModelLoanNew.patchValue({
      ...data,
      startDateLoan: data.startLoanDate ? data.startLoanDate : '-',
      fullName: data.prefix + data.firstName + ' ' + data.lastName,
      stockValue: data.stockAccumulate
        ? this.formattedNumber2(Number(data.stockAccumulate))
        : 0,
      loanValue: data.loanValue
        ? this.formattedNumber2(Number(data.loanValue))
        : 0,
      loanId: data.id,
      guaranteeStockFlag: data.stockFlag ? data.stockFlag : false,
      loanBalance: data.loanBalance
        ? this.formattedNumber2(Number(data.loanBalance))
        : 0,
      //  guarantorOne: data.guarantorOne ? data.guarantorOne : null,
      //  guarantorTwo: data.guarantorOne ? data.guarantorOne : null
    });
    if (data.stockFlag) {
      this.formModelLoanNew.get('guarantorOne').disable();
      this.formModelLoanNew.get('guarantorTwo').disable();
      await this.checkGuarantorValue1(null);
      await this.checkGuarantorValue2(null);
    } else {
      await this.checkGuarantorValue1(data.guarantorOne);
      await this.checkGuarantorValue2(data.guarantorTwo);
    }
    // if(data.guarantorOneValue){
    //   this.inputGuarantorUnique1.next(data.guarantorOneValue);
    // }else{
    //   this.guarantorUniqueFlag1 = 'A';
    // }
    // if(data.guarantorTwoValue){
    //   this.inputGuarantorUnique2.next(data.guarantorTwoValue);
    // }else{
    //   this.guarantorUniqueFlag2 = 'A';
    // }
    this.displayModalLoanNew = true;
  }

  checkGuarantorValue1(guarantorOneValue: any) {
    if (guarantorOneValue) {
      this.searchIdOfEmpCodeValue1(guarantorOneValue);
    } else {
      this.guarantorUniqueFlag1 = 'A';
      this.formModelLoanNew.patchValue({
        guarantorOne: '-',
      });
      //this.formModelLoanNew.get('guarantorOne').setValue('-');
    }
  }

  checkGuarantorValue2(guarantorTwovalue: any) {
    if (guarantorTwovalue) {
      this.searchIdOfEmpCodeValue2(guarantorTwovalue);
    } else {
      this.guarantorUniqueFlag2 = 'A';
      this.formModelLoanNew.patchValue({
        guarantorTwo: '-',
      });
      //this.formModelLoanNew.get('guarantorTwo').setValue('-');
    }
  }

  searchIdOfEmpCodeValue1(id: any) {
    const payload = {
      empId: id,
    };
    this.service.searchIdOfEmpCode(payload).subscribe((res) => {
      this.guarantorOneValue = res;
      this.guarantorUniqueFlag1 = 'Y';
      this.guarantorUniqueName1 = res.fullName;
      this.formModelLoanNew.patchValue({
        guarantorOne: res ? res.empCode : '-',
      });
    });
  }

  searchIdOfEmpCodeValue2(id: any) {
    const payload = {
      empId: id,
    };
    this.service.searchIdOfEmpCode(payload).subscribe((res) => {
      this.guarantorTwoValue = res;
      this.guarantorUniqueFlag2 = 'Y';
      this.guarantorUniqueName2 = res.fullName;
      this.formModelLoanNew.patchValue({
        guarantorTwo: res ? res.empCode : '-',
      });
    });
  }

  updateLoanEmp() {
    const data = this.formModelLoanNew.getRawValue();

    this.service.updateLoanEmpOfGuarantor(data).subscribe((res) => {
      if (res) {
        this.displayModalLoanNew = false;
        this.messageService.add({
          severity: 'success',
          detail: 'เเก้ไขสัญญาเงินกู้สำเร็จ',
        });
        this.ngOnInit();
      }
    });
  }

  onCancleLoanEmp() {
    this.displayModalLoanNew = false;
  }

  checkNull: boolean = true;
  checkNullAddLoan: boolean = true;
  checkValueOfNull(event: any) {
    if (!event.value) {
      this.checkNull = true;
    } else {
      this.checkNull = false;
    }
  }

  checkSetValueEmp(event: any) {
    this.inputSubject.next(event.target.value);
  }

  checkGuaranteeStock(event: any) {
    this.inputGuaranteeStock.next(event.target.value);
  }

  checkLoanTime(event: any) {
    this.inputLoanTime.next(event.target.value);
  }

  checkGuarantorUnique1(event: any) {
    this.inputGuarantorUnique1.next(event.target.value);
  }

  checkGuarantorUnique2(event: any) {
    this.inputGuarantorUnique2.next(event.target.value);
  }

  monthNew: any;
  yearNew: any;
  timeNew: any;
  pipeDateTHNewLan() {
    const format = new Date();
    const year = this.checkYearOfLoanDate(format.getFullYear());
    this.year = year;
    const monthSelectCurrent = this.periodMonthDescOption[format.getMonth()];
    format.setMonth(format.getMonth());
    const month = this.checkMonthOfLoanDate(format.getMonth());
    format.setDate(0);
    const day = format.getDate();
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    const time = format.getHours() + ':' + format.getMinutes() + ' น.';
    this.time = time;

    this.formModelLoanNew
      .get('loanYear')
      .setValue(Number(format.getFullYear() + 543));
    this.formModelLoanNew.get('loanMonth').setValue(monthSelectCurrent.label); //monthSelect

    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    //const firstDayOfNextMonth = this.findFirstWeekdayOfMonth(year, month);
    //const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1).getDate();
    return (
      year +
      '-' +
      monthSelect.value +
      '-' +
      this.checkLenghtDate(firstDayOfNextMonth.getDate())
    ); //this.checkLenghtDate(firstDayOfNextMonth.getDate());
  }

  checkLenghtDate(day: any) {
    if (day <= 9) {
      return '0' + day;
    } else {
      return day;
    }
  }

  checkYearOfLoanDate(year: any) {
    const format = new Date();
    if (format.getMonth() === 11) {
      return year; // year + 1
    } else {
      return year;
    }
  }

  checkMonthOfLoanDate(month: any) {
    if (month === 11) {
      return month; // 0
    } else {
      return month;
    }
  }

  findFirstWeekdayOfMonth(year: number, month: number): Date {
    const date = new Date(year, month, 1); // Creating a date object for the given year and month
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1); // Incrementing the date until it's not Saturday or Sunday
    }
    return date; // Returning the first weekday of the month
  }

  pipeDateTHNewLanMore1() {
    const format = new Date();
    const year = this.checkYearOfLoanDateMore1Year(format.getFullYear());
    this.year = year;
    const monthSelectCurrent = this.periodMonthDescOption[format.getMonth()];
    format.setMonth(format.getMonth());
    const month = this.checkMonthOfLoanDateMore1Month(format.getMonth());
    format.setDate(0);
    const day = format.getDate();
    const monthSelect = this.periodMonthDescOption[month];
    this.month = monthSelect.label;
    const time = format.getHours() + ':' + format.getMinutes() + ' น.';
    this.time = time;

    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    //const firstDayOfNextMonth = this.findFirstWeekdayOfMonth(year, month);
    //const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1).getDate();
    return (
      year +
      '-' +
      monthSelect.value +
      '-' +
      this.checkLenghtDate(firstDayOfNextMonth.getDate())
    ); //this.checkLenghtDate(firstDayOfNextMonth.getDate());
  }

  checkYearOfLoanDateMore1Year(year: any) {
    const format = new Date();
    if (format.getMonth() === 11) {
      return year + 1;
    } else {
      return year;
    }
  }

  checkMonthOfLoanDateMore1Month(month: any) {
    if (month === 11) {
      return 0;
    } else {
      return month + 1;
    }
  }

  onCalculateLoanOld() {
    const datePayLoanNew = this.pipeDateTHNewLan();
    const data = this.formModelLoanNew.getRawValue();
    const payload = {
      principal: data.loanValue,
      interestRate: this.dataNewLoan.interestPercent,
      numOfPayments: data.loanTime,
      paymentStartDate: datePayLoanNew,
    };
    this.service.onCalculateLoanOld(payload).subscribe((res) => {
      const data = res[0];
      this.formModelLoanNew.patchValue({
        loanOrdinary: this.formattedNumber2(Number(data.totalDeduction)),
        startDateLoan: datePayLoanNew,
        interestLoan: data.interest, //interest
        loanBalance: data.principalBalance, //principalBalance
        interestLoanLastMonth: 0, // interestLastMonth
      });
    });
  }

  onCalculateLoanNew() {
    const datePayLoanNew = this.pipeDateTHNewLan();
    const datePayLoanNewMore1 = this.pipeDateTHNewLanMore1();
    const data = this.formModelLoanNew.getRawValue();
    const interestRE = data.interestPercent.replace('%', '');
    const payload = {
      principal: data.loanValue,
      interestRate: data.interestPercent ? interestRE : null, //this.dataNewLoan.interestPercent
      numOfPayments: data.loanTime,
      paymentStartDate: datePayLoanNew,
    };
    this.service.onCalculateLoanNew(payload).subscribe((res) => {
      const data = res[0];
      this.formModelLoanNew.patchValue({
        loanOrdinary: this.formattedNumber2(Number(data.totalDeduction)),
        startDateLoan: datePayLoanNewMore1,
        interestLoan: data.interest, //interest
        loanBalance: data.principalBalance, //principalBalance
        interestLoanLastMonth: 0, // interestLastMonth
      });
    });
  }

  onCloseLoan(data: any) {
    this.confirmationService.confirm({
      message:
        'ต้องการปิดหนี้ให้ <br/> คุณ ' + data.firstName + ' ' + data.lastName,
      header: 'ปิดหนี้สมาชิก',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //api
        this.service.closeLoan(data.id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            detail: 'ปิดหนี้สำเร็จ',
          });
          this.ngOnInit();
        });
      },
      reject: () => {},
    });
  }

  requestLoanAgreement() {
    //
  }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: 'แจ้งเตือน',
      detail: 'โปรดรอสักครู่ PDF อาจใช้เวลาในการเเสดงข้อมูล ประมาณ 1-5 นาที',
    });
  }

  oldMonth: any;
  oldYear: any;
  newMonth: any;
  newYear: any;
  updateLoantoMonth() {
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

    this.formModelLoan.patchValue({
      loanYear: this.newYear,
      loanMonth: this.newMonth.label,
    });

    this.formModelLoan.get('loanMonth')?.disable();
    this.formModelLoan.get('loanYear')?.disable();

    this.checkInsertLoanDetailAll();
  }

  loanDetail: any;
  getLoanDetailListOfLastValue() {
    const payload = {
      monthCurrent: this.month,
      yearCurrent: this.year,
    };
    this.service.getLoanDetail(payload).subscribe((data) => {
      this.loanDetail = data;
      this.loading = false;
      this.checkInsertLoanDetailAll();
    });
  }

  checkInsertLoanDetailAll() {
    const loanDetail = this.loanDetail;
    const formatDate = new Date();
    const month = formatDate.getMonth();
    const monthSelect = this.periodMonthDescOption[month];

    if (loanDetail != null) {
      if (loanDetail.loanMonth === monthSelect.label) {
        this.checkNull = true;
        this.checkNullAddLoan = false;
      } else {
        this.checkNull = false;
        this.checkNullAddLoan = true;
      }
    } else {
      this.checkNull = false;
    }
  }

  showWarnAddLoan() {
    this.messageService.add({
      severity: 'warn',
      summary: 'แจ้งเตือน',
      detail: 'โปรดรอสักครู่ อาจใช้เวลาในการประมวลผลข้อมูล ประมาณ 1-5 นาที',
      life: 10000,
    });
  }

  onupdateLoanToMonth() {
    // api update stock to everyone
    this.showWarnAddLoan();
    const payload = {
      oldMonth: this.oldMonth.label,
      oldYear: this.oldYear,
      newMonth: this.newMonth.label,
      newYear: this.newYear,
    };
    this.service.insertLoanDetail(payload).subscribe((data) => {
      this.messageService.add({ severity: 'success', detail: 'เพิ่มสำเร็จ' });
      this.displayModal = false;
      this.ngOnInit();
    });
  }

  checkSetValueBill(event: any) {
    this.inputSubjectBill.next(event.target.value);
  }

  onDisplay() {
    if (this.headerName === 'ประวัติเงินกู้ของสมาชิกทั้งหมด') {
      this.onSearchDocumentV1All();
      this.displayModalBill = false;
    } else if (this.headerName === '') {
      //
    } else if (this.headerName === '') {
      //
    }
  }

  onCancleModalBill() {
    this.formModelBill.reset();
    this.formModelBill.patchValue({
      year: this.year,
      month: this.monthValue,
    });
    this.displayModalBill = false;
  }

  monthSelectNew: any;
  yearSelectNew: any;
  onSearchDocumentV1All() {
    this.showWarn();
    const dataMY = this.formModelBill.getRawValue();
    const monthNew = this.periodMonthDescOption[Number(dataMY.month) - 1].label;
    const payload = {
      // monthCurrent: this.month,
      // yearCurrent: this.year.toString()
      admin: true,
      loanId: null,
      monthCurrent: monthNew,
      yearCurrent: dataMY.year,
    };
    this.monthSelectNew = monthNew;
    this.yearSelectNew = dataMY.year;

    if (this.year == dataMY.year && this.monthValue == dataMY.month) {
      this.service.searchDocumentV1Loan(payload).subscribe((data) => {
        this.list = data;
        const key = 'employeeCode';
        const arrayUniqueByKey = [
          ...new Map(data.map((item) => [item[key], item])).values(),
        ];
        const reCheckData = arrayUniqueByKey.filter(
          (item) => Number(item.installment) >= 0
        ); // > 0
        this.getSearchDocumentV2SumAll(payload, this.mode, reCheckData);
      });
    } else {
      this.service
        .searchDocumentV1LoanDetailHistory(payload)
        .subscribe((data) => {
          this.list = data;
          const key = 'employeeCode';
          const arrayUniqueByKey = [
            ...new Map(data.map((item) => [item[key], item])).values(),
          ];
          const reCheckData = arrayUniqueByKey.filter(
            (item) => Number(item.installment) >= 0
          ); // > 0
          this.getSearchDocumentV2SumAllDetailHistory(
            payload,
            this.mode,
            reCheckData
          );
        });
    }
  }

  getSearchDocumentV2SumAllDetailHistory(
    playload: any,
    mode: any,
    listdata: any[]
  ) {
    this.service
      .searchDocumentV2SumLoanDetailHistory(playload)
      .subscribe((data) => {
        this.sumLoan = data;
        this.checkDepartment(listdata);
        this.exportMakePDFAll(mode, data);
      });
  }

  displayInsetLoanNew() {
    this.displayLoanNewQuagmire = true;
    this.formModelLoanNew.get('loanValueQuagmire').disable();
    const data = this.formModelLoanNew.getRawValue();
    if (this.dataNewLoan) {
      const loanBalance = this.dataNewLoan.loanBalance
        ? this.dataNewLoan.loanBalance
        : 0;
      const sum = data.loanValue - loanBalance;
      this.formModelLoanNew.get('loanValueQuagmire').setValue(sum);
    }
    this.messageQuagmire =
      'กู้หล่มจะทำการปิดหนี้คงค้างทั้งหมดและสร้างสัญญาใหม่';
  }

  checkInsetLoanNewQuagmire() {
    this.dataNewLoan.loanBalance = 0;
    this.displayLoanNewQuagmire = false;
    this.displayMessageError = false;
    this.displayModalLoanNew = false;
    this.insertLoanDetail();
  }

  onDeleteLoanEmp() {
    const data = this.formModelLoanNew.getRawValue();
    this.confirmationService.confirm({
      message: 'ต้องการยกเลิกสัญญา <br/> คุณ ' + data.fullName,
      header: 'ยกเลิกสัญญา',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const loanBalanceNum = data.loanBalance.replace(/,/g, '');
        if (Number(loanBalanceNum) <= 0) {
          this.service.deleteLoanNew(data).subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'success',
                detail: 'ลบข้อมูลสำเร็จ',
                life: 5000,
              });
              this.displayModalLoanNew = false;
              this.ngOnInit();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                detail: 'ลบข้อมูลไม่สำเร็จ',
                life: 5000,
              });
            },
          });
        } else {
          this.messageError =
            'ไม่สามารถยกเลิกสัญญาได้  ยังมีหนี้คงค้างเหลืออยู่   ' +
            data.loanBalance +
            ' บาท ';
          this.displayMessageError = true;
        }
      },
      reject: () => {},
    });
  }
}
