import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeObligationPageComponent } from './guarantee-obligation-page.component';

describe('GuaranteeObligationPageComponent', () => {
  let component: GuaranteeObligationPageComponent;
  let fixture: ComponentFixture<GuaranteeObligationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuaranteeObligationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuaranteeObligationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
