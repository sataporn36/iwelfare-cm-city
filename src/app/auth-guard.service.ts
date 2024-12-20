import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    private localStorageService: LocalStorageService,
    protected router: Router
  ) {}

  canActivate(): boolean {
    if (this.localStorageService.retrieve('empId') === null) {
      return true;
    }
    //alert(' กรุณาออกจากระบบระบบ ');
    this.router.navigate(['/main/main-page'], {});
    return false;
  }

  canActivateChild(): boolean {
    if (this.localStorageService.retrieve('empId') !== null) {
      return true;
    }
    alert(' กรุณาเข้าสู่ระบบ ');
    this.router.navigate(['/login'], {});
    return false;
  }
}
