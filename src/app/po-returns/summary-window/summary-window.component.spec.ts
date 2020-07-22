import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryWindowComponent } from './summary-window.component';

describe('SummaryWindowComponent', () => {
  let component: SummaryWindowComponent;
  let fixture: ComponentFixture<SummaryWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
