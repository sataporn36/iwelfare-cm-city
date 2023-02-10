import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppPath } from '../constans/config';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  userId = new BehaviorSubject<number|undefined>(undefined);

  constructor(private http: HttpClient) { }

  register(playload: any): Observable<any>{
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/addEmployee', playload
    );
  }

  editStatusEmployeeResign(playload: any): Observable<any>{
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/editStatusEmployeeResign', playload
    );
  }

  login(): Observable<any>{
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/stock'
    );
  }

}
