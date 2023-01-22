import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRightsPageComponent } from './loan-rights-page.component';

describe('LoanRightsPageComponent', () => {
  let component: LoanRightsPageComponent;
  let fixture: ComponentFixture<LoanRightsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanRightsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRightsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
