import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPage3Component } from './admin-page3.component';

describe('AdminPage3Component', () => {
  let component: AdminPage3Component;
  let fixture: ComponentFixture<AdminPage3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPage3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPage3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
