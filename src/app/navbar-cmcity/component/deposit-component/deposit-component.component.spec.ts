import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositComponentComponent } from './deposit-component.component';

describe('DepositComponentComponent', () => {
  let component: DepositComponentComponent;
  let fixture: ComponentFixture<DepositComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
