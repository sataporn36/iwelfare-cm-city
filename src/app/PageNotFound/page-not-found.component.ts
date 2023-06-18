import { Component } from '@angular/core';
import { MainService } from '../service/main.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  constructor(
    private service: MainService, 
    protected router: Router,
    private localStorageService: LocalStorageService,
    ) { 
     //
    }

  onGotoPage() {
    this.router.navigate(['/login']);
  }

}
