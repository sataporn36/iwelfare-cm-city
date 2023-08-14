import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingComponentComponent } from './admin-setting-component.component';

describe('AdminSettingComponentComponent', () => {
  let component: AdminSettingComponentComponent;
  let fixture: ComponentFixture<AdminSettingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSettingComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSettingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
