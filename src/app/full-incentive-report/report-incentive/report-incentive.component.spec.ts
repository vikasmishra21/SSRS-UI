import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIncentiveComponent } from './report-incentive.component';

describe('ReportIncentiveComponent', () => {
  let component: ReportIncentiveComponent;
  let fixture: ComponentFixture<ReportIncentiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportIncentiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
