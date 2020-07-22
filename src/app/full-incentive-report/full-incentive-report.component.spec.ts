import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullIncentiveReportComponent } from './full-incentive-report.component';

describe('FullIncentiveReportComponent', () => {
  let component: FullIncentiveReportComponent;
  let fixture: ComponentFixture<FullIncentiveReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullIncentiveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullIncentiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
