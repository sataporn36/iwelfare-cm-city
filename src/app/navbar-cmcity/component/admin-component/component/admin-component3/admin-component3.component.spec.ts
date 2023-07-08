import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent3Component } from './admin-component3.component';

describe('AdminComponent3Component', () => {
  let component: AdminComponent3Component;
  let fixture: ComponentFixture<AdminComponent3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminComponent3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
