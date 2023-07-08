import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class MainService {

  userId = new BehaviorSubject<number | undefined>(undefined);

  constructor(private http: HttpClient) { }

  // getCustomers(params?: any) {
  //   return this.http.get<any>('https://www.primefaces.org/data/customers', { params: params });
  // }

  register(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/add-employee', playload
    );
  }

  editStatusEmployeeResign(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/editStatusEmployeeResign', playload
    );
  }

  login(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/user-login', playload
    );
  }

  changePassword(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/change/forget-password', playload
    );
  }

  searchRegister(): Observable<SearchNewResgter[]> {
    return this.http.post<SearchNewResgter[]>(AppPath.APP_API_SERVICE + '/logic/v1/register/search-register', null);
  }

  searchPosition(): Observable<Positions[]> {
    return this.http.post<Positions[]>(AppPath.APP_API_SERVICE + '/v1/position/search', null);
  }

  searchDepartment(): Observable<Department[]> {
    return this.http.post<Department[]>(AppPath.APP_API_SERVICE + '/v1/department/search', null);
  }

  searchBureau(): Observable<Bureau[]> {
    return this.http.post<Bureau[]>(AppPath.APP_API_SERVICE + '/v1/bureau/search', null);
  }

  searchByBureau(id: number): Observable<Affiliation[]> {
    return this.http.post<Affiliation[]>(AppPath.APP_API_SERVICE + '/v1/affiliation/search-by-bureau/' + id, null);
  }

  searchAffiliation(): Observable<Affiliation[]> {
    return this.http.post<Affiliation[]>(AppPath.APP_API_SERVICE + '/v1/affiliation/search', null);
  }

  approveRegister(req: ApproveRegisterReq): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/approve-register', req
    );
  }

  getEmployee(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/employee/' + id,
    );
  }

  cancelApproveRegister(req: CancelRegisterReq): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/cancel-approve-register', req);
  }

  conutNewRegister(): Observable<any> {
    return this.http.post<any>(AppPath.APP_API_SERVICE + '/logic/v1/register/count-register', null);
  }


  updateEmp(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee', playload
    );
  }

  updateBeneficiary(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary', playload
    );
  }

  getBeneficiary(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary/' + id,
    );
  }

  deleteBeneficiary(id: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary/' + id,
    );
  }

  searchLevel(): Observable<Level[]> {
    return this.http.post<Level[]>(AppPath.APP_API_SERVICE + '/v1/level/search', null);
  }

  searchEmployeeType(): Observable<EmployeeType[]> {
    return this.http.post<EmployeeType[]>(AppPath.APP_API_SERVICE + '/v1/employee-type/search', null);
  }

  searchStockDetail(id: number, value: string): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/v1/stock-detail/search-by-stock/' + id + '/' + value, null);
  }

  searchStock(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/stock/search', null);
  }

  updateStock(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/stock', playload
    );
  }

  updateResign(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-resign', playload
    );
  }

  updateStockValue(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-stock-value', playload
    );
  }

  searchNotify(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/v1/notify/search', null);
  }

  searchLoanDetail(id: number): Observable<any[]> {
    return this.http.get<any[]>(AppPath.APP_API_SERVICE + '/v1/loan-detail/search-by-loan/' + id);
  }

  searchLoan(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/loan/search', null);
  }

  updateResignAdmin(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-resign-admin', playload
    );
  }

  getGrandTotal(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/document/grand-total', null);
  }

  searchDocumentV1(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/document/search', playload);
  }

  searchDocumentV2Sum(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v2/document/search', playload);
  }

  documentInfoAll(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/document/info-all', null);
  }

  searchDocumentV1Loan(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoan', playload);
  }

  searchDocumentV2SumLoan(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v2/document/searchLoan', playload);
  }

  updateEmployeeStatus(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-emp-status', playload
    );
  }

  insertStockDetail(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/stock/add-all', playload
    );
  }

  insertLoanDetail(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/add-all', playload
    );
  }

  getEmployeeOfMain(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/employee/of-main/' + id,
    );
  }

  getStock(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/stock/' + id,
    );
  }

  cancelNotification(id: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/notify/cancel/' + id,
    );
  }

  searchEmployeeLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoan-add-new', playload
    );
  }

  onCalculateLoanOld(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/calculate-loan-old', playload
    );
  }

  onCalculateLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/calculate-loan-new', playload
    );
  }

  searchGuarantorUnique(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoan-guarantor-unique', playload
    );
  }

  searchEmpCodeOfId(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/search-emp-code-of-id', playload
    );
  }

  getGuarantor(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/guarantor/' + id,
    );
  }

  getGuarantee(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/guarantee/' + id,
    );
  }

  getBeneficiaryByEmpId(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/beneficiary/' + id,
    );
  }

  searchBeneficiary(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/beneficiary/search/' + id,
    );
  }

  updateBeneficiaryLogic(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/beneficiary/update', playload
    );
  }

  insertLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/v1/loan/add-loan-New', playload
    );
  }

  closeLoan(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/close/' + id,
    );
  }

  // displayImage(id: number): Observable<any[]> {
  //   return this.http.get<any[]>(
  //     AppPath.APP_API_SERVICE + '/v1/file-resource/display/' + id,
  //   );
  // }

  getImage(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/display/' + id, { responseType: 'blob' as 'json' }
    );
  }

  uploadImage(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add', playload 
    );
  }

  calculateStockDividend(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/calculate-dividend', playload
    );
  }

}
