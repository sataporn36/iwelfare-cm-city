import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent1Component } from './admin-component1.component';

describe('AdminComponent1Component', () => {
  let component: AdminComponent1Component;
  let fixture: ComponentFixture<AdminComponent1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminComponent1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
