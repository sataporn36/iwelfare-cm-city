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

  postUser(playload: any): Observable<any>{
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/v1/stock', playload
    );
  }

  get(): Observable<any>{
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/stock'
    );
  }

}
