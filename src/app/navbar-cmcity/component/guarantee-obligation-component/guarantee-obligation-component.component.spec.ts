import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeObligationComponentComponent } from './guarantee-obligation-component.component';

describe('GuaranteeObligationComponentComponent', () => {
  let component: GuaranteeObligationComponentComponent;
  let fixture: ComponentFixture<GuaranteeObligationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuaranteeObligationComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuaranteeObligationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
