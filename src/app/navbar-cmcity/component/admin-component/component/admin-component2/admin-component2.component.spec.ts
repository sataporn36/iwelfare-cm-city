import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent2Component } from './admin-component2.component';

describe('AdminComponent2Component', () => {
  let component: AdminComponent2Component;
  let fixture: ComponentFixture<AdminComponent2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminComponent2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
