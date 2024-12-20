import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocComponentComponent } from './admin-doc-component.component';

describe('AdminDocComponentComponent', () => {
  let component: AdminDocComponentComponent;
  let fixture: ComponentFixture<AdminDocComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDocComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDocComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
