import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewsComponentComponent } from './admin-news-component.component';

describe('AdminNewsComponentComponent', () => {
  let component: AdminNewsComponentComponent;
  let fixture: ComponentFixture<AdminNewsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNewsComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
