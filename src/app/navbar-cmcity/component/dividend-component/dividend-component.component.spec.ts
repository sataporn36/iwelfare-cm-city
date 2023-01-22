import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendComponentComponent } from './dividend-component.component';

describe('DividendComponentComponent', () => {
  let component: DividendComponentComponent;
  let fixture: ComponentFixture<DividendComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DividendComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividendComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
