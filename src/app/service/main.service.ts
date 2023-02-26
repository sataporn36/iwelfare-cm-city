import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppPath } from '../constans/config';
import { Affiliation } from '../model/affiliation';
import { ApproveRegisterReq } from '../model/approve-register-req';
import { CancelRegisterReq } from '../model/cancel-register-req';
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

}
