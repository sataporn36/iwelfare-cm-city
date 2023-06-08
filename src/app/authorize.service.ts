import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppPath } from './constans/config';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  constructor(private http: HttpClient) { }

  getAuthToken(payload: any) :Observable<any>{
    return this.http.post<any>(AppPath.APP_API_SERVICE + '/logic/v1/login/user-login', payload);
  }
  
}
