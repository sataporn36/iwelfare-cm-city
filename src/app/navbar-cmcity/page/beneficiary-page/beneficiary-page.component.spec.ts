import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryPageComponent } from './beneficiary-page.component';

describe('BeneficiaryPageComponent', () => {
  let component: BeneficiaryPageComponent;
  let fixture: ComponentFixture<BeneficiaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
