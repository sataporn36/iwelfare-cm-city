import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProgrameComponent } from './main-programe.component';

describe('MainProgrameComponent', () => {
  let component: MainProgrameComponent;
  let fixture: ComponentFixture<MainProgrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainProgrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainProgrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
