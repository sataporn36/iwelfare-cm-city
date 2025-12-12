import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  throwError,
  timeout,
} from 'rxjs';
import { AppPath } from '../constans/config';
import { Affiliation } from '../model/affiliation';
import { ApproveRegisterReq } from '../model/approve-register-req';
import { Bureau } from '../model/bureau';
import { CancelRegisterReq } from '../model/cancel-register-req';
import { Department } from '../model/department';
import { EmployeeType } from '../model/employee-type';
import { Level } from '../model/level';
import { Marital } from '../model/marital';
import { Positions } from '../model/position';
import { SearchNewResgter } from '../model/search-new-register';
import { AdminEmployeeReq } from '../navbar-cmcity/component/admin-component/component/admin-component1/models/admin-employee-req';
import { ResponseDto } from '../data/interfaces';
import { AdminEmployeeRes } from '../navbar-cmcity/component/admin-component/component/admin-component1/models/admin-employee-res';
import { AdminStockReq } from '../navbar-cmcity/component/admin-component/component/admin-component2/models/admin-stock-req';
import { AdminStockRes } from '../navbar-cmcity/component/admin-component/component/admin-component2/models/admin-stock-res';
import { AdminLoanRes } from '../navbar-cmcity/component/admin-component/component/admin-component3/models/admin-loan-res';
import { AdminLoanReq } from '../navbar-cmcity/component/admin-component/component/admin-component3/models/admin-loan-req';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  userId = new BehaviorSubject<number | undefined>(undefined);

  constructor(private http: HttpClient) {}

  // getCustomers(params?: any) {
  //   return this.http.get<any>('https://www.primefaces.org/data/customers', { params: params });
  // }

  register(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/add-employee',
      playload
    );
  }

  editStatusEmployeeResign(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/editStatusEmployeeResign',
      playload
    );
  }

  login(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/user-login',
      playload
    );
  }

  changePassword(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/change/forget-password',
      playload
    );
  }

  resetPassword(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/change/reset-password',
      playload
    );
  }

  searchRegister(): Observable<SearchNewResgter[]> {
    return this.http.post<SearchNewResgter[]>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/search-register',
      null
    );
  }

  searchPosition(): Observable<Positions[]> {
    return this.http.post<Positions[]>(
      AppPath.APP_API_SERVICE + '/v1/position/search',
      null
    );
  }

  searchDepartment(): Observable<Department[]> {
    return this.http.post<Department[]>(
      AppPath.APP_API_SERVICE + '/v1/department/search',
      null
    );
  }

  searchBureau(): Observable<Bureau[]> {
    return this.http.post<Bureau[]>(
      AppPath.APP_API_SERVICE + '/v1/bureau/search',
      null
    );
  }

  searchByBureau(id: number): Observable<Affiliation[]> {
    return this.http.post<Affiliation[]>(
      AppPath.APP_API_SERVICE + '/v1/affiliation/search-by-bureau/' + id,
      null
    );
  }

  searchAffiliation(): Observable<Affiliation[]> {
    return this.http.post<Affiliation[]>(
      AppPath.APP_API_SERVICE + '/v1/affiliation/search',
      null
    );
  }

  approveRegister(req: ApproveRegisterReq): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/approve-register',
      req
    );
  }

  getEmployee(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/employee/' + id
    );
  }

  cancelApproveRegister(req: CancelRegisterReq): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/cancel-approve-register',
      req
    );
  }

  conutNewRegister(): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/count-register',
      null
    );
  }

  updateEmp(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee',
      playload
    );
  }

  updateBeneficiary(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary',
      playload
    );
  }

  getBeneficiary(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary/' + id
    );
  }

  deleteBeneficiary(id: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary/' + id
    );
  }

  searchLevel(): Observable<Level[]> {
    return this.http.post<Level[]>(
      AppPath.APP_API_SERVICE + '/v1/level/search',
      null
    );
  }

  searchEmployeeType(): Observable<EmployeeType[]> {
    return this.http.post<EmployeeType[]>(
      AppPath.APP_API_SERVICE + '/v1/employee-type/search',
      null
    );
  }

  searchStockDetail(id: number, value: string): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE +
        '/v1/stock-detail/search-by-stock/' +
        id +
        '/' +
        value,
      null
    );
  }

  getStockDetail(payload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/v1/stock-detail/getStockDetail',
      payload
    );
  }

  searchStock(): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v1/stock/search',
      null
    );
  }

  searchStockV2(body: AdminStockReq): Observable<ResponseDto<AdminStockRes>> {
    return this.http.post<ResponseDto<AdminStockRes>>(
      AppPath.APP_API_SERVICE + '/logic/v1/stock/v2/search',
      body
    );
  }

  updateStock(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/stock',
      playload
    );
  }

  updateResign(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-resign',
      playload
    );
  }

  updateStockValue(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-stock-value',
      playload
    );
  }

  searchNotify(): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/v1/notify/search',
      null
    );
  }

  searchLoanDetail(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/v1/loan-detail/search-by-loan',
      playload
    );
  }

  getLoanDetail(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/v1/loan-detail/getLoanDetail',
      playload
    );
  }

  searchLoan(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/search',
      playload
    );
  }

  searchLoanV2(body: AdminLoanReq): Observable<ResponseDto<AdminLoanRes>> {
    return this.http.post<ResponseDto<AdminLoanRes>>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/v2/search',
      body
    );
  }

  updateResignAdmin(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-resign-admin',
      playload
    );
  }

  getGrandTotal(payload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/grand-total',
      payload
    );
  }

  getSummary(payload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/v1/summary/get-summary',
      payload
    );
  }

  searchDocumentV1(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/search',
      playload
    );
  }

  searchDocumentV2Sum(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v2/document/search',
      playload
    );
  }

  documentInfoAll(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/info-all',
      playload
    );
  }

  searchDocumentV1Loan(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoan',
      playload
    );
  }

  searchLoanById(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoanById',
      playload
    );
  }

  searchDocumentV2SumLoan(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v2/document/searchLoan',
      playload
    );
  }

  updateEmployeeStatus(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-emp-status',
      playload
    );
  }

  updateEmployeeStatusIsActive(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-emp-status/is-active',
      playload
    );
  }

  insertStockDetail(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/stock/add-all',
      playload
    );
  }

  insertLoanDetail(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/add-all',
      playload
    );
  }

  getEmployeeOfMain(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/employee/of-main/' + id
    );
  }

  getStock(id: number): Observable<any> {
    return this.http.get<any>(AppPath.APP_API_SERVICE + '/v1/stock/' + id);
  }

  cancelNotification(id: number, empId: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/notify/cancel/' + id + '/' + empId
    );
  }

  rejectRegister(id: number, empId: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/notify/reject-register/' + id + '/' + empId
    );
  }

  searchEmployeeLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoan-add-new',
      playload
    );
  }

  onCalculateLoanOld(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/calculate-loan-old',
      playload
    );
  }

  onCalculateLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/calculate-loan-new',
      playload
    );
  }

  searchGuarantorUnique(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE +
        '/logic/v1/document/searchLoan-guarantor-unique',
      playload
    );
  }

  searchEmpCodeOfId(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/search-emp-code-of-id',
      playload
    );
  }

  searchIdOfEmpCode(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/search-id-of-emp-code',
      playload
    );
  }

  getGuarantor(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/guarantor/' + id
    );
  }

  getGuarantee(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/guarantee/' + id
    );
  }

  getBeneficiaryByEmpId(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/beneficiary/' + id
    );
  }

  searchBeneficiary(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/beneficiary/search/' + id
    );
  }

  updateBeneficiaryLogic(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/beneficiary/update',
      playload
    );
  }

  insertLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/v1/loan/add-loan-New',
      playload
    );
  }

  closeLoan(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/close/' + id
    );
  }

  // displayImage(id: number): Observable<any[]> {
  //   return this.http.get<any[]>(
  //     AppPath.APP_API_SERVICE + '/v1/file-resource/display/' + id,
  //   );
  // }

  getImage(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/display/' + id,
      { responseType: 'blob' as 'json' }
    );
  }

  getImageIdCard(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/display/id-card/' + id,
      { responseType: 'blob' as 'json' }
    );
  }

  getImageAddress(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/display/address/' + id,
      { responseType: 'blob' as 'json' }
    );
  }

  uploadImage(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add',
      playload
    );
  }

  uploadImageIdCard(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add-id-card',
      playload
    );
  }

  uploadImageAddress(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add-address',
      playload
    );
  }

  calculateStockDividend(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/calculate-dividend',
      playload
    );
  }

  getConfigByList(): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/getConfigByList',
      null
    );
  }

  editConfig(payload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/updateConfig',
      payload
    );
  }

  getImageConfig(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/getImageConfig/' + id,
      { responseType: 'blob' as 'json' }
    );
  }

  uploadImageConfig(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/admin/logic/document/getImageConfig/add',
      playload
    );
  }

  getEmployeeByList(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/getEmployeeByList',
      playload
    );
  }

  updateRoleEmp(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/updateRoleEmp',
      playload
    );
  }

  updateBeneficiaryId(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-beneficiary-id',
      playload
    );
  }

  deleteNotify(id: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/notify/delete-notify/' + id
    );
  }

  searchEmployee(): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/v1/employee/search',
      null
    );
  }

  // searchEmployeeV2(): Observable<any[]> {
  //   return this.http.post<any[]>(
  //     AppPath.APP_API_SERVICE + '/v1/employee/v2/search',
  //     null
  //   );
  // }

  searchEmployeeV2(
    body: AdminEmployeeReq
  ): Observable<ResponseDto<AdminEmployeeRes>> {
    return this.http.post<ResponseDto<AdminEmployeeRes>>(
      AppPath.APP_API_SERVICE + '/v1/employee/v2/search',
      body
    );
  }

  updateInfo(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/update-info',
      playload
    );
  }

  uploadImageNews(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add-news',
      playload
    );
  }

  uploadImageNewsDetail(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add-news-detail',
      playload
    );
  }

  updateImageNews(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/update-news',
      playload
    );
  }

  getImageNews(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/display/news/' + id,
      { responseType: 'blob' as 'json' }
    );
  }

  deleteImage(id: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/' + id
    );
  }

  deleteImageDetail(id: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/detail/' + id
    );
  }

  searchNews(): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/v1/news/search',
      null
    );
  }

  searchNewsMain(): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/v1/news/search/main',
      null
    );
  }

  createNewsUp(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/v1/news/create-up',
      playload
    );
  }

  createNews(): Observable<any> {
    return this.http.post<any>(AppPath.APP_API_SERVICE + '/v1/news', null);
  }

  getNews(id: number): Observable<any> {
    return this.http.get<any>(AppPath.APP_API_SERVICE + '/v1/news/' + id);
  }

  getNewsDetail(id: number): Observable<any> {
    console.log(id);
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/news/' + id + '/files/images'
    );
  }

  editNews(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/v1/news/update',
      playload
    );
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete<any>(AppPath.APP_API_SERVICE + '/v1/news/' + id);
  }

  updateByUser(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-by-user',
      playload
    );
  }

  approveUpdateByUser(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/approve-update-by-user',
      playload
    );
  }

  updateLoanEmpOfGuarantor(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/update-loan-emp-guarantor',
      playload
    );
  }

  deleteLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/v1/loan/delete-loan-New',
      playload
    );
  }

  getNotifyByEmpId(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/v1/notify/getNotifyByEmpId',
      playload
    );
  }

  searchDoc(): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/documents/search',
      null
    );
  }

  addDoc(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/documents/upload-file',
      playload
    );
  }

  getDoc(id: any): Observable<Blob> {
    return this.http.get<Blob>(AppPath.APP_API_SERVICE + '/documents/' + id, {
      responseType: 'blob' as 'json',
    });
  }

  deletedDoc(id: number): Observable<any> {
    return this.http.delete<any>(AppPath.APP_API_SERVICE + '/documents/' + id);
  }

  addFile(payload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/documents/add-file',
      payload
    );
  }

  getFile(payload: any): Observable<Blob> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/documents/get-file',
      payload,
      { responseType: 'blob' }
    );
  }

  // loan-history api //

  searchDocumentV1LoanDetailHistory(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/v1/loan-detail-histories/v1/all',
      playload
    );
  }
  searchDocumentV2SumLoanDetailHistory(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/v1/loan-detail-histories/v2/all',
      playload
    );
  }

  searchDocumentV1DetailHistory(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/old/search',
      playload
    );
  }
  searchDocumentV2SumDetailHistory(playload: any): Observable<any[]> {
    return this.http.post<any[]>(
      AppPath.APP_API_SERVICE + '/logic/v2/document/old/search',
      playload
    );
  }

  searchEmployeeLoanNewDetailHistory(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoan-old',
      playload
    );
  }

  // loan-history api //

  // // API Export Excel //
  // exportDividendsExcel(playload: any): Observable<any> {
  //   return this.http.post<any>(
  //     AppPath.APP_API_SERVICE + '/logic/v1/document/export-data/dividends',
  //     playload,
  //     {
  //       responseType: 'blob' as 'json',
  //     }
  //   );
  // }
  exportDividendsExcel(payload: any): Observable<Blob> {
    return this.http
      .post<Blob>(
        AppPath.APP_API_SERVICE + '/logic/v1/document/export-data/dividends',
        payload,
        {
          responseType: 'blob' as 'json', // Ensure this is 'blob'
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Export failed:', error);
          return throwError('Export failed. Please try again later.');
        })
      );
  }

  receiptReport(payload: any): Observable<Blob> {
    return this.http
      .post(
        AppPath.APP_API_SERVICE + '/logic/v1/document/receipt-report',
        payload,
        {
          responseType: 'blob', // Ensure this is 'blob'
        }
      )
      .pipe(
        timeout(600000),
        catchError((error) => {
          console.error('Export failed:', error);
          return throwError(
            () => new Error('Export failed. Please try again later.')
          );
        })
      );
  }

  receiptReportCode(payload: any): Observable<Blob> {
    return this.http
      .post(
        AppPath.APP_API_SERVICE + '/logic/v1/document/receipt-report-code',
        payload,
        {
          responseType: 'blob', // Ensure this is 'blob'
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Export failed:', error);
          return throwError(
            () => new Error('Export failed. Please try again later.')
          );
        })
      );
  }

  empForReceiptList(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/empForReceiptList',
      playload
    );
  }

  checkStockDetail(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/stock/check-stock-detail', playload
    );
  }

  resetBackPassword(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/change/reset-back-password',
      playload
    );
  }

}
