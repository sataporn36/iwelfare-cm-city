import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit {
  
  @Input() formModel!: FormGroup;
  dataStockDetail!: any[];
  loading!: boolean;
  stockId: any;
  userId: any;

  constructor(
    private service: MainService, private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.userId = this.localStorageService.retrieve('empId');
    this.getEmployee(this.userId);
  }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => {
      this.stockId = data.stock.id;
      this.searchStockDetail(this.stockId);
    });
  }

  searchStockDetail(id: any): void {
    this.service.searchStockDetail(id, "desc").subscribe(data => this.dataStockDetail = data);
  }


  // TODO: ImgProfile
  checkImgProfile(gender: any) {
    let textGender = ""
    switch (gender) {
      case 'ชาย':
        textGender = "assets/images/boy.png"
        break;
      case 'หญิง':
        textGender = "assets/images/girl.png"
        break;
      default:
        break;
    }

    return textGender
  }
}
