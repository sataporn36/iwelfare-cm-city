import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/model/employee';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit {

  public data: Observable<Employee> | any 
  
  constructor(
    private service: MainService,
  ) {}

  ngOnInit(): void {
    const id = 1;
    this.getEmployee(id);
  }

  getEmployee(id: any): void {
    this.service.getEmployee(id).subscribe(data => this.data = data);
  }

  // TODO: ImgProfile
  checkImgProfile( data: any) {
    let textGender = ""
    if (data.gender != null) {
      switch (data.gender) {
        case 'ชาย':
          textGender = "assets/images/boy.png"
          break;
        case 'หญิง':
          textGender = "assets/images/girl.png"
          break;
        default:
          console.log("Not Null");
        break;
      }
    }
    
    return textGender
  }
}
