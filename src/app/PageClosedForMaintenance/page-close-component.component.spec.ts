import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCloseComponentComponent } from './page-close-component.component';

describe('PageCloseComponentComponent', () => {
  let component: PageCloseComponentComponent;
  let fixture: ComponentFixture<PageCloseComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCloseComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCloseComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
