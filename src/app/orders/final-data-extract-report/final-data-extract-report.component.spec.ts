import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDataExtractReportComponent } from './final-data-extract-report.component';

describe('FinalDataExtractReportComponent', () => {
  let component: FinalDataExtractReportComponent;
  let fixture: ComponentFixture<FinalDataExtractReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalDataExtractReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalDataExtractReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
