import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryComponentComponent } from './beneficiary-component.component';

describe('BeneficiaryComponentComponent', () => {
  let component: BeneficiaryComponentComponent;
  let fixture: ComponentFixture<BeneficiaryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
