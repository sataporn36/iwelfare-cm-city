import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCoponentComponent } from './main-coponent.component';

describe('MainCoponentComponent', () => {
  let component: MainCoponentComponent;
  let fixture: ComponentFixture<MainCoponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCoponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCoponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
