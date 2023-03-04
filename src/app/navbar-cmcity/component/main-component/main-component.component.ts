import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/model/employee';
import { MainService } from 'src/app/service/main.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit {
  
  @Input() formModel!: FormGroup;

  constructor(
    private service: MainService,
  ) { }

  ngOnInit(): void {
    // window.location.reload();
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
