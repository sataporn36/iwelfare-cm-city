import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocPageComponent } from './admin-doc-page.component';

describe('AdminDocPageComponent', () => {
  let component: AdminDocPageComponent;
  let fixture: ComponentFixture<AdminDocPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDocPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDocPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
