import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppPath } from '../constans/config';
import { Product } from '../constans/Product';
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

  userId = new BehaviorSubject<number|undefined>(undefined);

  constructor(private http: HttpClient) { }

  register(playload: any): Observable<any>{
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/add-employee', playload
    );
  }

  editStatusEmployeeResign(playload: any): Observable<any>{
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/editStatusEmployeeResign', playload
    );
  }

  login(playload: any): Observable<any>{
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/user-login', playload
    );
  }

  changePassword(playload: any): Observable<any>{
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/change/forget-password', playload
    );
  }

  searchRegister(): Observable<SearchNewResgter[]>{
    return this.http.post<SearchNewResgter[]>(AppPath.APP_API_SERVICE + '/logic/v1/register/search-register', null);
  }

  searchPosition(): Observable<Positions[]>{
    return this.http.post<Positions[]>(AppPath.APP_API_SERVICE + '/v1/position/search', null);
  }

  searchDepartment(): Observable<Department[]>{
    return this.http.post<Department[]>(AppPath.APP_API_SERVICE + '/v1/department/search', null);
  }

  searchBureau(): Observable<Bureau[]>{
    return this.http.post<Bureau[]>(AppPath.APP_API_SERVICE + '/v1/bureau/search', null);
  }

  searchByBureau(id: number): Observable<Affiliation[]>{
    return this.http.post<Affiliation[]>(AppPath.APP_API_SERVICE + '/v1/affiliation/search-by-bureau/'+ id, null);
  }

  searchAffiliation(): Observable<Affiliation[]>{
    return this.http.post<Affiliation[]>(AppPath.APP_API_SERVICE + '/v1/affiliation/search', null);
  }

  approveRegister(req: ApproveRegisterReq): Observable<any>{
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/approve-register', req
    );
  }

  getEmployee(id: number): Observable<any>{
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/' + id , 
    );
  }

  cancelApproveRegister(req: CancelRegisterReq): Observable<any>{
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/cancel-approve-register' , req);
  }

  conutNewRegister(): Observable<any>{
    return this.http.post<any>(AppPath.APP_API_SERVICE + '/logic/v1/register/count-register', null);
  }


  updateEmp(playload: any): Observable<any>{
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee', playload
    );
  }

  updateBeneficiary(playload: any): Observable<any>{
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary', playload
    );
  }

  getBeneficiary(id: number): Observable<any>{
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary/' + id , 
    );
  }

  deleteBeneficiary(id: number): Observable<any>{
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary/' + id , 
    );
  }

  searchLevel(): Observable<Level[]>{
    return this.http.post<Level[]>(AppPath.APP_API_SERVICE + '/v1/level/search', null);
  }

  searchEmployeeType(): Observable<EmployeeType[]>{
    return this.http.post<EmployeeType[]>(AppPath.APP_API_SERVICE + '/v1/employee-type/search', null);
  }

}
