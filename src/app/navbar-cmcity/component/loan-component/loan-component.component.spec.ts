import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanComponentComponent } from './loan-component.component';

describe('LoanComponentComponent', () => {
  let component: LoanComponentComponent;
  let fixture: ComponentFixture<LoanComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
