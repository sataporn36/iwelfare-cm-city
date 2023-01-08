import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCmcityComponent } from './navbar-cmcity.component';

describe('NavbarCmcityComponent', () => {
  let component: NavbarCmcityComponent;
  let fixture: ComponentFixture<NavbarCmcityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarCmcityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarCmcityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
