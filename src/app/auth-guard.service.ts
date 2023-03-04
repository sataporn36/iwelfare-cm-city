import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { BnNgIdleService } from 'bn-ng-idle';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild{

  constructor(private localStorageService: LocalStorageService, protected router: Router,private bnIdle: BnNgIdleService) { }

  canActivate(): boolean{
      if(this.localStorageService.retrieve('empId') === null){
          return true;
      }
      //alert(' กรุณาออกจากระบบระบบ ');
      this.router.navigate(['/main/main-page'], {});
      return false;
  }

  canActivateChild(): boolean{
    if(this.localStorageService.retrieve('empId') !== null){
        return true;
    }
    alert(' กรุณาเข้าสู่ระบบ ');
    this.router.navigate(['/login'], {});
    return false;
  }
}
