import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPage4Component } from './admin-page4.component';

describe('AdminPage4Component', () => {
  let component: AdminPage4Component;
  let fixture: ComponentFixture<AdminPage4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPage4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPage4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
