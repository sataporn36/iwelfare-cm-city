import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppPath } from './constans/config';
import { MainService } from './service/main.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  constructor(private http: HttpClient,private service: MainService,) { }

  getAuthToken(payload: any) :Observable<any>{
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/user-login', payload
    );
  }
  
}
