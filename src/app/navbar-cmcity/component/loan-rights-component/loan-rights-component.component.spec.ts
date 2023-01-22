import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRightsComponentComponent } from './loan-rights-component.component';

describe('LoanRightsComponentComponent', () => {
  let component: LoanRightsComponentComponent;
  let fixture: ComponentFixture<LoanRightsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanRightsComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRightsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
