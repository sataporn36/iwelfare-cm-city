import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent4Component } from './admin-component4.component';

describe('AdminComponent4Component', () => {
  let component: AdminComponent4Component;
  let fixture: ComponentFixture<AdminComponent4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminComponent4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
