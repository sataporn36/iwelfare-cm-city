import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    // const headers = new Headers();
    // headers.append('Authorization', 'Bearer AADDFFKKKLLLL');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer AADDFFKKKLLLL'
    });

    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/user-login', payload , { headers });

    //   this.http.post(this.url+ ordernummer + "/" + this.id, arr, {
    //     headers: headers
    //   }).subscribe(data => console.log("Successful"),
    //         error => console.log("Error: ", error)
    // )
  }
  
}
