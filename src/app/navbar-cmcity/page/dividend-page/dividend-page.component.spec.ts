import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendPageComponent } from './dividend-page.component';

describe('DividendPageComponent', () => {
  let component: DividendPageComponent;
  let fixture: ComponentFixture<DividendPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DividendPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividendPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
