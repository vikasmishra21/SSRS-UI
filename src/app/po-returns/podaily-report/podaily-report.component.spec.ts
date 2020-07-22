import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodailyReportComponent } from './podaily-report.component';

describe('PodailyReportComponent', () => {
  let component: PodailyReportComponent;
  let fixture: ComponentFixture<PodailyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodailyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
